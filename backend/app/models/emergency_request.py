from __future__ import annotations
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List
from sqlalchemy import DateTime, ForeignKey, Integer, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.hospital import Hospital
    from app.models.request_response import RequestResponse


class EmergencyRequest(Base):
    __tablename__ = "emergency_requests"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    hospital_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("hospitals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    blood_type: Mapped[str] = mapped_column(String, nullable=False, index=True)
    component: Mapped[str] = mapped_column(String, nullable=False)
    units_needed: Mapped[int] = mapped_column(Integer, nullable=False)
    urgency: Mapped[str] = mapped_column(String, nullable=False)  # critical | high | normal
    radius_km: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(
        String,
        default="open",
        server_default=text("'open'"),
        nullable=False,
        index=True,
    )  # open | fulfilled | expired
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationships
    hospital: Mapped[Hospital] = relationship("Hospital", back_populates="emergency_requests")
    responses: Mapped[List[RequestResponse]] = relationship(
        "RequestResponse",
        back_populates="request",
        cascade="all, delete-orphan",
    )
