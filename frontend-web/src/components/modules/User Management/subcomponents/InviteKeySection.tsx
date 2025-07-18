import React from "react";
import { Key, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface InviteKeySectionProps {
  inviteKey: string;
}

const InviteKeySection: React.FC<InviteKeySectionProps> = ({ inviteKey }) => {
  const copyInviteKey = async () => {
    try {
      await navigator.clipboard.writeText(inviteKey);
      toast.success("Invite key copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy invite key");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            Organization Invite Key
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Share this key with new users to join your organization
          </p>
        </div>
      </div>

      {inviteKey ? (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
          <div className="flex-1 font-mono text-sm bg-white p-3 rounded border border-gray-200 text-gray-700">
            {inviteKey}
          </div>
          <Button
            onClick={copyInviteKey}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Copy size={16} />
            Copy
          </Button>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-sm">
            No invite key available for this organization
          </p>
        </div>
      )}
    </div>
  );
};

export default InviteKeySection;
