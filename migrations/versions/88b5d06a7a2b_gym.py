"""gym

Revision ID: 88b5d06a7a2b
Revises: dfb5facf5331
Create Date: 2024-09-12 17:18:12.748487

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '88b5d06a7a2b'
down_revision = 'dfb5facf5331'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('member', schema=None) as batch_op:
        batch_op.alter_column('birthdate',
               existing_type=sa.DATE(),
               type_=sa.String(length=120),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('member', schema=None) as batch_op:
        batch_op.alter_column('birthdate',
               existing_type=sa.String(length=120),
               type_=sa.DATE(),
               existing_nullable=False)

    # ### end Alembic commands ###
