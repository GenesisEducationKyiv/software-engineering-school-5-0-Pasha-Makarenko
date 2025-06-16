import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { SearchComponent } from "../../../../src/app/components/search/search.component"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ModalComponent } from "../../../../src/app/components/modal/modal.component"
import { CityPipe } from "../../../../src/app/pipes/city.pipe"
import { SearchService } from "../../../../src/app/api/search/search.service"
import { provideMockStore } from "@ngrx/store/testing"
import { citiesMock } from "../../../mocks/data/city.mock"

describe("SearchComponent", () => {
  let component: SearchComponent
  let fixture: ComponentFixture<SearchComponent>
  let searchService: SearchService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchComponent,
        ModalComponent,
        CityPipe,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [provideMockStore(), SearchService]
    }).compileComponents()

    fixture = TestBed.createComponent(SearchComponent)
    component = fixture.componentInstance
    searchService = TestBed.inject(SearchService)
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize with empty data", () => {
    expect(component.data()).toEqual([])
  })

  it("should call search service on value changes", () => {
    const spy = jest.spyOn(searchService, "search")
    const searchControl = new FormControl<string | null>(null)
    component.searchControl = jest.fn(() => searchControl) as never
    component.options = jest.fn(() => ({ delay: 300, save: true })) as never

    component.ngOnInit()
    searchControl.setValue(citiesMock[0].name)

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(citiesMock[0].name)
    }, 300)
  })

  it("should select city and emit event", () => {
    const mockCities = citiesMock

    const emitSpy = jest.spyOn(component.selectOutput, "emit")
    const searchControl = new FormControl<string | null>(null)
    component.searchControl = jest.fn(() => searchControl) as never
    component.options = jest.fn(() => ({ delay: 300, save: true })) as never

    component.data.set(mockCities)
    component.select(0)

    expect(searchControl.value).toBe(mockCities[0].name)
    expect(component.data()).toEqual([])
    expect(emitSpy).toHaveBeenCalledWith(mockCities[0])
  })
})
