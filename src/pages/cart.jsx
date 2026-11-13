
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [message, setMessage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const deliveryFee = 40;
  const totalAmount = cartTotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login before placing your order.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return;
    }

    if (!deliveryAddress.trim()) {
      setMessage("Please enter your delivery address.");
      return;
    }

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);

    try {
      const orderItems = cart.map((item) => ({
        food: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: orderItems,
            totalAmount: totalAmount,
            deliveryAddress: deliveryAddress.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      setOrderId(data.order?._id || "");
      setOrderSuccess(true);

      clearCart();
      setDeliveryAddress("");
    } catch (error) {
      console.error("Place order error:", error);

      setMessage(
        error.message || "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  /* =========================
     ORDER SUCCESS
  ========================== */

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-orange-50 px-4 py-16">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">

          <div className="text-7xl mb-5">
            🎉
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-green-600">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mt-4">
            Thank you for ordering from FoodieHub.
          </p>

          {orderId && (
            <div className="mt-6 bg-orange-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Order ID
              </p>

              <p className="font-bold text-gray-800 break-all mt-1">
                {orderId}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">

            <Link
              to="/foods"
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600"
            >
              Order More 🍔
            </Link>

            <Link
              to="/dashboard"
              className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900"
            >
              Dashboard
            </Link>

          </div>
        </div>
      </div>
    );
  }

  /* =========================
     EMPTY CART
  ========================== */

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50 px-6 py-16">

        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-10 text-center">

          <div className="text-7xl mb-5">
            🛒
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-3">
            Add some delicious food to your cart!
          </p>

          <Link
            to="/foods"
            className="inline-block mt-6 bg-orange-500 text-white px-7 py-3 rounded-xl font-semibold hover:bg-orange-600"
          >
            Browse Foods 🍔
          </Link>

        </div>
      </div>
    );
  }

  /* =========================
     MAIN CART
  ========================== */

  return (
    <div className="min-h-screen bg-orange-50 px-4 sm:px-6 py-10">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-orange-600">
              Your Cart 🛒
            </h1>

            <p className="text-gray-600 mt-2">
              Review your order before checkout.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-red-500 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50"
          >
            Clear Cart
          </button>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mb-6 bg-white border border-orange-300 rounded-xl p-4 text-center font-semibold text-orange-600">
            {message}
          </div>
        )}

        {/* CART ITEMS */}

        <div className="space-y-4">

          {cart.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >

              {/* FOOD INFO */}

              <div className="flex items-center gap-4">

                <div className="w-20 h-20 bg-orange-100 rounded-xl flex items-center justify-center text-4xl">
                  🍽️
                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    {item.name}
                  </h2>

                  <p className="text-orange-600 font-semibold">
                    ₹{item.price}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.category}
                  </p>

                </div>

              </div>

              {/* QUANTITY */}

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    decreaseQuantity(item._id)
                  }
                  className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 font-bold hover:bg-orange-200"
                >
                  −
                </button>

                <span className="font-bold text-lg w-8 text-center">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQuantity(item._id)
                  }
                  className="w-9 h-9 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600"
                >
                  +
                </button>

              </div>

              {/* PRICE */}

              <div className="text-right">

                <p className="text-xl font-bold text-gray-800">
                  ₹{item.price * item.quantity}
                </p>

                <button
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                  className="text-red-500 text-sm mt-2 hover:underline"
                >
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* =========================
            DELIVERY DETAILS
        ========================== */}

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8">

          <h2 className="text-2xl font-bold text-gray-800">
            Delivery Details 📍
          </h2>

          <p className="text-gray-500 mt-2">
            Enter the address where you want your food delivered.
          </p>

          <div className="mt-5">

            <label className="block text-gray-700 font-semibold mb-2">
              Delivery Address
            </label>

            <textarea
              value={deliveryAddress}
              onChange={(e) =>
                setDeliveryAddress(e.target.value)
              }
              placeholder="Enter your complete delivery address..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />

          </div>

          {/* =========================
              ORDER SUMMARY
          ========================== */}

          <div className="mt-8">

            <h2 className="text-2xl font-bold text-gray-800">
              Order Summary
            </h2>

            <div className="flex justify-between mt-5 text-lg">
              <span>
                Subtotal
              </span>

              <span className="font-semibold">
                ₹{cartTotal}
              </span>
            </div>

            <div className="flex justify-between mt-3 text-gray-600">
              <span>
                Delivery Fee
              </span>

              <span>
                ₹{deliveryFee}
              </span>
            </div>

            <div className="border-t mt-5 pt-5 flex justify-between text-2xl font-bold">

              <span>
                Total
              </span>

              <span className="text-orange-600">
                ₹{totalAmount}
              </span>

            </div>

          </div>

          {/* =========================
              PLACE ORDER BUTTON
          ========================== */}

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg text-white transition ${
              placingOrder
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order 🎉"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default Cart;
