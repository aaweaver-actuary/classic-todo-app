"""Flask configuration."""


class Config:
    """Base configuration."""

    DEBUG = True
    TESTING = False
    SECRET_KEY = "mysecretkey"
    SQLALCHEMY_DATABASE_URI = "sqlite:///db.sqlite3"
    SQLALCHEMY_TRACK_MODIFICATIONS = True
