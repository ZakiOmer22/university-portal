type SkeletonLoaderProps = {
  variant?: "text" | "circle" | "rect";
  width?: string;
  height?: string;
  className?: string;
};

export default function SkeletonLoader({
  variant = "rect",
  width = "100%",
  height = "1rem",
  className = "",
}: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-gray-300 dark:bg-gray-700 rounded";

  const styles =
    variant === "circle"
      ? `w-${width} h-${height} rounded-full`
      : `w-[${width}] h-[${height}] rounded`;

  return <div className={`${baseClasses} ${className}`} style={{ width, height }} />;
}