// 23. Update the application to remove isPlatformWorkerUi and isPlatformWorkerApp since they were part of platform WebWorker which is now not part of Angular.
import { isPlatformWorkerApp, isPlatformWorkerUi } from "@angular/common";
import { Component, PLATFORM_ID } from "@angular/core";

@Component({
  selector: "step-23",
  template: "<div>step-23</div>",
})
export class Step23 {
  constructor() {
    const isPlatformWorker =
      false && false;
  }
}
