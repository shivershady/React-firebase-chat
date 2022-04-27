import React, {useEffect, useState} from 'react';
import User from '../assets/images/user.png';
import Camera from '../assets/images/Camera';
import {auth, db, storage} from "../firebase";
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import {getDoc, doc} from 'firebase/firestore';

function Profile() {
    const [img, setImg] = useState('');
    const [user, setUser] = useState('');
    useEffect(() => {
        // getDoc(doc(db, 'users', auth.currentUser.uid)).then(docSnap => {
        //     if (docSnap.exists) {
        //         setUser(docSnap.data());
        //     }
        // });

        if (img) {
            const uploadImg = async () => {
                const imgRef = ref(
                    storage,
                    `avatar/${new Date().getTime()} - ${img.name}`
                );
                const snap = await uploadBytes(imgRef, img);
                console.log(snap.ref.fullPath);
            }
            uploadImg();
        }
    }, [img]);
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
                            <img id="showImage" className="max-w-xs w-32 items-center border rounded-full" src={User}
                                 alt=""/>
                            <label htmlFor="photo"
                                   className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-white cursor-pointer">
                                <Camera/>
                            </label>
                            <input type="file" id="photo" className="hidden" onChange={e => setImg(e.target.files[0])}/>

                        </div>
                    </div>
                    <div className="w-full md:w-3/5 p-8 bg-white lg:ml-4 shadow-md">
                        <div className="rounded  shadow p-6">
                            <div className="pb-6">
                                <label htmlFor="name" className="font-semibold text-gray-700 block pb-1">Name</label>
                                <div className="flex">
                                    <input disabled id="username" className="border-1  rounded-r px-4 py-2 w-full"
                                           type="text" defaultValue="Jane Name"/>
                                </div>
                            </div>
                            <div className="pb-4">
                                <label htmlFor="about" className="font-semibold text-gray-700 block pb-1">Email</label>
                                <input disabled id="email" className="border-1  rounded-r px-4 py-2 w-full" type="email"
                                       defaultValue="example@example.com"/>
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