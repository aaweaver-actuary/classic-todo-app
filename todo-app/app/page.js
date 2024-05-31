'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoSection from '@/components/TodoSection.component';
import AddTodoItemButton from '@/components/AddTodoItemButton.component';
import AddTodoItemForm from '@/components/AddTodoItemForm.component';
import CompletedTodoSection from '@/components/CompletedTodoSection.component';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [openedTask, setOpenedTask] = useState(null);
  const [isAddTodoFormVisible, setIsAddTodoFormVisible] = useState(false);

  const handleClickTask = (task) => {
    if (openedTask === task.task_id) {
      setOpenedTask(null);
      return;
    }
    setOpenedTask(task.task_id);
  };

  const getTodos = async () => {
    try {
      console.log('Trying to fetch todos');
      const res = await axios.get('http://localhost:5000/tasks');
      setTodos(res.data);
      console.log('Fetched todos:', res.data);
    } catch (err) {
      console.log('Error fetching todos');
      console.error(err);
    }
  };

  // esc should close the task
  const handleEscForTask = (e) => {
    if (e.key === 'Escape') {
      setOpenedTask(null);
      console.log('Opened task set to null due to Escape key');
    }
  };

  // esc should close the form
  const handleEscForForm = (e) => {
    if (e.key === 'Escape') {
      setIsAddTodoFormVisible(false);
      console.log('Form visibility set to false due to Escape key');
    }
  };

  // clicking outside the form should close it
  const handleClickOutside = (e) => {
    if (!e.target.closest('.add-todo-form')) {
      setIsAddTodoFormVisible(false);
      console.log('Form visibility set to false due to outside click');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const formButton = e.target;
    const form = formButton.closest('.add-todo-form');
    const taskName = form.taskName.value;
    const taskDescription = form.taskDescription.value;
    try {
      console.log('Adding new task:', taskName, taskDescription);
      const res = await axios.post(
        'http://localhost:5000/tasks/new',
        {
          task_name: taskName,
          task_description: taskDescription,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Task added:', res.data);
      getTodos();
      setIsAddTodoFormVisible(false);
    } catch (err) {
      console.log('Error adding task:', taskName, taskDescription);
      console.error(err);
    }
  };

  const handleCompleteItem = async (task) => {
    try {
      console.log('Completing task:', task.task_id);
      const res = await axios.put(
        `http://localhost:5000/tasks/${task.task_id}/complete`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Task completed:', res.data);
      getTodos();

      // re-render the task list
      setOpenedTask(null);
    } catch (err) {
      console.log('Error completing task:', task.task_id);
      console.error(err);
    }
  };

  const handleRestoreItem = async (task) => {
    try {
      console.log('Restoring task:', task.task_id);
      const res = await axios.put(
        `http://localhost:5000/tasks/${task.task_id}/restore`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Task restored:', res.data);
      getTodos();

      // re-render the task list
      setOpenedTask(null);
    } catch (err) {
      console.log('Error restoring task:', task.task_id);
      console.error(err);
    }
  };

  const handleDeleteItem = async (task) => {
    try {
      console.log('Deleting task:', task.task_id);
      const res = await axios.delete(
        `http://localhost:5000/tasks/${task.task_id}/delete`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Task deleted:', res.data);
      getTodos();

      // re-render the task list
      setOpenedTask(null);
    } catch (err) {
      console.log('Error deleting task:', task.task_id);
      console.error(err);
    }
  };

  // fetch the todos from the server on page load
  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    if (isAddTodoFormVisible) {
      const inputElement = document.querySelector('.add-todo-form input');
      if (inputElement) {
        inputElement.focus();
      }
      console.log('Adding event listeners');
      window.addEventListener('keydown', handleEscForForm);
      window.addEventListener('click', handleClickOutside);

      console.log('Removing event listeners for closing tasks');
      window.removeEventListener('keydown', handleEscForTask);
    } else {
      console.log('Removing event listeners');
      window.removeEventListener('keydown', handleEscForForm);
      window.removeEventListener('click', handleClickOutside);

      console.log('Adding event listeners for closing tasks');
      window.addEventListener('keydown', handleEscForTask);
    }
    // Cleanup event listeners on component unmount or visibility change
    return () => {
      console.log('Cleaning up event listeners');
      window.removeEventListener('keydown', handleEscForForm);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isAddTodoFormVisible]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1
          className={`
          font-bold text-4xl text-center text-transparent bg-clip-text bg-gradient-to-br from-sky-100 to-blue-300
        `}
        >
          Todo or not todo
        </h1>
      </div>
      {isAddTodoFormVisible && (
        <AddTodoItemForm
          isVisible={isAddTodoFormVisible}
          handleAddItem={handleAddItem}
        />
      )}
      {!isAddTodoFormVisible && (
        <AddTodoItemButton
          handleAddTodoItemButtonClick={() => setIsAddTodoFormVisible(true)}
        />
      )}

      <h1 className="text-3xl font-bold">Todo:</h1>

      <TodoSection
        todos={todos}
        openedTask={openedTask}
        handleClickTask={handleClickTask}
        handleCompleteItem={handleCompleteItem}
        handleDeleteItem={handleDeleteItem}
      />

      <h1 className="text-3xl font-bold">Not Todo:</h1>

      <CompletedTodoSection
        todos={todos}
        openedTask={openedTask}
        handleClickTask={handleClickTask}
        handleRestoreItem={handleRestoreItem}
        handleDeleteItem={handleDeleteItem}
      />
    </main>
  );
}
