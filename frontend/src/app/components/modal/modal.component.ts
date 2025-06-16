import { Component, effect, HostListener, input, signal } from '@angular/core'
import { findParentById } from "../../utils/dom/find.util"
import { ModalAdapter } from "../../store/modal/modal.adapter"
import { Subscription } from 'rxjs'

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
  selectSubscription = signal<Subscription | null>(null)

  constructor(private modalAdapter: ModalAdapter) {
    effect(() => {
      const modalId = this.modalId()
      if (modalId) {
        this.selectSubscription()?.unsubscribe()

        const sub = this.modalAdapter.select().subscribe(res => {
          this.isOpen.set(res[modalId]?.isOpen)
        })

        this.selectSubscription.set(sub)
      }
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
