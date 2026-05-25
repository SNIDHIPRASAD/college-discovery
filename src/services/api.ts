import { College, FilterParams, PaginatedResponse } from '@/types'

// Mock college data
const colleges: College[] = [
  {
    id: '1',
    name: 'Indian Institute of Technology Bombay',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    fees: 250000,
    rating: 4.8,
    established: 1958,
    type: 'Government',
    overview: 'Premier engineering institute in India'
  },
  {
    id: '2',
    name: 'Delhi University',
    location: 'Delhi, NCR',
    city: 'Delhi',
    state: 'Delhi',
    fees: 50000,
    rating: 4.5,
    established: 1922,
    type: 'Government',
    overview: 'Leading university for arts and commerce'
  },
  {
    id: '3',
    name: 'Christ University',
    location: 'Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    fees: 150000,
    rating: 4.6,
    established: 1969,
    type: 'Private',
    overview: 'Known for holistic education'
  },
  {
    id: '4',
    name: 'BITS Pilani',
    location: 'Pilani, Rajasthan',
    city: 'Pilani',
    state: 'Rajasthan',
    fees: 400000,
    rating: 4.7,
    established: 1964,
    type: 'Private',
    overview: 'Premier private engineering institute'
  },
  {
    id: '5',
    name: 'IIT Delhi',
    location: 'Delhi, NCR',
    city: 'Delhi',
    state: 'Delhi',
    fees: 220000,
    rating: 4.8,
    established: 1961,
    type: 'Government',
    overview: 'Top engineering institute'
  },
  {
    id: '6',
    name: 'IIM Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    city: 'Ahmedabad',
    state: 'Gujarat',
    fees: 2300000,
    rating: 4.9,
    established: 1961,
    type: 'Government',
    overview: 'Premier management institute'
  }
]

// Add more colleges
for (let i = 7; i <= 30; i++) {
  colleges.push({
    id: String(i),
    name: `Sample College ${i}`,
    location: i % 2 === 0 ? 'Mumbai, Maharashtra' : 'Bangalore, Karnataka',
    city: i % 2 === 0 ? 'Mumbai' : 'Bangalore',
    state: i % 2 === 0 ? 'Maharashtra' : 'Karnataka',
    fees: 50000 + (i * 10000),
    rating: 3 + (i % 20) / 10,
    established: 1950 + i,
    type: i % 3 === 0 ? 'Government' : i % 3 === 1 ? 'Private' : 'Deemed',
    overview: `This is sample college ${i} with good infrastructure`
  })
}

export const collegeApi = {
  getColleges: async (params: FilterParams): Promise<PaginatedResponse<College>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filtered = [...colleges]
    
    // Apply search filter
    if (params.search) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(params.search!.toLowerCase())
      )
    }
    
    // Apply city filter
    if (params.city && params.city !== '') {
      filtered = filtered.filter(c => c.city === params.city)
    }
    
    // Apply type filter
    if (params.type && params.type !== '') {
      filtered = filtered.filter(c => c.type === params.type)
    }
    
    // Apply rating filter
    if (params.minRating) {
      filtered = filtered.filter(c => c.rating >= params.minRating!)
    }
    
    // Pagination
    const page = params.page || 1
    const limit = params.limit || 9
    const start = (page - 1) * limit
    const paginatedData = filtered.slice(start, start + limit)
    
    return {
      data: paginatedData,
      total: filtered.length,
      page: page,
      totalPages: Math.ceil(filtered.length / limit)
    }
  },
  
  getCollegeById: async (id: string): Promise<College> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const college = colleges.find(c => c.id === id)
    if (!college) throw new Error('College not found')
    return college
  }
}

// Simple auth with localStorage
export const authApi = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    if (email && password) {
      const user = { id: '1', email, name: email.split('@')[0] }
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('user', JSON.stringify(user))
      return { token: 'mock-token', user }
    }
    throw new Error('Invalid credentials')
  },
  
  register: async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    const user = { id: '1', email, name }
    localStorage.setItem('token', 'mock-token')
    localStorage.setItem('user', JSON.stringify(user))
    return { token: 'mock-token', user }
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
}

// Saved colleges with localStorage
export const savedApi = {
  getSavedColleges: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const saved = localStorage.getItem('savedColleges')
    const savedIds = saved ? JSON.parse(saved) : []
    return colleges.filter(c => savedIds.includes(c.id))
  },
  
  saveCollege: async (collegeId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const saved = localStorage.getItem('savedColleges')
    let savedIds = saved ? JSON.parse(saved) : []
    if (!savedIds.includes(collegeId)) {
      savedIds.push(collegeId)
      localStorage.setItem('savedColleges', JSON.stringify(savedIds))
    }
    return { success: true }
  },
  
  unsaveCollege: async (collegeId: string) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const saved = localStorage.getItem('savedColleges')
    let savedIds = saved ? JSON.parse(saved) : []
    savedIds = savedIds.filter((id: string) => id !== collegeId)
    localStorage.setItem('savedColleges', JSON.stringify(savedIds))
    return { success: true }
  }
}