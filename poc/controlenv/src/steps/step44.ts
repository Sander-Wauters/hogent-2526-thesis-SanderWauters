// 44. The factories property in KeyValueDiffers has been removed.
import { Component, KeyValueDiffers } from "@angular/core";

@Component({
  selector: "step-44",
  template: "<div>step-44</div>",
  standalone: false,
})
export class Step44 {
  constructor(differs: KeyValueDiffers) {}
}
