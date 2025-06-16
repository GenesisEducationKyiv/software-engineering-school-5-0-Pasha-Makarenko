import * as ModalActions from "../../../../src/app/store/modal/modal.actions"
import { modalReducer } from "../../../../src/app/store/modal/modal.reducer"
import { initialModalState } from "../../../../src/app/store/modal/modal.state"
import { Action } from "@ngrx/store"
import { emptyAction } from "../../../mocks/common/actions.mock"

describe("Modal Reducer", () => {
  describe("initial state", () => {
    it("should return the initial state", () => {
      const state = modalReducer(undefined, emptyAction)

      expect(state).toEqual(initialModalState)
      expect(state.modals).toEqual({})
    })
  })

  describe("openModal action", () => {
    it("should add a new modal with isOpen: true when it does not exist", () => {
      const modalId = "testModal"
      const action = ModalActions.openModal({ modalId })
      const state = modalReducer(initialModalState, action)

      expect(state.modals[modalId]).toEqual({ isOpen: true })
    })

    it("should set isOpen: true for an existing modal", () => {
      const modalId = "existingModal"
      const initialState = {
        modals: {
          [modalId]: { isOpen: false }
        }
      }
      const action = ModalActions.openModal({ modalId })
      const state = modalReducer(initialState, action)

      expect(state.modals[modalId].isOpen).toBe(true)
    })

    it("should not modify other modals when opening one", () => {
      const modalId1 = "modal1"
      const modalId2 = "modal2"
      const initialState = {
        modals: {
          [modalId1]: { isOpen: false },
          [modalId2]: { isOpen: true }
        }
      }
      const action = ModalActions.openModal({ modalId: modalId1 })
      const state = modalReducer(initialState, action)

      expect(state.modals[modalId1].isOpen).toBe(true)
      expect(state.modals[modalId2].isOpen).toBe(true)
    })
  })

  describe("closeModal action", () => {
    it("should set isOpen: false for an existing modal", () => {
      const modalId = "testModal"
      const initialState = {
        modals: {
          [modalId]: { isOpen: true }
        }
      }
      const action = ModalActions.closeModal({ modalId })
      const state = modalReducer(initialState, action)

      expect(state.modals[modalId].isOpen).toBe(false)
    })

    it("should create the modal with isOpen: false if it does not exist", () => {
      const modalId = "newModal"
      const action = ModalActions.closeModal({ modalId })
      const state = modalReducer(initialModalState, action)

      expect(state.modals[modalId]).toEqual({ isOpen: false })
    })

    it("should not modify other modals when closing one", () => {
      const modalId1 = "modal1"
      const modalId2 = "modal2"
      const initialState = {
        modals: {
          [modalId1]: { isOpen: true },
          [modalId2]: { isOpen: true }
        }
      }
      const action = ModalActions.closeModal({ modalId: modalId1 })
      const state = modalReducer(initialState, action)

      expect(state.modals[modalId1].isOpen).toBe(false)
      expect(state.modals[modalId2].isOpen).toBe(true)
    })
  })

  describe("unknown action", () => {
    it("should return the current state", () => {
      const currentState = {
        modals: {
          someModal: { isOpen: true }
        }
      }
      const action = {} as Action
      const state = modalReducer(currentState, action)

      expect(state).toBe(currentState)
    })
  })
})
