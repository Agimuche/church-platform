import { Role } from "@prisma/client";

/**
 * Central permission registry.
 *
 * Every permission check in the app should go through `hasPermission()` /
 * `requirePermission()` below rather than comparing `role` strings directly.
 * That keeps the actual rules in exactly one place, so changing what a role
 * can do never requires touching route handlers or components.
 */
export const PERMISSIONS = {
  // Media
  MEDIA_VIEW_PUBLIC: "media:view:public",
  MEDIA_VIEW_MEMBERS_ONLY: "media:view:members_only",
  MEDIA_UPLOAD: "media:upload",
  MEDIA_EDIT: "media:edit",
  MEDIA_DELETE: "media:delete",
  MEDIA_SCHEDULE: "media:schedule",

  // Live streaming
  STREAM_VIEW: "stream:view",
  STREAM_MANAGE: "stream:manage", // create/start/stop/schedule

  // Store / commerce
  PRODUCT_VIEW: "product:view",
  PRODUCT_MANAGE: "product:manage",
  ORDER_VIEW_OWN: "order:view:own",
  ORDER_VIEW_ALL: "order:view:all",
  ORDER_MANAGE: "order:manage",
  CHECKOUT: "checkout",

  // Prayer
  PRAYER_SUBMIT: "prayer:submit",
  PRAYER_VIEW_OWN: "prayer:view:own",
  PRAYER_VIEW_ASSIGNED: "prayer:view:assigned",
  PRAYER_MANAGE: "prayer:manage",

  // Counseling
  COUNSELING_SUBMIT: "counseling:submit",
  COUNSELING_VIEW_OWN: "counseling:view:own",
  COUNSELING_MANAGE: "counseling:manage",

  // Announcements
  ANNOUNCEMENT_VIEW: "announcement:view",
  ANNOUNCEMENT_MANAGE: "announcement:manage",

  // Gallery
  GALLERY_VIEW: "gallery:view",
  GALLERY_MANAGE: "gallery:manage",

  // Users / admin
  USER_MANAGE: "user:manage",
  ROLE_MANAGE: "role:manage",
  SETTINGS_MANAGE: "settings:manage",
  ANALYTICS_VIEW: "analytics:view",
  AUDIT_LOG_VIEW: "audit_log:view",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const P = PERMISSIONS;

/** Role → permission set. This table is the single place role capabilities are defined. */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  VISITOR: [
    P.MEDIA_VIEW_PUBLIC,
    P.STREAM_VIEW,
    P.PRODUCT_VIEW,
    P.ANNOUNCEMENT_VIEW,
    P.GALLERY_VIEW,
    P.PRAYER_SUBMIT,
    P.COUNSELING_SUBMIT,
  ],
  MEMBER: [
    P.MEDIA_VIEW_PUBLIC,
    P.MEDIA_VIEW_MEMBERS_ONLY,
    P.STREAM_VIEW,
    P.PRODUCT_VIEW,
    P.CHECKOUT,
    P.ORDER_VIEW_OWN,
    P.ANNOUNCEMENT_VIEW,
    P.GALLERY_VIEW,
    P.PRAYER_SUBMIT,
    P.PRAYER_VIEW_OWN,
    P.COUNSELING_SUBMIT,
    P.COUNSELING_VIEW_OWN,
  ],
  MEDIA_TEAM: [
    P.MEDIA_VIEW_PUBLIC,
    P.MEDIA_VIEW_MEMBERS_ONLY,
    P.MEDIA_UPLOAD,
    P.MEDIA_EDIT,
    P.MEDIA_SCHEDULE,
    P.STREAM_VIEW,
    P.STREAM_MANAGE,
    P.ANNOUNCEMENT_VIEW,
    P.ANNOUNCEMENT_MANAGE,
    P.GALLERY_VIEW,
    P.GALLERY_MANAGE,
    P.ANALYTICS_VIEW,
  ],
  PASTOR: [
    P.MEDIA_VIEW_PUBLIC,
    P.MEDIA_VIEW_MEMBERS_ONLY,
    P.STREAM_VIEW,
    P.ANNOUNCEMENT_VIEW,
    P.GALLERY_VIEW,
    P.PRAYER_VIEW_ASSIGNED,
    P.PRAYER_MANAGE,
    P.COUNSELING_MANAGE,
    P.MEDIA_EDIT, // publish approved content
  ],
  ADMIN: [
    P.MEDIA_VIEW_PUBLIC,
    P.MEDIA_VIEW_MEMBERS_ONLY,
    P.MEDIA_UPLOAD,
    P.MEDIA_EDIT,
    P.MEDIA_DELETE,
    P.MEDIA_SCHEDULE,
    P.STREAM_VIEW,
    P.STREAM_MANAGE,
    P.PRODUCT_VIEW,
    P.PRODUCT_MANAGE,
    P.ORDER_VIEW_ALL,
    P.ORDER_MANAGE,
    P.CHECKOUT,
    P.PRAYER_VIEW_ASSIGNED,
    P.PRAYER_MANAGE,
    P.COUNSELING_MANAGE,
    P.ANNOUNCEMENT_VIEW,
    P.ANNOUNCEMENT_MANAGE,
    P.GALLERY_VIEW,
    P.GALLERY_MANAGE,
    P.USER_MANAGE,
    P.ANALYTICS_VIEW,
    P.AUDIT_LOG_VIEW,
  ],
  SUPER_ADMIN: Object.values(P), // full system control
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

export function permissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/** Role hierarchy for display/ordering purposes only — never used for permission checks. */
export const ROLE_ORDER: Role[] = [
  "VISITOR",
  "MEMBER",
  "MEDIA_TEAM",
  "PASTOR",
  "ADMIN",
  "SUPER_ADMIN",
];
