import { of } from "rxjs"
import { ModalAdapter } from "../../../src/app/store/modal/modal.adapter"

export const modalAdapterMockFactory = () =>
  ({
    select: jest.fn(() => of({})),
    close: jest.fn(),
    open: jest.fn()
  }) as never as ModalAdapter
