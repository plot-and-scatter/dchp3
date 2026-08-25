import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSearchResultFistNotes, getFistNotesCount } from './getSearchResultFistNotes'
import type { SearchResultParams } from '../search.server'
import { prisma } from '~/db.server'
import { SEARCH_WILDCARD } from '../search.server'

// Mock prisma
vi.mock('~/db.server', () => ({
  prisma: {
    $queryRaw: vi.fn()
  }
}))

describe('getSearchResultFistNotes', () => {
  const mockParams: SearchResultParams = {
    searchTerm: 'test fist note',
    database: ['dchp3'],
    canadianismType: ['1. Origin'],
    editingStatus: [],
    nonCanadianism: false,
    caseSensitive: false,
    page: 1,
    attribute: 'fist_note',
    isUserAdmin: false,
    take: 100,
    skip: 0,
    canadianismTypes: ['1. Origin'],
    versions: ['dchp3']
  }

  const mockFistNotes = [
    { headword: 'test1', fistNote: 'test fist note 1', id: 1 },
    { headword: 'test2', fistNote: 'test fist note 2', id: 2 }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return fist notes with proper search criteria', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFistNotes)

    const result = await getSearchResultFistNotes(mockParams)

    expect(result).toEqual(mockFistNotes)
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('should handle wildcard search', async () => {
    const params = { ...mockParams, searchTerm: SEARCH_WILDCARD }
    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFistNotes)

    await getSearchResultFistNotes(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('should handle case sensitive search', async () => {
    const params = { ...mockParams, caseSensitive: true }
    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFistNotes)

    await getSearchResultFistNotes(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('should handle pagination', async () => {
    const params = { ...mockParams, skip: 50, take: 10 }
    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFistNotes)

    await getSearchResultFistNotes(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('should handle non-canadianism filter', async () => {
    const params = { ...mockParams, nonCanadianism: true }
    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFistNotes)

    await getSearchResultFistNotes(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('should handle admin users', async () => {
    const params = { ...mockParams, isUserAdmin: true }
    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFistNotes)

    await getSearchResultFistNotes(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple database versions', async () => {
    const params = { 
      ...mockParams, 
      database: ['dchp1', 'dchp2', 'dchp3'],
      versions: ['dchp1', 'dchp2', 'dchp3']
    }
    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFistNotes)

    await getSearchResultFistNotes(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('should handle editing status filters', async () => {
    const params = { 
      ...mockParams, 
      editingStatus: ['first_draft', 'revised_draft']
    }
    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFistNotes)

    await getSearchResultFistNotes(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('should return empty array when no results found', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([])

    const result = await getSearchResultFistNotes(mockParams)

    expect(result).toEqual([])
  })
})

describe('getFistNotesCount', () => {
  const mockParams: SearchResultParams = {
    searchTerm: 'test fist note',
    database: ['dchp3'],
    canadianismType: ['1. Origin'],
    editingStatus: [],
    nonCanadianism: false,
    caseSensitive: false,
    page: 1,
    attribute: 'fist_note',
    isUserAdmin: false,
    take: 100,
    skip: 0,
    canadianismTypes: ['1. Origin'],
    versions: ['dchp3']
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return count with proper search criteria', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 42 }])

    const result = await getFistNotesCount(mockParams)

    expect(result).toEqual([{ count: 42 }])
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('should handle wildcard search in count', async () => {
    const params = { ...mockParams, searchTerm: SEARCH_WILDCARD }
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 100 }])

    const result = await getFistNotesCount(params)

    expect(result).toEqual([{ count: 100 }])
  })

  it('should handle case sensitive count', async () => {
    const params = { ...mockParams, caseSensitive: true }
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 5 }])

    const result = await getFistNotesCount(params)

    expect(result).toEqual([{ count: 5 }])
  })

  it('should return 0 count when no matches found', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 0 }])

    const result = await getFistNotesCount(mockParams)

    expect(result).toEqual([{ count: 0 }])
  })
})