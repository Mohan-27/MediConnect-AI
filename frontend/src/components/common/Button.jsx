import { Loader2 } from "lucide-react";

function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-cyan-600 text-white shadow-sm hover:bg-cyan-700 hover:shadow-md",

    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700",

    outline:
      "border border-cyan-600 bg-transparent text-cyan-600 hover:bg-cyan-50",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  const sizes = {
    sm: "min-h-9 px-3 text-sm",
    md: "min-h-11 px-5 text-sm",
    lg: "min-h-12 px-6 text-base",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}

      {children}
    </button>
  );
}

export default Button;