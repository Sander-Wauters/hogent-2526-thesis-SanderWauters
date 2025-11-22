// 73. Remove InjectFlags enum and its usage from inject, Injector.get, EnvironmentInjector.get, and TestBed.inject calls. Use options like {optional: true} for inject or handle null for \*.get methods.
import { Component, InjectFlags, Injector, inject } from "@angular/core";

class SomeService {}

@Component({
  selector: "step-73",
  template: "<div>step-73</div>",
})
export class Step73 {
  private injector = inject(Injector);

  // Old pattern using InjectFlags
  private service = inject(SomeService, { optional: true });

  constructor() {
    // Old Injector.get usage with InjectFlags
    const optionalService = this.injector.get(
      SomeService,
      null,
      {},
    );
    this.injector.get(SomeService, null, { host: true });
    this.injector.get(SomeService, null, { self: true });
    this.injector.get(SomeService, null, { skipSelf: true });
    console.log("Service:", optionalService);
  }
}
