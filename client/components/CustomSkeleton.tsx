export function CustomSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`}></div>
  );
}
