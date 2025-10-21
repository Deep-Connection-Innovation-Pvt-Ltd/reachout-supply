import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormData } from '@/pages/ApplicationForm';

interface PersonalDetailsProps {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
}

export default function PersonalDetails({ data, onDataChange }: PersonalDetailsProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (id: string, value: string) => {
        let error = "";

        switch (id) {
            case "fullName":
                if (!value.trim()) error = "Full Name is required";
                break;
            case "email":
                if (!value.trim()) error = "Email is required";
                else if (!/\S+@\S+\.\S+/.test(value)) error = "Enter a valid email";
                break;
            case "phone":
                if (!value.trim()) error = "Phone number is required";
                else if (!/^\d{10}$/.test(value)) error = "Enter a valid 10-digit phone number";
                break;
            case "graduationCollege":
                if (!value.trim()) error = "Graduation College is required";
                break;
            case "graduationYear":
                if (!value.trim()) error = "Graduation Year is required";
                else if (!/^\d{4}$/.test(value)) error = "Enter a valid year (e.g., 2023)";
                break;
            case "postGraduationCollege":
                if (!value.trim()) error = "Post Graduation College is required";
                break;
            case "postGraduationYear":
                if (!value.trim()) error = "Post Graduation Year is required";
                else if (!/^\d{4}$/.test(value)) error = "Enter a valid year (e.g., 2025)";
                break;
            case "rciLicense":
                if (!value.trim()) error = "Please select an option";
                break;
        }

        setErrors(prev => ({ ...prev, [id]: error }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        onDataChange({ [id]: value } as Partial<FormData>);
        if (errors[id]) {
            validateField(id, value);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        validateField(e.target.id, e.target.value);
    };

    const handleSelectChange = (id: string, value: string) => {
        onDataChange({ [id]: value } as Partial<FormData>);
        validateField(id, value);
    };

    return (
        <Card className="shadow-soft bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Personal Information
                </CardTitle>
                <CardDescription>
                    Tell us about yourself and your academic background
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="fullName"
                                placeholder="Your full name"
                                className={errors.fullName ? "border-red-500" : ""}
                                value={data.fullName}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your.email@domain.com"
                                className={errors.email ? "border-red-500" : ""}
                                value={data.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="9876543210"
                                maxLength={10}
                                className={errors.phone ? "border-red-500" : ""}
                                value={data.phone}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        {/* RCI License */}
                        <div className="space-y-2 w-full">
                            <Label htmlFor="rciLicense">Do you have an RCI License? <span className="text-red-500">*</span></Label>
                            <Select onValueChange={(value) => handleSelectChange("rciLicense", value)} value={data.rciLicense}>
                                <SelectTrigger className={errors.rciLicense ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select Yes or No" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.rciLicense && <p className="text-sm text-red-500">{errors.rciLicense}</p>}
                        </div>

                        {/* Graduation College */}
                        <div className="space-y-2">
                            <Label htmlFor="graduationCollege">Graduation College <span className="text-red-500">*</span></Label>
                            <Input
                                id="graduationCollege"
                                placeholder="e.g., ABC College"
                                className={errors.graduationCollege ? "border-red-500" : ""}
                                value={data.graduationCollege}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.graduationCollege && <p className="text-sm text-red-500">{errors.graduationCollege}</p>}
                        </div>

                        {/* Graduation Year */}
                        <div className="space-y-2">
                            <Label htmlFor="graduationYear">Graduation Year <span className="text-red-500">*</span></Label>
                            <Input
                                id="graduationYear"
                                placeholder="e.g., 2023"
                                className={errors.graduationYear ? "border-red-500" : ""}
                                value={data.graduationYear}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.graduationYear && <p className="text-sm text-red-500">{errors.graduationYear}</p>}
                        </div>

                        {/* Post Graduation College */}
                        <div className="space-y-2">
                            <Label htmlFor="postGraduationCollege">Post Graduation College <span className="text-red-500">*</span></Label>
                            <Input
                                id="postGraduationCollege"
                                placeholder="e.g., XYZ University"
                                className={errors.postGraduationCollege ? "border-red-500" : ""}
                                value={data.postGraduationCollege}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.postGraduationCollege && <p className="text-sm text-red-500">{errors.postGraduationCollege}</p>}
                        </div>

                        {/* Post Graduation Year */}
                        <div className="space-y-2">
                            <Label htmlFor="postGraduationYear">Post Graduation Year <span className="text-red-500">*</span></Label>
                            <Input
                                id="postGraduationYear"
                                placeholder="e.g., 2025"
                                className={errors.postGraduationYear ? "border-red-500" : ""}
                                value={data.postGraduationYear}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.postGraduationYear && <p className="text-sm text-red-500">{errors.postGraduationYear}</p>}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
