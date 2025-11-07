// 72. Replace all occurrences of the deprecated TestBed.get() method with TestBed.inject() in your Angular tests for dependency injection.
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

@Component({
  selector: "step-72",
  template: "<div>step-72</div>",
})
export class Step72 {}

describe("Step72", () => {
  let service: Step72;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Step72],
    });

    // Using TestBed.get() to retrieve the service instance
    service = TestBed.get(Step72);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
