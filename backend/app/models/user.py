from __future__ import annotations
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import DateTime, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.donor import Donor
    from app.models.hospital import Hospital
    from app.models.ngo import NGO


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String, nullable=False)  # donor | hospital_admin | ngo_admin
    name: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # 1-to-1 Profile Relationships
    donor: Mapped[Optional[Donor]] = relationship(
        "Donor",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    hospital: Mapped[Optional[Hospital]] = relationship(
        "Hospital",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    ngo: Mapped[Optional[NGO]] = relationship(
        "NGO",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
