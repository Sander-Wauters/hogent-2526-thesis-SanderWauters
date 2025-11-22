// 33. Remove all imports of ServerTransferStateModule from your application. It is no longer needed.
import { NgModule } from "@angular/core";
import {
  ServerModule,
  ServerTransferStateModule,
} from "@angular/platform-server";

@NgModule({
  imports: [ServerModule, ],
})
export class Step33 {}
