import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loader } from './search'
import { getSearchResults } from '~/models/search.server'
import { userHasPermission } from '~/services/auth/session.server'
import { SearchResultEnum } from './search/searchResultEnum'

// Mock dependencies
vi.mock('~/models/search.server', () => ({
  getSearchResults: vi.fn()
}))

vi.mock('~/services/auth/session.server', () => ({
  userHasPermission: vi.fn()
}))

describe('search route loader', () => {
  const mockRequest = (searchParams: URLSearchParams) => ({
    url: `http://localhost:3000/search?${searchParams.toString()}`
  }) as Request

  // The loader's schema requires searchTerm, a non-empty database list and an
  // attribute. A request missing any of them fails validation and returns
  // before getSearchResults is reached.
  const buildSearchParams = ({
    searchTerm = 'test',
    database = ['dchp3'],
    canadianismType = [],
    editingStatus = [],
    attribute = SearchResultEnum.HEADWORD,
    page,
    caseSensitive,
    nonCanadianism
  }: {
    searchTerm?: string
    database?: string[]
    canadianismType?: string[]
    editingStatus?: string[]
    attribute?: string
    page?: string
    caseSensitive?: string
    nonCanadianism?: string
  } = {}) => {
    const searchParams = new URLSearchParams()
    searchParams.set('searchTerm', searchTerm)
    searchParams.set('attribute', attribute)
    database.forEach((value) => searchParams.append('database', value))
    canadianismType.forEach((value) =>
      searchParams.append('canadianismType', value)
    )
    editingStatus.forEach((value) =>
      searchParams.append('editingStatus', value)
    )
    if (page !== undefined) searchParams.set('page', page)
    if (caseSensitive !== undefined) {
      searchParams.set('caseSensitive', caseSensitive)
    }
    if (nonCanadianism !== undefined) {
      searchParams.set('nonCanadianism', nonCanadianism)
    }
    return searchParams
  }

  const mockSearchResults = {
    counts: {
      [SearchResultEnum.HEADWORD]: 10,
      [SearchResultEnum.MEANING]: 5,
      [SearchResultEnum.CANADIANISM]: 3,
      [SearchResultEnum.USAGE_NOTE]: 2,
      [SearchResultEnum.FIST_NOTE]: 1,
      [SearchResultEnum.QUOTATION]: 8
    },
    data: {
      type: SearchResultEnum.HEADWORD,
      entries: [
        { id: 1, headword: 'test1', dchp_version: 'dchp3' },
        { id: 2, headword: 'test2', dchp_version: 'dchp3' }
      ]
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(userHasPermission).mockResolvedValue(false)
    vi.mocked(getSearchResults).mockResolvedValue(mockSearchResults as any)
  })

  it('should return isUserAdmin false when user is not admin', async () => {
    vi.mocked(userHasPermission).mockResolvedValue(false)
    const searchParams = new URLSearchParams({
      searchTerm: 'test'
    })

    const result = await loader({ request: mockRequest(searchParams) } as any)

    expect(userHasPermission).toHaveBeenCalledWith(expect.any(Object), 'det:viewEdits')
    expect(result.isUserAdmin).toBe(false)
  })

  it('should return isUserAdmin true when user is admin', async () => {
    vi.mocked(userHasPermission).mockResolvedValue(true)
    const searchParams = new URLSearchParams({
      searchTerm: 'test'
    })

    const result = await loader({ request: mockRequest(searchParams) } as any)

    expect(result.isUserAdmin).toBe(true)
  })

  it('should return search results when valid search term provided', async () => {
    const searchParams = new URLSearchParams({
      searchTerm: 'test',
      'database[]': 'dchp3',
      'canadianismType[]': '1. Origin',
      attribute: SearchResultEnum.HEADWORD
    })

    const result = await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).toHaveBeenCalledWith(
      expect.objectContaining({
        searchTerm: 'test',
        database: ['dchp3'],
        canadianismType: ['1. Origin'],
        attribute: SearchResultEnum.HEADWORD
      }),
      false
    )
    expect(result.searchResults).toEqual(mockSearchResults)
    expect(result.searchParams).toBeDefined()
    expect(result.url).toBeDefined()
  })

  it('should handle multiple database selections', async () => {
    const searchParams = buildSearchParams({
      database: ['dchp1', 'dchp2', 'dchp3']
    })

    const result = await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).toHaveBeenCalledWith(
      expect.objectContaining({ database: ['dchp1', 'dchp2', 'dchp3'] }),
      false
    )
    expect(result.searchResults).toBeDefined()
  })

  it('should handle multiple canadianism type selections', async () => {
    const searchParams = buildSearchParams({
      canadianismType: ['1. Origin', '2. Preservation', '6. Memorial']
    })

    await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).toHaveBeenCalledWith(
      expect.objectContaining({
        canadianismType: ['1. Origin', '2. Preservation', '6. Memorial']
      }),
      false
    )
  })

  it('should handle case sensitive search', async () => {
    const searchParams = buildSearchParams({
      searchTerm: 'Test',
      caseSensitive: 'on'
    })

    await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).toHaveBeenCalledWith(
      expect.objectContaining({ searchTerm: 'Test', caseSensitive: true }),
      false
    )
  })

  it('should handle non-canadianism filter', async () => {
    const searchParams = buildSearchParams({ nonCanadianism: 'on' })

    await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).toHaveBeenCalledWith(
      expect.objectContaining({ nonCanadianism: true }),
      false
    )
  })

  it('should handle pagination', async () => {
    const searchParams = buildSearchParams({ page: '3' })

    await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).toHaveBeenCalledWith(
      expect.objectContaining({ page: 3 }),
      false
    )
  })

  it('should handle different search attributes', async () => {
    const searchParams = buildSearchParams({
      attribute: SearchResultEnum.MEANING
    })

    await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).toHaveBeenCalledWith(
      expect.objectContaining({ attribute: SearchResultEnum.MEANING }),
      false
    )
  })

  it('should handle wildcard search', async () => {
    const searchParams = buildSearchParams({ searchTerm: '*' })

    await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).toHaveBeenCalledWith(
      expect.objectContaining({ searchTerm: '*' }),
      false
    )
  })

  it('should return only isUserAdmin when no search term provided', async () => {
    const searchParams = new URLSearchParams()

    const result = await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).not.toHaveBeenCalled()
    expect(result.isUserAdmin).toBeDefined()
    expect(result.searchResults).toBeUndefined()
    expect(result.searchParams).toBeUndefined()
  })

  it('should return only isUserAdmin when search validation fails', async () => {
    const searchParams = new URLSearchParams({
      searchTerm: '' // Empty search term should fail validation
    })

    const result = await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).not.toHaveBeenCalled()
    expect(result.isUserAdmin).toBeDefined()
    expect(result.searchResults).toBeUndefined()
    expect(result.searchParams).toBeUndefined()
  })

  it('should handle editing status filters when user is admin', async () => {
    vi.mocked(userHasPermission).mockResolvedValue(true)
    const searchParams = buildSearchParams({
      editingStatus: ['first_draft', 'revised_draft']
    })

    await loader({ request: mockRequest(searchParams) } as any)

    expect(getSearchResults).toHaveBeenCalledWith(
      expect.objectContaining({
        editingStatus: ['first_draft', 'revised_draft']
      }),
      true
    )
  })
})