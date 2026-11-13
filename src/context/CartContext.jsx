import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add food to cart
  const addToCart = (food) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (item) => item._id === food._id
      );

      if (existingItem) {
        return previousCart.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...food,
          quantity: 1,
        },
      ];
    });
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item._id !== id)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Total quantity
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total price
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}