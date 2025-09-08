export function Alert({ type = "info", message, className = "" }) {
  const styles = {
    info: "bg-blue-50 text-blue-900 border-blue-200",
    success: "bg-green-50 text-green-900 border-green-200",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
    error: "bg-red-50 text-red-900 border-red-200",
  };
  return (
    <div className={`border rounded-md px-3 py-2 text-sm ${styles[type]} ${className}`}>
      {message}
    </div>
  );
}
