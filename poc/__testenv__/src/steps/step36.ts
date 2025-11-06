// 36. For any components using OnPush change detection, ensure they are properly marked dirty to enable host binding updates.
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
} from "@angular/core";

@Component({
  selector: "step-36",
  template: "<div>step-36</div>",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step36 {
  private _isActive = false;

  @HostBinding("class.active")
  get isActive() {
    return this._isActive;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  toggleActive() {
    this._isActive = !this._isActive;

    // Since we're using OnPush, we need to explicitly mark for check
    this.cdr.markForCheck();
  }
}
