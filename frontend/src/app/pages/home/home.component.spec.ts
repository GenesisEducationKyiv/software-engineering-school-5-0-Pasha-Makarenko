import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HomeComponent } from "./home.component"
import { WeatherAdapter } from "../../store/weather/weather.adapter"
import { WeatherService } from "../../api/weather/weather.service"
import { Store } from "@ngrx/store"
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { selectWeather } from "../../store/weather/home.selectors"
import { of } from "rxjs"
import { City } from "../../api/search/search.interface"
import { WeatherData } from "../../api/weather/weather.interface"
import { TemperatureUnit } from "../../pipes/temperature.pipe"
import { SpeedUnit } from "../../pipes/speed.pipe"
import {
  getWeatherAction,
  getWeatherFailureAction,
  getWeatherSuccessAction
} from "../../store/weather/home.actions"
import { initialWeatherState } from "../../store/weather/weatherState"
import { weatherReducer } from "../../store/weather/weather.reducer"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { SearchComponent } from "../../components/search/search.component"
import { ErrorComponent } from "../../components/error/error.component"

describe("HomeComponent", () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>
  let homeAdapter: WeatherAdapter

  const mockCity: City = {
    id: 1,
    name: "London",
    region: "England",
    country: "United Kingdom",
    lat: 51.5074,
    lon: -0.1278,
    url: "london-united-kingdom"
  }

  const mockWeatherData: WeatherData = {
    location: { name: "London" },
    current: { temp_c: 15 },
    forecast: {
      forecastday: [
        {
          date: "2023-01-01",
          day: {
            avgtemp_c: 15,
            avgtemp_f: 59,
            condition: { text: "Sunny", icon: "icon.png" }
          },
          hour: []
        }
      ]
    }
  } as never as WeatherData

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        ErrorComponent,
        SearchComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: WeatherAdapter,
          useValue: {
            select: jest.fn(() =>
              of({ result: null, isLoading: false, error: null })
            ),
            weather: jest.fn()
          }
        },
        {
          provide: WeatherService,
          useValue: {
            get city() {
              return mockCity
            },
            setCity: jest.fn(),
            weather: jest.fn(() => of(mockWeatherData))
          }
        },
        provideMockStore()
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance
    homeAdapter = TestBed.inject(WeatherAdapter)

    jest.spyOn(homeAdapter, "select").mockReturnValue(
      of({
        result: mockWeatherData,
        isLoading: false,
        error: null
      })
    )

    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize with city name in search control", () => {
    expect(component.searchControl.value).toBe("London")
  })

  it("should initialize with default temperature unit", () => {
    expect(component.tempUnit()).toBe(TemperatureUnit.CELSIUS)
  })

  it("should update temperature unit", () => {
    component.tempUnit.set(TemperatureUnit.FAHRENHEIT)
    expect(component.tempUnit()).toBe(TemperatureUnit.FAHRENHEIT)
  })

  it("should update speed unit based on temperature unit", () => {
    component.tempUnit.set(TemperatureUnit.CELSIUS)
    expect(component.speedUnit()).toBe(SpeedUnit.KILOMETRES)

    component.tempUnit.set(TemperatureUnit.FAHRENHEIT)
    expect(component.speedUnit()).toBe(SpeedUnit.MIlES)
  })

  it("should call weather adapter on init", () => {
    expect(homeAdapter.weather).toHaveBeenCalled()
  })

  it("should update day index", () => {
    component.dayIndex.set(0)
    expect(component.dayIndex()).toBe(0)
  })
})

describe("HomeAdapter", () => {
  let adapter: WeatherAdapter
  let store: MockStore
  let weatherService: WeatherService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherAdapter,
        {
          provide: WeatherService,
          useValue: {
            get city() {
              return { url: "london" }
            },
            weather: jest.fn(() => of({}))
          }
        },
        provideMockStore()
      ]
    })

    adapter = TestBed.inject(WeatherAdapter)
    store = TestBed.inject(Store) as MockStore
    weatherService = TestBed.inject(WeatherService)
    jest.spyOn(store, "dispatch")
  })

  it("should dispatch getWeatherAction when weather is called", () => {
    adapter.weather()
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "[Home] Get Weather" })
    )
  })

  it("should not dispatch if city is not set", () => {
    jest.spyOn(weatherService, "city", "get").mockReturnValue(null)
    adapter.weather()
    expect(store.dispatch).not.toHaveBeenCalled()
  })

  it("should select home state", () => {
    const mockState = { result: null, isLoading: false, error: null }
    store.overrideSelector(selectWeather, mockState)

    adapter.select().subscribe(state => {
      expect(state).toEqual(mockState)
    })
  })
})

describe("Home Actions", () => {
  it("should create getWeatherAction", () => {
    const action = getWeatherAction()
    expect(action.type).toBe("[Home] Get Weather")
  })

  it("should create getWeatherSuccessAction with payload", () => {
    const payload = { location: { name: "London" } }
    const action = getWeatherSuccessAction({ data: payload as never })
    expect(action.type).toBe("[Home] Get Weather Success")
    expect(action.result).toEqual(payload)
  })

  it("should create getWeatherFailureAction with error", () => {
    const error = "Error message"
    const action = getWeatherFailureAction({ error })
    expect(action.type).toBe("[Home] Get Weather Failure")
    expect(action.error).toBe(error)
  })
})

describe("Home Reducer", () => {
  const initialState = initialWeatherState

  it("should return initial state", () => {
    const action = {} as never
    const state = weatherReducer(undefined, action)
    expect(state).toEqual(initialState)
  })

  it("should handle getWeatherAction", () => {
    const action = getWeatherAction()
    const state = weatherReducer(initialState, action)
    expect(state.weather.isLoading).toBe(true)
    expect(state.weather.error).toBeNull()
  })

  it("should handle getWeatherSuccessAction", () => {
    const payload = { location: { name: "London" } }
    const action = getWeatherSuccessAction({ data: payload as never })
    const state = weatherReducer(
      {
        ...initialState,
        weather: { ...initialState.weather, isLoading: true }
      },
      action
    )
    expect(state.weather.result).toEqual(payload)
    expect(state.weather.isLoading).toBe(false)
    expect(state.weather.error).toBeNull()
  })

  it("should handle getWeatherFailureAction", () => {
    const error = "Error message"
    const action = getWeatherFailureAction({ error })
    const state = weatherReducer(
      {
        ...initialState,
        weather: { ...initialState.weather, isLoading: true }
      },
      action
    )
    expect(state.weather.error).toBe(error)
    expect(state.weather.isLoading).toBe(false)
    expect(state.weather.result).toBeNull()
  })
})

describe("Home Selectors", () => {
  it("should select home state", () => {
    const mockState = {
      home: {
        result: null,
        isLoading: false,
        error: null
      }
    }
    const result = selectWeather.projector(mockState)
    expect(result).toEqual(mockState.home)
  })
})
