import React from "react"
import { type User } from "~/models/user.server"
import { Link } from "../elements/LinksAndButtons/Link"

interface UserListSectionProps {
  header: string
  users?: Pick<
    User,
    "first_name" | "last_name" | "id" | "email" | "access_level"
  >[]
}

const UserListSection = ({ header, users }: UserListSectionProps) => {
  if (users === undefined) return <></>

  // display: 1. Student / Editor, 2. Research Assistant, 3. Superadmin
  return (
    <>
      <h2 className="text-2xl">{header}</h2>
      <div className="grid grid-cols-3">
        {users.map((user) => {
          return (
            <React.Fragment key={user.id}>
              <Link to={`/profile/${user.email}`}>
                <p> {user.first_name + " " + user.last_name}</p>
              </Link>
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}

export default UserListSection
