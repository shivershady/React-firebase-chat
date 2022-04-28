import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db, auth} from "../firebase";
import User from "../Components/User";
import Message from "./Message";
import {useNavigate} from "react-router-dom";

function Home(props) {
    const [users, setUsers] = useState([]);
    let navigate = useNavigate();
    useEffect(() => {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("uid", "not-in", [auth.currentUser.uid]));
        const unsub = onSnapshot(q, (snapshot) => {
            let users = [];
            snapshot.forEach((doc) => {
                users.push(doc.data());
            });
            setUsers(users);
        });
    }, [])

    const [chatFriend, setChatFriend] = useState([]);
    const selectUser = (user) => {
        setChatFriend(user);
    }
    return (
        <div className="container mx-auto bg-gray-400">
            {!chatFriend.name && users.map((user) => {
                return (
                    <User key={user.uid} user={user} selectUser={selectUser}/>
                )
            })}
            {chatFriend.name && <Message friend={chatFriend}/>}
        </div>
    );
}

export default Home;