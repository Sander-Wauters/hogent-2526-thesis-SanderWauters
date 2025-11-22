// 43. Replace usages of BrowserModule.withServerTransition() with injection of the APP_ID token to set the application id instead.
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "src/app/app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class Step43 {}
