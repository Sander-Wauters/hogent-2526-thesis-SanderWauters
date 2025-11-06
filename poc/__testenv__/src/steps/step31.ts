// 31. Provide an absolute url instead of using useAbsoluteUrl and baseUrl from PlatformConfig.
import { Component } from "@angular/core";
import { PlatformConfig } from "@angular/platform-server";

@Component({
  selector: "step-31",
  template: "<div>step-31</div>",
})
export class Step31 {
  config: PlatformConfig;

  constructor() {
    this.config = {
      document: "step-31",
      useAbsoluteUrl: true,
      baseUrl: "step-31",
    };
  }
}
