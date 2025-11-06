// 21. Import StateKey and TransferState from @angular/core instead of @angular/platform-browser.
import { Component, makeStateKey } from "@angular/core";
import { StateKey, TransferState } from "@angular/platform-browser";

@Component({
  selector: "step-21",
  template: "<div>step-21</div>",
})
export class Step21 {
  state: TransferState;
  stateKey: StateKey<number>;

  constructor() {
    this.state = new TransferState();
    this.stateKey = makeStateKey<number>("counter");
  }
}
