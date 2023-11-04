import { type User } from "~/models/user.server"
import { Link } from "../elements/LinksAndButtons/Link"
import React from "react"

interface UserListSectionProps {
  header: string
  users?: User[]
  displayInactive: boolean
}

const UserListSection = ({
  header,
  users,
  displayInactive,
}: UserListSectionProps) => {
  if (users === undefined) return <></>

  return (
    <>
      <h2 className="text-2xl">{header}</h2>
      <div className="grid grid-cols-3">
        {users
          .filter((user) => (displayInactive ? true : user.is_active))
          .map((user) => {
            const asterisk = user.is_active ? "" : "*"
            const appearance = user.is_active ? "primary" : "secondary"
            return (
              <React.Fragment key={user.id}>
                <Link appearance={appearance} to={`/profile/${user.email}`}>
                  <p>
                    {user.first_name + " " + user.last_name + " " + asterisk}
                  </p>
                </Link>
              </React.Fragment>
            )
          })}
      </div>
    </>
  )
}

export default UserListSection
