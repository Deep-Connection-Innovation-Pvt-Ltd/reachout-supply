import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PaymentSuccess() {
  const [data, setData] = useState<any>(null);
  const [searchParams] = useSearchParams();
  const order_id = searchParams.get("order_id");

  useEffect(() => {
    fetch(`http://localhost/reachoutprof/backend/fetch_payment.php?order_id=${order_id}`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [order_id]);

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading payment details...</p>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Card className="w-full max-w-md shadow-lg border border-slate-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="text-green-500 w-12 h-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful 🎉
          </CardTitle>
          <CardDescription className="text-slate-600 mt-1">
            Thank you for your purchase!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Customer</span>
            <span className="font-medium text-slate-800">{data.customer_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Payment ID</span>
            <Badge variant="secondary">{data.payment_id}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-semibold text-green-600">₹{data.paid_amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Program</span>
            <span className="font-medium">{data.program_type}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Email</span>
            <span>{data.customer_email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Phone</span>
            <span>{data.customer_phone}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button asChild className="gap-2">
            <Link to="/">
              Back to Home <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
