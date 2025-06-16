import { Component, HostListener, input, signal } from "@angular/core"
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
  modalId = input<string>()
  options = input<Partial<ModalOptions> | null>(null)
  isOpen = signal(false)

  constructor(private modalAdapter: ModalAdapter) {
    this.modalAdapter.select().subscribe(res => {
      this.isOpen.set(res[this.modalId()!]?.isOpen)
    })
  }

  @HostListener("document:click", ["$event.target"])
  onClickOutside(target: HTMLElement) {
    if (
      this.options()?.closeOutside &&
      this.isOpen() &&
      !findParentById(target, ["modal", `modal-target-${this.modalId()!}`])
    ) {
      this.modalAdapter.close(this.modalId()!)
    }
  }
}
