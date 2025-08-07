import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { IComment } from "@/types/Comment";

interface CommentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, content: string, rating: number) => void;
  comment: IComment | null;
}

const CommentEditDialog: React.FC<CommentEditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  comment,
}) => {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (comment) {
      setContent(comment.content);
    }
  }, [comment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment) {
      onSave(comment.id, content, rating);
      onClose();
    }
  };

  const renderStars = (currentRating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer ${
          i < currentRating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-400"
        }`}
        onClick={() => setRating(i + 1)}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex items-center space-x-1">
              {renderStars(rating)}
              <span className="text-white ml-2">{rating}/5</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CommentEditDialog;
