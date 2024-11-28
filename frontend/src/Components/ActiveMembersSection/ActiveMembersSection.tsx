import React, { useEffect, useState } from "react";
import ActiveUser from "../ActiveUser/ActiveUser";
import { BlinkBlur } from "react-loading-indicators";

const ActiveMembersSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const connectToRoom = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/active-users");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        }

        console.log("done");
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    };

    connectToRoom();
  }, []);

  return (
    <div className="h-full overflow-auto backdrop-blur-xl w-full backdrop-brightness-50   ">
      {isLoading ? (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <BlinkBlur color="black" size="large" text="Loading" textColor="" />
        </div>
      ) : (
        <div className="flex flex-col items-center ">
          <div className="flex flex-row flex-wrap px-5 py-5 gap-6 md:gap-x-12 gap-y-6 overflow-hidden items-center justify-center ">
            <ActiveUser
              name="user 1"
              isActive={false}
              profileImg="/public/basicAvatar.png"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveMembersSection;
