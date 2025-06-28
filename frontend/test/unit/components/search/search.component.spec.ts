import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing"
import { SearchComponent } from "../../../../src/app/components/search/search.component"
import { FormControl, ReactiveFormsModule } from "@angular/forms"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { provideMockStore } from "@ngrx/store/testing"

describe("SearchComponent", () => {
  let component: SearchComponent
  let fixture: ComponentFixture<SearchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [provideMockStore()]
    }).compileComponents()

    fixture = TestBed.createComponent(SearchComponent)
    fixture.componentRef.setInput("options", {
      delay: 300,
      save: false
    })
    fixture.componentRef.setInput("searchControl", new FormControl(""))
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should handle search with debounce", fakeAsync(() => {
    const emit = jest.spyOn(component.selectOutput, "emit")
    const changes = jest.spyOn(component, "searchChanges")
    component.searchControl()?.setValue("London")

    expect(emit).not.toHaveBeenCalled()

    tick(500)
    expect(changes).toHaveBeenCalledWith("London")
  }))
})
