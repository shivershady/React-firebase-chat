import React, {useEffect, useState} from 'react';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    where
} from "firebase/firestore";
import {db, auth} from "../firebase";
import User from "../Components/User";
import Message from "./Message";

function Home() {
    const [users, setUsers] = useState([]);
    const [chatFriend, setChatFriend] = useState('');
    const [msgs, setMsgs] = useState([]);
    const userId = auth.currentUser.uid;


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
        return () => unsub();
    }, [])

    const selectUser = async (user) => {
        setChatFriend(user);
        const friendId = user.uid;
        const id = userId > friendId ? `${friendId + userId}` : `${userId + friendId}`;
        const msgsRef = collection(db, "chats", id, "mess");
        const q = query(msgsRef, orderBy("createdAt", "asc"));
        onSnapshot(q, (querySnapshot) => {
            let msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push(doc.data());
            });
            setMsgs(msgs);
        });
    }

    return (
        <div className="container mx-auto bg-gray-400">
            {!chatFriend.name && users.map((user) => {
                return (
                    <User key={user.uid} user={user} selectUser={selectUser}/>
                )
            })}
            {chatFriend.name && <Message friend={chatFriend} msgs={msgs} backHome={()=>setChatFriend('')}/>}
        </div>
    );
}

export default Home;