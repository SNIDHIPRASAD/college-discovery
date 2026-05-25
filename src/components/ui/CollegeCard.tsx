'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, DollarSign, Star, Heart } from 'lucide-react'
import { College } from '@/types'

interface CollegeCardProps {
  college: College
  onSave?: () => void
  isSaved?: boolean
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college, onSave, isSaved }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      <Link href={`/college/${college.id}`}>
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
          <button
            onClick={(e) => {
              e.preventDefault()
              onSave?.()
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors z-10"
          >
            <Heart
              className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="text-xs px-2 py-1 bg-white/90 rounded-md text-gray-700">
              {college.type}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {college.name}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{college.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{college.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-gray-700">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold">
                ₹{(college.fees / 100000).toFixed(2)}L
              </span>
              <span className="text-xs text-gray-500">/year</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}