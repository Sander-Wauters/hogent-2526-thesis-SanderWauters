// 55. fakeAsync will flush pending timers by default. For tests that require the previous behavior, explicitly pass {flush: false} in the options parameter.
import { Component } from "@angular/core";
import { tick } from "@angular/core/testing";

@Component({
  selector: "step-55",
  template: "<div>step-55</div>",
})
export class Step55 {}

describe("Step55", () => {
  it("should automatically flush pending timers with fakeAsync (default behavior)", () => {
    tick(500);
  });
});
