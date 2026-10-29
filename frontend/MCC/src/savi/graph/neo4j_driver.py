"""
Phase 3: Neo4j In-Memory & Live Graph Processing Staging Engine.
Acts as the platform's high-speed topological staging and structural computational memory.
"""

from __future__ import annotations
from typing import List, Dict, Any, Optional, Tuple
import networkx as nx
from neo4j import GraphDatabase, Driver
from savi.config import DatabaseConfig, settings
from savi.graph.triplet_extractor import Triplet
from savi.graph.louvain import LouvainCommunityDetector
from savi.ingestion.schema import ScrapedPayload


class Neo4jLiveClusterClient:
    """
    Direct client connecting to live Neo4j 5.x graph database cluster.
    Translates canonical data envelopes and SPO triplets into Cypher graphs.
    """
    def __init__(self, db_config: DatabaseConfig = settings.db):
        self.db_config = db_config
        self.driver: Optional[Driver] = None
        self.is_connected = False
        try:
            self.driver = GraphDatabase.driver(
                db_config.neo4j_uri,
                auth=(db_config.neo4j_user, db_config.neo4j_password),
                connection_timeout=3,
            )
            self.driver.verify_connectivity()
            self.is_connected = True
        except Exception:
            self.is_connected = False

    def close(self) -> None:
        if self.driver:
            self.driver.close()

    def health_check(self) -> bool:
        if not self.driver or not self.is_connected:
            return False
        try:
            with self.driver.session() as session:
                res = session.run("RETURN 1 AS ping")
                rec = res.single()
                return rec is not None and rec["ping"] == 1
        except Exception:
            return False

    def sync_payload(self, payload: ScrapedPayload, triplets: List[Triplet]) -> None:
        """Writes content node, author, platform, citations, and SPO triplets to live Neo4j."""
        if not self.driver or not self.is_connected:
            return

        with self.driver.session() as session:
            # Merge Content, Author, Platform
            session.run("""
                MERGE (c:Content {id: $content_id})
                SET c.title = $title,
                    c.platform = $platform,
                    c.canonical_hash = $canonical_hash,
                    c.published_timestamp = $published_at
                
                MERGE (a:Author {id: $author_id})
                SET a.username = $username,
                    a.is_verified = $is_verified
                
                MERGE (p:Platform {name: $platform})
                
                MERGE (a)-[:AUTHORED]->(c)
                MERGE (c)-[:PUBLISHED_ON]->(p)
            """, {
                "content_id": payload.content_id,
                "title": payload.headline_or_title,
                "platform": payload.origin_platform,
                "canonical_hash": payload.canonical_hash,
                "published_at": payload.published_timestamp.isoformat(),
                "author_id": payload.author.author_id,
                "username": payload.author.username,
                "is_verified": payload.author.is_verified,
            })

            # Merge Citations
            for cit in payload.citations:
                session.run("""
                    MATCH (c:Content {id: $content_id})
                    MERGE (cit:Citation {url: $url})
                    MERGE (c)-[:CITES]->(cit)
                """, {"content_id": payload.content_id, "url": cit})

            # Merge SPO Triplets
            for trip in triplets:
                session.run("""
                    MATCH (c:Content {id: $content_id})
                    MERGE (s:Entity {name: $subject})
                    MERGE (o:Entity {name: $object})
                    MERGE (c)-[:MENTIONS]->(s)
                    MERGE (s)-[r:RELATION {predicate: $predicate}]->(o)
                    SET r.confidence = $confidence
                """, {
                    "content_id": payload.content_id,
                    "subject": trip.subject.lower(),
                    "predicate": trip.predicate.upper(),
                    "object": trip.object.lower(),
                    "confidence": trip.confidence,
                })

    def count_nodes(self) -> Dict[str, int]:
        """Returns node count breakdown from live Neo4j."""
        if not self.driver or not self.is_connected:
            return {}
        with self.driver.session() as session:
            res = session.run("MATCH (n) RETURN labels(n)[0] AS label, count(n) AS cnt")
            counts = {}
            for rec in res:
                lbl = rec["label"] or "Unlabeled"
                counts[lbl] = rec["cnt"]
            return counts


class Neo4jStagingGraph:
    """
    Topological Staging and In-Memory Graph Processing Engine.
    Handles entity nodes, triplet relationships, citation networks,
    and topological betweenness centrality metrics.
    Optionally syncs to live Neo4j cluster when available.
    """
    def __init__(self, live_client: Optional[Neo4jLiveClusterClient] = None):
        self.graph = nx.Graph()
        self.payload_nodes: Dict[str, ScrapedPayload] = {}
        self.triplets: List[Triplet] = []
        self.community_detector = LouvainCommunityDetector()
        self.live_client = live_client

    def add_payload(self, payload: ScrapedPayload, triplets: List[Triplet]) -> None:
        """Stages content payload and its SPO triplets in the topological graph."""
        content_id = payload.content_id
        self.payload_nodes[content_id] = payload

        # Add content node
        self.graph.add_node(
            content_id,
            node_type="Content",
            platform=payload.origin_platform,
            title=payload.headline_or_title,
        )

        # Add author node and edge
        author_id = payload.author.author_id
        self.graph.add_node(author_id, node_type="Author", username=payload.author.username)
        self.graph.add_edge(author_id, content_id, relation="AUTHORED", weight=1.0)

        # Add platform node and edge
        platform_id = f"platform_{payload.origin_platform}"
        self.graph.add_node(platform_id, node_type="Platform", name=payload.origin_platform)
        self.graph.add_edge(content_id, platform_id, relation="PUBLISHED_ON", weight=1.0)

        # Add citations as edges
        for cit in payload.citations:
            cit_id = f"citation_{cit}"
            self.graph.add_node(cit_id, node_type="Citation", url=cit)
            self.graph.add_edge(content_id, cit_id, relation="CITES", weight=1.5)

        # Add SPO triplets
        for trip in triplets:
            self.triplets.append(trip)
            s_node = f"entity_{trip.subject.lower()}"
            o_node = f"entity_{trip.object.lower()}"

            self.graph.add_node(s_node, node_type="Entity", label=trip.subject)
            self.graph.add_node(o_node, node_type="Entity", label=trip.object)

            # Edge between subject and object with predicate label
            self.graph.add_edge(s_node, o_node, relation=trip.predicate, weight=trip.confidence)
            # Connect content node to subject entity
            self.graph.add_edge(content_id, s_node, relation="MENTIONS", weight=1.0)

        # Forward sync to live Neo4j cluster if connected
        if self.live_client and self.live_client.is_connected:
            try:
                self.live_client.sync_payload(payload, triplets)
            except Exception:
                pass

    def compute_betweenness_centrality(self) -> Dict[str, float]:
        """
        Computes betweenness centrality C_B for all nodes in the topology:
        C_B(v) = sum_{s != v != t} (sigma_{st}(v) / sigma_{st})
        """
        if self.graph.number_of_nodes() <= 2:
            return {node: 1.0 for node in self.graph.nodes()}
        return nx.betweenness_centrality(self.graph, weight="weight")

    def run_louvain_communities(self) -> Tuple[Dict[str, int], float]:
        """Runs Louvain modularity optimization across current topology."""
        return self.community_detector.detect_communities(self.graph)

    def find_evidence_triplets_for_claim(self, claim: Triplet) -> List[Triplet]:
        """Discovers supporting or contradicting evidence triplets in graph staging."""
        evidence = []
        subj_clean = claim.subject.lower()
        obj_clean = claim.object.lower()

        for trip in self.triplets:
            if trip == claim:
                continue
            # Overlap in subject or object
            if (trip.subject.lower() == subj_clean) or (trip.object.lower() == obj_clean):
                evidence.append(trip)

        return evidence[:5]
