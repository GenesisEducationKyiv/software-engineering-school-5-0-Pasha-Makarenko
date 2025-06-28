import { Pipe, PipeTransform } from "@angular/core"

export enum SpeedUnit {
  KILOMETRES = "k",
  MIlES = "m"
}

@Pipe({
  name: "speed"
})
export class SpeedPipe implements PipeTransform {
  transform(value: number | string, unit: SpeedUnit): string {
    value = parseFloat(value.toString())
    let result = ""

    switch (unit) {
      case SpeedUnit.KILOMETRES:
        result = value.toFixed(1) + " k/h"
        break
      case SpeedUnit.MIlES:
        result = (value * 0.621371).toFixed(1) + " m/h"
        break
    }

    return result
  }
}
