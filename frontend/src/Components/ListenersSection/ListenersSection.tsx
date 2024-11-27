import React from 'react';


const ListenersSection: React.FC = () => {


    return (
        <div className="w-full h-1/5 overflow-auto" >
        <div className="flex flex-col items-center bg-orange-200 rounded-b-3xl shadow-lg shadow-zinc-500 ">
            <div>
                Listeners section
            </div>
            
            <div className="flex flex-row flex-wrap px-5 py-5 gap-10 overflow-hidden justify-center">
                <div className="flex flex-col items-center justify-center">
                    <img className="w-[60px] h-[60px] rounded-full bg-slate-400 border shadow-md shadow-slate-500 border-stone-300" src="/public/basicAvatar.png"></img>
                    <p>User Name</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <img className="w-[60px] h-[60px] rounded-full bg-slate-400" src="/public/basicAvatar.png"></img>
                    <p>User Name</p>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                    <img className="w-[60px] h-[60px] rounded-full bg-slate-400" src="/public/basicAvatar.png"></img>
                    <p>User Name</p>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                    <img className="w-[60px] h-[60px] rounded-full bg-slate-400" src="/public/basicAvatar.png"></img>
                    <p>User Name</p>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                    <img className="w-[60px] h-[60px] rounded-full bg-slate-400" src="/public/basicAvatar.png"></img>
                    <p>User Name</p>
                </div>
                
            </div>
        </div>
    </div>
    )
}

export default ListenersSection;