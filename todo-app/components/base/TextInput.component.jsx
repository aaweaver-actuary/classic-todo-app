import React from 'react';
import { Description, Field, Input, Label } from '@headlessui/react';

const TextInput = ({
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
    <Field>
      <div className="flex flex-col">
        {labelText && <Label>{labelText}</Label>}
        <Input className={enabledClassName} disabled={!enabled} />
        {descriptionText && (
          <span className={enabledClassName} disabled={!enabled}>
            <Description>{descriptionText}</Description>
          </span>
        )}
      </div>
    </Field>
  );
};

export default TextInput;
