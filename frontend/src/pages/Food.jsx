import React from 'react'
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Food = () => {
    const [formdata, setFormdata] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        restaurant: "",
        image: null
    });

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const [restaurants, setRestaurants] = useState([]);
    const [editId, setEditId] = useState(null);

    const [foods, setFoods] = useState([]);

    const getFoods = async () => {
        try {
            const response = await fetch("https://restaurant-management-system-nzgm.onrender.com/api/foods");

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            setFoods(data.foods)

        } catch (err) {
            console.log(err);
        }
    }

    const handleChange = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value
        });
    };



    const getRestaurants = async () => {
        try {
            const response = await fetch(
                "https://restaurant-management-system-nzgm.onrender.com/api/restaurants",
                {
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

            setRestaurants(data.restaurants || []);

        } catch (err) {
            console.log(err);
        }
    };

    const createFood = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();

            form.append('name', formdata.name);
            form.append('description', formdata.description);
            form.append('price', formdata.price);
            form.append("category", formdata.category);
            form.append("restaurant", formdata.restaurant);

            if (formdata.image) {
                form.append('image', formdata.image);
            }

            const response = await fetch(
                "https://restaurant-management-system-nzgm.onrender.com/api/foods",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: form
                }
            );

            const data = await response.json();

            if (!response.ok) {
               toast.error(data.message);
                return;
            }

            toast.success("Food created successfully");

            setFormdata({
                name: "",
                description: "",
                price: "",
                category: "",
                restaurant: "",
                image: null
            });

            e.target.reset();
            getFoods();

        } catch (err) {
            console.log(err)
        }
    }

    const updateFood = async (e) => {
        e.preventDefault();

        try {
            const form = new FormData();

            form.append("name", formdata.name);
            form.append("description", formdata.description);
            form.append("price", formdata.price);
            form.append("category", formdata.category);
            form.append("restaurant", formdata.restaurant);

            if (formdata.image) {
                form.append("image", formdata.image);
            }

            const response = await fetch(
                `https://restaurant-management-system-nzgm.onrender.com/api/foods/${editId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: form
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            toast.success("Food updated successfully");

            setFormdata({
                name: "",
                description: "",
                price: "",
                category: "",
                restaurant: "",
                image: null
            });

            setEditId(null);
            e.target.reset();
            getFoods();

        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (food) => {
        setEditId(food._id);

        setFormdata({
            name: food.name,
            description: food.description,
            price: food.price,
            category: food.category,
            restaurant: food.restaurant._id,
            image: null
        });
    };

    useEffect(() => {
        getRestaurants();
        getFoods();
    }, []);
    return (
        <>
            {role === 'restaurant' && (
                <form onSubmit={editId ? updateFood : createFood}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Food name"
                        value={formdata.name}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Food description"
                        value={formdata.description}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formdata.price}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formdata.category}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="restaurant"
                        value={formdata.restaurant}
                        onChange={handleChange}
                    >
                        <option value="">Select Restaurant</option>

                        {restaurants.map((restaurant) => (
                            <option key={restaurant._id} value={restaurant._id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>


                    <input type='file' name='image' accept='image/' onChange={(e) => {
                        setFormdata({
                            ...formdata,
                            image: e.target.files[0]
                        })
                    }}
                        required />

                    <button type="submit">
                        {editId ? "Update Food" : "Add Food"}
                    </button>
                </form>
            )}
            {foods.map((food) => (
                <div key={food._id}>
                    <h3>{food.name}</h3>
                    <p>{food.description}</p>
                    <p>Price : {food.price}</p>
                    <p>Category : {food.category}</p>

                    <img src={food.image} alt={food.name} width='150' />

                    {
                        role === 'restaurant' && (
                            <button onClick={() => handleEdit(food)}>
                                Edit
                            </button>
                        )
                    }
                </div>
            ))}
        </>
    )
}

export default Food
