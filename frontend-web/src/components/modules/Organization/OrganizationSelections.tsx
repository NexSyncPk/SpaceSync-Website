import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setOrganization } from "../../../store/slices/organizationSlice";
import CreateOrganization from "./CreateOrganization";
import JoinOrganization from "./JoinOrganization";
import MyOrganization from "./MyOrganization";

const OrganizationSelection: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<
    "create" | "join" | "my" | null
  >(null);
  const dispatch = useDispatch();

  const handleBack = () => {
    setSelectedOption(null);
  };

  if (selectedOption === "create") {
    return <CreateOrganization onBack={handleBack} />;
  }

  if (selectedOption === "join") {
    return <JoinOrganization onBack={handleBack} />;
  }

  if (selectedOption === "my") {
    return <MyOrganization onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Organization Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose how you want to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <button
              onClick={() => setSelectedOption("my")}
              className="w-full flex flex-col items-center justify-center px-4 py-6 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              My Organization
              <span className="text-sm font-normal mt-1">
                Join your existing organization
              </span>
            </button>

            <button
              onClick={() => setSelectedOption("create")}
              className="w-full flex flex-col items-center justify-center px-4 py-6 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create Organization
              <span className="text-sm font-normal mt-1">
                Start as an admin
              </span>
            </button>

            <button
              onClick={() => setSelectedOption("join")}
              className="w-full flex flex-col items-center justify-center px-4 py-6 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:bg-slate-200  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Join Organization
              <span className="text-sm font-normal mt-1">Join as a member</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSelection;
