import React from "react"
import { type User } from "~/models/user.server"
import { Link } from "../elements/LinksAndButtons/Link"

interface UserListProps {
  users: Pick<User, "first_name" | "last_name" | "id" | "email">[]
}

const UserList = ({ users }: UserListProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-3xl">Other Users</h2>
      <div className="grid grid-cols-3">
        {users?.map((user) => {
          if (!user || !user.email) return <></>
          return (
            <React.Fragment key={user.id}>
              <Link to={user.email}>
                <p> {user.first_name + " " + user.last_name}</p>
              </Link>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default UserList
