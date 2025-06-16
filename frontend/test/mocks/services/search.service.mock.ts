import { of } from "rxjs"
import { SearchService } from "../../../src/app/api/search/search.service"

export const searchServiceMockFactory = () =>
  ({
    search: jest.fn().mockReturnValue(of([]))
  }) as never as SearchService
