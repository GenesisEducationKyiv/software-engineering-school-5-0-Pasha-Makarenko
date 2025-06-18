import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal
} from "@angular/core"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { debounceTime, distinctUntilChanged } from "rxjs"
import { ModalComponent } from "../modal/modal.component"
import { City } from "../../api/search/search.interface"
import { SearchService } from "../../api/search/search.service"
import { ModalAdapter } from "../../store/modal/modal.adapter"
import { CityPipe } from "../../pipes/city.pipe"
import { CityAdapter } from "../../store/city/city.adapter"

export interface SearchOptions {
  delay: number
  save: boolean
}

@Component({
  selector: "app-search",
  imports: [ReactiveFormsModule, ModalComponent, CityPipe],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.scss"
})
export class SearchComponent implements OnInit {
  private modalAdapter = inject(ModalAdapter)
  private cityAdapter = inject(CityAdapter)
  private searchService = inject(SearchService)

  searchId = input<string>()
  modalId = computed(() => this.searchId() + "-modal")
  options = input<SearchOptions | null>(null)
  searchControl = input<FormControl<string | null>>()
  data = signal<City[]>([])
  selectOutput = output<City | null>()

  constructor() {
    effect(() => {
      if (this.data().length) {
        this.modalAdapter.open(this.modalId())
      } else {
        this.modalAdapter.close(this.modalId())
      }
    })
  }

  ngOnInit() {
    this.searchControl()
      ?.valueChanges.pipe(
        debounceTime(this.options()!.delay),
        distinctUntilChanged()
      )
      .subscribe(search => {
        this.searchChanges(search)
      })
  }

  select(index: number) {
    const city = this.data()[index]
    this.searchControl()?.setValue(city.name, {
      emitEvent: false
    })
    this.data.set([])

    if (this.options()?.save) {
      this.cityAdapter.setCity(city)
    }

    if (this.selectOutput) {
      this.selectOutput.emit(city)
    }
  }

  searchChanges(search: string | null) {
    if (!search || !this.searchControl() || !this.options()) {
      this.data.set([])
      return
    }

    this.searchService.search(search).subscribe(this.data.set)
  }
}
