import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { LoginFormData, loginSchema } from "@/schema/validationSchemas";
import { loginSuccess, setError, setLoading } from "@/store/slices/authSlice";
import { login } from "@/api/services/authService";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(setLoading(true));

    try {
      const response = await login(data);

      if (response) {
        dispatch(loginSuccess(response.data));
        console.log(response, response.data);
        reset();
        navigate("/");
        // navigate("/organization");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white w-full max-w-md mx-auto p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your SpaceSync account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("email")}
                type="email"
                id="email"
                className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-primary hover:text-blue-700 font-medium"
              disabled={isSubmitting}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-primary hover:text-blue-700 font-medium"
                disabled={isSubmitting}
                onClick={() => navigate("/signup")}
              >
                Create an account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
