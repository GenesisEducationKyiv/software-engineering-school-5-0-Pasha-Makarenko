import { FormControl, FormGroup } from "@angular/forms"
import { invalid } from "../../../../src/app/utils/error/invalid.util"

describe("invalid", () => {
  let formGroup: FormGroup

  beforeEach(() => {
    formGroup = new FormGroup({
      validControl: new FormControl("valid value"),
      invalidControl: new FormControl("", {
        validators: [() => ({ required: true })]
      }),
      untouchedInvalidControl: new FormControl("", {
        validators: [() => ({ required: true })]
      })
    })

    formGroup.get("invalidControl")?.markAsTouched()
    formGroup.get("validControl")?.markAsTouched()
  })

  it("should return true for invalid and touched control", () => {
    expect(invalid(formGroup, "invalidControl")).toBe(true)
  })

  it("should return false for valid and touched control", () => {
    expect(invalid(formGroup, "validControl")).toBe(false)
  })

  it("should return false for invalid but untouched control", () => {
    expect(invalid(formGroup, "untouchedInvalidControl")).toBe(false)
  })
})
