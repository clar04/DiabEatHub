export default function Button({ variant = "soft", className = "", children, ...props }) {

  const styles =
    variant === "soft"
      ? "bg-surface-100 border border-line-200 text-ink-900 hover:bg-surface-200"
      : "bg-accent-600 text-white hover:bg-accent-500";

  return (
    <button
      className={
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[0.99] " +
        styles +
        " " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
