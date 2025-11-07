// 54. Update usages of Resolve interface to include RedirectCommand in its return type.
import { Component } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";

class TestResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return "";
  }
}

@Component({
  selector: "step-54",
  template: "<div>step-54</div>",
})
export class Step54 {
  constructor() {
    let res: Resolve<string> = new TestResolver();
    res.resolve;
  }
}
