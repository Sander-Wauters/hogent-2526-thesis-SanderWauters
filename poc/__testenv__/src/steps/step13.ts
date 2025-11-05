// 13. Use update instead of mutate in Angular Signals. For example items.mutate(itemsArray => itemsArray.push(newItem)); will now be items.update(itemsArray => [itemsArray, …newItem]);
import { Component, signal } from "@angular/core";

interface CounterState {
  count: number;
}

@Component({
  selector: "step-13",
  template: "<div>step-13</div>",
})
export class Step13 {
  counter = signal<CounterState>({ count: 0 });

  increment = () =>
    this.counter.mutate((state) => {
      state.count += 1;
    });
}
