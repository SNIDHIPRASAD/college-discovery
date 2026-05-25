'use client'

import React, { useState, useEffect } from 'react'
import { CollegeCard } from '@/components/ui/CollegeCard'
import { savedApi, authApi } from '@/services/api'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function SavedPage() {
  const router = useRouter()
  const [savedColleges, setSavedColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push('/login')
      return
    }
    
    loadSaved()
  }, [])

  const loadSaved = async () => {
    try {
      const saved = await savedApi.getSavedColleges()
      setSavedColleges(saved)
    } catch (error) {
      toast.error('Failed to load saved colleges')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsave = async (collegeId: string) => {
    await savedApi.unsaveCollege(collegeId)
    setSavedColleges(prev => prev.filter(c => c.id !== collegeId))
    toast.success('Removed from saved')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="bottom-right" />
      
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Colleges</h1>
        <p className="text-gray-600 mb-8">Colleges you've saved for later</p>

        {savedColleges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No saved colleges yet</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Browse Colleges
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onSave={() => handleUnsave(college.id)}
                isSaved={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}