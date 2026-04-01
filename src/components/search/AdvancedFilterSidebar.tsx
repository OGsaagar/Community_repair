'use client'

import { useState } from 'react'
import { Filter, X, Sliders } from 'lucide-react'

export interface FilterState {
  priceRange: [number, number]
  rating: number
  specialty: string[]
  distance: number
  sortBy: 'rating' | 'price' | 'distance' | 'newest'
}

interface AdvancedFilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClose?: () => void
  isMobile?: boolean
}

const SPECIALTIES = ['Phone Repair', 'Laptop Repair', 'Tablet Repair', 'Game Console Repair', 'Audio Equipment']

export function AdvancedFilterSidebar({
  filters,
  onFiltersChange,
  onClose,
  isMobile = false,
}: AdvancedFilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(!isMobile)

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const newRange: [number, number] = [...filters.priceRange]
    newRange[index] = parseInt(e.target.value)
    onFiltersChange({ ...filters, priceRange: newRange })
  }

  const handleSpecialtyToggle = (specialty: string) => {
    const updated = filters.specialty.includes(specialty)
      ? filters.specialty.filter((s) => s !== specialty)
      : [...filters.specialty, specialty]
    onFiltersChange({ ...filters, specialty: updated })
  }

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, 5000],
      rating: 0,
      specialty: [],
      distance: 100,
      sortBy: 'rating',
    })
  }

  if (isMobile && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:hidden p-3 bg-green text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <Sliders className="size-6" />
      </button>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? 'fixed right-0 top-0 h-screen w-full sm:max-w-md shadow-xl md:relative md:w-auto md:h-auto md:shadow-none'
            : ''
        } bg-white rounded-lg border border-cream-3 p-6 space-y-6 ${!isOpen ? 'hidden md:block' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
            <Filter className="size-5" />
            Filters
          </h2>
          {isMobile && (
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-cream-50 rounded">
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-ink mb-3">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
            className="w-full px-3 py-2 border border-cream-3 rounded-lg focus:outline-none focus:border-green text-sm"
          >
            <option value="rating">Highest Rated</option>
            <option value="price">Lowest Price</option>
            <option value="distance">Closest First</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-ink mb-3">Price Range</label>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-ink-60">Min: ${filters.priceRange[0]}</label>
              <input
                type="range"
                min="0"
                max="5000"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(e, 0)}
                className="w-full h-2 bg-cream-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-ink-60">Max: ${filters.priceRange[1]}</label>
              <input
                type="range"
                min="0"
                max="5000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(e, 1)}
                className="w-full h-2 bg-cream-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-ink mb-3">Minimum Rating</label>
          <div className="space-y-2">
            {['', '4.5', '4.0', '3.5', 'Any'].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={parseFloat(rating) || 0}
                  checked={filters.rating === (parseFloat(rating) || 0)}
                  onChange={(e) => onFiltersChange({ ...filters, rating: parseFloat(e.target.value) })}
                  className="size-4"
                />
                <span className="text-sm text-ink-60">{rating === '' ? 'Any' : `⭐ ${rating}+`}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-ink mb-3">Specialties</label>
          <div className="space-y-2">
            {SPECIALTIES.map((specialty) => (
              <label key={specialty} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.specialty.includes(specialty)}
                  onChange={() => handleSpecialtyToggle(specialty)}
                  className="size-4 rounded border-cream-3"
                />
                <span className="text-sm text-ink-60">{specialty}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-ink mb-3">
            Distance: {filters.distance} miles
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={filters.distance}
            onChange={(e) => onFiltersChange({ ...filters, distance: parseInt(e.target.value) })}
            className="w-full h-2 bg-cream-2 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-cream-3">
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 border border-cream-3 text-ink rounded-lg hover:bg-cream-50 transition-colors text-sm font-medium"
          >
            Clear Filters
          </button>
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 bg-green text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Apply Filters
            </button>
          )}
        </div>
      </div>
    </>
  )
}
