# Roles and permissions: Auth0 is the source of truth

Decided 2026-08-31, as part of the user management milestone (#438, issue #440).

## The decision

**Auth0 roles decide what a user can do. The `user.access_level` column is
retired.** Nothing writes it from now on, and the last readers of it are being
removed. The column stays in the database for the moment so that no existing
row is destroyed by this change; dropping it is a later migration, already
listed in `sql/clean-database.sql`.

## What the two systems were

1. **Auth0 roles.** The login callback reads the custom claim
   `https://dchp.ca/roles` from the ID token and stores the result on the
   session as `LoggedInUser.roles`. Every permission check in the application
   goes through `app/services/auth/AuthRole.ts`, which maps a role to a set of
   `AuthPermission` values. The four roles are `Display`,
   `Student / Editor`, `Research Assistant` and `Superadmin`.

2. **`user.access_level`.** A nullable `Int` on the MySQL `user` table,
   written by the pre-Auth0 application. `app/routes/users.tsx` groups the
   user list by it: 1 Superadmin, 2 Research Assistant, 3 Student / Editor,
   0 Display.

Nothing kept the two in step, so the list of users on screen was grouped by
one system while what those users could actually do was decided by the other.

## Why Auth0 won

`access_level` is not merely redundant. It is already largely unusable, and
the production data says so. Counting the `user` table on 2026-08-31:

| `access_level` | active | inactive | shown on `/users`?         |
| -------------- | ------ | -------- | -------------------------- |
| NULL           | 23     | 0        | no                         |
| 0              | 3      | 212      | yes, as Display            |
| 1              | 4      | 3        | yes, as Superadmin         |
| 2              | 4      | 27       | yes, as Research Assistant |
| 3              | 2      | 105      | yes, as Student / Editor   |
| 5              | 1      | 1        | no                         |
| 6              | 0      | 4        | no                         |

Of the 37 active users, **24 do not appear on `/users` at all**: 23 with a
NULL access level and one at level 5. Levels 5 and 6 have no meaning anywhere
in the code.

The NULL rows are not an accident of old data. They are the current
behaviour. `app/services/auth/auth.server.ts` creates a local `user` row
lazily, on first login, setting `first_name`, `last_name`, `email` and
`is_active` — and never `access_level`. So every user onboarded since Auth0
arrived has no access level, and every user onboarded from now on would have
had none either.

Meanwhile no permission check has ever consulted `access_level`. Keeping the
column in sync would mean writing and backfilling a value that decides
nothing.

## What follows from the decision

- **Role names are validated, not assumed.** The claim used to be cast
  straight to `AuthRole[]`. `parseAuthRoles` in `AuthRole.ts` now checks each
  name against the four known roles and drops anything else, so a role renamed
  in the Auth0 tenant fails visibly at the boundary instead of silently
  granting a permission set that does not exist.

- **`getIsAdmin` checked for a role named `Admin`**, which is not one of the
  four and therefore never matched. It now means "holds the Superadmin role".

- **`/profile/$userEmail` no longer displays an access level.**

- **`/users` still groups by `access_level` after this change.** Regrouping it
  by Auth0 role needs the Management API to read role membership, which is
  issue #442. That issue replaces the grouping and is where the 24 invisible
  users become visible.

- **A user existing in Auth0 but not in the local database** is still
  invisible until their first login, because the local row is created lazily.
  The user list in #442 shows that state explicitly rather than hiding it;
  #443 decides whether creating a user writes the local row immediately.

## Where the mapping lives

`app/services/auth/AuthRole.ts` is the only place that knows the role names.
`AUTH_ROLES` lists them, `isAuthRole` narrows a string, and `parseAuthRoles`
turns an unvalidated claim into `AuthRole[]`. Do not re-derive role names
anywhere else.

## One person can hold more than one Auth0 account

Decided 2026-09-01, while building the user list (#442). Measured against the
Auth0 tenant, which had never been read from application code before.

### What was found

The tenant has 34 accounts across two connections: a username-and-password
database connection and a Google social connection. **Three email addresses
have two accounts each**, one on each connection, and **no account in the
tenant has ever had its identities linked**. Auth0 treats each as a separate
user with its own id, its own roles and its own `blocked` flag.

Two of the three are dormant and hold no role. The third is in active use
through both accounts within the same fortnight, and happens to hold the same
role on each — by duplication, not by design.

### Why this is not being solved with account linking

Auth0 supports automatic linking in a post-login Action, keyed on a verified
email address, using `api.authentication.setPrimaryUser()` and the Management
API. It was considered and rejected:

- It is code to write and maintain, hosted in Auth0. Auth0's own worked
  example also stands up an external linking service, and the Action needs its
  own Management API credentials as secrets.
- There is a known defect where a redirect in a later Action loses the
  `setPrimaryUser` assignment and the login fails.
- Linking is gated on the email being **verified**, which is the mitigation
  for the account-takeover risk Auth0 warns about. **The one actively used
  duplicate in this tenant has an unverified address on the account it uses
  most**, so an Action would skip the only case that matters and link the two
  dormant ones instead.

Three accounts is a manual decision, not a system to build.

### What the application does instead

- **The user list groups Auth0 accounts by email address.** One person is one
  row, listing each account and its connection, so two accounts are visible
  rather than appearing as two identical rows.
- **`auth0UserIdsFor` returns every account id for a person, and #444 and #445
  apply their change to all of them.** A role change or a block applied to one
  account leaves the person holding the old role, or still able to log in,
  through the other.
- **The list distinguishes "partly deactivated" from "deactivated."** When some
  but not all of a person's accounts are blocked, saying "deactivated" would be
  false: they can still log in.

This is correct whether or not any accounts are ever linked, which is why it is
preferred to depending on linking.

## What the tenant looked like on 2026-09-01

Recorded because several of these contradicted assumptions in the milestone
issues. No personal data here: counts only.

- **All four role names match `AUTH_ROLES` exactly**, spacing included. This
  was the most likely silent failure and it is not present.
- **No account holds more than one role.** This answers the open question in
  #444: a role change is a remove-then-add, not an addition.
- **Half the tenant holds no role at all** — 17 of 34 accounts. Those people
  can log in and receive no permission, not even `bank:read`.
- **The `Display` role has no members.**
- **No account is blocked**, so the deactivation in #445 has never been used.
- **Every account has logged in at least once.** Nothing in the tenant is a
  never-used invitation.
- Joined against the local database: 27 addresses in both systems, 4 in Auth0
  with no local row, 243 local rows with no Auth0 account. Of those 243, only
  4 are marked active.
- **The four Auth0 accounts with no local row have all logged in.** Lazy row
  creation arrived on 2023-10-11; three of the four last logged in on or before
  that date, which explains them. The fourth logged in many times afterwards
  and is unexplained. The list therefore says "no database record" rather than
  "has never logged in", which the join cannot know.
