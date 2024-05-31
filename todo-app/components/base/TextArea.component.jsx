import React from 'react';

const TextArea = ({
  labelText = null,
  descriptionText = null,
  enabled = true,
  name = null,
}) => {
  const enabledClassName = `
  data-[${enabled ? 'enabled' : 'disabled'}]:opacity-50
  rounded-lg px-3 py-2 border border-gray-300
  `;

  return (
    <div className="flex flex-col">
      {labelText && <label>{labelText}</label>}
      <input
        type="text"
        id={name}
        name={name}
        className={enabledClassName}
        disabled={!enabled}
      />
      {descriptionText && (
        <textarea
          id={name}
          name={name}
          className={enabledClassName}
          disabled={!enabled}
        />
      )}
    </div>
  );
};

export default TextArea;
