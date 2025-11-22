// 74. Update injector.get() calls to use a specific ProviderToken<T> instead of relying on the removed any overload. If using string tokens (deprecated since v4), migrate them to ProviderToken<T>.
import { HttpClient } from "@angular/common/http";
import { Component, Injector } from "@angular/core";

@Component({
  selector: "step-74",
  template: "<div>step-74</div>",
})
export class Step74 {
  constructor(private injector: Injector) {}

  makeRequest() {
    // Manually retrieve HttpClient instance from the injector
    const http = this.injector.get(HttpClient);

    http.get("https://api.example.com/data").subscribe((data) => {
      console.log("Received:", data);
    });
  }
}
