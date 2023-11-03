import React, { useState } from "react"
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
  const [displayInactive] = useState(true)
  if (users === undefined) return <></>

  // display: 1. Student / Editor, 2. Research Assistant, 3. Superadmin
  return (
    <div className="flex flex-col">
      <UserListSection
        header="Superadmin"
        users={users.filter((user) => isAccessLevel(user, 1))}
        displayInactive={displayInactive}
      />
      <UserListSection
        header="Research Assistant"
        users={users.filter((user) => isAccessLevel(user, 2))}
        displayInactive={displayInactive}
      />
      <UserListSection
        header="Student / Editor"
        users={users.filter((user) => isAccessLevel(user, 3))}
        displayInactive={displayInactive}
      />
      <UserListSection
        header="Display"
        users={users.filter((user) => isAccessLevel(user, 0))}
        displayInactive={displayInactive}
      />
    </div>
  )
}

export default UserList
