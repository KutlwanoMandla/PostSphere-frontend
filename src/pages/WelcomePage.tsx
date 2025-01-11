import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

import { init, send } from '@emailjs/browser';

import { toast } from 'react-toastify';


export default function WelcomePage() {

  const { setUser } = useAuth();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  console.log(verificationCode)


  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: '',
  });

  init("Qzr5FvwtA14N9oQQq");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null);
    setLoading(true);

    try {
      const response = await authService.login(loginData);
      // Handle successful login
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
        bio: response.bio,
        token: response.token
      };
      setUser(userData);

      // console.log('Login successful:', response);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', String(response.id));

      toast.success("successfully logged in!");
      
      navigate('/home'); // Redirect to home page
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChars) {
      return "Password must contain at least one special character.";
    }
    return null; // Password is valid
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null);

    // Add validation
    if (!signupData.username.trim()) {
      toast.error('Username is required');
      return;
    }
    if (!signupData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!signupData.password) {
      toast.error('Password is required');
      return;
    }

    const passwordValidationError = validatePassword(signupData.password);
    if (passwordValidationError) {
      toast.error(passwordValidationError);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.signup({
        username: signupData.username,
        email: signupData.email,
        bio: signupData.bio,
        password: signupData.password,
      });
      console.log('Signup successful:', response);

      toast.success("Account created successfully!")

      // Switch to login tab after successful signup
      setActiveTab('login');
      // Clear signup form
      setSignupData({
        username: '',
        email: '',
        bio: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };
  
  const sendVerificationEmail = async (email: string, code: string) => {
    try {
      const templateParams = {
        to_email: email,
        verification_code: code,
        // Add any other template parameters you need
      };

      await send(
        'service_ahtxezn', // Replace with your EmailJS service ID
        'template_j4onatp', // Replace with your EmailJS template ID
        templateParams,
        'Qzr5FvwtA14N9oQQq' // Replace with your EmailJS public key
      );

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError(null);
    setLoading(true);

    try {
      // First, call the forgot-password endpoint to get the verification code
      const response = await authService.forgotPassword(forgotPasswordEmail);
      
      // Extract the verification code from the response
      // Assuming the response is something like: "Verification code sent to your email: 123456"
      const code = response.split(': ')[1];
      setVerificationCode(code);

      // Send the email using EmailJS
      await sendVerificationEmail(forgotPasswordEmail, code);

      toast.success('Verification code has been sent to your email');
      
      // Navigate to reset password page after successful email send
      setTimeout(() => {
        navigate('/reset-password', { 
          state: { 
            email: forgotPasswordEmail,
            verificationCode: code // Optionally pass the code if needed
          }
        });
      }, 2000);

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 p-4 sm:p-8">
        <div className="text-center leading-snug pt-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800">
            Welcome
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-600 mt-4">
            To
          </h2>
          <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-600">
            PostSphere
          </h3>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 italic mt-8">
            Share Your Thoughts
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">

          <div className="flex border-b mb-6">
            <button
              className={`flex-1 py-2 text-center ${activeTab === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center ${activeTab === "signup"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
                }`}
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* login part */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              {/* {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )} */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          )}
          {activeTab === "login" && (
            <button
              type="button"
              className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition mt-2"
              onClick={() => setActiveTab("forgot-password")}
            >
              Forgot Password?
            </button>
          )}

          {/* sign up part */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="signup-username"
                  type="text"
                  value={signupData.username}
                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              <label htmlFor="signup-bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                value={signupData.bio}
                onChange={(e) => setSignupData({ ...signupData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tell us about yourself..."
              />
              <div className="space-y-2">
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password"
                />
                {/* {error && error.includes("Password") && (
                  <div className="text-red-600 text-sm">{error}</div>
                )} */}
              </div>

              <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
              {/* {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )} */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </form>
          )}

          {/* forgot password part */}
          {activeTab === "forgot-password" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              {/* {error && (
                <div className={`text-sm ${error.includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
                  {error}
                </div>
              )} */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {loading ? 'Sending...' : 'Send Code'}
              </button>
              <button
                type="button"
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition"
                onClick={() => setActiveTab("login")}
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}