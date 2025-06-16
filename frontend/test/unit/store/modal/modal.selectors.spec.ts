import {
  selectModals,
  selectModalState
} from "../../../../src/app/store/modal/modal.selectors"
import { appStateMock } from "../../../mocks/common/state.mock"

describe("Modal Selectors", () => {
  const initialState = appStateMock

  it("should select the modal state", () => {
    const result = selectModalState(initialState)
    expect(result).toEqual(initialState.modals)
  })

  it("should select all modals", () => {
    const result = selectModals.projector(initialState.modals)
    expect(result).toEqual(initialState.modals.modals)
  })
})
