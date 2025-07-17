import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  Search,
  MoreVertical,
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
import { getAllRooms } from "@/api/services/userService";

// Room validation schema
const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  location: z.string().min(1, "Location is required"),
  amenities: z.array(z.string()),
  description: z.string(),
});

type RoomFormData = z.infer<typeof roomSchema>;

// Room type for state
interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  description: string;
  isActive: boolean;
  bookingCount: number;
}

// Mock room data
const mockRooms: Room[] = [
  {
    id: 1,
    name: "Conference Room A",
    capacity: 12,
    location: "Floor 1",
    amenities: ["Projector", "Whiteboard", "Video Conference"],
    description: "Large conference room with modern amenities",
    isActive: true,
    bookingCount: 45,
  },
  {
    id: 2,
    name: "Meeting Room B",
    capacity: 6,
    location: "Floor 2",
    amenities: ["TV Screen", "Whiteboard"],
    description: "Small meeting room for team discussions",
    isActive: true,
    bookingCount: 32,
  },
  {
    id: 3,
    name: "Creative Studio",
    capacity: 8,
    location: "Floor 1",
    amenities: ["Projector", "Sound System", "Creative Tools"],
    description: "Creative space for brainstorming sessions",
    isActive: true,
    bookingCount: 28,
  },
  {
    id: 4,
    name: "Executive Boardroom",
    capacity: 16,
    location: "Floor 3",
    amenities: ["Projector", "Video Conference", "Premium Furniture"],
    description: "High-end boardroom for executive meetings",
    isActive: false,
    bookingCount: 15,
  },
];

const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState(mockRooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      amenities: [],
      description: "",
    },
  });

  const fetchAllRooms = async () => {
    try {
      const response = await getAllRooms();
      if (response) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllRooms();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && room.isActive) ||
      (filterStatus === "inactive" && !room.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleAddRoom = (data: RoomFormData) => {
    const newRoom: Room = {
      id: rooms.length + 1,
      ...data,
      description: data.description || "",
      isActive: true,
      bookingCount: 0,
    };
    setRooms([...rooms, newRoom]);
    toast.success("Room added successfully!");
    setIsAddModalOpen(false);
    reset();
  };

  const handleEditRoom = (data: RoomFormData) => {
    if (selectedRoom) {
      setRooms(
        rooms.map((room) =>
          room.id === selectedRoom.id ? { ...room, ...data } : room
        )
      );
      toast.success("Room updated successfully!");
      setIsEditModalOpen(false);
      setSelectedRoom(null);
      reset();
    }
  };

  const handleDeleteRoom = (roomId: number) => {
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRooms(rooms.filter((room) => room.id !== roomToDelete.id));
      toast.success("Room deleted successfully!");
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    } catch (error) {
      toast.error("Failed to delete room. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = (roomId: number) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, isActive: !room.isActive } : room
      )
    );
    toast.success("Room status updated!");
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setValue("name", room.name);
    setValue("capacity", room.capacity);
    setValue("location", room.location);
    setValue("amenities", room.amenities);
    setValue("description", room.description);
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
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {filteredRooms.map((room) => (
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
                    <MapPin size={14} className="mr-1" />
                    {room.location}
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
                    {room.bookingCount} bookings
                  </span>
                </div>

                {room.description && (
                  <p className="text-sm text-gray-600">{room.description}</p>
                )}

                <div className="flex flex-wrap gap-1">
                  {room.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{room.amenities.length - 3} more
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
        ))}
      </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                {...register("location")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location"
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
                rows={3}
              />
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                {...register("location")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location"
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
                rows={3}
              />
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
