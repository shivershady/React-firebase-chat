import React , {useState ,useEffect} from 'react';
import Avatar from '../assets/images/user.png';
import { onSnapshot, doc } from "firebase/firestore";
import {db} from "../firebase";

function User({user, selectUser}) {
    return (
        <div className="flex items-center gap-8 py-4 ml-4" onClick={()=>selectUser(user)}>
            <div className="flex justify-start items-center gap-6">
                <img className="w-12 h-12 rounded-full" src={user.avatar || Avatar} alt="user"/>
                <h4>{user.name}</h4>
            </div>
            <div className={`text-${user.isOnline ? "green" : "red"}-500`}>
                {user.isOnline ? "Online" : "Offline"}
            </div>
        </div>
    );
}

export default User;