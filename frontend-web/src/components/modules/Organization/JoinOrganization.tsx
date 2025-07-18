import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setOrganization } from "../../../store/slices/organizationSlice";
import { addNotification } from "../../../store/slices/notificationSlice";
// import toast from "react-hot-toast";
// import { getAllOrganizations } from "@/api/services/userService";
import { refreshOrganizationData } from "../../../utils/organizationHelpers";
import { useOrganizationOperations } from "@/hooks/useOrganizationOperations";

interface JoinOrganizationProps {
  onBack: () => void;
}

const JoinOrganization: React.FC<JoinOrganizationProps> = ({ onBack }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleJoinOrganization, isProcessing } = useOrganizationOperations();

  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // Unified function to join organization using invite key
  const joinOrganizationByInviteKey = async (inviteKey: string) => {
    setError("");
    setLoading(true);
    try {
      const result = await handleJoinOrganization(inviteKey);

      if (result.success && result.data) {
        console.log("Join organization response:", result.data);

        const joinedOrganization = {
          ...result.data.organization,
          role: result.data.role || "employee",
          joinedAt: new Date().toISOString(),
        };

        // Update organization state
        dispatch(setOrganization(joinedOrganization));

        // Add notification for joining
        dispatch(
          addNotification({
            id: Date.now().toString(),
            type: "user_joined",
            message: `You have joined ${result.data.organization.name}`,
            timestamp: new Date().toISOString(),
            read: false,
          })
        );

        // Fetch updated organization data with fresh member count and room data
        await refreshOrganizationData(result.data.organization.id, dispatch);

        // Log the updated states for debugging
        console.log("Updated organization state:", joinedOrganization);
      } else {
        setError(
          result.error || "Failed to join organization. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Join organization error:", error);
      const errorMessage = error?.message || "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError("Please enter an invite code");
      return;
    }
    await joinOrganizationByInviteKey(inviteCode.trim());
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
          Join Organization
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="inviteCode"
                className="block text-sm font-medium text-gray-700"
              >
                Invite Code
              </label>
              <input
                id="inviteCode"
                name="inviteCode"
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="Enter invite code"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isProcessing || loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isProcessing || loading ? "Joining..." : "Join Organization"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinOrganization;
