// 19. Replace async from @angular/core with waitForAsync.
import { Component } from "@angular/core";
import { waitForAsync } from "@angular/core/testing";

async function shouldStayAsync() {}

@Component({
  selector: "step-19",
  template: "<div>step-19</div>",
})
export class Step19 {
  constructor() {
    waitForAsync(() => {});
  }
}
