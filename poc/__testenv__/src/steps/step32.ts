// 32. Replace the usage of platformDynamicServer with platformServer. Also, add an import @angular/compiler.
import { Component, PlatformRef } from "@angular/core";
import { platformDynamicServer } from "@angular/platform-server";

@Component({
  selector: "step-32",
  template: "<div>step-32</div>",
})
export class Step32 {
  platformRef: PlatformRef;

  constructor() {
    this.platformRef = platformDynamicServer([]);
  }
}
