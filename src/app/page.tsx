'use client'

import React, { useState, useEffect } from 'react'
import { CollegeCard } from '@/components/ui/CollegeCard'
import { collegeApi, savedApi, authApi } from '@/services/api'
import { FilterParams } from '@/types'
import { Search, Filter, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function HomePage() {
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    city: '',
    type: '',
    minRating: undefined
  })

  // Load saved colleges
  useEffect(() => {
    const loadSaved = async () => {
      const saved = await savedApi.getSavedColleges()
      setSavedIds(saved.map((s: any) => s.id))
    }
    loadSaved()
  }, [])

  // Load colleges on filter change
  useEffect(() => {
    loadColleges(true)
  }, [filters])

  const loadColleges = async (reset = false) => {
    if (loading) return
    
    setLoading(true)
    try {
      const currentPage = reset ? 1 : page
      const response = await collegeApi.getColleges({ ...filters, page: currentPage, limit: 9 })
      
      if (reset) {
        setColleges(response.data)
        setPage(2)
      } else {
        setColleges(prev => [...prev, ...response.data])
        setPage(prev => prev + 1)
      }
      
      setHasMore(currentPage < response.totalPages)
    } catch (error) {
      toast.error('Failed to load colleges')
    } finally {
      setLoading(false)
    }
  }

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        if (hasMore && !loading) {
          loadColleges()
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loading, page])

  const handleSave = async (collegeId: string) => {
    if (!authApi.isAuthenticated()) {
      toast.error('Please login to save colleges')
      window.location.href = '/login'
      return
    }
    
    if (savedIds.includes(collegeId)) {
      await savedApi.unsaveCollege(collegeId)
      setSavedIds(prev => prev.filter(id => id !== collegeId))
      toast.success('Removed from saved')
    } else {
      await savedApi.saveCollege(collegeId)
      setSavedIds(prev => [...prev, collegeId])
      toast.success('Saved!')
    }
  }

  const cities = ['', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune']
  const types = ['', 'Government', 'Private', 'Deemed']

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="bottom-right" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find Your Perfect College
          </h1>
          <p className="text-gray-600 text-lg">
            Search, compare, and save your favorite colleges
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search colleges by name..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h3 className="text-lg font-bold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-4 hidden lg:block">Filters</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city || 'All Cities'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">College Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type || 'All Types'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <div className="flex gap-2">
                    {[3, 3.5, 4, 4.5].map(rating => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFilters({ ...filters, minRating: rating })}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.minRating === rating
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {rating}+
                      </button>
                    ))}
                    {filters.minRating && (
                      <button
                        onClick={() => setFilters({ ...filters, minRating: undefined })}
                        className="px-3 py-1 rounded-md text-sm bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setFilters({ search: '', city: '', type: '', minRating: undefined })}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Colleges Grid */}
          <div className="flex-1">
            {colleges.length === 0 && !loading ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">No colleges found matching your criteria</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {colleges.map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      onSave={() => handleSave(college.id)}
                      isSaved={savedIds.includes(college.id)}
                    />
                  ))}
                </div>

                {/* Loading indicator */}
                <div className="flex justify-center py-8">
                  {loading && (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  )}
                  {!hasMore && colleges.length > 0 && (
                    <p className="text-gray-500 text-sm">You've seen all colleges</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}