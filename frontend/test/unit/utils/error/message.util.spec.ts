import { FormControl, FormGroup, Validators } from "@angular/forms"
import { message } from "../../../../src/app/utils/error/message.util"
import { commonErrors } from "../../../../src/app/consts/errors/common.errors"

describe("message", () => {
  let formGroup: FormGroup
  const customErrors = {
    required: "Custom required message",
    minlength: "Custom minlength message"
  }

  beforeEach(() => {
    formGroup = new FormGroup({
      requiredControl: new FormControl("", Validators.required),
      minLengthControl: new FormControl("a", Validators.minLength(3)),
      validControl: new FormControl("valid value")
    })
  })

  it("should return custom message for required error", () => {
    formGroup.get("requiredControl")?.markAsTouched()
    const result = message(customErrors, formGroup, "requiredControl")
    expect(result).toBe("Custom required message")
  })

  it("should return custom message for minlength error", () => {
    formGroup.get("minLengthControl")?.markAsTouched()
    const result = message(customErrors, formGroup, "minLengthControl")
    expect(result).toBe("Custom minlength message")
  })

  it("should return common error when control is valid", () => {
    formGroup.get("validControl")?.markAsTouched()
    const result = message(customErrors, formGroup, "validControl")
    expect(result).toBe(commonErrors.main)
  })

  it("should return common error for non-existent control", () => {
    const result = message(customErrors, formGroup, "nonExistentControl")
    expect(result).toBe(commonErrors.main)
  })

  it("should use the first error when multiple exist", () => {
    const multiErrorControl = new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ])
    formGroup.addControl("multiErrorControl", multiErrorControl)
    formGroup.get("multiErrorControl")?.markAsTouched()

    const result = message(customErrors, formGroup, "multiErrorControl")
    expect(result).toBe("Custom required message")
  })
})
