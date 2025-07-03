// Custom Input Component with Error State
import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps {
  label: string;
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  endIcon?: LucideIcon;
}

export const FormInput: React.FC<InputProps> = ({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  error,
  disabled = false,
  value,
  onChange,
  onTogglePassword,
  endIcon: EndIcon,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          className={`w-full pl-10 ${
            EndIcon || onTogglePassword ? "pr-12" : "pr-3"
          } py-3 border-2 rounded-lg focus:outline-none transition-colors ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-300 focus:border-primary"
          }`}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {(EndIcon || onTogglePassword) && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={onTogglePassword}
            disabled={disabled}
          >
            {EndIcon && (
              <EndIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Loading Button Component
interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
