import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function ApplicationSubmitted() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Application Submitted!</h2>
                <p className="text-gray-700 mb-6">
                    Your application has been successfully submitted and is awaiting payment.
                    We will review your details and contact you shortly regarding the next steps.
                </p>
                <Button asChild>
                    <Link to="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    );
}