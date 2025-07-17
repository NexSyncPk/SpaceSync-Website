import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Search,
  MoreVertical,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import {
  addRooms,
  deleteRoom,
  getActiveRooms,
  getAllRooms,
  toggleRoomStatus,
  updateRoom,
} from "@/api/services/userService";

// Room validation schema
const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  displayProjector: z.boolean().optional(),
  displayWhiteboard: z.boolean().optional(),
  cateringAvailable: z.boolean().optional(),
  videoConferenceAvailable: z.boolean().optional(),
});

type RoomFormData = z.infer<typeof roomSchema>;

// Room type for API response
interface Room {
  id: string;
  name: string;
  capacity: number;
  displayProjector: boolean;
  displayWhiteboard: boolean;
  cateringAvailable: boolean;
  videoConferenceAvailable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  Organization: {
    id: string;
    name: string;
  };
}

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      displayProjector: false,
      displayWhiteboard: false,
      cateringAvailable: false,
      videoConferenceAvailable: false,
    },
  });

  // Helper function to get amenities array from boolean flags
  const getAmenitiesFromRoom = (room: Room): string[] => {
    const amenities: string[] = [];
    if (room.displayProjector) amenities.push("Projector");
    if (room.displayWhiteboard) amenities.push("Whiteboard");
    if (room.cateringAvailable) amenities.push("Catering");
    if (room.videoConferenceAvailable) amenities.push("Video Conference");
    return amenities;
  };

  const fetchAllRooms = async () => {
    try {
      setIsLoading(true);
      const response = await getAllRooms();
      // const response = await getActiveRooms();
      if (response && response.data) {
        console.log("Rooms data:", response.data);
        setRooms(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const amenities = getAmenitiesFromRoom(room);
    const searchString = `${room.name} ${
      room.Organization.name
    } ${amenities.join(" ")}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && room.isActive) ||
      (filterStatus === "inactive" && !room.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleAddRoom = async (data: any) => {
    // TODO: Implement actual API call for adding room
    console.log("Adding room:", data);
    try {
      const response = await addRooms(data);
      if (response) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
    setIsAddModalOpen(false);
    reset();
    fetchAllRooms(); // Refresh the list
  };

  const handleEditRoom = async (data: RoomFormData) => {
    // TODO: Implement actual API call for updating room
    if (selectedRoom) {
      try {
        const response = await updateRoom(selectedRoom.id, data);
        console.log(response);
        toast.success("Room updated successfully!");
        setIsEditModalOpen(false);
        setSelectedRoom(null);
        reset();
        fetchAllRooms(); // Refresh the list
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setRoomToDelete(room);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteRoom(roomToDelete.id);
      if (response) {
        console.log(response);
      }
      toast.success("Room deleted successfully!");
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
      fetchAllRooms(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete room. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (roomId: string) => {
    // TODO: Implement actual API call for toggling room status
    console.log("Toggling status for room:", roomId);
    try {
      await toggleRoomStatus(roomId);
      toast.success("Room status updated!");
      fetchAllRooms(); // Refresh the list
    } catch (error) {
      console.log(error);
    }
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setValue("name", room.name);
    setValue("capacity", room.capacity);
    setValue("displayProjector", room.displayProjector);
    setValue("displayWhiteboard", room.displayWhiteboard);
    setValue("cateringAvailable", room.cateringAvailable);
    setValue("videoConferenceAvailable", room.videoConferenceAvailable);
    setIsEditModalOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Room Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage meeting rooms and their configurations
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Room
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Rooms</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div>
        <h1 className="font-bold text-lg mb-4">
          Total Rooms ({rooms?.length || 0})
        </h1>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading rooms...</span>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No rooms found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRooms.map((room) => {
            const amenities = getAmenitiesFromRoom(room);
            return (
              <div
                key={room.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {room.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Building size={14} className="mr-1" />
                        {room.Organization.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          room.isActive
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {room.isActive ? "Active" : "Inactive"}
                      </span>
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users size={14} className="mr-1" />
                        Capacity: {room.capacity}
                      </div>
                      <span className="text-sm text-gray-600">
                        Created: {new Date(room.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {amenities.length > 0 ? (
                        <>
                          {amenities.slice(0, 3).map((amenity, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                          {amenities.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{amenities.length - 3} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                          No amenities
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(room)}
                      className="flex-1"
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(room.id)}
                      className="flex-1"
                    >
                      {room.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Room Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            reset();
          }
          setIsAddModalOpen(open);
        }}
      >
        <DialogContent className="max-w-md max-sm: w-11/12 max-sm:rounded-lg ">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddRoom)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Name
              </label>
              <input
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                {...register("capacity", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter capacity"
              />
              {errors.capacity && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.capacity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("displayProjector")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Projector</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("displayWhiteboard")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Whiteboard</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("cateringAvailable")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Catering</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("videoConferenceAvailable")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Video Conference
                  </span>
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setIsAddModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Room"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            reset();
            setSelectedRoom(null);
          }
          setIsEditModalOpen(open);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditRoom)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Name
              </label>
              <input
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity
              </label>
              <input
                type="number"
                {...register("capacity", { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter capacity"
              />
              {errors.capacity && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.capacity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("displayProjector")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Projector</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("displayWhiteboard")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Whiteboard</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("cateringAvailable")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Catering</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("videoConferenceAvailable")}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Video Conference
                  </span>
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setSelectedRoom(null);
                  setIsEditModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Room"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRoomToDelete(null);
        }}
        onConfirm={confirmDeleteRoom}
        title="Delete Room"
        description="Are you sure you want to delete this room? This action cannot be undone and will affect any future bookings."
        itemName={roomToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default RoomManagement;
