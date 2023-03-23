import React, { useContext, useState } from "react";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import Checkout from "./Checkout";

const Cart = (props) => {
  const cartCtx = useContext(CartContext);
  const [isCheckout, setIsCheckout] = useState(false);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );
  const orderButtonHandler = () => {
    setIsCheckout(true);
  };
  const confirmSubmitHandler = async (userData) => {
    setIsSubmitting(true);

    await fetch(
      "https://react-http-9a444-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orders: cartCtx.items,
        }),
      }
    );
    setIsSubmitting(false);
    setIsSubmitted(true);
    cartCtx.clearCart();
  };

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderButtonHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout
          onClose={props.onClose}
          onConfirmOrder={confirmSubmitHandler}
        />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );
  const isSubmittingCart = <p>Sending order ....</p>;
  const didSubmitOrder = (
    <React.Fragment>
      <p>Sucessfully ordered</p>
      <div className={classes.actions}>
        <button type="button" onClick={props.onClose}>
          Close
        </button>
      </div>
    </React.Fragment>
  );
  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !isSubmitted && cartModalContent}
      {isSubmitting && isSubmittingCart}
      {!isSubmitting && isSubmitted && didSubmitOrder}
    </Modal>
  );
};

export default Cart;
