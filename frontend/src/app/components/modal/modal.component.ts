import { Component, HostListener, inject, input, signal } from "@angular/core"
import { findParentById } from "../../utils/dom/find.util"
import { ModalAdapter } from "../../store/modal/modal.adapter"

interface ModalOptions {
  closeOutside: boolean
}

@Component({
  standalone: true,
  selector: "app-modal",
  imports: [],
  templateUrl: "./modal.component.html",
  styleUrl: "./modal.component.scss"
})
export class ModalComponent {
  private modalAdapter = inject(ModalAdapter)

  modalId = input<string>()
  options = input<Partial<ModalOptions> | null>(null)
  isOpen = signal(false)

  constructor() {
    this.modalAdapter.select().subscribe(res => {
      this.isOpen.set(res[this.modalId()!]?.isOpen)
    })
  }

  @HostListener("document:click", ["$event.target"])
  onClickOutside(target: HTMLElement) {
    const modalId = this.modalId()

    if (
      modalId &&
      this.options()?.closeOutside &&
      this.isOpen() &&
      !findParentById(target, ["modal", `modal-target-${modalId}`])
    ) {
      this.modalAdapter.close(modalId)
    }
  }
}
