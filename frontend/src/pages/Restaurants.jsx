import React from 'react'
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Restaurants = () => {

    const [restaurants, setRestaurants] = useState([]);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem('role');

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        image: null
    })

    const [editId, setEditId] = useState(null);

    const getRestaurants = async () => {
        try {
            const response = await fetch("https://restaurant-management-system-nzgm.onrender.com/api/restaurants",
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            setRestaurants(data.restaurants || []);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getRestaurants()
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    }

    const createRestaurant = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();

            form.append('name', formData.name);
            form.append('address', formData.address);
            form.append('phone', formData.phone)

            if (formData.image) {
                form.append('image', formData.image);
            }

            const response = await fetch('https://restaurant-management-system-nzgm.onrender.com/api/restaurants',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: form
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }
            toast.success('Restaurant created succesfully');

            setFormData({
                name: '',
                address: '',
                phone: '',
                image: null
            });
            e.target.reset();
            getRestaurants();

        } catch (err) {
            console.log(err)
        }
    }

    const handleEdit = (restaurant) => {
        setEditId(restaurant._id)

        setFormData({
            name: restaurant.name,
            address: restaurant.address,
            phone: restaurant.phone,
            image: null
        })
    }

    const deleteRestaurant = async (id) => {
        const answer = prompt("Type YES if you want to delete this restaurant");

        if (answer !== "YES") {
            return;
        }

        try {
            const response = await fetch(
                `https://restaurant-management-system-nzgm.onrender.com/api/restaurants/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            toast.success("Restaurant deleted successfully");
            getRestaurants();

        } catch (error) {
            console.log(error);
        }
    };

    const updateRestaurant = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();

            form.append('name', formData.name);
            form.append('address', formData.address);
            form.append('phone', formData.phone)

            if (formData.image) {
                form.append('image', formData.image);
            }

            const response = await fetch(`https://restaurant-management-system-nzgm.onrender.com/api/restaurants/${editId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: form
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            };

            toast.success('Restaurant updated succesfully');

            setFormData({
                name: '',
                address: '',
                phone: '',
                image: null
            })

            setEditId(null);
            e.target.reset();
            getRestaurants();
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <>

            {role === 'restaurant' && (
                <div className="w-full max-w-md mx-auto">

                    <form
                        onSubmit={editId ? updateRestaurant : createRestaurant}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Restaurant name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded"
                            required
                        />

                        <input
                            type="text"
                            name="address"
                            placeholder="Restaurant address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded"
                            required
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded"
                            required
                        />

                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    image: e.target.files[0]
                                });
                            }}
                            className="w-full border border-gray-300 p-3 rounded"
                        />

                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded"
                        >
                            {editId ? 'Update Restaurant' : 'Add Restaurant'}
                        </button>

                    </form>

                </div>
            )}
            <h2>Restaurants List</h2>
            <div className="flex flex-wrap justify-center items-start gap-6 p-4">

                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant._id}
                        className="w-full max-w-xs border rounded-lg p-4"
                    >

                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-40 object-cover rounded"
                        />

                        <h2 className="text-xl font-bold mt-3">
                            {restaurant.name}
                        </h2>

                        <p className="mt-2">
                            {restaurant.address}
                        </p>

                        <p className="mt-1">
                            {restaurant.phone}
                        </p>

                        {role === 'restaurant' && (
                            <div className="flex gap-3 mt-3">

                                <button
                                    onClick={() => handleEdit(restaurant)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteRestaurant(restaurant._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>

                            </div>
                        )}

                    </div>
                ))}

            </div>
        </>
    )
}

export default Restaurants
