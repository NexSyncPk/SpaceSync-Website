import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./dialog";
import { Button } from "./button";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-left">{title}</DialogTitle>
              <DialogDescription className="text-left mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {itemName && (
          <div className="my-4 p-3 bg-gray-50 rounded-lg border">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Item to delete:</span> {itemName}
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
