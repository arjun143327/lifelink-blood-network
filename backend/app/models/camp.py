from __future__ import annotations
import uuid
from datetime import date as python_date
from typing import TYPE_CHECKING, Any, List
from geoalchemy2 import Geography
from sqlalchemy import ARRAY, Date, ForeignKey, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.ngo import NGO


class Camp(Base):
    __tablename__ = "camps"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    ngo_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("ngos.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[Any] = mapped_column(
        Geography(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=False,
    )
    date: Mapped[python_date] = mapped_column(Date, nullable=False)
    target_blood_types: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=False)

    # Relationships
    ngo: Mapped[NGO] = relationship("NGO", back_populates="camps")
