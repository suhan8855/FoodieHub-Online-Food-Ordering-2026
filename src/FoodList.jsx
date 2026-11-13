import { useEffect, useState } from "react";

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/foods")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch food items");
        }

        return response.json();
      })
      .then((data) => {
        setFoods(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load food items");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <p className="py-6 text-center text-lg font-semibold">
        Loading food items...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-6 text-center font-semibold text-red-500">
        {error}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-6 text-center text-3xl font-bold">
        Food Items from MongoDB
      </h2>

      {foods.length === 0 ? (
        <p className="text-center text-gray-500">
          No food items available.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <div
              key={food._id}
              className="rounded-xl border bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800">
                {food.name}
              </h3>

              <p className="mt-2 text-2xl font-bold text-orange-600">
                ₹{food.price}
              </p>

              <p className="mt-2 rounded-md bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                {food.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FoodList;