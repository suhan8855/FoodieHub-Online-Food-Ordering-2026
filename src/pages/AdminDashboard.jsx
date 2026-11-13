import { useEffect, useState } from "react";

function AdminDashboard() {
  const [foods, setFoods] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const statuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  /* =========================
     FETCH FOODS
  ========================== */

  const fetchFoods = async () => {
    try {
      const response = await fetch(
        "https://foodiehub-online-food-ordering-2026.onrender.com/api/foods"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch foods");
      }

      const data = await response.json();

      setFoods(data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to load foods ❌"
      );
    }
  };

  /* =========================
     FETCH ALL ORDERS
  ========================== */

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setOrdersLoading(false);
      return;
    }

    try {
      /*
        Admin order list is fetched using
        individual order IDs if needed.

        For now this request tries the
        admin orders endpoint.
      */

      const response = await fetch(
        "https://foodiehub-online-food-ordering-2026.onrender.com/api/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        setOrders(
          Array.isArray(data)
            ? data
            : data.orders || []
        );
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      );

      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================== */

  useEffect(() => {
    fetchFoods();
    fetchOrders();
  }, []);

  /* =========================
     FORM CHANGE
  ========================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     VALIDATION
  ========================== */

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage(
        "Food name is required ❌"
      );

      return false;
    }

    if (
      !formData.price ||
      Number(formData.price) <= 0
    ) {
      setMessage(
        "Price must be greater than 0 ❌"
      );

      return false;
    }

    if (!formData.category.trim()) {
      setMessage(
        "Category is required ❌"
      );

      return false;
    }

    return true;
  };

  /* =========================
     ADD / UPDATE FOOD
  ========================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      const url = editingId
        ? `https://foodiehub-online-food-ordering-2026.onrender.com/api/foods/${editingId}`
        : "https://foodiehub-online-food-ordering-2026.onrender.com/api/foods";

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            price: Number(formData.price),
            category:
              formData.category.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Operation failed"
        );
      }

      setMessage(
        editingId
          ? "Food updated successfully! ✅"
          : "Food added successfully! ✅"
      );

      setFormData({
        name: "",
        price: "",
        category: "",
      });

      setEditingId(null);

      fetchFoods();

    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Something went wrong ❌"
      );
    }
  };

  /* =========================
     EDIT FOOD
  ========================== */

  const handleEdit = (food) => {
    setEditingId(food._id);

    setFormData({
      name: food.name,
      price: food.price,
      category: food.category,
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     DELETE FOOD
  ========================== */

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this food item?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://foodiehub-online-food-ordering-2026.onrender.com/api/foods/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete food"
        );
      }

      setMessage(
        "Food deleted successfully! 🗑️"
      );

      fetchFoods();

    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Delete failed ❌"
      );
    }
  };

  /* =========================
     CANCEL EDIT
  ========================== */

  const cancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: "",
      price: "",
      category: "",
    });

    setMessage("");
  };

  /* =========================
     UPDATE ORDER STATUS
  ========================== */

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    const token =
      localStorage.getItem(
        "token"
      );

    try {
      const response =
        await fetch(
          `https://foodiehub-online-food-ordering-2026.onrender.com/api/orders/${orderId}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order"
        );
      }

      setMessage(
        "Order status updated successfully! ✅"
      );

      fetchOrders();

    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Failed to update order ❌"
      );
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 px-4 sm:px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* =========================
            HEADER
        ========================== */}

        <div className="text-center mb-10">

          <h1 className="text-4xl sm:text-5xl font-bold text-orange-600">
            Admin Dashboard 👑
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Manage FoodieHub food items and orders
          </p>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mb-6 bg-white border border-orange-200 rounded-xl shadow-sm p-4 text-center font-semibold text-orange-600">
            {message}
          </div>
        )}

        {/* =========================
            FOOD FORM
        ========================== */}

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-10">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">

            {editingId
              ? "Edit Food Item ✏️"
              : "Add New Food Item ➕"}

          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >

            {/* FOOD NAME */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Food Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter food name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

            </div>

            {/* PRICE */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Pizza / Burger / Drinks"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

            </div>

            {/* BUTTONS */}

            <div className="md:col-span-3 flex flex-col sm:flex-row gap-3">

              <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition"
              >

                {editingId
                  ? "Update Food ✏️"
                  : "Add Food ➕"}

              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* =========================
            FOOD TABLE
        ========================== */}

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-10">

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">

            <h2 className="text-2xl font-bold text-gray-800">
              Food Items 🍔
            </h2>

            <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
              Total: {foods.length}
            </span>

          </div>

          {foods.length === 0 ? (
            <div className="text-center py-10">

              <div className="text-6xl mb-4">
                🍽️
              </div>

              <p className="text-gray-500">
                No food items available.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-orange-50">

                    <th className="text-left p-4 border-b">
                      Food
                    </th>

                    <th className="text-left p-4 border-b">
                      Category
                    </th>

                    <th className="text-left p-4 border-b">
                      Price
                    </th>

                    <th className="text-center p-4 border-b">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {foods.map((food) => (
                    <tr
                      key={food._id}
                      className="hover:bg-orange-50 transition"
                    >

                      <td className="p-4 border-b font-semibold text-gray-800">
                        🍽️ {food.name}
                      </td>

                      <td className="p-4 border-b">

                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                          {food.category}
                        </span>

                      </td>

                      <td className="p-4 border-b font-bold text-orange-600">
                        ₹{food.price}
                      </td>

                      <td className="p-4 border-b">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              handleEdit(food)
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                food._id
                              )
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* =========================
            ORDERS MANAGEMENT
        ========================== */}

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                Customer Orders 📦
              </h2>

              <p className="text-gray-500 mt-1">
                Manage customer order status.
              </p>

            </div>

            <button
              onClick={fetchOrders}
              className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600"
            >
              Refresh Orders 🔄
            </button>

          </div>

          {ordersLoading ? (
            <div className="text-center py-10">

              <div className="text-5xl mb-4">
                📦
              </div>

              <p className="text-gray-500">
                Loading orders...
              </p>

            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10">

              <div className="text-6xl mb-4">
                📦
              </div>

              <h3 className="text-xl font-bold text-gray-700">
                No orders found
              </h3>

              <p className="text-gray-500 mt-2">
                Customer orders will appear here.
              </p>

            </div>
          ) : (
            <div className="space-y-5">

              {orders.map((order) => (

                <div
                  key={order._id}
                  className="border border-gray-200 rounded-2xl p-5"
                >

                  {/* ORDER HEADER */}

                  <div className="flex flex-col lg:flex-row justify-between gap-4">

                    <div>

                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="font-bold text-gray-800 break-all">
                        {order._id}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString()
                          : ""}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div className="flex items-center gap-3">

                      <label className="font-semibold text-gray-700">
                        Status:
                      </label>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >

                        {statuses.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                  </div>

                  {/* ORDER ITEMS */}

                  <div className="mt-5">

                    <h3 className="font-bold text-gray-800 mb-3">
                      Items
                    </h3>

                    <div className="space-y-2">

                      {order.items?.map(
                        (item, index) => (

                          <div
                            key={index}
                            className="flex justify-between bg-orange-50 rounded-lg p-3"
                          >

                            <span className="font-medium">
                              {item.name} ×{" "}
                              {item.quantity}
                            </span>

                            <span className="font-bold text-orange-600">
                              ₹
                              {item.price *
                                item.quantity}
                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                  {/* ADDRESS */}

                  <div className="mt-4 bg-gray-50 rounded-xl p-4">

                    <p className="font-semibold text-gray-700">
                      📍 Delivery Address
                    </p>

                    <p className="text-gray-600 mt-1">
                      {order.deliveryAddress}
                    </p>

                  </div>

                  {/* TOTAL */}

                  <div className="border-t mt-4 pt-4 flex justify-between">

                    <span className="font-bold text-gray-800">
                      Total Amount
                    </span>

                    <span className="text-xl font-bold text-orange-600">
                      ₹{order.totalAmount}
                    </span>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
