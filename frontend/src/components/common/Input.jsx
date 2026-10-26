function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  helperText = "",
  disabled = false,
  required = false,
  icon: Icon,
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
        {Icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          className={`
            min-h-11 w-full rounded-xl border bg-white px-4 text-sm
            text-slate-900 outline-none transition
            placeholder:text-slate-400
            disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500
            focus:ring-2
            ${
              Icon
                ? "pl-10"
                : ""
            }
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-cyan-500 focus:ring-cyan-100"
            }
            ${className}
          `}
          {...props}
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

export default Input;