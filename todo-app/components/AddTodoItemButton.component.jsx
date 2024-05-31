import React from 'react';
import Button from './base/Button.component';

const AddTodoItemButton = ({ handleAddTodoItemButtonClick, isVisible }) => {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation(); // Prevent the click event from propagating
        handleAddTodoItemButtonClick();
      }}
      isVisible={isVisible}
    >
      New Task
    </Button>
  );
};

export default AddTodoItemButton;
