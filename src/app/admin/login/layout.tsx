// This layout intentionally overrides the parent /admin/layout.tsx
// so the login page renders without the AdminLayout sidebar.
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
