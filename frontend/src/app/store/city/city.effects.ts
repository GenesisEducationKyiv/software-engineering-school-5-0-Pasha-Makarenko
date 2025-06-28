import { inject, Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { tap } from "rxjs/operators"
import * as CityActions from "./city.actions"
import { CookieService } from "ngx-cookie-service"
import { Store } from "@ngrx/store"
import { AppState } from "../state.interfaces"

@Injectable()
export class CityEffects {
  private readonly CITY_COOKIE_KEY = "selected_city"
  private actions$ = inject(Actions)
  private cookieService = inject(CookieService)
  private store = inject(Store<AppState>)

  constructor() {
    this.loadInitialCity()
  }

  private loadInitialCity() {
    const city = this.cookieService.get(this.CITY_COOKIE_KEY)
    if (city) {
      const extractedCity = JSON.parse(city)
      this.store.dispatch(CityActions.setCity({ city: extractedCity }))
    }
  }

  saveCity$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CityActions.setCity),
        tap(({ city }) => {
          if (city) {
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + 30)

            this.cookieService.set(
              this.CITY_COOKIE_KEY,
              JSON.stringify(city),
              expiryDate
            )
          } else {
            this.cookieService.delete(this.CITY_COOKIE_KEY, "/")
          }
        })
      ),
    { dispatch: false }
  )
}
