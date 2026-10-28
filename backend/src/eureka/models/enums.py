"""Enumerated domain values for Project EUREKA schema."""

from enum import Enum


class SourceLane(str, Enum):
    """QUAD Ingestion architecture lane categories."""
    LANE_1_API_GOV = "LANE_1_API_GOV"          # Government structured APIs (data.gov.in, etc.)
    LANE_2_API_PORTAL = "LANE_2_API_PORTAL"    # Official department portals (dgipr.maharashtra.gov.in)
    LANE_3_SCRAPE_WEB = "LANE_3_SCRAPE_WEB"    # News outlets / RSS / Crawl4AI web extraction
    LANE_4_SCRAPE_DOM = "LANE_4_SCRAPE_DOM"    # Complex interactive DOMs / Crawl4AI bot-wall bypass


class IngestionRunStatus(str, Enum):
    """Execution status for batch ingestion runs."""
    STARTED = "STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class DetectedLanguage(str, Enum):
    """Supported multilingual languages for Maharashtra media operations."""
    MARATHI = "mr"
    HINDI = "hi"
    ENGLISH = "en"
    OTHER = "other"


class CanonicalEventStatus(str, Enum):
    """Review state machine values for media intelligence events."""
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    OVERRIDDEN = "overridden"
    REJECTED = "rejected"


class VerificationStatus(str, Enum):
    """Factual verification classifications."""
    UNVERIFIED = "UNVERIFIED"
    VERIFIED = "VERIFIED"
    DISPUTED = "DISPUTED"


class BindingDecisionType(str, Enum):
    """SemIf-OpenJev semantic binding decisions."""
    SAME_EVENT = "same_event"                  # Similarity >= 0.90
    NEW_EVENT = "new_event"                    # Similarity < 0.70
    NEEDS_HUMAN_REVIEW = "needs_human_review"  # 0.70 <= Similarity < 0.90


class FactCheckTicketStatus(str, Enum):
    """Lifecycle states of rumor fact check tickets."""
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    REFUTED = "REFUTED"
    DISMISSED = "DISMISSED"


class UserRole(str, Enum):
    """RBAC roles for DGIPR Maha-Command Center."""
    DG_STATE_ADMIN = "DG State Admin"
    DISTRICT_COLLECTOR = "District Collector"
    DIO_DESK = "DIO Desk"


class OutboxEventStatus(str, Enum):
    """Transactional Outbox CDC synchronization states."""
    PENDING = "PENDING"
    PROCESSED = "PROCESSED"
    FAILED = "FAILED"


class AggregateType(str, Enum):
    """Entities projected into Neo4j spatio-temporal graph."""
    CANONICAL_EVENT = "CanonicalEvent"
    RELEASE = "Release"
    DISTRICT = "District"
    DEPARTMENT = "Department"
    CLAIM = "Claim"
    EVENT_SOURCE_LINK = "EventSourceLink"
    ENTITY = "Entity"
    RELATION = "Relation"


class PositionCategory(str, Enum):
    """Administrative and political leadership categories."""
    MINISTER = "MINISTER"
    MP = "MP"
    MLA = "MLA"
    MLC = "MLC"
    COLLECTOR = "COLLECTOR"
    SP = "SP"
    ZP_CEO = "ZP_CEO"
    MUNICIPAL = "MUNICIPAL"
    DIO = "DIO"
    OTHER = "OTHER"


class TickerKind(str, Enum):
    """Categorization for broadcast news ticker items."""
    HEADLINE = "HEADLINE"
    ANNOUNCEMENT = "ANNOUNCEMENT"
    ALERT = "ALERT"

