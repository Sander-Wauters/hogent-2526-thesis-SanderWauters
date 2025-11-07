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
  private service = inject(SomeService, InjectFlags.Optional);

  constructor() {
    // Old Injector.get usage with InjectFlags
    const optionalService = this.injector.get(
      SomeService,
      null,
      InjectFlags.Default,
    );
    this.injector.get(SomeService, null, InjectFlags.Host);
    this.injector.get(SomeService, null, InjectFlags.Self);
    this.injector.get(SomeService, null, InjectFlags.SkipSelf);
    console.log("Service:", optionalService);
  }
}
