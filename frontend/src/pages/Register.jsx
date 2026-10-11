import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer"
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
                "http://localhost:5000/api/auth/register",
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
                alert(data.message);
                return;
            }

            alert("Registration successful");
            navigate("/login");

        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center ">

            <div className="bg-gray p-8 rounded-lg shadow-lg w-full max-w-sm">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Register
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 p-3 rounded focus:outline-none focus:border-orange-500"
                        required
                    />

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

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border border-gray-300 p-3 rounded focus:outline-none focus:border-orange-500"
                    >
                        <option value="customer">Customer</option>
                        <option value="restaurant">Restaurant</option>
                    </select>

                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded font-semibold"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-5 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-orange-500 font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;