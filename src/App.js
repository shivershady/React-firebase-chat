import {
    BrowserRouter,
    Routes,
    Route, Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./Components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {AuthContext} from "./context/auth";
import {useContext} from "react";
import Profile from "./pages/Profile";
import Message from "./pages/Message";

function App() {
    const {user} = useContext(AuthContext);
    return (
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route
                        path="/"
                        element={
                            user ? (
                                <Home />
                            ) : (
                                <Navigate replace to="/login" />
                            )
                        }
                    />
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<Profile />}/>
                    <Route path="/chat/:id" element={<Message />}/>
                </Routes>
            </BrowserRouter>
    );
}

export default App;
