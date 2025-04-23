import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loadStripe } from "@stripe/stripe-js";
const PaymentPage = () => {
  const { bookingId } = useParams();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/get-booking/${bookingId}`
        );
        if (response.ok) {
          const data = await response.json();
          setBookingData(data);
          makePayment(data);
        } else {
          throw new Error("Failed to fetch booking data");
        }
      } catch (error) {
        toast.error("Error fetching booking data");
        console.error(error);
      }
    };

    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId]);

  const makePayment = async (bookingData) => {
    const stripe = await loadStripe(
      "pk_test_51QgLyOIu2AObhV0qp7wYMmwLjVyGOWRrQ7iyUgGkT8fhlOtHnGtzvrQK2g8x8XkHfnRFvEFv8BLlU5odYn1F5eH300HJVXMZIk"
    );

    const body = {
      products: [
        {
          name: `Session with ${bookingData.teacherName}`,
          price: bookingData.price,
          currency: "inr",
          userId: bookingData.userId,
          teacherId: bookingData.teacherId,
          userName: bookingData.userName,
          teacherName: bookingData.teacherName,
          createdAt: bookingData.createdAt,
          status: bookingData.status,
          bookingId: bookingData._id,
        },
      ],
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/create-checkout-session",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        }
      );

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  return <></>;
};

export default PaymentPage;
