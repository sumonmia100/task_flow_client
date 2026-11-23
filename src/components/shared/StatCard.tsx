import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: "blue" | "green" | "purple" | "orange";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorMap[color])}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {trend && (
        <p className="text-xs text-gray-500 mt-1">
          <span className={trend.value >= 0 ? "text-green-600" : "text-red-500"}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </span>{" "}
          {trend.label}
        </p>
      )}
    </div>
  );
}
