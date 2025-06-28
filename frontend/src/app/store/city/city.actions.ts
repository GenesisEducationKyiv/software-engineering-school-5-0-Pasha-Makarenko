import { createAction, props } from "@ngrx/store"
import { City } from "../../api/search/search.interface"

export const setCity = createAction("[City] Set City", props<{ city: City }>())
