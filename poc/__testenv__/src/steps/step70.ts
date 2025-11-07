// 70. The any type is removed from the Route guard arrays (canActivate, canDeactivate, etc); ensure guards are functions, ProviderToken<T>, or (deprecated) strings. Refactor string guards to ProviderToken<T> or functions.
import { Component } from "@angular/core";
import { Route } from "@angular/router";

@Component({
  selector: "step-70",
  template: "<div>step-70</div>",
})
export class Step70 {
  test(route: Route) {
    route.canActivate = [];
    route.canMatch = [];
    route.canDeactivate = [];
    route.canActivateChild = [];
  }
}
