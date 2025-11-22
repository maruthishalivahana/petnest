"use client"

import React, { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PawPrint, Mail, CheckCircle2, ArrowRight, RefreshCcw, Timer } from "lucide-react"
const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export function EmailVerify() {
    const [mounted, setMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const countdownInitial = 10 * 60; // 10 minutes in seconds
    const [countdown, setCountdown] = useState(countdownInitial)
    const [canResend, setCanResend] = useState(false)
    const [email, setEmail] = useState<string | null>(null)
    const router = useRouter()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    useEffect(() => {
        setMounted(true)
        // Get email from localStorage on client side
        const storedEmail = localStorage.getItem("email")
        if (!storedEmail) {
            toast.error("No email found. Please sign up first.")
            router.push('/signup')
            return
        }
        setEmail(storedEmail)
        console.log("Email from localStorage:", storedEmail)
    }, [])

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (!email) {
            toast.error("Email not found. Please sign up again.")
            router.push('/signup')
            return
        }

        try {
            setIsLoading(true)
            console.log("OTP being sent:", data.pin, "for email:", email);

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"
            const res = await axios.post(
                `${baseUrl}/v1/api/auth/verify-otp`,
                {
                    otp: data.pin,
                    email: email
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )

            const responseData = await res.data;
            console.log("Verification successful:", responseData);
            toast.success("Email verified successfully! ")

            // Clear email from localStorage after successful verification
            localStorage.removeItem("email")

            // Redirect to dashboard or login
            setTimeout(() => {
                router.push('/login')
            }, 1500)

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Verification failed:", {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                });
                toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
            } else {
                console.error("Verification failed:", error);
                toast.error("An unexpected error occurred.");
            }
            setIsLoading(false);
        }
    }

    async function handleResendOTP() {
        if (!email) {
            toast.error("Email not found. Please sign up again.")
            router.push('/signup')
            return
        }

        try {
            setIsResending(true)

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"
            const res = await axios.post(
                `${baseUrl}/v1/api/auth/resend-otp`,
                { email: email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )

            toast.success("OTP resent successfully!")
            setCountdown(countdownInitial)
            setCanResend(false)
            form.reset()

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Failed to resend OTP.");
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setIsResending(false)
        }
    }

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background pointer-events-none" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />

            <Card className="w-full max-w-md relative z-10 shadow-2xl border-border/50 bg-card/95 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="text-center pb-4 pt-8 px-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-xl ring-1 ring-primary/20 animate-in zoom-in duration-300 delay-100">
                            <Mail className="h-8 w-8 text-primary animate-pulse" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                                Verify Your Email
                            </CardTitle>
                            <CardDescription className="text-sm">
                                We've sent a 6-digit code to {email ? email : 'your email'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-6 pb-8 pt-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
                            <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-center space-y-4">
                                        <FormLabel className="text-sm font-semibold text-accent uppercase tracking-wide">
                                            Enter OTP Code
                                        </FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                maxLength={6}
                                                {...field}
                                                className="gap-2"
                                            >
                                                <InputOTPGroup className="gap-2">
                                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="w-11 h-12 sm:w-12 sm:h-14 text-lg sm:text-xl font-bold border-2 border-border bg-background/50 hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg animate-in fade-in zoom-in duration-300"
                                                            style={{ animationDelay: `${index * 50}ms` }}
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage className="text-xs" />

                                        {/* Timer and Resend */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {!canResend ? (
                                                <>
                                                    <Timer className="w-4 h-4 animate-pulse" />
                                                    <span>Resend code in {countdown}s</span>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleResendOTP}
                                                    disabled={isResending}
                                                    className="flex items-center gap-2 text-primary font-semibold hover:underline transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                                >
                                                    <RefreshCcw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${isResending ? 'animate-spin' : ''}`} />
                                                    {isResending ? 'Sending...' : 'Resend OTP'}
                                                </button>
                                            )}
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="pt-2 space-y-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading || form.watch("pin").length !== 6}
                                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                    suppressHydrationWarning
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify Email
                                            <CheckCircle2 className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </Button>

                                {/* Back to Login */}
                                <div className="text-center text-xs text-muted-foreground">
                                    Wrong email?{" "}
                                    <button
                                        type="button"
                                        onClick={() => router.push('/signup')}
                                        className="text-primary font-semibold hover:underline transition-colors"
                                    >
                                        Go back
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
