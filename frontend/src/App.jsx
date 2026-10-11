import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import Food from "./pages/Food";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "restaurants",
                element: <Restaurants />
            },
            {
                path: "foods",
                element: <Food />
            },
            {
                path: "orders",
                element: <Orders />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            }
        ]
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;