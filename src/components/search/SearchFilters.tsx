import { cn } from "@/lib/utils"

interface SearchFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedSpecualty: string | null
  onSpecialtyChange: (specialty: string | null) => void
  sortBy: "rating" | "distance" | "price" | "newest"
  onSortChange: (sort: "rating" | "distance" | "price" | "newest") => void
  minRating: number
  onMinRatingChange: (rating: number) => void
}

const specialties = [
  { id: "phones", label: "Phones" },
  { id: "laptops", label: "Laptops" },
  { id: "tablets", label: "Tablets" },
  { id: "computers", label: "Computers" },
  { id: "smart-home", label: "Smart Home" },
  { id: "appliances", label: "Appliances" },
  { id: "furniture", label: "Furniture" },
  { id: "jewelry", label: "Jewelry" },
]

const sortOptions = [
  { id: "rating", label: "Top Rated" },
  { id: "distance", label: "Closest" },
  { id: "price", label: "Best Price" },
  { id: "newest", label: "Newest" },
]

export function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedSpecualty,
  onSpecialtyChange,
  sortBy,
  onSortChange,
  minRating,
  onMinRatingChange,
}: SearchFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div>
        <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
          Search
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search repairers or repairs..."
          className="w-full px-4 py-2 border border-cream-3 rounded-lg focus:border-green focus:ring-2 focus:ring-green-light outline-none"
        />
      </div>

      {/* Sort Options */}
      <div>
        <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
          Sort By
        </label>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onSortChange(option.id as typeof sortBy)}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition text-left",
                sortBy === option.id
                  ? "border-green bg-green-light text-green font-semibold"
                  : "border-cream-3 hover:border-cream-2"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Specialty Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
          Specialties
        </label>
        <div className="space-y-2">
          <button
            onClick={() => onSpecialtyChange(null)}
            className={cn(
              "w-full p-3 rounded-lg border-2 transition text-left",
              selectedSpecualty === null
                ? "border-green bg-green-light text-green font-semibold"
                : "border-cream-3 hover:border-cream-2"
            )}
          >
            All Specialties
          </button>
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => onSpecialtyChange(selectedSpecualty === specialty.id ? null : specialty.id)}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition text-left",
                selectedSpecualty === specialty.id
                  ? "border-green bg-green-light text-green font-semibold"
                  : "border-cream-3 hover:border-cream-2"
              )}
            >
              {specialty.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase text-ink-60 mb-2">
          Minimum Rating
        </label>
        <div className="space-y-2">
          {[0, 3.5, 4.0, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => onMinRatingChange(rating)}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition text-left",
                minRating === rating
                  ? "border-green bg-green-light text-green font-semibold"
                  : "border-cream-3 hover:border-cream-2"
              )}
            >
              {rating === 0 ? "All Ratings" : `${rating}+ ⭐`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
