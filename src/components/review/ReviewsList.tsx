import { Avatar } from "@/components/shared/Avatar";
import { StarRating } from "@/components/shared/StarRating";

interface Review {
  id: string;
  reviewer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  rating: number;
  title: string;
  comment: string;
  photos?: string[];
  created_at: string;
}

interface ReviewsListProps {
  reviews: Review[];
  loading?: boolean;
}

export function ReviewsList({ reviews, loading }: ReviewsListProps) {
  if (loading) {
    return <div className="text-center py-8 text-ink-60">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center py-8 text-ink-60">No reviews yet</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-cream-3 rounded-lg p-6 bg-card"
        >
          {/* Header with Avatar and Rating */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar
                name={review.reviewer.full_name}
                src={review.reviewer.avatar_url}
                size="md"
              />
              <div>
                <p className="font-semibold text-ink">{review.reviewer.full_name}</p>
                <p className="text-xs text-ink-60">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <StarRating rating={review.rating} interactive={false} />
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-semibold text-ink mb-2">{review.title}</h4>
          )}

          {/* Comment */}
          <p className="text-ink-60 mb-4">{review.comment}</p>

          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-3 mb-4">
              {review.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Review photo ${index + 1}`}
                  className="w-24 h-24 rounded-lg object-cover border border-cream-3"
                />
              ))}
            </div>
          )}

          {/* Helpful Actions */}
          <div className="flex gap-4 text-sm">
            <button className="text-ink-60 hover:text-green transition">
              👍 Helpful
            </button>
            <button className="text-ink-60 hover:text-green transition">
              🚩 Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
