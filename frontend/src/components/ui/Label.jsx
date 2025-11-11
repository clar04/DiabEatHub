export default function Label({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={"block text-sm font-medium text-ink-700 " + className}>
      {children}
    </label>
  );
}
