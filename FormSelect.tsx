
import React from 'react';
import { Tooltip } from './Tooltip';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  tooltip?: string;
  options: { value: string; label: string }[];
}

export const FormSelect: React.FC<FormSelectProps> = ({ label, name, tooltip, options, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-400 mb-2">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <select
        id={name}
        name={name}
        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-gray-200 focus:ring-brand-primary focus:border-brand-primary transition"
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
