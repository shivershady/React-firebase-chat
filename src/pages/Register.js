import React, {useState} from 'react';
import {Link,useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../firebase";
import {setDoc, doc, Timestamp} from "firebase/firestore";

function Register() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false
    });

    const navigate = useNavigate();

    const {name, email, password, error, loading} = data;
    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({...data, loading: true, error: null});
        if (!name || !email || !password) {
            setData({...data, error: 'Nhập đầy đủ thông tin'});
            return;
        }
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', result.user.uid), {
                uid: result.user.uid,
                name,
                email,
                createAt: Timestamp.fromDate(new Date()),
                isOnline: true
            });
            setData({name: '', email: '', password: '', loading: false, error: null});
            navigate('/');
        } catch (e) {
            setData({...data, error: e.message, loading: false})
        }
    };
    return (
        <div className="bg-grey-lighter min-h-screen flex flex-col">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <form onSubmit={handleSubmit} className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                    <input type="text" className="block border border-grey-light w-full p-3 rounded mb-4"
                           name="name" value={name} onChange={handleChange} placeholder="Name"/>
                    <input type="text" className="block border border-grey-light w-full p-3 rounded mb-4"
                           name="email" value={email} onChange={handleChange} placeholder="Email"/>
                    <input type="password" className="block border border-grey-light w-full p-3 rounded mb-4"
                           name="password" value={password} onChange={handleChange} placeholder="Password"/>
                    {/*<input type="password" className="block border border-grey-light w-full p-3 rounded mb-4" name="confirm_password" value={name} onChange={handleChange} placeholder="Confirm Password" />*/}
                    {error && <div className="text-center text-red-500 text-sm font-bold">{error}</div>}
                    <button disabled={loading}
                            type="submit"
                            className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-gray-500 focus:outline-none my-1">
                        {loading?'Loading...':'Sign up'}
                    </button>
                    <div className="text-center text-sm text-grey-dark mt-4">
                        By signing up, you agree to the
                        <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Terms of Service
                        </a> and
                        <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
                            Privacy Policy
                        </a>
                    </div>
                </form>
                <div className="text-grey-dark mt-6">
                    Already have an account?
                    <Link className="no-underline border-b border-blue text-blue-400" to="/login/">
                        Log in
                    </Link>.
                </div>
            </div>
        </div>
    );
}

export default Register;
