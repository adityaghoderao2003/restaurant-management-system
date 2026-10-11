
import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [foods, setFoods] = useState([]);

    const [formData, setFormData] = useState({
        restaurant: "",
        food: "",
        quantity: 1
    });

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 1. Get all orders
    const getOrders = async () => {
        try {
            const response = await fetch(
                "https://restaurant-management-system-nzgm.onrender.com/api/orders",
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

            setOrders(data.orders || []);
        } catch (error) {
            console.log(error);
        }
    };

    // 2. Get all restaurants
    const getRestaurants = async () => {
        try {
            const response = await fetch(
                "https://restaurant-management-system-nzgm.onrender.com/api/restaurants"
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            setRestaurants(data.restaurants || []);
        } catch (error) {
            console.log(error);
        }
    };

    // 3. Get all foods
    const getFoods = async () => {
        try {
            const response = await fetch(
                "https://restaurant-management-system-nzgm.onrender.com/api/foods"
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            setFoods(data.foods || []);
        } catch (error) {
            console.log(error);
        }
    };

    // 4. Handle form changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 5. Create order
    const createOrder = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "https://restaurant-management-system-nzgm.onrender.com/api/orders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        restaurant: formData.restaurant,
                        food: formData.food,
                        quantity: Number(formData.quantity)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            toast.success("Order created successfully");

            setFormData({
                restaurant: "",
                food: "",
                quantity: 1
            });

            e.target.reset();
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    // 6. Update order status
    const updateOrderStatus = async (id, status) => {
        try {
            const response = await fetch(
                `https://restaurant-management-system-nzgm.onrender.com/api/orders/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: status
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            toast.success("Order status updated successfully");
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    // 7. Delete order
    const deleteOrder = async (id) => {
        const answer = prompt(
            "Type YES if you want to delete this order"
        );

        if (answer !== "YES") {
            return;
        }

        try {
            const response = await fetch(
                `https://restaurant-management-system-nzgm.onrender.com/api/orders/${id}`,
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

            toast.success("Order deleted successfully");
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    // 8. Load data when page opens
    useEffect(() => {
        getOrders();
        getRestaurants();
        getFoods();
    }, []);

    return (
        <div>
            <h1>Orders</h1>

            {/* Create Order Form */}
            <h2>Create Order</h2>
            {role === 'customer' && (
                <form onSubmit={createOrder}>
                    <select
                        name="restaurant"
                        value={formData.restaurant}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Restaurant</option>

                        {restaurants.map((restaurant) => (
                            <option
                                key={restaurant._id}
                                value={restaurant._id}
                            >
                                {restaurant.name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="food"
                        value={formData.food}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Food</option>

                        {foods.map((food) => (
                            <option key={food._id} value={food._id}>
                                {food.name} - ₹{food.price}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Create Order
                    </button>
                </form>
            )}

            {/* Display Orders */}
            <h2>All Orders</h2>

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id}>
                        <h3>Order ID: {order._id}</h3>

                        <p>
                            Customer: {order.customer?.name}
                        </p>

                        <p>
                            Restaurant: {order.restaurant?.name}
                        </p>

                        <p>
                            Food: {order.food?.name}
                        </p>

                        <p>Quantity: {order.quantity}</p>

                        <p>Total Amount: ₹{order.totalAmount}</p>

                        <p>Status: {order.status}</p>

                        {role === 'restaurant' && (
                            <select
                                value={order.status}
                                onChange={(e) =>
                                    updateOrderStatus(
                                        order._id,
                                        e.target.value
                                    )
                                }
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        )}

                        {role === "admin" && (
                            <button
                                type="button"
                                onClick={() => deleteOrder(order._id)}
                            >
                                Delete Order
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
