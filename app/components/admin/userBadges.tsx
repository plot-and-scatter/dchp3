import StatusBadge, {
  type BadgeTone,
} from "~/components/elements/Labels/StatusBadge"
import {
  isFullyBlocked,
  isPartiallyBlocked,
  type DirectoryUser,
} from "~/services/auth/userDirectory"
import type { AuthRole } from "~/services/auth/AuthRole"

// The badge vocabulary for a person, shared by the list and by one person's
// own page. Kept in one place so a role is the same colour and the same icon
// wherever it appears -- two screens describing the same fact differently is
// how a reader stops trusting either.

export type Badge = {
  label: string
  tone: BadgeTone
  title?: string
  iconName?: string
  iconStyle?: string
}

// One icon per role, reading as what the role lets a person do: look at the
// dictionary, edit it, research it, or administer the site. Every name here is
// checked against the Font Awesome kit in use, which is a v6 kit still carrying
// v5 names -- fa-magnifying-glass is absent where fa-search is present.
const ROLE_ICONS: Record<AuthRole, string> = {
  Display: "fa-eye",
  "Student / Editor": "fa-pen-to-square",
  "Research Assistant": "fa-user-magnifying-glass",
  Superadmin: "fa-shield-halved",
}

// Colour by seniority: barely a badge at all for Display, grey, blue, then
// purple for the role that can do anything.
//
// Purple rather than red, and green is not used here at all. Both of those
// mean something in the Auth0 login column four columns over -- red is
// blocked, green is can log in -- and a colour should not mean two things on
// one screen. Holding the Superadmin role is not a danger either way.
const ROLE_TONES: Record<AuthRole, BadgeTone> = {
  Display: "plain",
  "Student / Editor": "neutral",
  "Research Assistant": "info",
  Superadmin: "privileged",
}

/** Can this person log in at all, and through how many accounts. */
export function loginBadge(user: DirectoryUser): Badge {
  if (user.presence === "auth0Unknown") {
    return {
      label: "Auth0 not read",
      tone: "neutral",
      title: "Auth0 could not be reached, so this is not known.",
    }
  }

  if (user.auth0Accounts.length === 0) {
    return {
      // Neutral, not a warning: a legacy contributor having no account is the
      // expected state, not a problem to fix.
      label: "No account",
      tone: "neutral",
      title:
        "No Auth0 account, so no way to log in. Usual for a legacy contributor.",
    }
  }

  if (isPartiallyBlocked(user)) {
    return {
      label: "Partly blocked",
      tone: "danger",
      title:
        "Some of this person's Auth0 accounts are blocked and others are not, so they can still log in.",
    }
  }

  if (isFullyBlocked(user)) {
    return { label: "Blocked", tone: "danger", title: "Cannot log in." }
  }

  return { label: "Can log in", tone: "success" }
}

/**
 * What this person may do. An Auth0 account with no role is the case worth
 * finding: they can log in and hold no permission at all, which is what a
 * self-service signup produces.
 */
export function roleBadges(user: DirectoryUser): Badge[] {
  if (user.roles.length > 0) {
    return user.roles.map((role) => ({
      label: role,
      tone: ROLE_TONES[role],
      iconName: ROLE_ICONS[role],
    }))
  }

  if (user.auth0Accounts.length > 0) {
    return [
      {
        label: "No role",
        tone: "warning",
        iconName: "fa-exclamation-circle",
        title:
          "Can log in but holds no role, so has no permission at all. Worth checking how this account was created.",
      },
    ]
  }

  return [{ label: "—", tone: "neutral" }]
}

export const renderBadge = (
  { label, tone, title, iconName, iconStyle }: Badge,
  key?: string
) => (
  <StatusBadge
    key={key ?? label}
    tone={tone}
    title={title}
    iconName={iconName}
    iconStyle={iconStyle}
  >
    {label}
  </StatusBadge>
)
