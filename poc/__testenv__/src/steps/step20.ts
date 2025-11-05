// 20. Remove calls to matchesElement because it's now not part of AnimationDriver.
import { Component } from "@angular/core";
import { AnimationDriver } from "@angular/animations/browser";

@Component({
  selector: "step-20",
  template: "<div>step-20</div>",
})
export class Step20 {
  constructor(anim: AnimationDriver) {
    anim.matchesElement("test", "test");
  }
}
