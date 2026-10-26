function Card({
  children,
  padding = true,
  hover = false,
  className = "",
}) {
  const baseStyles =
    "rounded-2xl border border-slate-200 bg-white shadow-sm";

  const paddingStyles = padding ? "p-5" : "";

  const hoverStyles = hover
    ? "transition-all duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md"
    : "";

  return (
    <div
      className={`${baseStyles} ${paddingStyles} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;