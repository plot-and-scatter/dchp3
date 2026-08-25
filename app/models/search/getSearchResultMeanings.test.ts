import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSearchResultMeanings, getMeaningsCount } from './getSearchResultMeanings'
import type { SearchResultParams } from '../search.server'
import { prisma } from '~/db.server'
import { SEARCH_WILDCARD } from '../search.server'

// Mock prisma
vi.mock('~/db.server', () => ({
  prisma: {
    meaning: {
      findMany: vi.fn(),
      count: vi.fn()
    }
  }
}))

describe('getSearchResultMeanings', () => {
  const mockParams: SearchResultParams = {
    searchTerm: 'test definition',
    database: ['dchp3'],
    canadianismType: ['1. Origin', '2. Preservation'],
    editingStatus: [],
    nonCanadianism: false,
    caseSensitive: false,
    page: 1,
    attribute: 'meaning',
    isUserAdmin: false,
    take: 100,
    skip: 0,
    canadianismTypes: ['1. Origin', '2. Preservation'],
    versions: ['dchp3']
  }

  const mockMeanings = [
    {
      id: 1,
      definition: 'test definition 1',
      entry: { headword: 'test1' }
    },
    {
      id: 2,
      definition: 'test definition 2',
      entry: { headword: 'test2' }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return meanings with proper search criteria', async () => {
    vi.mocked(prisma.meaning.findMany).mockResolvedValue(mockMeanings as any)

    const result = await getSearchResultMeanings(mockParams)

    expect(result).toEqual(mockMeanings)
    expect(prisma.meaning.findMany).toHaveBeenCalledWith({
      where: {
        entry: {
          is_public: true,
          no_cdn_conf: false,
          dchp_version: { in: ['dchp3'] },
        },
        definition: {
          contains: 'test definition'
        },
        canadianism_type: {
          in: ['1. Origin', '2. Preservation']
        }
      },
      select: {
        entry: { select: { headword: true } },
        definition: true,
        id: true,
      },
      skip: 0,
      take: 100
    })
  })

  it('should handle wildcard search', async () => {
    const params = { ...mockParams, searchTerm: SEARCH_WILDCARD }
    vi.mocked(prisma.meaning.findMany).mockResolvedValue(mockMeanings as any)

    await getSearchResultMeanings(params)

    expect(prisma.meaning.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          definition: {
            contains: ''
          }
        })
      })
    )
  })

  it('should not filter by canadianism_type when all types are selected', async () => {
    const params = { 
      ...mockParams, 
      canadianismType: ['1. Origin', '2. Preservation', '3. Semantic Change', '4. Culturally Significant', '5. Frequency', '6. Memorial'],
      canadianismTypes: ['1. Origin', '2. Preservation', '3. Semantic Change', '4. Culturally Significant', '5. Frequency', '6. Memorial']
    }
    vi.mocked(prisma.meaning.findMany).mockResolvedValue(mockMeanings as any)

    await getSearchResultMeanings(params)

    expect(prisma.meaning.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.not.objectContaining({
          canadianism_type: expect.anything()
        })
      })
    )
  })

  it('should handle non-canadianism filter', async () => {
    const params = { ...mockParams, nonCanadianism: true }
    vi.mocked(prisma.meaning.findMany).mockResolvedValue(mockMeanings as any)

    await getSearchResultMeanings(params)

    expect(prisma.meaning.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          entry: expect.objectContaining({
            no_cdn_conf: true
          })
        })
      })
    )
  })

  it('should handle editing status filters', async () => {
    const params = { 
      ...mockParams, 
      editingStatus: ['first_draft', 'revised_draft']
    }
    vi.mocked(prisma.meaning.findMany).mockResolvedValue(mockMeanings as any)

    await getSearchResultMeanings(params)

    expect(prisma.meaning.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          entry: expect.objectContaining({
            OR: [
              { first_draft: true },
              { revised_draft: true }
            ]
          })
        })
      })
    )
  })

  it('should handle pagination', async () => {
    const params = { ...mockParams, skip: 50, take: 10 }
    vi.mocked(prisma.meaning.findMany).mockResolvedValue(mockMeanings as any)

    await getSearchResultMeanings(params)

    expect(prisma.meaning.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 50,
        take: 10
      })
    )
  })

  it('should return empty array when no results found', async () => {
    vi.mocked(prisma.meaning.findMany).mockResolvedValue([])

    const result = await getSearchResultMeanings(mockParams)

    expect(result).toEqual([])
  })
})

describe('getMeaningsCount', () => {
  const mockParams: SearchResultParams = {
    searchTerm: 'test definition',
    database: ['dchp3'],
    canadianismType: ['1. Origin'],
    editingStatus: [],
    nonCanadianism: false,
    caseSensitive: false,
    page: 1,
    attribute: 'meaning',
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
    vi.mocked(prisma.meaning.count).mockResolvedValue(42)

    const result = await getMeaningsCount(mockParams)

    expect(result).toBe(42)
    expect(prisma.meaning.count).toHaveBeenCalledWith({
      where: {
        entry: {
          is_public: true,
          no_cdn_conf: false,
          dchp_version: { in: ['dchp3'] },
        },
        definition: {
          contains: 'test definition'
        },
        canadianism_type: {
          in: ['1. Origin']
        }
      }
    })
  })

  it('should handle wildcard search in count', async () => {
    const params = { ...mockParams, searchTerm: SEARCH_WILDCARD }
    vi.mocked(prisma.meaning.count).mockResolvedValue(100)

    const result = await getMeaningsCount(params)

    expect(result).toBe(100)
    expect(prisma.meaning.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          definition: {
            contains: ''
          }
        })
      })
    )
  })

  it('should return 0 when no matches found', async () => {
    vi.mocked(prisma.meaning.count).mockResolvedValue(0)

    const result = await getMeaningsCount(mockParams)

    expect(result).toBe(0)
  })
})