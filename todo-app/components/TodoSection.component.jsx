import React from 'react';
import TodoItem from './TodoItem.component';

const TodoSection = ({
  todos,
  openedTask,
  handleClickTask,
  handleCompleteItem,
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
            todo.is_task_done == 0 && (
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
                  onCompletedClick={() => handleCompleteItem(todo)}
                  onDeletedClick={() => handleDeleteItem(todo)}
                />
              </li>
            ),
        )}
      </ul>
    </section>
  );
};

export default TodoSection;
