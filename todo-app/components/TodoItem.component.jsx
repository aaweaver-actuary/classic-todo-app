import React from 'react';
import Button from './base/Button.component';

const TodoItem = ({
  taskName,
  taskDescription,
  taskCreatedAt,
  taskLastUpdatedAt,
  taskCompletedAt,
  isTaskComplete,
  isOpened,
  onClick,
  onCompletedClick,
  onDeletedClick,
  backgroundImage,
}) => {
  return (
    <div
      className={`
      w-fit
      my-5 p-8 rounded-lg shadow-lg ${
        isTaskComplete ? 'bg-slate-300' : 'bg-green-200'
      } bg-opacity-50
      hover:${isTaskComplete ? 'bg-slate-400' : 'bg-green-300'} 
      ${isOpened ? '' : 'hover:scale-105'}
      transition-transform duration-300
      cursor-pointer

      flex flex-col gap-2 flex-wrap

    `}
      onClick={onClick}
    >
      <div
        className={`
        w-[90%] h-[90%] bg-center 
        rounded-lg
        ${!backgroundImage ? '' : 'bg-gradient-to-br from-sky-100 to-blue-300'}
      `}
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></div>

      <div>
        <h2 className="text-2xl font-bold">{taskName}</h2>
        <p>{taskDescription}</p>
        {isTaskComplete ? (
          <p className="italic text-red-500">Task is complete</p>
        ) : (
          <p></p>
        )}

        {isOpened && (
          <>
            <p>Created at: {taskCreatedAt}</p>
            <p>Last updated at: {taskLastUpdatedAt}</p>
            {taskCompletedAt != null && <p>Completed at: {taskCompletedAt}</p>}
            <p>Is task complete: {isTaskComplete == 1 ? 'Yes' : 'No'}</p>
            <div className="mx-3 mt-5 flex flex-row gap-2">
              <Button onClick={onCompletedClick} isVisible={true}>
                {isTaskComplete ? 'Restore Task' : 'Complete Task'}
              </Button>
              <Button onClick={onDeletedClick} isVisible={true}>
                Delete Task
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
