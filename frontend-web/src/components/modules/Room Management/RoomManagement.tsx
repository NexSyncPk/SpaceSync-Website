import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import {
  addRooms,
  deleteRoom,
  getAllRooms,
  toggleRoomStatus,
  updateRoom,
} from "@/api/services/userService";
import { RoomFilters, RoomGrid, RoomFormModal } from "./subcomponents";
import { Room } from "@/types/interfaces";

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
// interface Room {
//   id: string;
//   name: string;
//   capacity: number;
//   displayProjector: boolean;
//   displayWhiteboard: boolean;
//   cateringAvailable: boolean;
//   videoConferenceAvailable: boolean;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   organizationId: string;
//   Organization: {
//     id: string;
//     name: string;
//   };
// }

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

  // Separate form for add modal
  const addForm = useForm<RoomFormData>({
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
      <RoomFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Rooms Grid */}
      <RoomGrid
        rooms={rooms}
        filteredRooms={filteredRooms}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={handleDeleteRoom}
        onToggleStatus={handleToggleStatus}
        getAmenitiesFromRoom={getAmenitiesFromRoom}
      />

      {/* Add Room Modal */}
      <RoomFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRoom}
        form={addForm}
        title="Add New Room"
        submitText="Add Room"
        isSubmitting={addForm.formState.isSubmitting}
      />

      {/* Edit Room Modal */}
      <RoomFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRoom(null);
        }}
        onSubmit={handleEditRoom}
        form={
          {
            register,
            handleSubmit,
            formState: { errors, isSubmitting },
            reset,
          } as any
        }
        title="Edit Room"
        submitText="Update Room"
        isSubmitting={isSubmitting}
      />

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
