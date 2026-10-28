"""Additive migration for EUREKA Nirdeshak v2 Phase 2: Text Retrieval & Graph Context

Revision ID: 004_text_search_and_extraction
Revises: 003_meeting_changes_foundation
Create Date: 2026-10-28 17:55:00.000000

Adds:
1. Postgres pg_trgm extension & full-text search (simple config) and trigram GIN indexes
   over media_events, normalized_records, fact_check_tickets, clippings, transcript_segments, tv_clips.
2. Tables for schema-based entity & claim extraction:
   - extracted_entities
   - entity_mentions
   - extracted_relations
   - extraction_checkpoints
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '004_text_search_and_extraction'
down_revision: Union[str, None] = '003_meeting_changes_foundation'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"

    # 1. Enable pg_trgm extension on Postgres
    if is_postgres:
        op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")

    # 2. extracted_entities table
    op.create_table(
        'extracted_entities',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('category', sa.String(50), nullable=False),
        sa.Column('canonical_id', sa.String(100), nullable=True),
        sa.Column('properties', sa.JSON() if not is_postgres else postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('ix_extracted_entities_name', 'extracted_entities', ['name'])
    op.create_index('ix_extracted_entities_category', 'extracted_entities', ['category'])
    op.create_index('ix_extracted_entities_canonical_id', 'extracted_entities', ['canonical_id'])

    # 3. entity_mentions table
    op.create_table(
        'entity_mentions',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('entity_id', sa.String(100), sa.ForeignKey('extracted_entities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('source_table', sa.String(100), nullable=False),
        sa.Column('source_id', sa.String(100), nullable=False),
        sa.Column('mention_text', sa.String(255), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('district_code', sa.String(50), nullable=True),
        sa.Column('as_of', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('ix_entity_mentions_entity_id', 'entity_mentions', ['entity_id'])
    op.create_index('ix_entity_mentions_source', 'entity_mentions', ['source_table', 'source_id'])
    op.create_index('ix_entity_mentions_district', 'entity_mentions', ['district_code'])

    # 4. extracted_relations table
    op.create_table(
        'extracted_relations',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('source_entity_id', sa.String(100), sa.ForeignKey('extracted_entities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('target_entity_id', sa.String(100), sa.ForeignKey('extracted_entities.id', ondelete='CASCADE'), nullable=False),
        sa.Column('relation_type', sa.String(100), nullable=False),
        sa.Column('source_table', sa.String(100), nullable=False),
        sa.Column('source_id', sa.String(100), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('as_of', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('ix_extracted_relations_source', 'extracted_relations', ['source_entity_id'])
    op.create_index('ix_extracted_relations_target', 'extracted_relations', ['target_entity_id'])
    op.create_index('ix_extracted_relations_type', 'extracted_relations', ['relation_type'])

    # 5. extraction_checkpoints table
    op.create_table(
        'extraction_checkpoints',
        sa.Column('source_table', sa.String(100), primary_key=True),
        sa.Column('last_processed_id', sa.String(100), nullable=True),
        sa.Column('last_processed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('records_processed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
    )

    # 6. Postgres Full-Text Search ('simple' config) & pg_trgm GIN Indexes
    if is_postgres:
        # media_events
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_media_events_fts 
            ON media_events USING gin (to_tsvector('simple', coalesce(english_content, '')));
        """)
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_media_events_trgm 
            ON media_events USING gin (english_content gin_trgm_ops);
        """)

        # normalized_records
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_normalized_records_fts 
            ON normalized_records USING gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(cleaned_text, '')));
        """)
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_normalized_records_trgm 
            ON normalized_records USING gin (cleaned_text gin_trgm_ops);
        """)

        # fact_check_tickets (claims)
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_fact_check_tickets_fts 
            ON fact_check_tickets USING gin (to_tsvector('simple', coalesce(claim_text, '')));
        """)
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_fact_check_tickets_trgm 
            ON fact_check_tickets USING gin (claim_text gin_trgm_ops);
        """)

        # clippings
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_clippings_fts 
            ON clippings USING gin (to_tsvector('simple', coalesce(headline, '') || ' ' || coalesce(summary, '')));
        """)
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_clippings_trgm 
            ON clippings USING gin (headline gin_trgm_ops);
        """)

        # transcript_segments
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_transcript_segments_fts 
            ON transcript_segments USING gin (to_tsvector('simple', coalesce(text, '')));
        """)
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_transcript_segments_trgm 
            ON transcript_segments USING gin (text gin_trgm_ops);
        """)

        # tv_clips
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_tv_clips_fts 
            ON tv_clips USING gin (to_tsvector('simple', coalesce(transcript_text, '')));
        """)
        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_tv_clips_trgm 
            ON tv_clips USING gin (transcript_text gin_trgm_ops);
        """)


def downgrade() -> None:
    bind = op.get_bind()
    is_postgres = bind.dialect.name == "postgresql"

    if is_postgres:
        op.execute("DROP INDEX IF EXISTS ix_tv_clips_trgm;")
        op.execute("DROP INDEX IF EXISTS ix_tv_clips_fts;")
        op.execute("DROP INDEX IF EXISTS ix_transcript_segments_trgm;")
        op.execute("DROP INDEX IF EXISTS ix_transcript_segments_fts;")
        op.execute("DROP INDEX IF EXISTS ix_clippings_trgm;")
        op.execute("DROP INDEX IF EXISTS ix_clippings_fts;")
        op.execute("DROP INDEX IF EXISTS ix_fact_check_tickets_trgm;")
        op.execute("DROP INDEX IF EXISTS ix_fact_check_tickets_fts;")
        op.execute("DROP INDEX IF EXISTS ix_normalized_records_trgm;")
        op.execute("DROP INDEX IF EXISTS ix_normalized_records_fts;")
        op.execute("DROP INDEX IF EXISTS ix_media_events_trgm;")
        op.execute("DROP INDEX IF EXISTS ix_media_events_fts;")

    op.drop_table('extraction_checkpoints')
    op.drop_table('extracted_relations')
    op.drop_table('entity_mentions')
    op.drop_table('extracted_entities')
