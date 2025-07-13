import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { SignupFormData, signupSchema } from "@/schema/validationSchemas";
import { setError, setLoading, signupSuccess } from "@/store/slices/authSlice";
import { signup } from "@/api/services/authService";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    dispatch(setLoading(true));

    try {
      // Simulate API call - replace with actual API call

      const response = await signup(data);
      if (response) {
        console.log(response);
      }
      // toast.success("Account created successfully! Welcome to SpaceSync.");
      reset();
      navigate("/"); // Redirect to home page
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white w-full max-w-md mx-auto p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join SpaceSync to manage your meeting spaces
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("name")}
                type="text"
                id="name"
                className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.name
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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

          {/* Phone Field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("phone")}
                type="tel"
                id="phone"
                className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.phone
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Enter your phone number"
                disabled={isSubmitting}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Department Field */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("department")}
                type="text"
                id="department"
                className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.department
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Enter your department"
                disabled={isSubmitting}
              />
            </div>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">
                {errors.department.message}
              </p>
            )}
          </div>

          {/* Position Field */}
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Position/Job Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("position")}
                type="text"
                id="position"
                className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.position
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Enter your position"
                disabled={isSubmitting}
              />
            </div>
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">
                {errors.position.message}
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
                placeholder="Create a password"
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

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Confirm your password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
              disabled={isSubmitting}
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <button
                type="button"
                className="text-primary hover:text-blue-700 font-medium"
                disabled={isSubmitting}
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-primary hover:text-blue-700 font-medium"
                disabled={isSubmitting}
              >
                Privacy Policy
              </button>
            </label>
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
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary hover:text-blue-700 font-medium"
                disabled={isSubmitting}
                onClick={() => navigate("/login")}
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
