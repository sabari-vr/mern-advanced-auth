import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react'
import { Route, Routes } from 'react-router-dom';
import LoginPage from './containers/LoginPage';
import FloatingShape from './components/FloatingShape';
import SignUpPage from './containers/SignUpPage';
import EmailVerificationPage from './containers/EmailVerificationPage';
import { AppScope } from './context/AppScope';
import { ProtectedRoute } from './containers';
import DashboardPage from './containers/DashboardPage';
import ForgotPasswordPage from './containers/ForgotPasswordPage';
import ResetPasswordPage from './containers/ResetPasswordPage';

export const Master = () => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <AppScope>
                <div
                    className='min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'
                >
                    <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
                    <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
                    <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
                    <Routes>
                        <Route path='login' element={<LoginPage />} />
                        <Route path='signup' element={<SignUpPage />} />
                        <Route path='verify-email' element={<EmailVerificationPage />} />
                        <Route path='forgot-password' element={<ForgotPasswordPage />} />
                        <Route path='reset-password/:token' element={<ResetPasswordPage />} />

                        <Route
                            exact
                            element={
                                <ProtectedRoute redirectTo={"/login"}>
                                    <Home />
                                </ProtectedRoute>
                            }
                            path={"/*"}
                        />
                    </Routes>
                    <div className='absolute bottom-5 text-white'>Made with 💖 by <a target='blank' href='https://sabari-vr.github.io/my-portfolio' className='font-bold'>Sabari V R</a></div>
                </div>
            </AppScope>
        </QueryClientProvider>
    )
}

const Home = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
        </Routes>
    );
};
