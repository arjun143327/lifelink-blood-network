from __future__ import annotations
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.donor import Donor
    from app.models.emergency_request import EmergencyRequest


class RequestResponse(Base):
    __tablename__ = "request_responses"
    __table_args__ = (
        UniqueConstraint("request_id", "donor_id", name="uq_request_donor"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    request_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("emergency_requests.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    donor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("donors.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    response: Mapped[str] = mapped_column(
        String,
        default="pending",
        server_default=text("'pending'"),
        nullable=False,
    )  # pending | confirmed | declined
    responded_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    request: Mapped[EmergencyRequest] = relationship("EmergencyRequest", back_populates="responses")
    donor: Mapped[Donor] = relationship("Donor", back_populates="responses")
