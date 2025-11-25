import Login from '@/components/landing/Login'
import React, { Suspense } from 'react'

export default function LoginPage() {
    return (
        <div>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            }>
                <Login />
            </Suspense>
        </div>
    )
}

