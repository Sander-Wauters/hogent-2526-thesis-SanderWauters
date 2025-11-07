// 57. Rename the afterRender lifecycle hook to afterEveryRender
import { Component, afterRender } from "@angular/core";

@Component({
  selector: "step-57",
  template: "<div>step-57</div>",
})
export class Step57 {
  constructor() {
    afterRender(() => {
      console.log("After render");
    });
  }
}
