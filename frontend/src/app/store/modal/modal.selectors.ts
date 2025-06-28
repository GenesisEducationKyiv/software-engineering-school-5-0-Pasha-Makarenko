import { createSelector } from "@ngrx/store"
import { AppState } from "../state.interfaces"

export const selectModalState = (state: AppState) => state.modals

export const selectModals = createSelector(
  selectModalState,
  state => state.modals
)
