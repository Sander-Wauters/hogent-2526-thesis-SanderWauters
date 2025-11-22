// 14. To disable hydration use ngSkipHydration or remove the provideClientHydration call from the provider list since withNoDomReuse is no longer part of the public API.
import { Component, NgModule } from "@angular/core";
import {
  bootstrapApplication,
  provideClientHydration,
  withNoDomReuse,
} from "@angular/platform-browser";

@Component({
  selector: "step-14",
  template: "<div>step-14</div>",
  providers: [],
})
export class Step14 {}

bootstrapApplication(Step14, {
  providers: [],
});

@NgModule({
  declarations: [Step14],
  exports: [Step14],
  bootstrap: [Step14],
  providers: [],
})
export class Step14Module {}
