"""Define the flask app."""

from __future__ import annotations

from uuid import uuid4
from datetime import datetime

from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from webargs import fields
from webargs.flaskparser import use_args, use_kwargs
from flask_marshmallow import Marshmallow

from sqlmodel import Session

import duckdb
from pathlib import Path

from config import Config
from models import Task
from db import engine


app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/*": {"origins": "*"}})

db = SQLAlchemy(app)
ma = Marshmallow(app)

connection_str = "/home/andy/classic-todo-app/server/db.sqlite3"

# Ensure the directory exists
db_dir = "server"
db_file = "server/db.sqlite3"
Path(db_dir).mkdir(parents=True, exist_ok=True)

# Ensure the database file exists
if not Path(db_file).exists():
    task_db = duckdb.connect(db_file)
    task_db.execute("""
        CREATE TABLE IF NOT EXISTS task (
            task_id STRING,
            task_created_at DATETIME,
            task_last_updated_at DATETIME,
            task_completed_at DATETIME,
            task_name STRING,
            task_description STRING,
            is_task_done BOOLEAN
        )""")
    task_db.close()


def sql_query(where: str | None = None) -> str:
    """Return the SQL query to retrieve tasks."""
    select = """select
        task_id,
        try_cast(task_created_at as text) as task_created_at,
        try_cast(task_last_updated_at as text) as task_last_updated_at,
        try_cast(task_completed_at as text) as task_completed_at,
        task_name,
        task_description,
        is_task_done
    """
    where = f"where {where}" if where else ""
    return f"{select} from task {where}"


def add_cors_headers(response: Response) -> Response:
    """Ensure CORS headers are included in all responses."""
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


@app.route("/")
@use_args({"name": fields.Str(required=True)}, location="query")
def hello(args: dict) -> str:
    """Return a greeting."""
    greeting = f'Hello, {args["name"]}!'
    return add_cors_headers(Response(jsonify(greeting)))


@app.route("/tasks")
def get_tasks() -> dict:
    """Return all tasks."""
    task_db = duckdb.connect(connection_str)
    res = task_db.execute(sql_query()).df().to_json(orient="records")
    task_db.close()

    return add_cors_headers(Response(res))


@app.route("/tasks/<task_id>")
def get_task(task_id: str) -> dict:
    """Return a single task."""
    with Session(engine) as session:
        task = session.get(Task, task_id)
    return add_cors_headers(Response(jsonify(task.to_json())))


@app.route("/tasks/new", methods=["POST"])
@use_kwargs(
    {
        "task_name": fields.Str(required=True),
        "task_description": fields.Str(required=False),
    },
    location="json",
)
def create_task(task_name: str, task_description: str | None = None) -> dict:
    """Create a new task."""
    now = datetime.now()
    task_id = str(uuid4())
    new_task = Task(
        task_id=task_id,
        task_created_at=now,
        task_last_updated_at=now,
        task_name=task_name,
        task_description=task_description,
        is_task_done=False,
    )

    with Session(engine) as session:
        session.add(new_task)
        session.commit()
        session.refresh(new_task)

    return add_cors_headers(Response(jsonify(new_task.to_json())))


@app.route("/tasks/<task_id>", methods=["PUT"])
@use_kwargs(
    {
        "task_name": fields.Str(required=False),
        "task_description": fields.Str(required=False),
        "is_task_done": fields.Bool(required=False),
    },
    location="json",
)
def update_task(
    task_id: str,
    task_name: str | None = None,
    task_description: str | None = None,
    is_task_done: bool | None = None,
) -> dict:
    """Update a task."""
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if task_name:
            task.task_name = task_name
        if task_description:
            task.task_description = task_description
        if is_task_done is not None:
            task.is_task_done = is_task_done
        task.task_last_updated_at = datetime.now()
        session.add(task)
        session.commit()
        session.refresh(task)
    return add_cors_headers(Response(jsonify(task.to_json())))


@app.route("/tasks/<task_id>/complete", methods=["PUT"])
def complete_task(task_id: str) -> dict:
    """Mark a task as complete."""
    try:
        with Session(engine) as session:
            task = session.get(Task, task_id)

            if task.is_task_done:
                # don't update the task if it's already done
                return add_cors_headers(Response(jsonify(task.to_json())))

            task.is_task_done = True
            task.task_completed_at = datetime.now()
            task.task_last_updated_at = datetime.now()
            session.add(task)
            session.commit()
            session.refresh(task)
        return add_cors_headers(Response(jsonify(task.to_json())))
    except Exception as e:
        return add_cors_headers(Response(jsonify({"error": str(e)})))


@app.route("/tasks/<task_id>/restore", methods=["PUT"])
def restore_task(task_id: str) -> dict:
    """Mark a task as incomplete."""
    with Session(engine) as session:
        task = session.get(Task, task_id)
        task.is_task_done = False
        task.task_completed_at = None
        task.task_last_updated_at = datetime.now()
        session.add(task)
        session.commit()
        session.refresh(task)
    return add_cors_headers(Response(jsonify(task.to_json())))


@app.route("/tasks/<task_id>/delete", methods=["DELETE"])
def delete_task(task_id: str) -> dict:
    """Delete a task."""
    with Session(engine) as session:
        task = session.get(Task, task_id)
        session.delete(task)
        session.commit()
    return {"message": "Task deleted."}


if __name__ == "__main__":
    app.run()
