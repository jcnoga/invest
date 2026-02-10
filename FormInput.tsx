
import React from 'react';
import { Tooltip } from './Tooltip';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, name, tooltip, prefix, suffix, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className="flex items-center text-sm font-medium text-gray-400 mb-2">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            {prefix}
          </span>
        )}
        <input
          id={name}
          name={name}
          className={`w-full bg-gray-700 border border-gray-600 rounded-md py-2 text-gray-200 focus:ring-brand-primary focus:border-brand-primary transition ${prefix ? 'pl-10' : 'pl-3'} ${suffix ? 'pr-10' : 'pr-3'}`}
          {...props}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
