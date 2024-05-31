"""Define the database engine."""

from sqlmodel import create_engine
from config import Config

sqlalchemy_uri = Config.SQLALCHEMY_DATABASE_URI
db_file = sqlalchemy_uri.split("sqlite:///")[-1]

engine = create_engine(sqlalchemy_uri, echo=True)
