export function SkeletonRect({ className = "" }: { className?: string }) {
  return (
    // Use a lighter gray and smoother pulse animation
    <div
      className={`bg-gray-200 animate-[pulse_1.5s_infinite] rounded-lg ${className}`}
    />
  );
}

export default function SkeletonCard() {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-lg overflow-hidden">
      {/* Title/Header Skeleton */}
      <SkeletonRect className="w-4/5 h-6 mb-3" />
      {/* Content Lines Skeleton */}
      <SkeletonRect className="w-full h-3 mb-2" />
      <SkeletonRect className="w-11/12 h-3 mb-2" />
      <SkeletonRect className="w-3/4 h-3" />
      {/* Button/Action Skeleton */}
      <div className="mt-4 flex gap-3">
        <SkeletonRect className="w-20 h-9 rounded-md" />
        <SkeletonRect className="w-20 h-9 rounded-md" />
      </div>
    </div>
  );
}