import React, {useState} from 'react';
import {Link,useNavigate} from "react-router-dom";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../firebase";
import {updateDoc, doc} from "firebase/firestore";

function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
        error: null,
        loading: false
    });

    const navigate = useNavigate();

    const {email, password, error, loading} = data;
    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({...data, loading: true, error: null});
        if (!email || !password) {
            setData({...data, error: 'Nhập đầy đủ thông tin'});
        }
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            await updateDoc(doc(db, 'users', result.user.uid), {
                isOnline: true
            });
            setData({email: '', password: '', loading: false, error: null});
            navigate('/');
        } catch (e) {
            setData({...data, error: e.message, loading: false})
        }
    };
    return (
        <div className="bg-grey-lighter min-h-screen flex flex-col">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <form onSubmit={handleSubmit} className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 className="mb-8 text-3xl text-center">Login</h1>
                    <input type="text" className="block border border-grey-light w-full p-3 rounded mb-4"
                           name="email" value={email} onChange={handleChange} placeholder="Email"/>
                    <input type="password" className="block border border-grey-light w-full p-3 rounded mb-4"
                           name="password" value={password} onChange={handleChange} placeholder="Password"/>
                    {/*<input type="password" className="block border border-grey-light w-full p-3 rounded mb-4" name="confirm_password" value={name} onChange={handleChange} placeholder="Confirm Password" />*/}
                    {error && <div className="text-center text-red-500 text-sm font-bold">{error}</div>}
                    <button disabled={loading}
                            type="submit"
                            className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-gray-500 focus:outline-none my-1">
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
                <div className="text-grey-dark mt-6">
                    <Link className="no-underline border-b border-blue text-blue-400" to="/register">
                        Sing up
                    </Link>.
                </div>
            </div>
        </div>
    );
}

export default Login;
