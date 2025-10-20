import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";


export default function PaymentSuccess() {
  const [data, setData] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const order_id = searchParams.get("order_id");

  useEffect(() => {
    fetch(`http://localhost/reachoutprof/backend/db_sqls/fetch_payment.php?order_id=${order_id}`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [order_id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p className="mt-4">Thank you, {data.customer_name}!</p>
      <p>Payment ID: {data.payment_id}</p>
      <p>Amount Paid: ₹{data.paid_amount}</p>
      <p>Program: {data.program_type}</p>
      <p>Email: {data.customer_email}</p>
      <p>Phone: {data.customer_phone}</p>
      <Link to="/" className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded">
        Back to Home
      </Link>
    </div>
  );
}