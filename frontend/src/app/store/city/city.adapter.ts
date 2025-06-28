import { Injectable } from "@angular/core"
import { Store } from "@ngrx/store"
import { AppState } from "../state.interfaces"
import { selectCity } from "./city.selectors"
import * as CityActions from "./city.actions"
import { City } from "../../api/search/search.interface"

@Injectable({
  providedIn: "root"
})
export class CityAdapter {
  constructor(private store: Store<AppState>) {}

  select() {
    return this.store.select(selectCity)
  }

  setCity(city: City) {
    this.store.dispatch(CityActions.setCity({ city }))
  }
}
