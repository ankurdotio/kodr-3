import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

const Login = () => {

    const { handleLogin } = useAuth();
    const navigate = useNavigate();


    const [ formData, setFormData ] = useState({
        usernameOrEmail: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [ e.target.name ]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);

        await handleLogin(formData);
        navigate("/profile")

    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username or Email Field */}
                    <div>
                        <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            Username or Email
                        </label>
                        <input
                            type="text"
                            id="usernameOrEmail"
                            name="usernameOrEmail"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-colors"
                            placeholder="johndoe or john@example.com"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-[#800020] hover:bg-[#660019] text-white font-medium rounded-lg transition-colors duration-200 mt-8 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                        Sign In
                    </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="text-[#800020] hover:text-[#660019] font-medium transition-colors">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
