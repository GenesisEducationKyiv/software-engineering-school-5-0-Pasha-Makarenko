import { Component, computed, effect, inject, signal } from "@angular/core"
import { WeatherAdapter } from "../../store/weather/weather.adapter"
import {
  initialWeatherState,
  WeatherState
} from "../../store/weather/weather.state"
import { SearchComponent } from "../../components/search/search.component"
import { FormControl } from "@angular/forms"
import { FaIconComponent } from "@fortawesome/angular-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { ErrorComponent } from "../../components/error/error.component"
import { DatePipe } from "@angular/common"
import { TemperaturePipe, TemperatureUnit } from "../../pipes/temperature.pipe"
import { CityPipe } from "../../pipes/city.pipe"
import { WeatherHour } from "../../api/weather/weather.interface"
import { SpeedPipe, SpeedUnit } from "../../pipes/speed.pipe"
import { CityAdapter } from "../../store/city/city.adapter"
import { City } from "../../api/search/search.interface"

@Component({
  selector: "app-home",
  imports: [
    SearchComponent,
    FaIconComponent,
    ErrorComponent,
    DatePipe,
    TemperaturePipe,
    CityPipe,
    SpeedPipe
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss"
})
export class HomeComponent {
  protected weatherAdapter = inject(WeatherAdapter)
  protected cityAdapter = inject(CityAdapter)

  searchControl = new FormControl<string | null>(null)
  searchIcon = faSearch
  hourStep = 3
  weatherData = signal<WeatherState["weather"]>(initialWeatherState.weather)
  city = signal<City | null>(null)
  dayIndex = signal<number>(0)
  currentDay = computed(
    () => this.weatherData().data?.forecast[this.dayIndex()] || null
  )
  currentDate = computed(
    () => this.weatherData().data?.forecast[this.dayIndex()].date || null
  )
  hours = computed<WeatherHour[]>(
    () =>
      this.weatherData().data?.forecast[this.dayIndex()].hours.filter(
        (_, i) => i % this.hourStep === 0
      ) || []
  )
  tempUnit = signal<TemperatureUnit>(TemperatureUnit.CELSIUS)
  speedUnit = computed(() =>
    this.tempUnit() === TemperatureUnit.CELSIUS
      ? SpeedUnit.KILOMETRES
      : SpeedUnit.MIlES
  )

  constructor() {
    this.weatherAdapter.select().subscribe(this.weatherData.set)
    this.cityAdapter.select().subscribe(city => {
      this.city.set(city)
      this.searchControl.setValue(city ? city.name : null)
    })

    effect(() => {
      const city = this.city()

      if (city) {
        this.weatherAdapter.weather(city.name, city.lat, city.lon)
      }
    })
  }

  protected readonly TemperatureUnit = TemperatureUnit
  protected readonly SpeedUnit = SpeedUnit
}
