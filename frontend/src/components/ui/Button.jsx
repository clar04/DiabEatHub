export default function Button({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center
        rounded-full
        bg-emerald-700
        px-6 py-3
        text-sm font-semibold text-white
        shadow-sm
        transition
        hover:bg-emerald-800
        active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
