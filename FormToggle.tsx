
import React from 'react';
import { Tooltip } from './Tooltip';

interface FormToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  tooltip?: string;
}

export const FormToggle: React.FC<FormToggleProps> = ({ label, name, tooltip, checked, ...props }) => {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-400">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" id={name} name={name} className="sr-only peer" checked={checked} {...props} />
        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-brand-secondary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
      </label>
    </div>
  );
};
