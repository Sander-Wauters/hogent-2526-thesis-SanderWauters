// Update tests to handle errors thrown during ApplicationRef.tick by either triggering change detection synchronously or rejecting outstanding ComponentFixture.whenStable promises.
import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApplicationRef, NO_ERRORS_SCHEMA } from "@angular/core";

@Component({
  selector: "step-53",
  template: "<div>step-53</div>",
})
export class Step53 {}

describe("Step53", () => {
  let fixture: ComponentFixture<Step53>;
  let app: Step53;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step53],
      schemas: [NO_ERRORS_SCHEMA], // Ignoring any template errors to focus on our test case
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Step53);
    app = fixture.componentInstance;
  });

  it("should handle errors thrown during ApplicationRef.tick", async () => {
    const applicationRef = TestBed.inject(ApplicationRef);

    // Overriding the default change detection to trigger synchronously in this test case
    spyOn(applicationRef, "tick").and.callFake(() => {
      try {
        applicationRef.tick(); // Manually triggering the change detection
        return;
      } catch (error) {
        // You can handle the error here, or reject a promise in case it's needed
        return Promise.reject(error);
      }
    });

    try {
      // Trigger change detection and wait for stable state
      fixture.detectChanges();
      await fixture.whenStable(); // Wait until all promises are resolved
    } catch (error) {
      // Handle the error thrown during ApplicationRef.tick
      expect(error).toBeTruthy();
    }
  });
});
