// 5.  Angular now automatically removes styles of destroyed components, which may impact your existing apps in cases you rely on leaked styles. To change this update the value of the REMOVE_STYLES_ON_COMPONENT_DESTROY provider to false.
import { Component } from "@angular/core";
import { REMOVE_STYLES_ON_COMPONENT_DESTROY } from "@angular/platform-browser";

@Component({
  selector: "step-5",
  providers: [{ provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: true }],
  template: "<div>step-5</div>",
})
export class Step5 {}
