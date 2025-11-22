// 52. Migrate from using Router.errorHandler to withNavigationErrorHandler from provideRouter or errorHandler from RouterModule.forRoot.
import { NgModule } from "@angular/core";
import {
  Router,
  RouterModule,
  withNavigationErrorHandler,
} from "@angular/router";

@NgModule({
  imports: [RouterModule.forRoot([])],
  exports: [RouterModule],
})
export class Step52 {
  constructor(router: Router) {
    withNavigationErrorHandler((error) => {
      console.error("Old navigation error:", error);
    });
  }
}
