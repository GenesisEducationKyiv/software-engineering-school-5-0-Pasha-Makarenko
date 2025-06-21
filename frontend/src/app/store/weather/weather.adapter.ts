import { inject, Injectable } from "@angular/core"
import { AppState } from "../state.interfaces"
import { Store } from "@ngrx/store"
import { commonErrors } from "../../consts/errors/common.errors"
import { WeatherService } from "../../api/weather/weather.service"
import * as WeatherActions from "./weather.actions"
import { selectWeather } from "./weather.selectors"

@Injectable({ providedIn: "root" })
export class WeatherAdapter {
  private weatherService = inject(WeatherService)

  constructor(private store: Store<AppState>) {}

  select() {
    return this.store.select(selectWeather)
  }

  weather(city: string | null, lat: string | null, lon: string | null, finallyFn?: () => void) {
    if (!lat || !lon || !city) {
      return
    }

    this.store.dispatch(WeatherActions.getWeatherAction())

    this.weatherService
      .getWeather({
        city,
        lat,
        lon,
        days: 14
      })
      .subscribe(
        data => {
          this.store.dispatch(WeatherActions.getWeatherSuccessAction({ data }))
        },
        error => {
          this.store.dispatch(
            WeatherActions.getWeatherFailureAction({
              error: error?.message || commonErrors.main
            })
          )
        }
      )
      .add(finallyFn)
  }
}
