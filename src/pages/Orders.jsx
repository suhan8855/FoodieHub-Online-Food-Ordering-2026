
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to view your orders.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      setOrders(data);
    } catch (error) {
      console.error("Fetch orders error:", error);
      setMessage(
        error.message || "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Preparing":
        return "bg-yellow-100 text-yellow-700";

      case "Out for Delivery":
        return "bg-blue-100 text-blue-700";

      case "Confirmed":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍔</div>
          <p className="text-xl font-semibold text-gray-600">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 sm:px-6 py-10">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="text-center mb-10">

          <h1 className="text-4xl sm:text-5xl font-bold text-orange-600">
            My Orders 📦
          </h1>

          <p className="text-gray-600 mt-3">
            Track all your FoodieHub orders here.
          </p>

        </div>

        {/* Error / Message */}

        {message && (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center mb-6">
            <p className="text-red-500 font-semibold">
              {message}
            </p>

            <Link
              to="/login"
              className="inline-block mt-4 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600"
            >
              Login
            </Link>
          </div>
        )}

        {/* No Orders */}

        {!message && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-7xl mb-5">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-3">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/foods"
              className="inline-block mt-6 bg-orange-500 text-white px-7 py-3 rounded-xl font-semibold hover:bg-orange-600"
            >
              Order Food 🍔
            </Link>

          </div>
        )}

        {/* Orders */}

        <div className="space-y-6">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg p-6"
            >

              {/* Order Header */}

              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-5">

                <div>

                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-bold text-gray-800 break-all">
                    {order._id}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

                <div>

                  <span
                    className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

              </div>

              {/* Items */}

              <div className="mt-5">

                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Ordered Items
                </h3>

                <div className="space-y-3">

                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-orange-50 rounded-xl p-4"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl">
                          🍽️
                        </div>

                        <div>

                          <p className="font-semibold text-gray-800">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>

                        </div>

                      </div>

                      <p className="font-bold text-orange-600">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>
                  ))}

                </div>

              </div>

              {/* Delivery Address */}

              <div className="mt-5 bg-gray-50 rounded-xl p-4">

                <p className="font-semibold text-gray-700">
                  📍 Delivery Address
                </p>

                <p className="text-gray-600 mt-1">
                  {order.deliveryAddress}
                </p>

              </div>

              {/* Total */}

              <div className="border-t mt-5 pt-5 flex justify-between items-center">

                <span className="text-lg font-bold text-gray-800">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-orange-600">
                  ₹{order.totalAmount}
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Orders;
