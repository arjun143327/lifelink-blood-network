from __future__ import annotations
import uuid
from typing import TYPE_CHECKING, Any, List
from geoalchemy2 import Geography
from sqlalchemy import Boolean, ForeignKey, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.emergency_request import EmergencyRequest
    from app.models.inventory import Inventory
    from app.models.user import User


class Hospital(Base):
    __tablename__ = "hospitals"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[Any] = mapped_column(
        Geography(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=False,
    )
    verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        server_default=text("false"),
        nullable=False,
    )

    # Relationships
    user: Mapped[User] = relationship("User", back_populates="hospital")
    inventory: Mapped[List[Inventory]] = relationship(
        "Inventory",
        back_populates="hospital",
        cascade="all, delete-orphan",
    )
    emergency_requests: Mapped[List[EmergencyRequest]] = relationship(
        "EmergencyRequest",
        back_populates="hospital",
        cascade="all, delete-orphan",
    )
