import { Pipe, PipeTransform } from "@angular/core"

export enum TemperatureUnit {
  CELSIUS = "c",
  FAHRENHEIT = "f"
}

const degSymbol = "°"

@Pipe({
  name: "temperature"
})
export class TemperaturePipe implements PipeTransform {
  transform(value: number | string, unit?: TemperatureUnit): string {
    value = parseFloat(value.toString())

    let result = ""

    switch (unit) {
      case TemperatureUnit.CELSIUS:
        result = value.toFixed(1) + degSymbol + "C"
        break
      case TemperatureUnit.FAHRENHEIT:
        result = ((value * 9) / 5 + 32).toFixed(1) + degSymbol + "F"
        break
    }

    return result
  }
}
