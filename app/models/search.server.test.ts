import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSearchResults, SEARCH_WILDCARD } from './search.server'
import { SearchResultEnum } from '~/routes/search/searchResultEnum'
import type { SearchActionSchema } from '~/routes/search'
import { getEntriesByBasicTextSearch } from './search/getEntriesByBasicTextSearch'
import { getSearchResultMeanings } from './search/getSearchResultMeanings'
import { getSearchResultCanadianisms } from './search/getSearchResultCanadianisms'
import { getSearchResultUsageNotes } from './search/getSearchResultUsageNotes'
import { getSearchResultFistNotes } from './search/getSearchResultFistNotes'
import { getSearchResultQuotations } from './search/getSearchResultQuotations'
import { getCounts } from './search/getCounts.server'

// search.server imports calculatePageSkip from entry.server, which constructs a
// PrismaClient at import time. Mock the client so the suite needs no DATABASE_URL.
vi.mock('~/db.server', () => ({
  prisma: {}
}))

// Mock all the search functions
vi.mock('./search/getEntriesByBasicTextSearch', () => ({
  getEntriesByBasicTextSearch: vi.fn()
}))

vi.mock('./search/getSearchResultMeanings', () => ({
  getSearchResultMeanings: vi.fn()
}))

vi.mock('./search/getSearchResultCanadianisms', () => ({
  getSearchResultCanadianisms: vi.fn()
}))

vi.mock('./search/getSearchResultUsageNotes', () => ({
  getSearchResultUsageNotes: vi.fn()
}))

vi.mock('./search/getSearchResultFistNotes', () => ({
  getSearchResultFistNotes: vi.fn()
}))

vi.mock('./search/getSearchResultQuotations', () => ({
  getSearchResultQuotations: vi.fn()
}))

vi.mock('./search/getCounts.server', () => ({
  getCounts: vi.fn()
}))

describe('getSearchResults', () => {
  const mockSearchParams: SearchActionSchema = {
    searchTerm: 'test',
    database: ['dchp3'],
    canadianismType: ['1. Origin'],
    editingStatus: [],
    nonCanadianism: false,
    caseSensitive: false,
    page: 1,
    attribute: SearchResultEnum.HEADWORD
  }

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

  it('should return headword search results by default', async () => {
    const mockEntries = [
      { id: 1, headword: 'test1', dchp_version: 'dchp3' },
      { id: 2, headword: 'test2', dchp_version: 'dchp3' }
    ]
    
    vi.mocked(getEntriesByBasicTextSearch).mockResolvedValue(mockEntries as any)

    const result = await getSearchResults(mockSearchParams, false)

    expect(result.counts).toEqual(mockCounts)
    expect(result.data.type).toBe(SearchResultEnum.HEADWORD)
    expect(result.data.entries).toEqual(mockEntries)
    expect(getEntriesByBasicTextSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        searchTerm: 'test',
        database: ['dchp3'],
        canadianismTypes: ['1. Origin'],
        versions: ['dchp3'],
        isUserAdmin: false,
        skip: 0,
        take: 100
      })
    )
  })

  it('should return meaning search results when attribute is MEANING', async () => {
    const params = { ...mockSearchParams, attribute: SearchResultEnum.MEANING }
    const mockMeanings = [
      { id: 1, definition: 'test definition', entry: { headword: 'test1' } }
    ]
    
    vi.mocked(getSearchResultMeanings).mockResolvedValue(mockMeanings as any)

    const result = await getSearchResults(params, false)

    expect(result.data.type).toBe(SearchResultEnum.MEANING)
    expect(result.data.entries).toEqual(mockMeanings)
    expect(getSearchResultMeanings).toHaveBeenCalled()
  })

  it('should return canadianism search results when attribute is CANADIANISM', async () => {
    const params = { ...mockSearchParams, attribute: SearchResultEnum.CANADIANISM }
    const mockCanadianisms = [
      { id: 1, canadianism: 'test canadianism', headword: 'test1' }
    ]
    
    vi.mocked(getSearchResultCanadianisms).mockResolvedValue(mockCanadianisms as any)

    const result = await getSearchResults(params, false)

    expect(result.data.type).toBe(SearchResultEnum.CANADIANISM)
    expect(result.data.entries).toEqual(mockCanadianisms)
    expect(getSearchResultCanadianisms).toHaveBeenCalled()
  })

  it('should return usage note search results when attribute is USAGE_NOTE', async () => {
    const params = { ...mockSearchParams, attribute: SearchResultEnum.USAGE_NOTE }
    const mockUsageNotes = [
      { id: 1, usage: 'test usage', headword: 'test1', partOfSpeech: 'noun' }
    ]
    
    vi.mocked(getSearchResultUsageNotes).mockResolvedValue(mockUsageNotes as any)

    const result = await getSearchResults(params, false)

    expect(result.data.type).toBe(SearchResultEnum.USAGE_NOTE)
    expect(result.data.entries).toEqual(mockUsageNotes)
    expect(getSearchResultUsageNotes).toHaveBeenCalled()
  })

  it('should return fist note search results when attribute is FIST_NOTE', async () => {
    const params = { ...mockSearchParams, attribute: SearchResultEnum.FIST_NOTE }
    const mockFistNotes = [
      { id: 1, fistNote: 'test fist note', headword: 'test1' }
    ]
    
    vi.mocked(getSearchResultFistNotes).mockResolvedValue(mockFistNotes as any)

    const result = await getSearchResults(params, false)

    expect(result.data.type).toBe(SearchResultEnum.FIST_NOTE)
    expect(result.data.entries).toEqual(mockFistNotes)
    expect(getSearchResultFistNotes).toHaveBeenCalled()
  })

  it('should return quotation search results when attribute is QUOTATION', async () => {
    const params = { ...mockSearchParams, attribute: SearchResultEnum.QUOTATION }
    const mockQuotations = [
      { id: 1, text: 'test quotation', headword: 'test1', date: '2020', see_also_links: '' }
    ]
    
    vi.mocked(getSearchResultQuotations).mockResolvedValue(mockQuotations as any)

    const result = await getSearchResults(params, false)

    expect(result.data.type).toBe(SearchResultEnum.QUOTATION)
    expect(result.data.entries).toEqual(mockQuotations)
    expect(getSearchResultQuotations).toHaveBeenCalled()
  })

  it('should use default database versions when not provided', async () => {
    const params = { ...mockSearchParams, database: undefined as any }
    const mockEntries = [{ id: 1, headword: 'test', dchp_version: 'dchp3' }]
    
    vi.mocked(getEntriesByBasicTextSearch).mockResolvedValue(mockEntries as any)

    await getSearchResults(params, false)

    expect(getEntriesByBasicTextSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        versions: ['dchp1', 'dchp2', 'dchp3']
      })
    )
  })

  it('should use all canadianism types when not provided', async () => {
    const params = { ...mockSearchParams, canadianismType: undefined as any }
    const mockEntries = [{ id: 1, headword: 'test', dchp_version: 'dchp3' }]
    
    vi.mocked(getEntriesByBasicTextSearch).mockResolvedValue(mockEntries as any)

    await getSearchResults(params, false)

    expect(getEntriesByBasicTextSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        canadianismTypes: ['1. Origin', '2. Preservation', '3. Semantic Change', '4. Culturally Significant', '5. Frequency', '6. Memorial']
      })
    )
  })

  it('should handle wildcard searches', async () => {
    const params = { ...mockSearchParams, searchTerm: SEARCH_WILDCARD }
    const mockEntries = [{ id: 1, headword: 'test', dchp_version: 'dchp3' }]
    
    vi.mocked(getEntriesByBasicTextSearch).mockResolvedValue(mockEntries as any)

    await getSearchResults(params, false)

    expect(getEntriesByBasicTextSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        searchTerm: SEARCH_WILDCARD
      })
    )
  })

  it('should handle admin users', async () => {
    const mockEntries = [{ id: 1, headword: 'test', dchp_version: 'dchp3' }]
    
    vi.mocked(getEntriesByBasicTextSearch).mockResolvedValue(mockEntries as any)

    await getSearchResults(mockSearchParams, true)

    expect(getEntriesByBasicTextSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        isUserAdmin: true
      })
    )
  })

  it('should handle case sensitive searches', async () => {
    const params = { ...mockSearchParams, caseSensitive: true }
    const mockEntries = [{ id: 1, headword: 'test', dchp_version: 'dchp3' }]
    
    vi.mocked(getEntriesByBasicTextSearch).mockResolvedValue(mockEntries as any)

    await getSearchResults(params, false)

    expect(getEntriesByBasicTextSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        caseSensitive: true
      })
    )
  })

  it('should handle pagination correctly', async () => {
    const params = { ...mockSearchParams, page: 3 }
    const mockEntries = [{ id: 1, headword: 'test', dchp_version: 'dchp3' }]
    
    vi.mocked(getEntriesByBasicTextSearch).mockResolvedValue(mockEntries as any)

    await getSearchResults(params, false)

    expect(getEntriesByBasicTextSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 200, // (page 3 - 1) * 100 = 200
        take: 100
      })
    )
  })
})