import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOrganization } from "../../../store/slices/organizationSlice";
import { addNotification } from "../../../store/slices/notificationSlice";
import toast from "react-hot-toast";
import { getAllOrganizations } from "@/api/services/userService";
import { refreshOrganizationData } from "../../../utils/organizationHelpers";
import { useOrganizationOperations } from "@/hooks/useOrganizationOperations";

interface JoinOrganizationProps {
  onBack: () => void;
}

const JoinOrganization: React.FC<JoinOrganizationProps> = ({ onBack }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleJoinOrganization, isProcessing } = useOrganizationOperations();
  interface Organization {
    id: string;
    name: string;
    description: string;
    inviteKey: string;
    Users: [];
  }

  const [organizations, setOrganizations] = useState<Organization[] | null>(
    null
  );
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // Unified function to join organization using invite key
  const joinOrganizationByInviteKey = async (inviteKey: string) => {
    setError("");

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
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await getAllOrganizations();
      if (response) {
        setOrganizations(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError("Please enter an invite code");
      return;
    }
    await joinOrganizationByInviteKey(inviteCode.trim());
  };

  // const handleJoinById = async (orgId: string) => {
  //   // Find the organization from the fetched list to get its invite key
  //   const organization = organizations?.find((org) => org.id === orgId);
  //   if (organization && organization.inviteKey) {
  //     await joinOrganizationByInviteKey(organization.inviteKey);
  //   } else {
  //     toast.error("Organization invite key not found");
  //   }
  // };

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

          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or browse available organizations
                </span>
              </div>
            </div>

            {organizations ? (
              <div className="mt-6 space-y-3">
                {organizations.length > 0 ? (
                  organizations.map((org) => (
                    <div
                      key={org.id}
                      className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {org?.name}
                          </h3>
                          <p className="text-sm text-gray-500 w-10/12">
                            {org?.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {org?.Users?.length} members
                          </p>
                        </div>
                        <button
                          className="text-indigo-600 hover:text-indigo-500 text-sm font-medium disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinById(org.id);
                          }}
                          disabled={isProcessing || loading}
                        >
                          {isProcessing || loading ? "Joining..." : "Join"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No organizations available to join
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 text-center text-gray-500">
                <div className="animate-pulse">Loading organizations...</div>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default JoinOrganization;
