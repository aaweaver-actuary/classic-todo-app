import React from 'react';
import TextArea from './base/TextArea.component';
import Button from './base/Button.component';

const AddTodoItemForm = ({ isVisible, handleAddItem }) => {
  return (
    <form
      className={`
        add-todo-form
        flex flex-col gap-4 w-[30%] mx-auto
        ${isVisible ? 'z-50' : 'hidden -z-50'}
        absolute bg-white bg-opacity-90 backdrop-blur-md
        text-black p-[100px] rounded-lg shadow-lg
      `}
    >
      <TextArea labelText={'Task Name'} name={'taskName'} />
      {/* <label htmlFor="taskName">Task Name</label>
      <input type="text" id="taskName" name="taskName" /> */}

      <TextArea labelText={'Task Description'} name={'taskDescription'} />

      {/* <label htmlFor="taskDescription">Task Description</label>
      <textarea id="taskDescription" name="taskDescription" /> */}

      <Button
        onClick={(event) => {
          event.preventDefault();
          handleAddItem(event);
        }}
      >
        Add Task
      </Button>
    </form>
  );
};

export default AddTodoItemForm;
