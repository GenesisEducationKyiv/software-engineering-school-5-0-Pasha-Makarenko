import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ModalComponent } from "../../../../src/app/components/modal/modal.component"
import { ModalAdapter } from "../../../../src/app/store/modal/modal.adapter"
import { modalAdapterMockFactory } from "../../../mocks/adapters/modal.adapter.mock"
import { provideMockStore } from "@ngrx/store/testing"

describe("ModalComponent", () => {
  let component: ModalComponent
  let fixture: ComponentFixture<ModalComponent>
  let modalAdapter: jest.Mocked<ModalAdapter>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        { provide: ModalAdapter, useValue: modalAdapterMockFactory() },
        provideMockStore()
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ModalComponent)
    component = fixture.componentInstance
    modalAdapter = TestBed.inject(ModalAdapter) as jest.Mocked<ModalAdapter>
    fixture.componentRef.setInput("modalId", "test-modal")
    fixture.detectChanges()
  })

  it("should handle complex click outside scenarios", () => {
    fixture.componentRef.setInput("options", { closeOutside: true })
    component.isOpen.set(true)

    const insideElement = {
      id: "modal-content",
      parentElement: {
        id: "modal-target-test-modal",
        parentElement: { id: "parent" }
      }
    } as unknown as HTMLElement
    component.onClickOutside(insideElement)
    expect(modalAdapter.close).not.toHaveBeenCalled()

    const outsideElement = {
      id: "other-element",
      parentElement: null
    } as unknown as HTMLElement
    component.onClickOutside(outsideElement)
    expect(modalAdapter.close).toHaveBeenCalledWith("test-modal")
  })
})
