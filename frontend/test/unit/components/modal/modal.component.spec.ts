import { ComponentFixture, TestBed } from "@angular/core/testing"
import { provideMockStore } from "@ngrx/store/testing"
import { ModalComponent } from "../../../../src/app/components/modal/modal.component"
import { ModalAdapter } from "../../../../src/app/store/modal/modal.adapter"
import { modalAdapterMockFactory } from "../../../mocks/adapters/modal.adapter.mock"

describe("ModalComponent", () => {
  let component: ModalComponent
  let fixture: ComponentFixture<ModalComponent>
  let modalAdapter: jest.Mocked<ModalAdapter>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [
        {
          provide: ModalAdapter,
          useValue: modalAdapterMockFactory()
        },
        provideMockStore()
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ModalComponent)
    component = fixture.componentInstance
    modalAdapter = TestBed.inject(ModalAdapter) as jest.Mocked<ModalAdapter>

    fixture.componentRef.setInput("modalId", "test-modal")
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize with default options", () => {
    expect(component.options()).toBeNull()
  })

  it("should not close when clicking inside modal", () => {
    fixture.componentRef.setInput("options", { closeOutside: true })
    component.isOpen.set(true)

    const mockElement = {
      id: "modal",
      parentElement: { id: "modal-target-test-modal" }
    } as unknown as HTMLElement

    component.onClickOutside(mockElement)
    expect(modalAdapter.close).not.toHaveBeenCalled()
  })

  it("should close when clicking outside if closeOutside is true", () => {
    fixture.componentRef.setInput("options", { closeOutside: true })
    component.isOpen.set(true)

    const mockElement = {
      id: "other-element",
      parentElement: null
    } as unknown as HTMLElement

    component.onClickOutside(mockElement)
    expect(modalAdapter.close).toHaveBeenCalledWith("test-modal")
  })

  it("should not close when clicking outside if closeOutside is false", () => {
    fixture.componentRef.setInput("options", { closeOutside: false })
    component.isOpen.set(true)

    const mockElement = {
      id: "other-element",
      parentElement: null
    } as unknown as HTMLElement

    component.onClickOutside(mockElement)
    expect(modalAdapter.close).not.toHaveBeenCalled()
  })

  it("should not close when modal is not open", () => {
    fixture.componentRef.setInput("options", { closeOutside: true })
    component.isOpen.set(false)

    const mockElement = {
      id: "other-element",
      parentElement: null
    } as unknown as HTMLElement

    component.onClickOutside(mockElement)
    expect(modalAdapter.close).not.toHaveBeenCalled()
  })

  it("should render with active class when open", () => {
    component.isOpen.set(true)
    fixture.detectChanges()

    const modalElement = fixture.nativeElement.querySelector(".modal")
    expect(modalElement.classList).toContain("modal_active")
  })

  it("should render without active class when closed", () => {
    component.isOpen.set(false)
    fixture.detectChanges()

    const modalElement = fixture.nativeElement.querySelector(".modal")
    expect(modalElement.classList).not.toContain("modal_active")
  })
})
