import { HomeComponent } from "../../../../src/app/pages/home/home.component"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { WeatherAdapter } from "../../../../src/app/store/weather/weather.adapter"
import { CityAdapter } from "../../../../src/app/store/city/city.adapter"
import { provideMockStore } from "@ngrx/store/testing"
import { weatherStateMock } from "../../../mocks/data/weather.mock"
import { weatherAdapterMockFactory } from "../../../mocks/adapters/weather.adapter.mock"
import { cityAdapterMockFactory } from "../../../mocks/adapters/city.adapter.mock"
import { SearchComponent } from "../../../../src/app/components/search/search.component"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ModalAdapter } from "../../../../src/app/store/modal/modal.adapter"
import { SearchService } from "../../../../src/app/api/search/search.service"
import { modalAdapterMockFactory } from "../../../mocks/adapters/modal.adapter.mock"
import { searchServiceMockFactory } from "../../../mocks/services/search.service.mock"

describe("HomeComponent", () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>
  let weatherAdapter: jest.Mocked<Partial<WeatherAdapter>>
  let cityAdapter: jest.Mocked<Partial<CityAdapter>>
  let modalAdapter: jest.Mocked<Partial<ModalAdapter>>
  let searchService: jest.Mocked<Partial<SearchService>>

  beforeEach(async () => {
    weatherAdapter = weatherAdapterMockFactory()
    cityAdapter = cityAdapterMockFactory()
    modalAdapter = modalAdapterMockFactory()
    searchService = searchServiceMockFactory()

    await TestBed.configureTestingModule({
      imports: [HomeComponent, SearchComponent, HttpClientTestingModule],
      providers: [
        { provide: WeatherAdapter, useValue: weatherAdapter },
        { provide: CityAdapter, useValue: cityAdapter },
        { provide: ModalAdapter, useValue: modalAdapter },
        { provide: SearchService, useValue: searchService },
        provideMockStore()
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should handle weather data loading states", () => {
    component.weatherData.set({ ...weatherStateMock.weather, isLoading: true })
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector(".loader")).toBeTruthy()

    component.weatherData.set({
      data: null,
      isLoading: false,
      error: "Test error"
    })
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector("app-form-error")).toBeTruthy()

    component.weatherData.set(weatherStateMock.weather)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector(".weather-summary")).toBeTruthy()
  })
})
