import React from 'react';
import TodoItem from './TodoItem.component';

const CompletedTodoSection = ({
  todos,
  openedTask,
  handleClickTask,
  handleRestoreItem,
  handleDeleteItem,
}) => {
  return (
    <section
      className={`
        w-[80%] 
      `}
    >
      <ul
        className={`
        flex flex-row flex-wrap gap-4
      `}
      >
        {todos.map(
          (todo) =>
            todo.is_task_done == 1 && (
              <li key={todo.task_id}>
                <TodoItem
                  taskName={todo.task_name}
                  taskDescription={todo.task_description}
                  taskCreatedAt={todo.task_created_at}
                  taskLastUpdatedAt={todo.task_last_updated_at}
                  taskCompletedAt={todo.task_completed_at}
                  isTaskComplete={todo.is_task_done}
                  isOpened={openedTask === todo.task_id}
                  onClick={() => handleClickTask(todo)}
                  onCompletedClick={() => handleRestoreItem(todo)}
                  onDeletedClick={() => handleDeleteItem(todo)}
                />
              </li>
            ),
        )}
      </ul>
    </section>
  );
};

export default CompletedTodoSection;
