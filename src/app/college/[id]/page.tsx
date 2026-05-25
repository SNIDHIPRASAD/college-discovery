'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { collegeApi } from '@/services/api'
import { College } from '@/types'
import { MapPin, DollarSign, Star, Calendar, Building } from 'lucide-react'

export default function CollegeDetailPage() {
  const { id } = useParams()
  const [college, setCollege] = useState<College | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      collegeApi.getCollegeById(id as string)
        .then(setCollege)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">College not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{college.name}</h1>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{college.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{college.rating}/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Est. {college.established}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              <span>{college.type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">About {college.name}</h2>
          <p className="text-gray-700 leading-relaxed">{college.overview}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Fee Structure</h2>
          <div className="flex items-center gap-2 text-3xl font-bold text-blue-600">
            <DollarSign className="w-8 h-8" />
            <span>₹{(college.fees / 100000).toFixed(2)} Lakhs</span>
            <span className="text-sm text-gray-500 font-normal">per year</span>
          </div>
        </div>
      </div>
    </div>
  )
}