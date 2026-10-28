"""SQLAlchemy 2.0 ORM models for Project EUREKA database."""

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from eureka.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from eureka.models.enums import (
    AggregateType,
    BindingDecisionType,
    CanonicalEventStatus,
    DetectedLanguage,
    FactCheckTicketStatus,
    IngestionRunStatus,
    OutboxEventStatus,
    PositionCategory,
    SourceLane,
    TickerKind,
    UserRole,
    VerificationStatus,
)


class SourceRegistry(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Registry of ingestion sources across QUAD lanes."""

    __tablename__ = "source_registry"

    name: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    lane: Mapped[SourceLane] = mapped_column(String(50), nullable=False, index=True)
    base_url: Mapped[str] = mapped_column(String(2048), nullable=False)
    config_json: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    poll_interval_sec: Mapped[int] = mapped_column(Integer, default=300, nullable=False)
    last_polled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    ingestion_runs: Mapped[List["IngestionRun"]] = relationship("IngestionRun", back_populates="source", cascade="all, delete-orphan")
    raw_events: Mapped[List["RawEvent"]] = relationship("RawEvent", back_populates="source", cascade="all, delete-orphan")


class IngestionRun(Base, UUIDPrimaryKeyMixin):
    """Tracks batch execution lifecycle for an ingestion source."""

    __tablename__ = "ingestion_runs"

    source_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("source_registry.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status: Mapped[IngestionRunStatus] = mapped_column(String(50), default=IngestionRunStatus.STARTED, nullable=False, index=True)
    items_ingested: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    errors_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    error_log: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    source: Mapped["SourceRegistry"] = relationship("SourceRegistry", back_populates="ingestion_runs")
    raw_events: Mapped[List["RawEvent"]] = relationship("RawEvent", back_populates="ingestion_run", cascade="all, delete-orphan")


class RawEvent(Base, UUIDPrimaryKeyMixin):
    """Immutable raw event payloads ingested from APIs or CSVAdapter before normalization."""

    __tablename__ = "raw_events"

    ingestion_run_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("ingestion_runs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    source_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("source_registry.id", ondelete="CASCADE"), nullable=False, index=True
    )
    lane: Mapped[SourceLane] = mapped_column(String(50), nullable=False, index=True)
    payload_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)  # SHA-256
    raw_content: Mapped[str] = mapped_column(Text, nullable=False)
    raw_metadata: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    ingested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )

    # Relationships
    source: Mapped["SourceRegistry"] = relationship("SourceRegistry", back_populates="raw_events")
    ingestion_run: Mapped["IngestionRun"] = relationship("IngestionRun", back_populates="raw_events")
    normalized_record: Mapped[Optional["NormalizedRecord"]] = relationship(
        "NormalizedRecord", back_populates="raw_event", uselist=False, cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("ix_raw_events_source_hash", "source_id", "payload_hash", unique=True),
    )


class NormalizedRecord(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Standardized record extracted from raw content with language detection and clean timestamps."""

    __tablename__ = "normalized_records"

    raw_event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("raw_events.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    cleaned_text: Mapped[str] = mapped_column(Text, nullable=False)
    detected_language: Mapped[DetectedLanguage] = mapped_column(String(20), default=DetectedLanguage.OTHER, nullable=False, index=True)
    script: Mapped[str] = mapped_column(String(50), default="Unknown", nullable=False)
    normalized_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    entities: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    claims: Mapped[List[str]] = mapped_column(JSONB, default=list, nullable=False)

    # Relationships
    raw_event: Mapped["RawEvent"] = relationship("RawEvent", back_populates="normalized_record")
    event_source_links: Mapped[List["EventSourceLink"]] = relationship("EventSourceLink", back_populates="normalized_record")
    binding_decisions: Mapped[List["BindingDecision"]] = relationship("BindingDecision", back_populates="normalized_record")


class CanonicalEvent(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Authoritative clustered event entity bound by IRF SemIf-OpenJev."""

    __tablename__ = "canonical_events"

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    primary_language: Mapped[DetectedLanguage] = mapped_column(String(20), default=DetectedLanguage.MARATHI, nullable=False)
    district_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    district_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    department_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    department_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[CanonicalEventStatus] = mapped_column(
        String(50), default=CanonicalEventStatus.PENDING_REVIEW, nullable=False, index=True
    )
    verification_status: Mapped[VerificationStatus] = mapped_column(
        String(50), default=VerificationStatus.UNVERIFIED, nullable=False, index=True
    )
    sentiment_label: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    sentiment_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    first_detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    last_updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Relationships
    source_links: Mapped[List["EventSourceLink"]] = relationship("EventSourceLink", back_populates="canonical_event", cascade="all, delete-orphan")
    fact_check_tickets: Mapped[List["FactCheckTicket"]] = relationship("FactCheckTicket", back_populates="canonical_event", cascade="all, delete-orphan")
    binding_decisions: Mapped[List["BindingDecision"]] = relationship("BindingDecision", back_populates="canonical_event")


class EventSourceLink(Base, UUIDPrimaryKeyMixin):
    """Many-to-one mapping linking normalized source records to canonical events."""

    __tablename__ = "event_source_links"

    canonical_event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("canonical_events.id", ondelete="CASCADE"), nullable=False, index=True
    )
    normalized_record_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("normalized_records.id", ondelete="CASCADE"), nullable=False, index=True
    )
    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    bound_by: Mapped[str] = mapped_column(String(100), default="SemIf-OpenJev", nullable=False)
    bound_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    canonical_event: Mapped["CanonicalEvent"] = relationship("CanonicalEvent", back_populates="source_links")
    normalized_record: Mapped["NormalizedRecord"] = relationship("NormalizedRecord", back_populates="event_source_links")

    __table_args__ = (
        Index("ix_event_source_unique", "canonical_event_id", "normalized_record_id", unique=True),
    )


class BindingDecision(Base, UUIDPrimaryKeyMixin):
    """Persistent audit record of SemIf-OpenJev binding comparisons."""

    __tablename__ = "binding_decisions"

    normalized_record_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("normalized_records.id", ondelete="CASCADE"), nullable=False, index=True
    )
    canonical_event_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("canonical_events.id", ondelete="SET NULL"), nullable=True, index=True
    )
    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    decision_type: Mapped[BindingDecisionType] = mapped_column(String(50), nullable=False, index=True)
    logic_primitive: Mapped[str] = mapped_column(String(50), nullable=False)  # Choice, Noul, Score
    reasoning: Mapped[str] = mapped_column(Text, nullable=False)
    decided_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )

    # Relationships
    normalized_record: Mapped["NormalizedRecord"] = relationship("NormalizedRecord", back_populates="binding_decisions")
    canonical_event: Mapped[Optional["CanonicalEvent"]] = relationship("CanonicalEvent", back_populates="binding_decisions")


class FactCheckTicket(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Tracks rumor claims, refutations, and the 90-minute crisis SLA."""

    __tablename__ = "fact_check_tickets"

    canonical_event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("canonical_events.id", ondelete="CASCADE"), nullable=False, index=True
    )
    claim_text: Mapped[str] = mapped_column(Text, nullable=False)
    is_rumor: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    event_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    refuted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    refuted_within_sla_90m: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    status: Mapped[FactCheckTicketStatus] = mapped_column(
        String(50), default=FactCheckTicketStatus.OPEN, nullable=False, index=True
    )
    assigned_to: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    canonical_event: Mapped["CanonicalEvent"] = relationship("CanonicalEvent", back_populates="fact_check_tickets")


class PillarScoreSnapshot(Base, UUIDPrimaryKeyMixin):
    """Periodic snapshots of the 100-Point Composite Index across all 4 pillars."""

    __tablename__ = "pillar_score_snapshots"

    window_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    window_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    district_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    district_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    volume_score: Mapped[float] = mapped_column(Float, nullable=False)         # 0-25
    tat_score: Mapped[float] = mapped_column(Float, nullable=False)            # 0-25
    sentiment_score: Mapped[float] = mapped_column(Float, nullable=False)      # 0-25
    crisis_sla_score: Mapped[float] = mapped_column(Float, nullable=False)     # 0-25
    total_composite_score: Mapped[float] = mapped_column(Float, nullable=False) # 0-100
    calculation_metadata: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )


class HumanReviewAction(Base, UUIDPrimaryKeyMixin):
    """Immutable audit log for human approvals, overrides, and rejections."""

    __tablename__ = "human_review_actions"

    entity_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    reviewer_id: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[UserRole] = mapped_column(String(50), nullable=False, index=True)
    previous_state: Mapped[str] = mapped_column(String(50), nullable=False)
    new_state: Mapped[str] = mapped_column(String(50), nullable=False)
    action_taken: Mapped[str] = mapped_column(String(50), nullable=False)
    comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )


class OutboxEvent(Base, UUIDPrimaryKeyMixin):
    """Transactional Outbox table for reliable CDC projection into Neo4j."""

    __tablename__ = "outbox_events"

    aggregate_type: Mapped[AggregateType] = mapped_column(String(50), nullable=False, index=True)
    aggregate_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)  # CREATED, UPDATED, DELETED, LINKED
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    status: Mapped[OutboxEventStatus] = mapped_column(
        String(50), default=OutboxEventStatus.PENDING, nullable=False, index=True
    )
    retry_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_error: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("ix_outbox_events_status_created", "status", "created_at"),
    )


class Division(Base, TimestampMixin):
    """9 DGIPR divisional information-office divisions."""

    __tablename__ = "divisions"

    division_code: Mapped[str] = mapped_column(String(50), primary_key=True)
    name_en: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    name_mr: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    hq_district_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class District(Base, TimestampMixin):
    """36 Districts of Maharashtra."""

    __tablename__ = "districts"

    district_code: Mapped[str] = mapped_column(String(50), primary_key=True)
    division_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    name_en: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    name_mr: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    former_name_en: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    lgd_code: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    centroid_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    centroid_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class DistrictAlias(Base):
    """Spellings seen in government sheets and historical news feeds."""

    __tablename__ = "district_aliases"

    alias_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    district_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    alias_text: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    language: Mapped[str] = mapped_column(String(10), nullable=False)
    alias_type: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class DistrictAdjacency(Base):
    """Physical land borders and transit corridors for StGNN diffusion modeling."""

    __tablename__ = "district_adjacency"

    adjacency_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    district_a: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    district_b: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    relation_type: Mapped[str] = mapped_column(String(50), default="LAND_BORDER", nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    source: Mapped[str] = mapped_column(String(100), default="curated_v1", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class Department(Base, TimestampMixin):
    """21 Administrative Line Departments of Maharashtra Government."""

    __tablename__ = "departments"

    department_code: Mapped[str] = mapped_column(String(50), primary_key=True)
    name_en: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    name_mr: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class InformationOffice(Base, TimestampMixin):
    """45 Information Offices: 9 Divisional + 36 District Information Offices."""

    __tablename__ = "information_offices"

    office_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    office_code: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    office_level: Mapped[str] = mapped_column(String(50), nullable=False)
    division_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    district_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    name_mr: Mapped[str] = mapped_column(String(255), nullable=False)
    sheet_label_mr: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    in_source_sheet: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class User(Base, TimestampMixin):
    """Governance actors and RBAC accounts."""

    __tablename__ = "users"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, unique=True)
    full_name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name_mr: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    division_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    district_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_placeholder: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class ReportParameter(Base, TimestampMixin):
    """51 reporting parameters from the official DGIPR daily/monthly report format."""

    __tablename__ = "report_parameters"

    param_code: Mapped[str] = mapped_column(String(50), primary_key=True)
    sheet_column_index: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)
    name_mr: Mapped[str] = mapped_column(Text, nullable=False)
    name_en: Mapped[str] = mapped_column(Text, nullable=False)
    param_group: Mapped[str] = mapped_column(String(100), nullable=False)
    value_kind: Mapped[str] = mapped_column(String(50), nullable=False)
    applies_to: Mapped[str] = mapped_column(String(50), default="BOTH", nullable=False)
    department_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    social_platform: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    feeds_volume: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    feeds_sentiment: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    volume_weight: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class ReportPeriod(Base):
    """Monthly and daily field reporting periods."""

    __tablename__ = "report_periods"

    period_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    label: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    period_type: Mapped[str] = mapped_column(String(20), default="MONTH", nullable=False)
    period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="OPEN", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class ReportSubmission(Base, TimestampMixin):
    """Field report submission instances per office per period."""

    __tablename__ = "report_submissions"

    submission_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    period_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("report_periods.period_id"), nullable=False, index=True)
    office_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("information_offices.office_id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), default="approved", nullable=False)
    submitted_by: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)
    source_file_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    source_sheet_row: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    submitted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class ReportEntry(Base, TimestampMixin):
    """Individual reporting cell entries for P01-P51."""

    __tablename__ = "report_entries"

    entry_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("report_submissions.submission_id", ondelete="CASCADE"), nullable=False, index=True)
    param_code: Mapped[str] = mapped_column(String(50), ForeignKey("report_parameters.param_code"), nullable=False, index=True)
    raw_value: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    raw_cell_ref: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    parse_status: Mapped[str] = mapped_column(String(50), default="PARSED", nullable=False)
    item_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    items: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=list, nullable=False)
    attachment_mentioned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    quality_flags: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=list, nullable=False)


class EntrySocialMetric(Base):
    """Granular social engagement metrics for platform metrics parameters."""

    __tablename__ = "entry_social_metrics"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entry_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("report_entries.entry_id", ondelete="CASCADE"), nullable=False, index=True)
    platform_key: Mapped[str] = mapped_column(String(50), default="ALL", nullable=False)
    posts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    likes: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    views: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    comments: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    shares: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class ScoringConfigVersion(Base):
    """Scoring configuration parameters and weight sets."""

    __tablename__ = "scoring_config_versions"

    version: Mapped[int] = mapped_column(Integer, primary_key=True)
    weights: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    parameters: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class AgentRun(Base, UUIDPrimaryKeyMixin):
    """Immutable audit record for Open UI Copilot execution sessions."""

    __tablename__ = "agent_runs"

    principal_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    principal_role: Mapped[str] = mapped_column(String(50), nullable=False)
    model_id: Mapped[str] = mapped_column(String(100), nullable=False)
    prompt_version_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    user_query: Mapped[str] = mapped_column(Text, nullable=False)
    language: Mapped[str] = mapped_column(String(10), default="en", nullable=False)
    tools_called: Mapped[List[Dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)
    validation_result: Mapped[str] = mapped_column(String(50), default="valid", nullable=False)
    fallback_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    latency_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )


class AgentToolCall(Base, UUIDPrimaryKeyMixin):
    """Granular tool call audit record within an agent run."""

    __tablename__ = "agent_tool_calls"

    run_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("agent_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    tool_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    tool_args: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    tool_status: Mapped[str] = mapped_column(String(50), default="success", nullable=False)
    duration_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class CopilotFeedback(Base, UUIDPrimaryKeyMixin):
    """Officer feedback for copilot answers."""

    __tablename__ = "copilot_feedback"

    run_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True, index=True)
    principal_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    rating: Mapped[str] = mapped_column(String(20), nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class DistrictPosition(Base):
    """Elected and administrative key leadership posts per district."""

    __tablename__ = "district_positions"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    district_code: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    designation_en: Mapped[str] = mapped_column(String(255), nullable=False)
    designation_mr: Mapped[str] = mapped_column(String(255), nullable=False)
    person_name: Mapped[str] = mapped_column(String(255), nullable=False)
    responsibilities_en: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    responsibilities_mr: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    provenance: Mapped[str] = mapped_column(String(50), default="synthetic", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class SchemeHoarding(Base):
    """Field publicity and government scheme hoardings."""

    __tablename__ = "scheme_hoardings"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    district_code: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    scheme_name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    scheme_name_mr: Mapped[str] = mapped_column(String(255), nullable=False)
    department_code: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)
    size: Mapped[str] = mapped_column(String(50), nullable=False)
    installed_on: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    expires_on: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", nullable=False)
    announcement_en: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    announcement_mr: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    provenance: Mapped[str] = mapped_column(String(50), default="synthetic", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class Clipping(Base):
    """Print news clippings and press monitoring records."""

    __tablename__ = "clippings"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    district_code: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    headline: Mapped[str] = mapped_column(String(500), nullable=False)
    outlet: Mapped[str] = mapped_column(String(255), nullable=False)
    language: Mapped[str] = mapped_column(String(20), default="mr", nullable=False)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    source_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    clipping_image_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    provenance: Mapped[str] = mapped_column(String(50), default="synthetic", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class SocialPost(Base):
    """Social media listening posts."""

    __tablename__ = "social_posts"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    district_code: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    platform: Mapped[str] = mapped_column(String(50), nullable=False)
    handle: Mapped[str] = mapped_column(String(100), nullable=False)
    post_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    posted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    engagement: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    provenance: Mapped[str] = mapped_column(String(50), default="synthetic", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class TvClip(Base):
    """Broadcast TV monitoring news segments."""

    __tablename__ = "tv_clips"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    district_code: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    channel: Mapped[str] = mapped_column(String(100), nullable=False)
    programme: Mapped[str] = mapped_column(String(255), nullable=False)
    clip_url: Mapped[str] = mapped_column(String(1024), nullable=False)
    aired_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    start_offset_sec: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    transcript_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    provenance: Mapped[str] = mapped_column(String(50), default="synthetic", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class TickerItem(Base):
    """Statewide horizontal live news ticker items."""

    __tablename__ = "ticker_items"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    kind: Mapped[str] = mapped_column(String(50), nullable=False)
    text_en: Mapped[str] = mapped_column(Text, nullable=False)
    text_mr: Mapped[str] = mapped_column(Text, nullable=False)
    link_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    provenance: Mapped[str] = mapped_column(String(50), default="synthetic", nullable=False)


class WebAuthnCredential(Base):
    """WebAuthn FIDO2 / Passkey credentials for device biometric face authentication."""

    __tablename__ = "webauthn_credentials"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    credential_id: Mapped[str] = mapped_column(String(512), unique=True, nullable=False, index=True)
    public_key: Mapped[str] = mapped_column(Text, nullable=False)
    sign_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    transports: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    label: Mapped[Optional[str]] = mapped_column(String(255), default="Face ID / Windows Hello", nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    last_used_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class TranscriptSegment(Base):
    """Streaming audio transcription segments."""

    __tablename__ = "transcript_segments"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    stream_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    start_time: Mapped[float] = mapped_column(Float, nullable=False)
    end_time: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    language: Mapped[str] = mapped_column(String(10), default="mr", nullable=False)
    provider: Mapped[str] = mapped_column(String(50), nullable=False)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    machine_generated: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class ExtractedEntity(Base):
    """Schema-extracted entity from normalized text and media streams."""

    __tablename__ = "extracted_entities"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    canonical_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    properties: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class EntityMention(Base):
    """Specific textual mention linking an extracted entity to a source record."""

    __tablename__ = "entity_mentions"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_id: Mapped[str] = mapped_column(String(100), ForeignKey("extracted_entities.id", ondelete="CASCADE"), nullable=False, index=True)
    source_table: Mapped[str] = mapped_column(String(100), nullable=False)
    source_id: Mapped[str] = mapped_column(String(100), nullable=False)
    mention_text: Mapped[str] = mapped_column(String(255), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    district_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    as_of: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class ExtractedRelation(Base):
    """Extracted relationship between entities with source attribution."""

    __tablename__ = "extracted_relations"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_entity_id: Mapped[str] = mapped_column(String(100), ForeignKey("extracted_entities.id", ondelete="CASCADE"), nullable=False, index=True)
    target_entity_id: Mapped[str] = mapped_column(String(100), ForeignKey("extracted_entities.id", ondelete="CASCADE"), nullable=False, index=True)
    relation_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    source_table: Mapped[str] = mapped_column(String(100), nullable=False)
    source_id: Mapped[str] = mapped_column(String(100), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    as_of: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )


class ExtractionCheckpoint(Base):
    """Resumable checkpoint tracking extraction offsets per source table."""

    __tablename__ = "extraction_checkpoints"

    source_table: Mapped[str] = mapped_column(String(100), primary_key=True)
    last_processed_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    records_processed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False
    )



