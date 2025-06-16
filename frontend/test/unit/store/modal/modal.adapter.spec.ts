import { Store } from "@ngrx/store"
import { of } from "rxjs"
import { ModalAdapter } from "../../../../src/app/store/modal/modal.adapter"
import { selectModals } from "../../../../src/app/store/modal/modal.selectors"
import * as ModalActions from "../../../../src/app/store/modal/modal.actions"
import { AppState } from "../../../../src/app/store/state.interfaces"
import { storeMockFactory } from "../../../mocks/common/state.mock"
import { modalsStateMock } from "../../../mocks/data/modal.mock"

describe("ModalAdapter", () => {
  let adapter: ModalAdapter
  let store: jest.Mocked<Store<AppState>>

  beforeEach(() => {
    store = storeMockFactory()
    adapter = new ModalAdapter(store)
  })

  describe("select", () => {
    it("should select modals from store", () => {
      const mockModals = modalsStateMock
      store.select.mockReturnValue(of(mockModals))

      let result
      adapter.select().subscribe(modals => (result = modals))

      expect(store.select).toHaveBeenCalledWith(selectModals)
      expect(result).toEqual(mockModals)
    })
  })

  describe("open", () => {
    it("should dispatch openModal action", () => {
      const modalId = "modal1"
      adapter.open(modalId)

      expect(store.dispatch).toHaveBeenCalledWith(
        ModalActions.openModal({ modalId })
      )
    })
  })

  describe("close", () => {
    it("should dispatch closeModal action", () => {
      const modalId = "modal1s"
      adapter.close(modalId)

      expect(store.dispatch).toHaveBeenCalledWith(
        ModalActions.closeModal({ modalId })
      )
    })
  })
})
