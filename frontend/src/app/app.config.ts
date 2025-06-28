import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core"
import { provideRouter } from "@angular/router"
import { routes } from "./app.routes"
import { provideHttpClient } from "@angular/common/http"
import { provideStore } from "@ngrx/store"
import { modalReducer } from "./store/modal/modal.reducer"
import { weatherReducer } from "./store/weather/weather.reducer"
import { cityReducer } from "./store/city/city.reducer"
import { provideEffects } from "@ngrx/effects"
import { CityEffects } from "./store/city/city.effects"

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      modals: modalReducer,
      weather: weatherReducer,
      city: cityReducer
    }),
    provideEffects(CityEffects)
  ]
}
