import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalButton = (amount, onSuccess, onError) => {
  return (
    <PayPalScriptProvider
      options={{ "client-id": "" }}  // client id missing, import.meta.env.VITE_PAYMENT_CLIENT_ID
     
      createOrder={(data, action) => {
        return action.order.create({
          purchase_unit: [{ amount: { value: amount } }],
        });
      }}
      onApprove={(data, action) => {
        return action.order.capture().then(onSuccess);
      }}
      onError={onError}
    >
      <paypalButton style={{ layput: "vertical" }} />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
