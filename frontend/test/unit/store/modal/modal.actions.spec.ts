import * as ModalActions from "../../../../src/app/store/modal/modal.actions"

describe("Modal Actions", () => {
  it("should create an openModal action", () => {
    const modalId = "testModal"
    const action = ModalActions.openModal({ modalId })

    expect(action.type).toEqual("[Modal] Open Modal")
    expect(action.modalId).toEqual(modalId)
  })

  it("should create a closeModal action", () => {
    const modalId = "testModal"
    const action = ModalActions.closeModal({ modalId })

    expect(action.type).toEqual("[Modal] Close Modal")
    expect(action.modalId).toEqual(modalId)
  })
})
