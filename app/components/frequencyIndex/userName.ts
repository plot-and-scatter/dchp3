export const userName = (
  u: { first_name: string | null; last_name: string | null } | null | undefined
) => [u?.first_name, u?.last_name].filter(Boolean).join(" ") || "unknown user"
