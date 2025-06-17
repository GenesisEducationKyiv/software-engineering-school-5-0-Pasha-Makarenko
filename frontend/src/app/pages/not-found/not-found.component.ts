import { Component } from "@angular/core"
import { Router } from "@angular/router"

@Component({
  selector: "app-not-found",
  imports: [],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.scss"
})
export class NotFoundComponent {
  constructor(protected router: Router) {}
}
