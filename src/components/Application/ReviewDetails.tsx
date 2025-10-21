import type { FormData } from "@/pages/ApplicationForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText, User, CreditCard } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Link } from "react-router-dom";

interface ReviewDetailsProps {
    data: FormData;
    planDetails: {
        title: string;
        price: string;
    };
    onTermsChange: (checked: boolean) => void;
}

const DetailItem = ({ label, value }: { label: string; value: string | undefined | null }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || 'N/A'}</p>
    </div>
);

export default function ReviewDetails({ data, planDetails, onTermsChange }: ReviewDetailsProps) {
    const basePrice = parseInt(planDetails.price.replace(/,/g, ''), 10);
    const discountAmount = basePrice * 0.30;
    const total = basePrice - discountAmount;

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

    return(
        <>
            {/* Personal Information Review */}
            <Card className="shadow-soft bg-card mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" /> Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="Full Name" value={data.fullName} />
                        <DetailItem label="Email Address" value={data.email} />
                        <DetailItem label="Phone Number" value={data.phone} />
                        <DetailItem label="RCI License" value={data.rciLicense} />
                        <DetailItem label="Graduation College" value={data.graduationCollege} />
                        <DetailItem label="Graduation Year" value={data.graduationYear} />
                        <DetailItem label="Post Graduation College" value={data.postGraduationCollege} />
                        <DetailItem label="Post Graduation Year" value={data.postGraduationYear} />
                    </div>
                </CardContent>
            </Card>

            {/* Academic Qualifications Review */}
            <Card className="shadow-soft bg-card mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" /> Academic Qualifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="Master's Program" value={data.masters_program} />
                        <DetailItem label="Area of Expertise" value={data.area_of_expertise} />
                        {data.area_of_expertise === 'Others (please specify)' && (
                            <DetailItem label="Specified Expertise" value={data.other_expertise} />
                        )}
                        <DetailItem label="CV/Resume" value={data.resumeFileName} />
                    </div>
                </CardContent>
            </Card>

            {/* Payment Details Review */}
            <Card className="shadow-soft bg-card mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" /> Payment Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Program Selected:</p>
                            <p className="font-medium">{planDetails.title}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Base Price:</p>
                            <p className="font-medium">{formatCurrency(basePrice)}</p>
                        </div>
                        <div className="flex justify-between items-center text-green-600">
                            <p>Early Bird Special (30% off):</p>
                            <p className="font-medium">-{formatCurrency(discountAmount)}</p>
                        </div>
                        <div className="border-t border-border my-2"></div>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <p>Total:</p>
                            <p>{formatCurrency(total)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2 mt-4">
                <Checkbox id="terms" onCheckedChange={(checked) => onTermsChange(checked as boolean)} />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the ReachOut <Link to="https://www.deepconnection.life/T&C" target="_blank" className="underline text-primary hover:text-primary/80">Terms & Conditions</Link> and <Link to="https://www.deepconnection.life/privacy-policy" target="_blank" className="underline text-primary hover:text-primary/80">Privacy Policy</Link>
                </Label>
            </div>
        </>
    )
}