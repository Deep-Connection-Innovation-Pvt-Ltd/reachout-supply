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
import { FileText, UploadCloud } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FormData } from '@/pages/ApplicationForm';

interface AcademicDetailsProps {
    data: FormData;
    onDataChange: (data: Partial<FormData>) => void;
}

export default function AcademicDetails({ data, onDataChange }: AcademicDetailsProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (id: string, value: string) => {
        let error = "";

        switch (id) {
            case "masters_program":
                if (!value.trim()) error = "Master's Program is required";
                break;
            case "area_of_expertise":
                if (!value.trim()) error = "Please select an option";
                break;
            case "other_expertise":
                if (data.area_of_expertise === 'Others (please specify)' && !value.trim()) {
                    error = "Please specify your area of expertise";
                }
                break;
            case "resume":
                if (!data.resume) error = "CV/Resume is required";
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
        <>
            <Card className="shadow-soft bg-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" /> Academic Qualifications
                    </CardTitle>
                    <CardDescription>
                        Tell us about your academic background and upload required documents
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Master's Program */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Master's Program <span className="text-red-500">*</span></Label>
                                <Input
                                    id="masters_program"
                                    placeholder="e.g., M.A. Clinical Psychology"
                                    className={errors.masters_program ? "border-red-500" : ""}
                                    value={data.masters_program}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.masters_program && <p className="text-sm text-red-500">{errors.masters_program}</p>}
                            </div>

                            {/* Area of Expertise */}
                            <div className="space-y-2 w-full">
                            <Label htmlFor="area_of_expertise">Area of Expertise <span className="text-red-500">*</span></Label>
                            <Select onValueChange={(value) => handleSelectChange("area_of_expertise", value)} value={data.area_of_expertise}>
                                <SelectTrigger className={errors.area_of_expertise ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Select your area of expertise" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Clinical Psychology">Clinical Psychology</SelectItem>
                                    <SelectItem value="Counselling Psychology">Counselling Psychology</SelectItem>
                                    <SelectItem value="Others (please specify)">Others (please specify)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.area_of_expertise && <p className="text-sm text-red-500">{errors.area_of_expertise}</p>}
                        </div>

                            {/* Other Expertise - Conditional */}
                            {data.area_of_expertise === 'Others (please specify)' && (
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="other_expertise">Please specify your area of expertise <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="other_expertise"
                                        placeholder="e.g., Child Psychology"
                                        className={errors.other_expertise ? "border-red-500" : ""}
                                        value={data.other_expertise}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.other_expertise && <p className="text-sm text-red-500">{errors.other_expertise}</p>}
                                </div>
                            )}

                            {/* CV/Resume Upload */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="resume">Upload CV/Resume <span className="text-red-500">*</span></Label>
                                <div className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 ${errors.resume ? 'border-red-500' : data.resume ? 'border-green-500' : 'border-border'}`}>
                                    <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                        <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-1 text-sm text-muted-foreground">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 5MB)</p>
                                        {data.resumeFileName && <p className="mt-2 text-sm font-medium text-primary">{data.resumeFileName}</p>}
                                    </label>
                                    <Input 
                                        id="resume-upload" 
                                        type="file" 
                                        className="hidden" 
                                        accept=".pdf,.doc,.docx" 
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            onDataChange({ 
                                                resume: file,
                                                resumeFileName: file ? file.name : ''
                                            });
                                            // Clear any existing error when a file is selected
                                            if (file) {
                                                setErrors(prev => ({ ...prev, resume: '' }));
                                            } else {
                                                validateField("resume", "");
                                            }
                                        }} 
                                    />
                                </div>
                                {errors.resume && <p className="text-sm text-red-500">{errors.resume}</p>}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}