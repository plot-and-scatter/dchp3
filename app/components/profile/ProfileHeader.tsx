import { type User } from "~/models/user.server"

interface ProfileHeaderProps {
  user: User
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <div>
      <h1 className="text-4xl">
        Profile: {user.first_name + " " + user.last_name}
      </h1>
      <p className="text-lg">Email: {user.email}</p>
      <p className="text-lg">Access Level: {user.access_level}</p>
    </div>
  )
}

export default ProfileHeader
