'use client'

import React, { useState, useEffect } from 'react'
import { collegeApi } from '@/services/api'
import { College } from '@/types'
import { X, Plus } from 'lucide-react'

export default function ComparePage() {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<College[]>([])
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    if (searchTerm.length > 1) {
      const searchColleges = async () => {
        const response = await collegeApi.getColleges({ search: searchTerm, limit: 5 })
        setSearchResults(response.data)
      }
      searchColleges()
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const addCollege = (college: College) => {
    if (selectedColleges.length < 3 && !selectedColleges.find(c => c.id === college.id)) {
      setSelectedColleges([...selectedColleges, college])
      setShowSearch(false)
      setSearchTerm('')
    }
  }

  const removeCollege = (id: string) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Compare Colleges</h1>
        <p className="text-gray-600 mb-8">Compare up to 3 colleges side by side</p>

        {/* College Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            {selectedColleges.map(college => (
              <div key={college.id} className="bg-blue-50 rounded-lg p-3 flex items-center gap-2">
                <span className="font-medium">{college.name}</span>
                <button onClick={() => removeCollege(college.id)} className="text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {selectedColleges.length < 3 && (
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-2 hover:border-blue-500"
              >
                <Plus className="w-4 h-4" />
                Add College
              </button>
            )}
          </div>

          {/* Search Box */}
          {showSearch && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                autoFocus
              />
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded-lg overflow-hidden">
                  {searchResults.map(college => (
                    <button
                      key={college.id}
                      onClick={() => addCollege(college)}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="font-medium">{college.name}</div>
                      <div className="text-sm text-gray-500">{college.city} • ₹{(college.fees/100000).toFixed(2)}L</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selectedColleges.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left w-48">Metrics</th>
                  {selectedColleges.map(college => (
                    <th key={college.id} className="p-4 text-left">{college.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4 font-medium">Location</td>
                  {selectedColleges.map(college => (
                    <td key={college.id} className="p-4">{college.city}, {college.state}</td>
                  ))}
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-4 font-medium">Fees (per year)</td>
                  {selectedColleges.map(college => (
                    <td key={college.id} className="p-4">₹{(college.fees/100000).toFixed(2)} Lakhs</td>
                  ))}
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Rating</td>
                  {selectedColleges.map(college => (
                    <td key={college.id} className="p-4">
                      <span className="px-2 py-1 bg-yellow-100 rounded">{college.rating} / 5</span>
                    </td>
                  ))}
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-4 font-medium">Type</td>
                  {selectedColleges.map(college => (
                    <td key={college.id} className="p-4">{college.type}</td>
                  ))}
                </tr>
                <tr className="border-t">
                  <td className="p-4 font-medium">Established</td>
                  {selectedColleges.map(college => (
                    <td key={college.id} className="p-4">{college.established}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {selectedColleges.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Select colleges to compare</p>
            <p className="text-sm text-gray-400 mt-2">Click "Add College" to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}