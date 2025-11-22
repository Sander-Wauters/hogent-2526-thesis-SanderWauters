// 29. Remove dependencies of RESOURCE_CACHE_PROVIDER since it's no longer part of the Angular runtime.
import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

import { provideHttpClient } from "@angular/common/http";

@Component({
  selector: "step-29",
  template: "<div>step-29</div>",
})
export class Step29 {}

bootstrapApplication(Step29, {
  providers: [provideHttpClient(), ],
}).catch((err) => console.error(err));
