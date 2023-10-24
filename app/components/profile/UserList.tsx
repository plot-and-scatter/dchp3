import React from "react"
import { type User } from "~/models/user.server"
import UserListSection from "./UserListSection"

interface UserListProps {
  users?: User[]
}

function isAccessLevel(user: User, level: number) {
  if (user === null) return false
  return user.access_level === level
}

const UserList = ({ users }: UserListProps) => {
  if (users === undefined) return <></>

  // display: 1. Student / Editor, 2. Research Assistant, 3. Superadmin
  return (
    <div className="flex flex-col">
      <UserListSection
        header="Superadmin"
        users={users.filter((user) => isAccessLevel(user, 1))}
      />
      <UserListSection
        header="Research Assistant"
        users={users.filter((user) => isAccessLevel(user, 2))}
      />
      <UserListSection
        header="Student / Editor"
        users={users.filter((user) => isAccessLevel(user, 3))}
      />
      <UserListSection
        header="Display"
        users={users.filter((user) => isAccessLevel(user, 0))}
      />
    </div>
  )
}

export default UserList
