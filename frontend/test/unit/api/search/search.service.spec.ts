import { TestBed } from "@angular/core/testing"
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing"
import { SearchService } from "../../../../src/app/api/search/search.service"
import { City } from "../../../../src/app/api/search/search.interface"
import { ENDPOINTS } from "../../../../src/app/consts/endpoints"
import { citiesMock } from "../../../mocks/data/city.mock"

describe("SearchService", () => {
  let service: SearchService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService]
    })

    service = TestBed.inject(SearchService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it("should be created", () => {
    expect(service).toBeTruthy()
  })

  it("should search for cities", () => {
    const mockCities: City[] = [citiesMock[0]]
    const searchTerm = "London"

    service.search(searchTerm).subscribe(cities => {
      expect(cities).toEqual(mockCities)
    })

    const req = httpMock.expectOne(ENDPOINTS.search(searchTerm))
    expect(req.request.method).toBe("GET")
    req.flush(mockCities)
  })
})
