// ─── Enums ───────────────────────────────────────────────────────────────────

export type Role = "ADMIN" | "MANAGER" | "MEMBER";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type AuthProvider = "GOOGLE" | "CREDENTIAL";

export type ProjectStatus = "ACTIVE" | "ARCHIVED" | "COMPLETED";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

export type SubscriptionPlan = "FREE" | "PRO";

export type ActivityAction =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "STATUS_CHANGED"
  | "ASSIGNED"
  | "UNASSIGNED"
  | "COMMENTED"
  | "PAYMENT_MADE";

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  profileImage?: string;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Organization ─────────────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  ownerId: string;
  owner: User;
  members?: OrganizationMember[];
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  user: User;
  organizationId: string;
  role: Role;
  joinedAt: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  deadline?: string;
  organizationId: string;
  organization?: Organization;
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId: string;
  project?: Project;
  assigneeId?: string;
  assignee?: User;
  creatorId: string;
  creator?: User;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

// ─── Comment ─────────────────────────────────────────────────────────────────

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ─────────────────────────────────────────────────────────────────

export interface Payment {
  id: string;
  amount: string;
  plan: SubscriptionPlan;
  status: PaymentStatus;
  bkashPaymentId?: string;
  bkashTrxId?: string;
  merchantInvoiceNumber?: string;
  paidAt?: string;
  userId: string;
  user?: User;
  organizationId: string;
  organization?: Organization;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  isActive: boolean;
  organizationId: string;
  paymentId: string;
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export interface ActivityLog {
  id: string;
  action: ActivityAction;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  userId: string;
  user?: User;
  organizationId?: string;
  projectId?: string;
  taskId?: string;
  createdAt: string;
}

// ─── Admin Stats ─────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  totalProjects: number;
  totalTasks: number;
  totalRevenue: number;
  activeSubscriptions: number;
  recentPayments: Payment[];
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
