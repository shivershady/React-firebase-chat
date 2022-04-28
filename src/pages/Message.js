import React, {useEffect} from 'react';
import Avatar from "../assets/images/user.png"
import {auth, db, storage} from "../firebase";
import {useState} from "react";
import {
    addDoc,
    collection,
    setDoc,
    doc,
    Timestamp,
} from "firebase/firestore";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";

function Message({friend,msgs, backHome}) {
    const userId = auth.currentUser.uid;
    const [message, setMessage] = useState('');
    const [imgMess, setImgMess] = useState('');
    const friendId = friend.uid;

    const handleMessage = async (e) => {
        e.preventDefault();
        if (!message && !imgMess) {
            alert("Nhập vào rồi hãy submit bạn ơi");
            return;
        }
        let urlImg;

        const id = userId > friendId ? friendId + userId : userId + friendId;
        const collectionRef = collection(db, "chats", id , "mess");
        try {
            if (imgMess) {
                const imgFile = `images/${Date.now()} - ${imgMess.name}`;
                const imgRef = ref(storage, imgFile);
                const snap = await uploadBytes(imgRef, imgMess, imgFile);
                const pathRef = ref(storage, snap.ref.fullPath);
                const url = await getDownloadURL(pathRef);
                urlImg = url;
            }
            await addDoc(collectionRef, {
                message: message,
                from: userId,
                to: friendId,
                media: urlImg || "",
                createdAt: Timestamp.fromDate(new Date())
            });
            await setDoc(doc(db, "lastMsg", id), {
                message: message,
                from: userId,
                to: friendId,
                createdAt: Timestamp.fromDate(new Date()),
                media: urlImg || "",
                unread: true,
            });
        } catch (e) {
            console.log(e)
        }
        setMessage('');
        setImgMess('');
    }

    return (
        <div className="w-full bg-gray-200 container mx-auto">
            <div onClick={backHome} className="ml-6 text-blue-500">Quay lại Trang chủ</div>
            <div className="relative flex items-center p-3 border-b border-gray-300 z-1">
                <img className="object-cover w-10 h-10 rounded-full"
                     src={friend?.avatar || Avatar} alt="username"/>
                <span className="block ml-2 font-bold text-gray-600">{friend?.name}</span>
                {friend.isOnline ? <div className="ml-4 text-green-500">Online</div> : <div className="ml-4 text-gray-500">Ofline</div>}
            </div>

            <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
                <ul className="space-y-2">
                    {msgs.length && msgs.map((msg, index) => {
                        return (
                            <li className={`flex justify-${msg.from==userId?"end":"start"}`} key={index}>
                                {msg.media &&
                                <img src={msg.media} alt={msg.message}/>
                                }
                                {msg.message}
                            </li>
                        )
                    })}
                </ul>
            </div>
            <form onSubmit={handleMessage}
                  className="flex items-center justify-between w-full p-3 border-t border-gray-300">
                {/*<button>*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none"*/}
                {/*         viewBox="0 0 24 24" stroke="currentColor">*/}
                {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
                {/*              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>*/}
                {/*    </svg>*/}
                {/*</button>*/}
                <label htmlFor="photo"
                       className="flex justify-center items-center text-white cursor-pointer">
                    {imgMess ? <div className="text-green-500 text-center w-8">hoàn thành</div> :
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                        </svg>}
                </label>
                <input type="file" id="photo" className="hidden"
                       onChange={e => {
                           setImgMess(e.target.files[0])
                       }}/>

                <input type="text"
                       placeholder="Message"
                       className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                       name="message"
                       value={message}
                       onChange={event => setMessage(event.target.value)}
                />
                {/*<button>*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none"*/}
                {/*         viewBox="0 0 24 24" stroke="currentColor">*/}
                {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
                {/*              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>*/}
                {/*    </svg>*/}
                {/*</button>*/}
                <button type="submit">
                    <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                </button>
            </form>
        </div>
    );
}

export default Message;
