
"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ArrowRight, Mail, PawPrint, Lock } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { loginFormSchema } from '@/Validations/auth.validations'
import { z } from 'zod'
import axios from 'axios'
import { notFound } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// removed unused import
const Login = () => {
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            email: "",
            password: ""

        }
    })
    const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080"

    const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
        try {


            const data = await axios.post(`${url}/v1/api/auth/login`, values);
            console.log(data);
            toast.success('login successfull')
            router.push('/home')
            return data;

        } catch (error) {
            console.error("Login failed:", error);
            notFound();

        }
    }
    // Removed automatic submit on mount to avoid calling onSubmit without form values.


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
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-xs font-semibold uppercase text-accent tracking-wide">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    type="password"
                                                    placeholder="Aa1@example"
                                                    {...field}
                                                    className="pl-9 h-10 bg-background/50 focus:bg-background transition-all"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] mt-0.5" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="pt-2">
                                <Button
                                    type="submit"

                                    className="w-full cursor-pointer h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                    suppressHydrationWarning
                                >
                                    Login
                                </Button>
                            </div>
                            {/* Login Link */}
                            <div className="text-center text-xs text-muted-foreground pt-1">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => router.push('/signup')}
                                    className="text-primary font-semibold hover:underline transition-colors cursor-pointer bg-transparent border-none"
                                    suppressHydrationWarning
                                >
                                    Signup
                                </button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login
