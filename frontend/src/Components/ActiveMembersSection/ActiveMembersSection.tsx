import React from 'react'
import ActiveUser from '../ActiveUser/ActiveUser';

const ActiveMembersSection: React.FC = () => {
    return (
        <div className="w-full h-4/5 overflow-auto ">
            <div className="flex flex-col items-center">
                <div>
                    Active members section
                </div>
                <div className="flex flex-row flex-wrap px-5 py-5 gap-6 md:gap-x-12 gap-y-6 overflow-hidden items-center justify-center">
                       <ActiveUser name="user 1" isActive={false} profileImg="/public/basicAvatar.png" />
                       <ActiveUser name="user 1" isActive={false} profileImg="/public/basicAvatar.png" />
                       <ActiveUser name="user 1" isActive={false} profileImg="/public/basicAvatar.png" />
                       <ActiveUser name="user 1" isActive={false} profileImg="/public/basicAvatar.png" />
                       <ActiveUser name="user 1" isActive={false} profileImg="/public/basicAvatar.png" />
                       <ActiveUser name="user 1" isActive={false} profileImg="/public/basicAvatar.png" />
                       <ActiveUser name="user 1" isActive={false} profileImg="/public/basicAvatar.png" />
                       <ActiveUser name="user 1" isActive={false} profileImg="/public/basicAvatar.png" />
                    
                    
                  </div>
             </div>
        </div>
    )
}

export default ActiveMembersSection;