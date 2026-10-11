import React from "react";
import { Link, Outlet } from "react-router-dom";
import { toast } from 'react-toastify';

function Navbar() {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    const logout = async()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('role');

        toast.success('Logout successful');
        navigate('/login');
    }
    
    return (
        <>
            <nav className="flex justify-between items-center bg-gray-900 text-white px-8 py-4">

                <Link to="/" className="text-2xl font-bold">
                    FoodZone
                </Link>

                <div className="flex gap-6 items-center">

                    <Link to="/">Home</Link>

                    <Link to="/restaurants">Restaurants</Link>

                    <Link to="/foods">Foods</Link>

                    {token && role === "customer" && (
                        <Link to="/orders">My Orders</Link>
                    )}

                    {token && role === "restaurant" && (
                        <Link to="/orders">Orders</Link>
                    )}

                    {token && role === "admin" && (
                        <Link to="/orders">Orders</Link>
                    )}

                    {!token && (
                        <>
                            <Link
                                to="/login"
                                className="bg-orange-500 px-4 py-2 rounded"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="bg-white text-gray-900 px-4 py-2 rounded"
                            >
                                Register
                            </Link>

                        </>
                    )}

                    {token && (
                        <>
                        <Link to='/login'>Logout</Link>
                        </>
                    )}

                </div>

            </nav>
            <Outlet />
        </>
    );
}

export default Navbar;