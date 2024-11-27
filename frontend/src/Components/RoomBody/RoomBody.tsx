import React from 'react';
import ListenersSection from '../ListenersSection/ListenersSection';
import ActiveMembersSection from '../ActiveMembersSection/ActiveMembersSection';


const RoomBody: React.FC = () => {


    return (
    <div className="flex flex-col h-[calc(100%-80px)]  items-center justify-center bg-amber-200">
       <ListenersSection />
       <ActiveMembersSection />  
    </div>)
}

export default RoomBody;