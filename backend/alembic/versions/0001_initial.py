"""initial schema

Revision ID: 0001_initial
"""

from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "admins",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "stores",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("store_uuid", sa.String(length=50), nullable=False, unique=True),
        sa.Column("store_name", sa.String(length=255), nullable=False),
        sa.Column("owner_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("whatsapp_access_token", sa.Text(), nullable=True),
        sa.Column("whatsapp_phone_number_id", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_stores_store_uuid", "stores", ["store_uuid"])


def downgrade() -> None:
    op.drop_index("ix_stores_store_uuid", table_name="stores")
    op.drop_table("stores")
    op.drop_table("admins")
