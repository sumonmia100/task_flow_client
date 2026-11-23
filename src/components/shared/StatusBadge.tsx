import { cn } from "@/lib/utils";
import type { ProjectStatus, TaskStatus, TaskPriority, PaymentStatus, UserStatus } from "@/types";

type BadgeVariant =
  | ProjectStatus
  | TaskStatus
  | TaskPriority
  | PaymentStatus
  | UserStatus;

const variantMap: Record<BadgeVariant, string> = {
  // ProjectStatus
  ACTIVE: "bg-green-100 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-600",
  COMPLETED: "bg-blue-100 text-blue-700",
  // TaskStatus
  TODO: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  IN_REVIEW: "bg-purple-100 text-purple-700",
  DONE: "bg-green-100 text-green-700",
  // TaskPriority
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
  // PaymentStatus
  UNPAID: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-600",
  REFUNDED: "bg-purple-100 text-purple-700",
  // UserStatus
  BLOCKED: "bg-red-100 text-red-700",
  DELETED: "bg-gray-100 text-gray-400",
};

const labelMap: Record<BadgeVariant, string> = {
  ACTIVE: "Active",
  ARCHIVED: "Archived",
  COMPLETED: "Completed",
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
  UNPAID: "Unpaid",
  PAID: "Paid",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  BLOCKED: "Blocked",
  DELETED: "Deleted",
};

interface StatusBadgeProps {
  status: BadgeVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantMap[status],
        className,
      )}
    >
      {labelMap[status]}
    </span>
  );
}
