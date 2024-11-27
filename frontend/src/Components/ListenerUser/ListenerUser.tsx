import React from 'react';

export interface ListenerUserInterface {
    name: string,
    profileImg: string
}

const ListenerUser: React.FC<ListenerUserInterface> = ({name, profileImg}) => {

return (
    <div className="flex flex-col items-center justify-center">
        <img className="w-[80px] h-[80px] rounded-full bg-slate-400 border shadow-md shadow-slate-500  border-stone-300" src={profileImg}></img>
        <p>{name}</p>
    </div>
)
}

export default ListenerUser;