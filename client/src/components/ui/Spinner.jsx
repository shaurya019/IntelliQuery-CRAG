export default function Spinner({ className = "h-5 w-5" }) {
  return (
    <span
      className={`${className} inline-block animate-spin rounded-full border-2 border-slate-200 border-t-blue-500`}
      aria-label="Loading"
    />
  );
}
