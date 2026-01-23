import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaFacebook, FaApple } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, socialLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to where user came from, or home
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await socialLogin(credentialResponse, 'google');
            navigate(from, { replace: true });
        } catch (err) {
            setError('Google login failed. Please try again.');
        }
    };

    const handleFacebookResponse = async (response) => {
        try {
            if (response.accessToken) {
                await socialLogin(response, 'facebook');
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError('Facebook login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Log in to your account</h1>
                    <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm flex items-center justify-center">{error}</div>}

                {/* Social Logins */}
                <div className="space-y-3 mb-6">
                    <div className="w-full flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            useOneTap
                            width="100%"
                            theme="outline"
                            size="large"
                            text="continue_with"
                            shape="circle"
                        />
                    </div>

                    <FacebookLogin
                        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={handleFacebookResponse}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm">
                                <FaFacebook className="text-blue-600" /> Continue with Facebook
                            </button>
                        )}
                    />
                </div>

                <div className="relative flex items-center justify-center mb-6">
                    <div className="border-t border-gray-200 w-full"></div>
                    <span className="bg-white px-3 text-sm text-gray-400 absolute">or</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-bold text-gray-700">Password</label>
                            <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
                        </div>
                        <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3.5 rounded-full transition-all shadow-md mt-4"
                    >
                        Log in
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-bold hover:underline">
                        Sign up
                    </Link>
                </div>

                <div className="mt-8 text-center text-xs text-gray-400 max-w-xs mx-auto">
                    By logging in, you agree to our <Link to="#" className="underline">Terms of Service</Link> and <Link to="#" className="underline">Privacy Policy</Link>.
                </div>
            </div>
        </div>
    );
};

export default Login;
