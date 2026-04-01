"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Star, Send, AlertCircle } from "lucide-react";

interface ReviewFormProps {
  repairId: string;
  repairerId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ repairId, repairerId, onSuccess }: ReviewFormProps) {
  const { user } = useUser();
  const supabase = createClient();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 3) {
        setError("Maximum 3 photos allowed");
        return;
      }
      setPhotos(files);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("Please log in to submit a review");
      setLoading(false);
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      setLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review");
      setLoading(false);
      return;
    }

    try {
      let photoUrls: string[] = [];

      // Upload photos if provided
      if (photos.length > 0) {
        for (const photo of photos) {
          const fileName = `${repairId}/${Date.now()}-${photo.name}`;
          const { error: uploadError } = await supabase.storage
            .from("review-photos")
            .upload(fileName, photo);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from("review-photos")
            .getPublicUrl(fileName);

          photoUrls.push(data.publicUrl);
        }
      }

      // Create review
      const { error: reviewError } = await supabase.from("reviews").insert({
        repair_id: repairId,
        reviewer_id: user.id,
        repairer_id: repairerId,
        rating,
        title: title || "Great work!",
        comment,
        photos: photoUrls,
      });

      if (reviewError) throw reviewError;

      // Update repairer average rating
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("repairer_id", repairerId);

      if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await supabase
          .from("profiles")
          .update({ avg_rating: avgRating })
          .eq("id", repairerId);
      }

      setTitle("");
      setComment("");
      setPhotos([]);
      setRating(5);
      setSuccess(true);

      if (onSuccess) onSuccess();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-cream-3 p-6">
      <h3 className="text-lg font-semibold text-ink mb-6">Leave a Review</h3>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          ✓ Review submitted successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="size-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`size-8 ${
                    (hoverRating || rating) >= value ? "fill-amber text-amber" : "text-cream-3"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-60 mt-1">{rating} out of 5 stars</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Title (Optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Fixed my laptop perfectly!"
            className="w-full px-4 py-2 border border-cream-3 rounded-lg focus:outline-none focus:border-green"
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-ink mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this repairer..."
            className="w-full px-4 py-3 border border-cream-3 rounded-lg focus:outline-none focus:border-green resize-none text-sm"
            rows={4}
            disabled={loading}
          />
          <p className="text-xs text-ink-60 mt-1">{comment.length} / 500 characters</p>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Photos (Up to 3)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-cream-3 rounded-lg"
          />
          {photos.length > 0 && (
            <p className="text-xs text-ink-60 mt-2">{photos.length} photo(s) selected</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !user}
          className="w-full px-4 py-2 bg-green text-white rounded-lg hover:bg-green-600 disabled:bg-ink-20 disabled:text-ink-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Send className="size-4" />
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
