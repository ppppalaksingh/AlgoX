// ============================================================================
// ADMIN CONFIGURATION & WHITELIST
// ============================================================================
// You can add any Administrator email or Clerk User ID here.
// Users in this list or stored in MongoDB Admin collection get full access
// to the MoSPI Admin Hub, Workforce Analytics, and All Officials Directory.
// ============================================================================

export const ADMIN_WHITELIST = [
  "saksham4932@gmail.com",
  "admin.training@mospi.gov.in",
  "admin_saksham",
  "admin_mospi_super",
];

export function isUserAdmin(identifier) {
  if (!identifier) return false;
  const clean = identifier.trim().toLowerCase();
  return ADMIN_WHITELIST.some((adminId) => adminId.toLowerCase() === clean);
}
