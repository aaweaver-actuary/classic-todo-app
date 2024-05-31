"""Define the Task data model."""

from __future__ import annotations
from sqlmodel import Field, SQLModel
import datetime


class Task(SQLModel, table=True):
    """A single task."""

    task_id: str | None = Field(default=None, primary_key=True)
    task_created_at: datetime.datetime = datetime.datetime.now()
    task_last_updated_at: datetime.datetime = datetime.datetime.now()
    task_completed_at: datetime.datetime | None = None
    task_name: str
    task_description: str | None = None
    is_task_done: bool = False

    def to_json(self) -> dict:
        """Convert the task to a dictionary."""
        return {
            "task_id": self.task_id,
            "task_created_at": self.task_created_at,
            "task_last_updated_at": self.task_last_updated_at,
            "task_completed_at": self.task_completed_at,
            "task_name": self.task_name,
            "task_description": self.task_description,
            "is_task_done": self.is_task_done,
        }
