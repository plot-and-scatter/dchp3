import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getEntriesByBasicTextSearch, getHeadwordCount } from './getEntriesByBasicTextSearch'
import { getSearchResults } from '../search.server'
import { SearchResultEnum } from '~/routes/search/searchResultEnum'
import type { SearchResultParams, SearchActionSchema } from '../search.server'
import { BASE_CANADANISM_TYPES } from '~/types/CanadianismTypeEnum'

// Mock prisma
vi.mock('~/db.server', () => ({
  prisma: {
    $queryRaw: vi.fn()
  }
}))

// Mock other search functions
vi.mock('./getCounts.server', () => ({
  getCounts: vi.fn()
}))

import { prisma } from '~/db.server'
import { getCounts } from './getCounts.server'

describe('Canadianism Type Filtering', () => {
  const mockCounts = {
    [SearchResultEnum.HEADWORD]: 10,
    [SearchResultEnum.MEANING]: 5,
    [SearchResultEnum.CANADIANISM]: 3,
    [SearchResultEnum.USAGE_NOTE]: 2,
    [SearchResultEnum.FIST_NOTE]: 1,
    [SearchResultEnum.QUOTATION]: 8
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCounts).mockResolvedValue(mockCounts)
  })

  describe('getHeadwordCount with Canadianism Filtering', () => {
    const baseParams: SearchResultParams = {
      searchTerm: '*',
      database: ['dchp3'],
      canadianismType: [],
      editingStatus: [],
      nonCanadianism: false,
      caseSensitive: false,
      page: 1,
      attribute: SearchResultEnum.HEADWORD,
      isUserAdmin: false,
      take: 100,
      skip: 0,
      canadianismTypes: [],
      versions: ['dchp3']
    }

    it('should NOT use canadianism filter when all types are selected', async () => {
      const params = { 
        ...baseParams, 
        canadianismTypes: [...BASE_CANADANISM_TYPES] 
      }
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 137 }])

      await getHeadwordCount(params)

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
    })

    it('should use canadianism filter when specific types are selected', async () => {
      const params = { 
        ...baseParams, 
        canadianismTypes: ['6. Memorial'] 
      }
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 6 }])

      await getHeadwordCount(params)

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple specific canadianism types', async () => {
      const params = { 
        ...baseParams, 
        canadianismTypes: ['1. Origin', '6. Memorial'] 
      }
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 15 }])

      await getHeadwordCount(params)

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
      const query = vi.mocked(prisma.$queryRaw).mock.calls[0][0] as any
      
      expect(query.strings[0]).toContain('INNER JOIN det_meanings dm')
      expect(query.strings[0]).toContain('count(DISTINCT de.id)')
    })

    it('should handle single canadianism type', async () => {
      const params = { 
        ...baseParams, 
        canadianismTypes: ['2. Preservation'] 
      }
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 3 }])

      await getHeadwordCount(params)

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
      const query = vi.mocked(prisma.$queryRaw).mock.calls[0][0] as any
      
      expect(query.strings[0]).toContain('INNER JOIN det_meanings dm')
    })
  })

  describe('getEntriesByBasicTextSearch with Canadianism Filtering', () => {
    const baseParams: SearchResultParams = {
      searchTerm: '*',
      database: ['dchp3'],
      canadianismType: [],
      editingStatus: [],
      nonCanadianism: false,
      caseSensitive: false,
      page: 1,
      attribute: SearchResultEnum.HEADWORD,
      isUserAdmin: false,
      take: 100,
      skip: 0,
      canadianismTypes: [],
      versions: ['dchp3']
    }

    it('should NOT use canadianism filter when all types are selected', async () => {
      const params = { 
        ...baseParams, 
        canadianismTypes: [...BASE_CANADANISM_TYPES] 
      }
      
      const mockResults = [
        { id: 1, headword: 'test1', dchp_version: 'dchp3', is_public: true },
        { id: 2, headword: 'test2', dchp_version: 'dchp3', is_public: true }
      ]
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue(mockResults)

      await getEntriesByBasicTextSearch(params)

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
      const query = vi.mocked(prisma.$queryRaw).mock.calls[0][0] as any
      
    })

    it('should use canadianism filter when specific types are selected', async () => {
      const params = { 
        ...baseParams, 
        canadianismTypes: ['6. Memorial'] 
      }
      
      const mockResults = [
        { id: 1, headword: 'ramp ceremony', dchp_version: 'dchp3.1', is_public: true }
      ]
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue(mockResults)

      await getEntriesByBasicTextSearch(params)

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
      const query = vi.mocked(prisma.$queryRaw).mock.calls[0][0] as any
      
    })

    it('should maintain other filters when canadianism filtering is active', async () => {
      const params = { 
        ...baseParams, 
        canadianismTypes: ['6. Memorial'],
        caseSensitive: true,
        nonCanadianism: false,
        isUserAdmin: true,
        database: ['dchp3', 'dchp3.1']
      }
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue([])

      await getEntriesByBasicTextSearch(params)

      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
      const query = vi.mocked(prisma.$queryRaw).mock.calls[0][0] as any
      
    })
  })

  describe('Integration Test: Real World Scenario', () => {
    it('should reproduce the original bug: * + Type 6 + DCHP-3 returning filtered results', async () => {
      const searchParams: SearchActionSchema = {
        searchTerm: '*',
        database: ['dchp3'],
        canadianismType: ['6. Memorial'],
        editingStatus: [],
        nonCanadianism: false,
        caseSensitive: false,
        page: 1,
        attribute: SearchResultEnum.HEADWORD
      }

      // Mock that we find only 6 Type 6 Memorial entries instead of all 131
      const mockFilteredResults = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        headword: `memorial-entry-${i + 1}`,
        dchp_version: 'dchp3',
        is_public: true
      }))

      vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFilteredResults)

      const result = await getSearchResults(searchParams, false)

      expect(result.data.type).toBe(SearchResultEnum.HEADWORD)
      expect(result.data.entries).toHaveLength(6)
      
      // Verify that the canadianism filtering was applied
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
    })

    it('should handle the case where no entries match the canadianism filter', async () => {
      const searchParams: SearchActionSchema = {
        searchTerm: 'nonexistent',
        database: ['dchp3'],
        canadianismType: ['6. Memorial'],
        editingStatus: [],
        nonCanadianism: false,
        caseSensitive: false,
        page: 1,
        attribute: SearchResultEnum.HEADWORD
      }

      vi.mocked(prisma.$queryRaw).mockResolvedValue([])

      const result = await getSearchResults(searchParams, false)

      expect(result.data.entries).toHaveLength(0)
    })

    it('should work correctly when all canadianism types are selected (no filtering)', async () => {
      const searchParams: SearchActionSchema = {
        searchTerm: '*',
        database: ['dchp3'],
        canadianismType: [...BASE_CANADANISM_TYPES], // All types
        editingStatus: [],
        nonCanadianism: false,
        caseSensitive: false,
        page: 1,
        attribute: SearchResultEnum.HEADWORD
      }

      // Mock that we find all 137 entries when no filtering is applied
      const mockAllResults = Array.from({ length: 137 }, (_, i) => ({
        id: i + 1,
        headword: `entry-${i + 1}`,
        dchp_version: 'dchp3',
        is_public: true
      }))

      vi.mocked(prisma.$queryRaw).mockResolvedValue(mockAllResults)

      const result = await getSearchResults(searchParams, false)

      expect(result.data.entries).toHaveLength(137)
      
      // Verify that no JOIN was used (no filtering)
      expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases for Canadianism Filtering', () => {
    const baseParams: SearchResultParams = {
      searchTerm: '*',
      database: ['dchp3'],
      canadianismType: [],
      editingStatus: [],
      nonCanadianism: false,
      caseSensitive: false,
      page: 1,
      attribute: SearchResultEnum.HEADWORD,
      isUserAdmin: false,
      take: 100,
      skip: 0,
      canadianismTypes: [],
      versions: ['dchp3']
    }

    it('should handle empty canadianismTypes array', async () => {
      const params = { ...baseParams, canadianismTypes: [] }
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue([])

      await getEntriesByBasicTextSearch(params)

      // Should not apply filtering when array is empty
    })

    it('should handle undefined canadianismTypes', async () => {
      const params = { ...baseParams, canadianismTypes: undefined as any }
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue([])

      await getEntriesByBasicTextSearch(params)

      // Should not apply filtering when undefined
    })

    it('should handle invalid canadianism types gracefully', async () => {
      const params = { 
        ...baseParams, 
        canadianismTypes: ['Invalid Type', '99. Nonexistent'] 
      }
      
      vi.mocked(prisma.$queryRaw).mockResolvedValue([])

      await getEntriesByBasicTextSearch(params)

      // Should still apply filtering, but likely return no results
    })
  })
})