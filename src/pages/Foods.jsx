
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function Foods() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    fetch("https://foodiehub-online-food-ordering-2026.onrender.com/api/foods")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch foods");
        }

        return response.json();
      })
      .then((data) => {
        setFoods(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching foods:", error);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...new Set(foods.map((food) => food.category)),
  ];

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || food.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (food) => {
    addToCart(food);
    alert(`${food.name} added to cart! 🛒`);
  };

  return (
    <div className="min-h-screen bg-orange-50 px-4 sm:px-6 py-8 sm:py-10">

      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600">
            Our Delicious Foods 🍔
          </h1>

          <p className="mt-3 text-gray-600 text-base sm:text-lg">
            Order your favourite food from FoodieHub!
          </p>

        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-6">

          <input
            type="text"
            placeholder="🔍 Search your favourite food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 sm:py-4 bg-white border border-orange-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">

          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-4 sm:px-5 py-2 rounded-full font-medium transition ${
                category === item
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-orange-600 border border-orange-300 hover:bg-orange-100"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              Loading delicious foods... 🍔
            </p>
          </div>
        )}

        {/* No foods */}
        {!loading && filteredFoods.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">

            <div className="text-6xl mb-4">
              😔
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              No food items found
            </h2>

            <p className="text-gray-500 mt-2">
              Try another food name or category.
            </p>

          </div>
        )}

        {/* Food Cards */}
        {!loading && filteredFoods.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredFoods.map((food) => (
              <div
                key={food._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >

                <div className="h-44 bg-orange-100 flex items-center justify-center">
                  <span className="text-7xl">
                    🍽️
                  </span>
                </div>

                <div className="p-5">

                  <h2 className="text-xl font-bold text-gray-800">
                    {food.name}
                  </h2>

                  <div className="flex justify-between items-center mt-3">

                    <span className="text-2xl font-bold text-orange-600">
                      ₹{food.price}
                    </span>

                    <span className="bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full">
                      {food.category}
                    </span>

                  </div>

                  <p className="text-gray-500 text-sm mt-3">
                    Fresh and delicious food prepared specially for you.
                  </p>

                  <button
                    onClick={() => handleAddToCart(food)}
                    className="w-full mt-5 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 active:scale-95 transition duration-200"
                  >
                    Add to Cart 🛒
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Foods;
