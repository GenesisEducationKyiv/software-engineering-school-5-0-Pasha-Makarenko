import { HomeComponent } from "../../../../src/app/pages/home/home.component"
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing"
import { of } from "rxjs"
import { City } from "../../../../src/app/api/search/search.interface"
import { WeatherAdapter } from "../../../../src/app/store/weather/weather.adapter"
import { CityAdapter } from "../../../../src/app/store/city/city.adapter"
import { TemperatureUnit } from "../../../../src/app/pipes/temperature.pipe"
import { SpeedUnit } from "../../../../src/app/pipes/speed.pipe"
import { By } from "@angular/platform-browser"
import { ModalAdapter } from "../../../../src/app/store/modal/modal.adapter"
import { provideMockStore } from "@ngrx/store/testing"
import { SearchService } from "../../../../src/app/api/search/search.service"
import { SearchComponent } from "../../../../src/app/components/search/search.component"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { citiesMock } from "../../../mocks/data/city.mock"
import { weatherStateMock } from "../../../mocks/data/weather.mock"
import { searchServiceMockFactory } from "../../../mocks/services/search.service.mock"
import { modalAdapterMockFactory } from "../../../mocks/adapters/modal.adapter.mock"
import { cityAdapterMockFactory } from "../../../mocks/adapters/city.adapter.mock"
import { weatherAdapterMockFactory } from "../../../mocks/adapters/weather.adapter.mock"

describe("HomeComponent", () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>
  let weatherAdapter: jest.Mocked<Partial<WeatherAdapter>>
  let cityAdapter: jest.Mocked<Partial<CityAdapter>>
  let modalAdapter: jest.Mocked<Partial<ModalAdapter>>
  let searchService: jest.Mocked<Partial<SearchService>>

  const mockCity: City = citiesMock[0]

  const mockWeatherData = weatherStateMock.weather

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

    jest.clearAllMocks()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  describe("Initialization", () => {
    beforeEach(() => {
      jest.spyOn(weatherAdapter, "select").mockReturnValue(of(mockWeatherData))
      jest.spyOn(cityAdapter, "select").mockReturnValue(of(mockCity))
      fixture = TestBed.createComponent(HomeComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
    })

    it("should initialize with default values", () => {
      expect(component.searchControl.value).toBe(mockCity.name)
      expect(component.hourStep).toBe(3)
      expect(component.dayIndex()).toBe(0)
      expect(component.tempUnit()).toBe(TemperatureUnit.CELSIUS)
    })

    it("should subscribe to weather data", () => {
      expect(weatherAdapter.select).toHaveBeenCalled()
    })

    it("should subscribe to city data", () => {
      expect(cityAdapter.select).toHaveBeenCalled()
    })
  })

  describe("Computed Properties", () => {
    beforeEach(() => {
      component.weatherData.set(mockWeatherData)
      component.city.set(mockCity)
    })

    it("should compute currentDay", () => {
      expect(component.currentDay()).toEqual(
        mockWeatherData.data?.forecast.forecastday[0].day
      )
    })

    it("should compute currentDate", () => {
      expect(component.currentDate()).toBe("2023-01-01")
    })

    it("should compute hours with step", () => {
      const hours = component.hours()
      expect(hours.length).toBe(8)
      expect(hours[0].time).toBe("2023-01-01 00:00")
      expect(hours[1].time).toBe("2023-01-01 03:00")
    })

    it("should compute speed unit based on temperature unit", () => {
      expect(component.speedUnit()).toBe(SpeedUnit.KILOMETRES)
      component.tempUnit.set(TemperatureUnit.FAHRENHEIT)
      expect(component.speedUnit()).toBe(SpeedUnit.MIlES)
    })
  })

  describe("City Effect", () => {
    it("should fetch weather when city changes", fakeAsync(() => {
      jest.spyOn(cityAdapter, "select").mockReturnValue(of(mockCity))
      fixture = TestBed.createComponent(HomeComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      tick()

      expect(weatherAdapter.weather).toHaveBeenCalledWith(mockCity.url)
    }))

    it("should update search control when city changes", fakeAsync(() => {
      jest.spyOn(cityAdapter, "select").mockReturnValue(of(mockCity))
      fixture = TestBed.createComponent(HomeComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
      tick()

      expect(component.searchControl.value).toBe(mockCity.name)
    }))
  })

  describe("Template Rendering", () => {
    beforeEach(() => {
      component.weatherData.set(mockWeatherData)
      component.city.set(mockCity)
      fixture.detectChanges()
    })

    it("should display city name", () => {
      const title = fixture.debugElement.query(
        By.css(".heading-weather__title")
      )
      expect(title.nativeElement.textContent.trim()).toContain(
        `${mockCity.name} (${mockCity.country})`
      )
    })

    it("should display loading when isLoading is true", () => {
      component.weatherData.set({ ...mockWeatherData, isLoading: true })
      fixture.detectChanges()

      const loader = fixture.debugElement.query(By.css(".loader"))
      expect(loader).toBeTruthy()
    })

    it("should display error when error exists", () => {
      component.weatherData.set({ ...mockWeatherData, error: "Test error" })
      fixture.detectChanges()

      const error = fixture.debugElement.query(By.css("app-form-error"))
      expect(error).toBeTruthy()
    })

    it("should display weather data when available", () => {
      const weatherSummary = fixture.debugElement.query(
        By.css(".weather-summary")
      )
      expect(weatherSummary).toBeTruthy()
    })

    it("should update temperature unit when buttons clicked", () => {
      const temperatureButtons = fixture.debugElement.queryAll(
        By.css(".avg-summary__switch button")
      )
      temperatureButtons[1].triggerEventHandler("click", null)
      fixture.detectChanges()

      expect(component.tempUnit()).toBe(TemperatureUnit.FAHRENHEIT)
    })

    it("should update day index when day buttons clicked", () => {
      const dayButtons = fixture.debugElement.queryAll(
        By.css(".select-weather__item button")
      )
      dayButtons[1].triggerEventHandler("click", null)
      fixture.detectChanges()

      expect(component.dayIndex()).toBe(1)
    })
  })

  describe("Search Functionality", () => {
    it("should call cityAdapter.setCity when search emits", () => {
      const searchComponent = fixture.debugElement.query(By.css("app-search"))
      searchComponent.triggerEventHandler("selectOutput", mockCity)

      expect(cityAdapter.setCity).toHaveBeenCalledWith(mockCity)
    })

    it("should call weatherAdapter.weather when search button clicked", () => {
      component.city.set(mockCity)
      fixture.detectChanges()

      const searchButton = fixture.debugElement.query(
        By.css(".heading-weather__button")
      )
      searchButton.triggerEventHandler("click", null)

      expect(weatherAdapter.weather).toHaveBeenCalledWith(mockCity.url)
    })
  })
})
