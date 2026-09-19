from __future__ import annotations
import uuid
from typing import TYPE_CHECKING, List
from sqlalchemy import ForeignKey, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.camp import Camp
    from app.models.user import User


class NGO(Base):
    __tablename__ = "ngos"

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

    # Relationships
    user: Mapped[User] = relationship("User", back_populates="ngo")
    camps: Mapped[List[Camp]] = relationship(
        "Camp",
        back_populates="ngo",
        cascade="all, delete-orphan",
    )
