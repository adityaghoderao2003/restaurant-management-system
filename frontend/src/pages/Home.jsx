import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>


            <div className="bg-orange-50 min-h-screen flex flex-col justify-center items-center text-center px-6">

                <h1 className="text-5xl font-bold text-gray-900 mb-5">
                    Welcome to FoodZone
                </h1>

                <p className="text-lg text-gray-600 mb-8">
                    Discover restaurants and order your favourite food.
                </p>

                <Link
                    to="/restaurants"
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg"
                >
                    Explore Restaurants
                </Link>

            </div>

        </div>
    );
}

export default Home;