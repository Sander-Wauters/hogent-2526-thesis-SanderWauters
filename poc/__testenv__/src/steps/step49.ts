// 49. Update tests using fakeAsync that rely on specific timing of zone coalescing and scheduling when a change happens outside the Angular zone (hybrid mode scheduling) as these timers are now affected by tick and flush.
import { Component, NgZone } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";

@Component({
  selector: "step-49",
  template: "<div>step-49</div>",
})
export class Step49 {
  message = "";

  constructor(private ngZone: NgZone) {}

  startTimer() {
    // This is a function running outside Angular zone to simulate hybrid mode
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // We need to re-enter the Angular zone to update the view
        this.ngZone.run(() => {
          this.message = "Timer completed";
        });
      }, 1000);
    });
  }
}

describe("Step49", () => {
  let fixture: ComponentFixture<Step49>;
  let component: Step49;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Step49],
    });

    fixture = TestBed.createComponent(Step49);
    component = fixture.componentInstance;
  });

  it("should update message after 1000ms when running outside Angular zone", fakeAsync(() => {
    // Trigger the timer
    component.startTimer();

    // No immediate change in the view, so we manually trigger the passage of time
    tick(1000); // Advance the time by 1000ms

    // Now the message should be updated
    fixture.detectChanges(); // Ensure the view is updated

    // Check if the message is correctly updated
    expect(component.message).toBe("Timer completed");
  }));
});
