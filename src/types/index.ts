export interface College {
  id: string
  name: string
  location: string
  city: string
  state: string
  fees: number
  rating: number
  established: number
  type: string
  overview: string
}

export interface FilterParams {
  search?: string
  city?: string
  type?: string
  minRating?: number
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}