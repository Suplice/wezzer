import React from 'react';
import { ListenerUserInterface } from '../ListenerUser/ListenerUser';

interface ActiveUserInterface extends ListenerUserInterface{
    isActive: boolean;
} 


const ActiveUser: React.FC<ActiveUserInterface> = ({name, isActive, profileImg}) => {

    return (
    <div className="flex flex-col items-center justify-center gap-1">
        <img className={`w-[100px] h-[100px] rounded-full bg-slate-400 border shadow-md shadow-slate-500  border-stone-300 transition-all duration-75  ${isActive ? "outline-green-600 outline-4 outline " : "bg-slate-400 "}`} src={profileImg}></img>
        <p>{name}</p>
    </div>)
}

export default ActiveUser;