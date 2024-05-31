import React from 'react';
import { Button as Button_ } from '@headlessui/react';

const Button = ({ onClick, isVisible = true, children }) => {
  return (
    <Button_
      className={`
          uppercase
          bg-gradient-to-br from-sky-100 to-blue-300
          hover:from-sky-200 hover:to-blue-400 hover:scale-105 transition-all duration-300
          text-black font-bold py-2 px-4 rounded-lg
          ${isVisible ? '' : 'hidden'}
      `}
      onClick={onClick}
    >
      {children}
    </Button_>
  );
};

export default Button;
