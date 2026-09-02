# Managing users

`/admin/users`, and one page per person beneath it. Requires the
`det:manageUsers` permission, which only Superadmin holds.

This is the operational half. For why Auth0 owns roles at all, and what the
tenant actually contained when it was first read, see
[roles.md](./roles.md).

## What it needs

Two Auth0 applications, which are not interchangeable. `.env.example` lists
both, the seven scopes the second one needs, and why `delete:users` is not
among them.

**Without `AUTH0_MGMT_CLIENT_ID` and `AUTH0_MGMT_CLIENT_SECRET` the site starts
and runs normally.** Only `/admin/users` fails, and only when somebody opens
it. That is the reason setting them is a step in the deploy checklist rather
than something to notice afterwards: nothing else will tell you.

## What it does, and where each thing is written

| Action        | Auth0                          | DCHP database             |
| ------------- | ------------------------------ | ------------------------- |
| Add someone   | account, role, password ticket | the row, with their name  |
| Change a role | role, on every account         | —                         |
| Change a name | `name`, on every account       | `first_name`, `last_name` |
| Deactivate    | `blocked`, on every account    | `is_active`               |
| Password link | a one-time ticket              | —                         |

"Every account" is not a figure of speech. One address can carry two Auth0
accounts — one signing in with a password, one with Google — because Auth0
treats them as separate users and the tenant has never linked any. A change
applied to one of them would leave the person's access depending on which
button they pressed at the sign-in screen.

The same goes the other way: the `user` table has no unique index on email
despite `@@unique` in `schema.prisma`, so an address can have more than one
row. Both are written.

## When a change takes effect

**A role change or a deactivation applies at that person's next sign-in.**
Roles arrive on a claim in the login token, and blocking someone stops the next
sign-in rather than the current visit. The interface says so at the point of
making the change, because otherwise the natural conclusion is that it did not
work.

[#465](https://github.com/plot-and-scatter/dchp3/issues/465) is what would
make it immediate.

## Passwords

Nobody sets a password for anybody. Adding someone creates the account with a
random one that is never shown, and returns a one-time link they use to choose
their own. It lasts a week and works once.

The link is handed over by whoever created the account. **Nothing is emailed**,
which is deliberate: it means none of this depends on how the tenant's email is
configured. If a link expires or goes astray, make another from that person's
page — there is no state to recover.

Treat the link as a credential while it lives. Anyone holding it can set that
account's password. It is shown once and not stored anywhere.

A Google account has no password here, so no link is offered for one.

## When Auth0 cannot be reached

The list still renders, from the DCHP database, with a banner saying what is
missing. Nobody is shown as unable to sign in on the strength of a question
that could not be asked: those rows are marked as unknown rather than as having
no account.

The page reads Auth0 on each load — the user list, the roles, and each role's
membership. Sorting, filtering and paging do not re-read it.

## What is deliberately absent

- **Deletion.** The Management API application holds no `delete:users`, and a
  person's name is attached to entries and citations that should keep it.
  Deactivating is the end of the road.
- **Automatic account linking.** Considered and rejected; the reasoning is in
  [roles.md](./roles.md).
- **Changing your own role, or deactivating yourself.** Both would remove the
  access needed to undo them. Another Superadmin can, or the Auth0 dashboard.

## Two things worth knowing about the data

**Most of the list is legacy contributors** — people who wrote entries or
citations before the project moved to Auth0. They have no account and cannot
sign in. They are hidden by default and the count is always on screen.

**Half the Auth0 accounts hold no role.** Someone with no role can sign in and
has no permission at all. Sorting the list by role brings them to the top, and
the role filter has a "No role" option.
