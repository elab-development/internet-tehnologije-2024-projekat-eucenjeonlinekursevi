import React from 'react';

const InputField = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  name,
  required = false,
  styleClass = '',
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      required={required}
      className={`input-field ${className}`}
    />
  );
};

export default InputField;