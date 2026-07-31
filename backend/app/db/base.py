# Import all the models, so that Base has them before being imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.problem import Problem  # noqa
from app.models.testcase import TestCase  # noqa
from app.models.submission import Submission  # noqa
