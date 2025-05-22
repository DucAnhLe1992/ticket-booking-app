import { useEffect, useState } from "react";
import StripeCheckoutComponent from "react-stripe-checkout";
import { Router } from "next/router";

import useRequest from "../../hooks/use-request";
let StripeCheckout = StripeCheckoutComponent.default;

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const calcTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    calcTimeLeft();
    const timerId = setInterval(calcTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order expired.</div>;
  }

  return (
    <div>
      <div>Time left to pay: {timeLeft} seconds.</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51QS3u0HrUngRHHMutM5vEMx51cDzbQECF0D3iqA7oQHigWUXksamrpUIWUWgCMqn47Hci0qUiIhLP5Z3WN2mX4xn00WLrGYVqF"
        amount={order.ticket.price * 100}
        currency="eur"
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
