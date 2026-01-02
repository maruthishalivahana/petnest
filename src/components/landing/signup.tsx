"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PawPrint, Mail, Lock, User, UserCircle, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { formSchema } from "@/Validations/auth.validations"
import { CheckItem } from '../../helpers/checkitem'
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"


const SetEmail = (email: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem("email", email);
    }
}

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "buyer" as const,
            isVerified: false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true)
            SetEmail(values.email);

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"
            const apiUrl = `${baseUrl}/v1/api/auth/signup`;

            console.log("Signup Request Details:", {
                url: apiUrl,
                baseUrl,
                values: {
                    name: values.name,
                    email: values.email,
                    role: values.role,
                    isVerified: values.isVerified,
                    passwordLength: values.password.length
                }
            });

            const res = await axios.post(
                apiUrl,
                values,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )

            const data = await res.data;
            console.log("Signup successful:", data);
            toast.success("Signup successful! Please verify your email OTP.")
            router.push('/verify-otp')

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Signup failed - Axios Error:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message,
                    url: error.config?.url,
                    method: error.config?.method,
                    requestData: error.config?.data,
                });

                const errorMessage = error.response?.data?.message
                    || error.response?.data?.error
                    || `Signup failed: ${error.response?.statusText || error.message}`;

                toast.error(errorMessage);
            } else {
                console.error("Signup failed - Unknown Error:", error);
                toast.error("An unexpected error occurred. Please check your connection and try again.");
            }
            setIsLoading(false);
        }
    }
    const handleLoginLink = () => {
        if (typeof window !== 'undefined') {
            router.push('/login')
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">

            <Card className="w-full max-w-md relative z-10 shadow-2xl border-border/50 bg-card/95 backdrop-blur-md">

                {/* Compact Header */}
                <CardHeader className="text-center pb-2 pt-6 px-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-primary/10 p-2.5 rounded-xl ring-1 ring-primary/20">
                            <PawPrint className="h-6 w-6 text-primary" strokeWidth={2.5} />
                        </div>
                        <div>
                            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                                Join PetNest
                            </CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Create your account to get started
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-6 pb-6 pt-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" suppressHydrationWarning>

                            {/* Grid Wrapper for Compact Layout on larger screens */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">

                                {/* Name Field */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-semibold uppercase text-accent tracking-wide">
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative group">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                    <Input
                                                        placeholder="John Doe"
                                                        {...field}
                                                        className="pl-9 h-10 bg-background/50 focus:bg-background transition-all"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] mt-0.5" />
                                        </FormItem>
                                    )}
                                />

                                {/* Role Dropdown */}
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-semibold uppercase text-accent tracking-wide">
                                                I am a...
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <div className="relative group">
                                                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary z-10 pointer-events-none transition-colors" />
                                                        <SelectTrigger className="pl-9 h-10 w-full bg-background/50 focus:bg-background transition-all">
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                    </div>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="buyer">Buyer</SelectItem>
                                                    <SelectItem value="seller">Seller</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[10px] mt-0.5" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-xs font-semibold uppercase text-accent tracking-wide">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    {...field}
                                                    className="pl-9 h-10 bg-background/50 focus:bg-background transition-all"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] mt-0.5" />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => {
                                    const password = field.value || "";

                                    const hasUpper = /[A-Z]/.test(password);
                                    const hasLower = /[a-z]/.test(password);
                                    const hasNumber = /[0-9]/.test(password);
                                    const hasSymbol = /[^A-Za-z0-9]/.test(password);
                                    const isLong = password.length >= 6;

                                    const strengthScore = [hasUpper, hasLower, hasNumber, hasSymbol, isLong].filter(Boolean).length;

                                    let strength: "Weak" | "Medium" | "Strong" = "Weak";
                                    if (strengthScore >= 4) strength = "Strong";
                                    else if (strengthScore === 3) strength = "Medium";

                                    return (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-xs font-semibold uppercase text-accent tracking-wide">
                                                Password
                                            </FormLabel>

                                            <FormControl>
                                                <div className="relative group">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Aa1@example"
                                                        {...field}
                                                        className="pl-9 h-10 bg-background/50 focus:bg-background transition-all"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 
               text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>

                                            {/* Password Strength */}
                                            {password.length > 0 && (
                                                <p
                                                    className={`text-xs font-semibold ${strength === "Weak"
                                                        ? "text-red-500"
                                                        : strength === "Medium"
                                                            ? "text-muted-foreground"
                                                            : "text-primary"
                                                        }`}
                                                >
                                                    {strength}
                                                </p>
                                            )}

                                            {/* Validation Checklist */}
                                            {password.length > 0 && (
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1">
                                                    <CheckItem label="At least 1 uppercase (A-Z)" valid={hasUpper} />
                                                    <CheckItem label="At least 1 lowercase (a-z)" valid={hasLower} />
                                                    <CheckItem label="At least 1 number (0-9)" valid={hasNumber} />
                                                    <CheckItem label="At least 1 symbol (!@#$%)" valid={hasSymbol} />
                                                    <CheckItem label="Minimum 6 characters" valid={isLong} />
                                                </ul>
                                            )
                                            }

                                            <FormMessage className="text-[10px] mt-0.5" />
                                        </FormItem>
                                    );
                                }}
                            />


                            {/* Submit Button */}
                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full cursor-pointer h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                    suppressHydrationWarning
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Sending OTP...

                                        </>
                                    ) : (
                                        <>
                                            Verify Account
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Login Link */}
                            <div className="text-center text-xs text-muted-foreground pt-1">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={handleLoginLink}
                                    className="text-primary font-semibold hover:underline transition-colors cursor-pointer bg-transparent border-none"
                                    suppressHydrationWarning
                                >
                                    Log in
                                </button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div >
    );
}



