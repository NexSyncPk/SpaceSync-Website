import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setOrganization } from "../../../store/slices/organizationSlice";
import { addNotification } from "../../../store/slices/notificationSlice";

interface JoinOrganizationProps {
  onBack: () => void;
}

// Mock organizations data
const mockOrganizations = [
  {
    id: "1",
    name: "Tech Corp",
    description: "Leading technology company",
    industry: "Technology",
    memberCount: 25,
    inviteCode: "TECH001",
  },
  {
    id: "2",
    name: "Health Plus",
    description: "Healthcare solutions provider",
    industry: "Healthcare",
    memberCount: 15,
    inviteCode: "HEALTH002",
  },
  {
    id: "3",
    name: "Edu Learn",
    description: "Educational platform",
    industry: "Education",
    memberCount: 30,
    inviteCode: "EDU003",
  },
];

const JoinOrganization: React.FC<JoinOrganizationProps> = ({ onBack }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mock API call
    setTimeout(() => {
      const organization = mockOrganizations.find(
        (org) => org.inviteCode === inviteCode
      );

      if (organization) {
        const joinedOrganization = {
          ...organization,
          role: "member" as const,
          joinedAt: new Date().toISOString(),
        };

        dispatch(setOrganization(joinedOrganization));

        // Simulate admin notification
        dispatch(
          addNotification({
            id: Date.now().toString(),
            type: "user_joined",
            message: `A new user has joined ${organization.name}`,
            timestamp: new Date().toISOString(),
            read: false,
          })
        );
      } else {
        setError("Invalid invite code. Please check and try again.");
      }

      setLoading(false);
    }, 1000);
  };

  const handleJoinById = (orgId: string) => {
    const organization = mockOrganizations.find((org) => org.id === orgId);
    if (organization) {
      const joinedOrganization = {
        ...organization,
        role: "member" as const,
        joinedAt: new Date().toISOString(),
      };

      dispatch(setOrganization(joinedOrganization));

      // Simulate admin notification
      dispatch(
        addNotification({
          id: Date.now().toString(),
          type: "user_joined",
          message: `A new user has joined ${organization.name}`,
          timestamp: new Date().toISOString(),
          read: false,
        })
      );
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
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Organization"}
            </button>
          </form>

          <div className="mt-6">
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

            <div className="mt-6 space-y-3">
              {mockOrganizations.map((org) => (
                <div
                  key={org.id}
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleJoinById(org.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {org.name}
                      </h3>
                      <p className="text-sm text-gray-500">{org.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {org.memberCount} members • {org.industry}
                      </p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinOrganization;
