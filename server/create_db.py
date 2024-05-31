"""Simple script to create and initialize the database."""

from sqlmodel import SQLModel
from models import *
from db import engine

SQLModel.metadata.create_all(engine)
