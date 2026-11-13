import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Foods from "./pages/Foods";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotificationBell from "./components/NotificationBell";

function Home() {
  return (
    <div className="min-h-screen bg-orange-50">
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            Welcome to FoodieHub 🍔
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-orange-100 max-w-2xl mx-auto">
            Delicious food, easy ordering and fast delivery —
            everything you need in one place.
          </p>

          <Link
            to="/foods"
            className="inline-block mt-8 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-100 transition shadow-lg"
          >
            Order Now 🍕
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
          Why Choose FoodieHub?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">🍔</div>
            <h3 className="text-xl font-bold text-gray-800">
              Delicious Food
            </h3>
            <p className="text-gray-500 mt-3">
              Choose from a variety of tasty and freshly prepared food.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-gray-800">
              Easy Ordering
            </h3>
            <p className="text-gray-500 mt-3">
              Add your favourite food to cart and place your order easily.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-800">
              Fast Service
            </h3>
            <p className="text-gray-500 mt-3">
              Enjoy a simple and fast online food ordering experience.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">
            How FoodieHub Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl">🔐</div>
              <h3 className="font-bold mt-3">Login</h3>
              <p className="text-gray-500 text-sm mt-2">
                Login to your FoodieHub account.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl">🍕</div>
              <h3 className="font-bold mt-3">Choose Food</h3>
              <p className="text-gray-500 text-sm mt-2">
                Select your favourite food items.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl">🛒</div>
              <h3 className="font-bold mt-3">Add to Cart</h3>
              <p className="text-gray-500 text-sm mt-2">
                Review your selected items.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl">🚚</div>
              <h3 className="font-bold mt-3">Get Delivery</h3>
              <p className="text-gray-500 text-sm mt-2">
                Place your order and get it delivered.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Dashboard() {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return (
    <div className="min-h-screen bg-orange-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-4xl font-bold text-orange-600">
            Welcome to your Dashboard 👋
          </h1>

          <p className="mt-4 text-gray-600 text-lg">
            Hello, {user?.name || "User"}!
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <Link
              to="/foods"
              className="bg-orange-100 rounded-xl p-6 hover:bg-orange-200 transition"
            >
              <div className="text-4xl mb-3">🍔</div>
              <h2 className="text-xl font-bold text-gray-800">
                Browse Foods
              </h2>
              <p className="text-gray-600 mt-2">
                Explore delicious food items.
              </p>
            </Link>

            <Link
              to="/cart"
              className="bg-orange-100 rounded-xl p-6 hover:bg-orange-200 transition"
            >
              <div className="text-4xl mb-3">🛒</div>
              <h2 className="text-xl font-bold text-gray-800">
                My Cart
              </h2>
              <p className="text-gray-600 mt-2">
                View your selected food items.
              </p>
            </Link>

            <Link
              to="/orders"
              className="bg-green-100 rounded-xl p-6 hover:bg-green-200 transition"
            >
              <div className="text-4xl mb-3">📦</div>
              <h2 className="text-xl font-bold text-gray-800">
                My Orders
              </h2>
              <p className="text-gray-600 mt-2">
                Track your placed orders.
              </p>
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="bg-purple-100 rounded-xl p-6 hover:bg-purple-200 transition"
              >
                <div className="text-4xl mb-3">👑</div>
                <h2 className="text-xl font-bold text-gray-800">
                  Admin Dashboard
                </h2>
                <p className="text-gray-600 mt-2">
                  Manage FoodieHub food items and orders.
                </p>
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="flex flex-wrap items-center justify-between py-4 gap-4">

          <Link
            to="/"
            className="text-2xl font-bold text-orange-400"
          >
            🍔 FoodieHub
          </Link>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm sm:text-base">

            <Link
              to="/"
              className="hover:text-orange-400 transition"
            >
              Home
            </Link>

            <Link
              to="/foods"
              className="hover:text-orange-400 transition"
            >
              Foods
            </Link>

            <Link
              to="/cart"
              className="relative hover:text-orange-400 transition"
            >
              Cart 🛒

              {cartCount > 0 && (
                <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {!token ? (
              <>
                <Link
                  to="/login"
                  className="hover:text-orange-400 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-orange-400 transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/orders"
                  className="hover:text-orange-400 transition"
                >
                  My Orders 📦
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Admin 👑
                  </Link>
                )}

                <NotificationBell />

                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="min-h-screen">

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/foods"
          element={<Foods />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Routes>

    </div>
  );
}

export default App;