// 11. Change references to AnimationDriver.NOOP to use NoopAnimationDriver because AnimationDriver.NOOP is now deprecated.
import { Component } from "@angular/core";
import { AnimationDriver } from "@angular/animations/browser";

@Component({
  selector: "step-11",
  template: "<div>step-11</div>",
  providers: [
    {
      provide: AnimationDriver,
      useValue: AnimationDriver.NOOP,
    },
  ],
})
export class Step11 {}
