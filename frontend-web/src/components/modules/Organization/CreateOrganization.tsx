import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { setOrganization } from "../../../store/slices/organizationSlice";
import { createOrganization } from "@/api/services/userService";
import {
  createOrganizationSchema,
  CreateOrganizationFormData,
} from "@/schema/validationSchemas";
import { updateUser } from "@/store/slices/authSlice";
import { refreshOrganizationData } from "../../../utils/organizationHelpers";

interface CreateOrganizationProps {
  onBack: () => void;
}

const CreateOrganization: React.FC<CreateOrganizationProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: CreateOrganizationFormData) => {
    setLoading(true);

    try {
      console.log("Validated form data:", data);
      const response = await createOrganization(data);

      if (response && response.data) {
        console.log("Organization created:", response.data);
        dispatch(setOrganization(response.data));

        // Update user's organization ID in auth store
        dispatch(
          updateUser({
            organizationId: response.data.id,
          })
        );

        reset();
        toast.success("Organization created successfully!");

        // Fetch updated organization data with fresh member count and room data
        await refreshOrganizationData(response.data.id, dispatch);

        // Navigation will be handled by Organization component's useEffect
      } else {
        toast.error("Failed to create organization. Please try again.");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-indigo-600 hover:text-indigo-500"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create Organization
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Organization Name *
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter organization name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register("description")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Describe your organization (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                "Create Organization"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
