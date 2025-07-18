import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        <Button
          onClick={() => navigate("/admin/rooms/")}
          className="w-full justify-start"
          variant="outline"
        >
          <MapPin size={16} className="mr-2" />
          Add New Room
        </Button>
        <Button
          onClick={() => navigate("/admin/users")}
          className="w-full justify-start"
          variant="outline"
        >
          <Users size={16} className="mr-2" />
          Manage Users
        </Button>
        <Button
          onClick={() => navigate("/admin/bookings")}
          className="w-full justify-start"
          variant="outline"
        >
          <Calendar size={16} className="mr-2" />
          Manage Bookings
        </Button>
        {/* <Button
                onClick={() => navigate("/admin/settings")}
                className="w-full justify-start"
                variant="outline"
              >
                <Settings size={16} className="mr-2" />
                System Settings
              </Button> */}
      </div>
    </div>
  );
};

export default QuickActions;
