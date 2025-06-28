import { AppState } from "../../../src/app/store/state.interfaces"
import { getCityStateMock } from "../data/city.mock"
import { weatherStateMock } from "../data/weather.mock"
import { modalsStateMock } from "../data/modal.mock"
import { Store } from "@ngrx/store"

export const appStateMock: AppState = {
  city: getCityStateMock(0),
  weather: weatherStateMock,
  modals: modalsStateMock
}

export const storeMockFactory = () =>
  ({
    select: jest.fn(),
    dispatch: jest.fn()
  }) as never as jest.Mocked<Store<AppState>>
