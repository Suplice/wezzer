import React from 'react';
import ListenerUser from '../ListenerUser/ListenerUser';


const ListenersSection: React.FC = () => {


    return (
        <div className="w-full h-1/5 overflow-auto" >
        <div className="flex flex-col items-center bg-orange-200 rounded-b-3xl shadow-[0_8px_16px_3px_rgba(50,50,50,0.34)]  ">
            <div>
                Listeners section
            </div>
            
            <div className="flex flex-row flex-wrap px-5 py-5 gap-10 overflow-hidden justify-center">
               <ListenerUser name="User 1" profileImg="/public/basicAvatar.png" />
               <ListenerUser name="User 2" profileImg="/public/basicAvatar.png" />
               <ListenerUser name="User 3" profileImg="/public/basicAvatar.png" />
               <ListenerUser name="User 4" profileImg="/public/basicAvatar.png" />
               <ListenerUser name="User 5" profileImg="/public/basicAvatar.png" />
               <ListenerUser name="User 6" profileImg="/public/basicAvatar.png" />
               <ListenerUser name="User 7" profileImg="/public/basicAvatar.png" />
               
                
            </div>
        </div>
    </div>
    )
}

export default ListenersSection;