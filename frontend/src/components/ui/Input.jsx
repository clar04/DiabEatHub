export default function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "field w-full px-3 py-2 text-sm placeholder:text-ink-700/50 " +
        "focus:outline-none focus:ring-4 focus:ring-accent-500/20 focus:border-accent-600 transition " +
        className
      }
      {...props}
    />
  );
}
