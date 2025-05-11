import { Loader2 } from "lucide-react";

interface LoadingProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Loading({ fullScreen = false, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const content = (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-12 px-4">
        <div className="container mx-auto max-w-3xl">{content}</div>
      </div>
    );
  }

  return content;
}
