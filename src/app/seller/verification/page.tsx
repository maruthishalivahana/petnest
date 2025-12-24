'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ShieldCheck,
    CheckCircle2,
    Clock,
    FileText,
    AlertCircle
} from 'lucide-react';

const verificationSteps = [
    {
        id: 1,
        title: 'Business Registration',
        description: 'Upload your business license or registration certificate',
        status: 'completed',
        document: 'business_license.pdf'
    },
    {
        id: 2,
        title: 'Identity Verification',
        description: 'Upload government-issued ID (Aadhar, Passport, etc.)',
        status: 'completed',
        document: 'aadhar_card.pdf'
    },
    {
        id: 3,
        title: 'Address Proof',
        description: 'Utility bill or rental agreement (less than 3 months old)',
        status: 'completed',
        document: 'address_proof.pdf'
    },
    {
        id: 4,
        title: 'Phone Verification',
        description: 'Verify your phone number via OTP',
        status: 'completed'
    },
];

const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Verified' },
    pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Pending Review' },
    rejected: { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Rejected' },
    notStarted: { icon: FileText, color: 'text-slate-400', bgColor: 'bg-slate-100', label: 'Not Started' },
};

export default function VerificationPage() {
    const allCompleted = verificationSteps.every(step => step.status === 'completed');

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Verification Status</h2>
                <p className="text-slate-500 mt-1">Complete verification to unlock all seller features</p>
            </div>

            {/* Overall Status */}
            <Card className={`p-6 ${allCompleted ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-lg ${allCompleted ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center shrink-0`}>
                        <ShieldCheck className={`h-6 w-6 ${allCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">
                                {allCompleted ? 'Verification Complete' : 'Verification In Progress'}
                            </h3>
                            <Badge className={allCompleted ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-blue-100 text-blue-800 hover:bg-blue-100'}>
                                {allCompleted ? 'Verified' : '4/4 Complete'}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                            {allCompleted
                                ? 'Your seller account is fully verified. You can now list pets and receive inquiries.'
                                : 'Complete all steps to get verified and start selling on PetNest.'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Verification Steps */}
            <Card>
                <div className="p-6 border-b border-slate-200">
                    <h3 className="font-semibold text-slate-900">Verification Steps</h3>
                </div>
                <div className="divide-y divide-slate-200">
                    {verificationSteps.map((step, index) => {
                        const config = statusConfig[step.status as keyof typeof statusConfig];
                        const StatusIcon = config.icon;

                        return (
                            <div key={step.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <span className="text-sm font-semibold text-slate-600">{index + 1}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-medium text-slate-900">{step.title}</h4>
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor} shrink-0`}>
                                                <StatusIcon className={`h-3.5 w-3.5 ${config.color}`} />
                                                <span className={`text-xs font-medium ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3">{step.description}</p>
                                        {step.document && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <FileText className="h-3.5 w-3.5" />
                                                {step.document}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Benefits */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <h3 className="font-semibold text-slate-900 mb-3">Benefits of Verification</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>Get a verified badge on your profile and listings</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>Increase trust and get 3x more inquiries</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>Higher ranking in search results</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>Access to premium seller features</span>
                    </li>
                </ul>
            </Card>
        </div>

    );
}
