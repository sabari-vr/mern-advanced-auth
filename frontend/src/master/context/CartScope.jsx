import React, { useContext, createContext, useEffect } from "react";
import { useImmer } from "use-immer";
import { useQuery } from "@tanstack/react-query";
import { getCart, useAppScope } from "..";

const CartContext = createContext();

export const CartScope = (props) => {
  const [CartState, setCartState] = useImmer({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0
  });

  const {
    AppState: { accessToken },
  } = useAppScope();

  const cartListQuery = useQuery({
    queryKey: ["GET_CART"],
    queryFn: getCart,
    enabled: !!accessToken,
  });

  const { data } = !!cartListQuery && cartListQuery

  useEffect(() => {
    if (data) {
      const subtotal = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      let total = subtotal;

      if (CartState.coupon) {
        const discount = subtotal * (coupon.discountPercentage / 100);
        total = subtotal - discount;
      }
      setCartState((draft) => {
        draft.cart = data;
        draft.subtotal = subtotal;
        draft.total = total;
        return draft
      })
    }
  }, [data])

  return (
    <CartContext.Provider
      value={{
        CartState,
        setCartState,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export const useCartScope = () => useContext(CartContext);
