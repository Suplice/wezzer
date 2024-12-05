import React, { useEffect, useState } from "react";
import ActiveUser from "../../ActiveUser/ActiveUser";
import { BlinkBlur } from "react-loading-indicators";
import { Participant } from "../../../utils/models";

interface ActiveMembersSectionProps {
  users: Participant[];
  isLoading: boolean;
}

const ActiveMembersSection: React.FC<ActiveMembersSectionProps> = ({
  isLoading,
  users,
}) => {
  const [filteredUsers, setFilteredUsers] = useState<Participant[]>([]);

  useEffect(() => {
    const uniqueUsers = users.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.UserId === user.UserId)
    );
    setFilteredUsers(uniqueUsers);
  }, [users]);

  return (
    <div className="h-full overflow-auto backdrop-blur-xl w-full backdrop-brightness-50   ">
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <BlinkBlur color="black" size="large" text="Loading" textColor="" />
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <div className="flex flex-row flex-wrap px-5 py-5 gap-6 md:gap-x-12 gap-y-6 overflow-hidden items-center justify-center ">
            {filteredUsers.map((user) => (
              <ActiveUser
                key={user.UserId}
                name={user.Nickname}
                isActive={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveMembersSection;
