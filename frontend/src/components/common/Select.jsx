import { ChevronDown } from "lucide-react";

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error = "",
  helperText = "",
  disabled = false,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error
              ? `${name}-error`
              : helperText
                ? `${name}-helper`
                : undefined
          }
          className={`
            min-h-11 w-full appearance-none rounded-xl border
            bg-white px-4 pr-10 text-sm text-slate-900
            outline-none transition
            focus:ring-2
            disabled:cursor-not-allowed disabled:bg-slate-100
            disabled:text-slate-500
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
            }
            ${className}
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => {
            const optionValue =
              typeof option === "object" ? option.value : option;

            const optionLabel =
              typeof option === "object" ? option.label : option;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 text-xs font-medium text-red-500"
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={`${name}-helper`}
          className="mt-1.5 text-xs text-slate-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Select;