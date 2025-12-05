export function SkeletonRect({ className = "" }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

export default function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <SkeletonRect className="w-32 h-6 mb-3" />
      <SkeletonRect className="w-full h-3 mb-2" />
      <SkeletonRect className="w-3/4 h-3" />
      <div className="mt-4 flex gap-2">
        <SkeletonRect className="w-20 h-8 rounded" />
        <SkeletonRect className="w-20 h-8 rounded" />
      </div>
    </div>
  );
}
