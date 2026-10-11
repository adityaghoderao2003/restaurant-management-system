import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "https://restaurant-management-system-nzgm.onrender.com/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            toast.success("Login successful");
            navigate("/");
            window.location.reload();

        } catch (error) {
            console.log(error);
            toast.error("Server error");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">

            <div className="bg-gray p-8 rounded-lg shadow-lg w-full max-w-sm">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Login
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-gray-300 p-3 rounded focus:outline-none focus:border-orange-500"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-gray-300 p-3 rounded focus:outline-none focus:border-orange-500"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded font-semibold"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-5 text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-orange-500 font-semibold hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;