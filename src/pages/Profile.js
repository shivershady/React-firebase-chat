import React, {useEffect, useState} from 'react';
import User from '../assets/images/user.png';
import Camera from '../assets/images/Camera';
import {auth, db, storage} from "../firebase";
import {ref, getDownloadURL, uploadBytes , deleteObject} from 'firebase/storage';
import {addDoc, collection, getDoc, doc, updateDoc , onSnapshot} from "firebase/firestore";

function Profile() {
    const [img, setImg] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        getDoc(doc(db, 'users', auth.currentUser.uid)).then(docSnap => {
            if (docSnap.exists) {
                setUser(docSnap.data());
            }
        });
        if (img) {
            const uploadImg = async () => {
                const imgFile = `avatar/${Date.now()} - ${img.name}`;
                const imgRef = ref(storage, imgFile);
                try {
                    if(user.avatarFile) {
                        await deleteObject(ref(storage, user.avatarFile));
                    }
                    const snap = await uploadBytes(imgRef, img, imgFile);

                    const pathRef = ref(storage, snap.ref.fullPath);
                    const url = await getDownloadURL(pathRef);
                    await updateDoc(doc(db, "users", auth.currentUser.uid), {
                        avatar: url,
                        avatarFile: snap.ref.fullPath
                    });
                    setImg('');
                } catch (e) {
                    console.log(e)
                }
            }
            uploadImg();
        }
    }, [img]);
    console.log(user);
    let unsub = null;
    useEffect(() => {
        const collectionRef = collection(db, "users");
        unsub = onSnapshot(collectionRef,snap => {
            snap.forEach(change => {
                setUser(change.data());
            })
        })
    },[])
    return (
        <div className="container mx-auto">
            <div className="h-full">
                <div className="border-b-2 block md:flex">
                    <div className="w-full md:w-2/5 p-4 sm:p-6 lg:p-8 bg-white shadow-md">
                        <div className="flex justify-between">
                            <span className="text-xl font-semibold block">Admin Profile</span>
                            <a href="#"
                               className="-mt-2 text-md font-bold text-white bg-gray-700 rounded-full px-5 py-2 hover:bg-gray-800">Edit</a>
                        </div>
                        <span className="text-gray-600">This information is secret so be careful</span>
                        <div className="w-full p-8 mx-2 flex justify-center relative">
                                    <img src={user.avatar || User} alt="avatar" className="rounded-full w-32 h-32"/>
                                    <label htmlFor="photo"
                                           className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-white cursor-pointer">
                                        <Camera/>
                                    </label>
                                    <input type="file" id="photo" className="hidden"
                                           onChange={e => setImg(e.target.files[0])}/>
                        </div>
                    </div>
                    <div className="w-full md:w-3/5 p-8 bg-white lg:ml-4 shadow-md">
                        <div className="rounded  shadow p-6">
                            <div className="pb-6">
                                <label htmlFor="name" className="font-semibold text-gray-700 block pb-1">Name</label>
                                <div className="flex">
                                    <input disabled id="username" className="border-1  rounded-r px-4 py-2 w-full"
                                           type="text" defaultValue={user.name}/>
                                </div>
                            </div>
                            <div className="pb-4">
                                <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Email</label>
                                <input disabled id="email" className="border-1  rounded-r px-4 py-2 w-full" type="email"
                                       defaultValue={user.email}/>
                                <span className="text-gray-600 pt-4 block opacity-70">Personal login information of your account</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;