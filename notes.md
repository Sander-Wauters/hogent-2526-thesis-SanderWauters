# Notes

## TLDR

Problem:

- Multiple Angular application need to be updated from v.16 to v.20.
  - This would take a long time and the results are not directly obvious to the end-user.

Research question:

- To what extent can the update of Angular v.16 to v.20 be automized?
  - What does the update entail?
    - Use AngularUpdateGuide2025 to determine what needs to happen.
  - What can we automize?
    - Use Bavota2012 to categorize the changes
      - Changes that are deemed potentially harmfull and not harmfull will be automized.
      - Changes that are deemed harmfull will not be automized.
      - Changes that are uncategorized will be evaluated case by case.
  - What are our options to automize?
    - AI (still to many problems with this, but its topical these days)
    - TypeScript compiler API (good documentation, battle tested, commonly used for similar cases, no support for Angular templates)
    - Angular LSP (no documentation, battle tested, not commonly used for this case, support for Angular templates, limited to LSP capabilities)
    - TypeScript LSP (limited documentation, battle tested, not commonly used for this case, support for Angular templates, limited to LSP capabilities)
  - What option is best suited for us?
    - Will most likely use ts-morph (wrapper over the TypeScript compiler API with built in find and replace).

Proposed solution:

- Build an application that can detect and/or execute the needed updates to the source code.
  - This application purpose is the ASSIST in the update process NOT to replace it.
  - Implementation measured by the amount of detected changes and executed changes.
  - The application should be easely expandable so that it can be used for future updates.

## Problem domain

### What needs to change?

A list of all changes can be found in the [Angular update guide](https://angular.dev/update-guide?v=16.0-20.0&l=3).
There are 79 steps in total which can be grouped into the following 7 categories:

- Version checks (8 total):
  - [ ] Make sure that you are using a supported version of node.js before you upgrade your application. Angular v17 supports node.js versions: v18.13.0 and newer
  - [ ] Make sure that you are using a supported version of TypeScript before you upgrade your application. Angular v17 supports TypeScript version 5.2 or later.
  - [ ] Make sure that you are using a supported version of Zone.js before you upgrade your application. Angular v17 supports Zone.js version 0.14.x or later.
  - [ ] Make sure that you are using a supported version of node.js before you upgrade your application. Angular v18 supports node.js versions: v18.19.0 and newer
  - [ ] Update TypeScript to versions 5.4 or newer.
  - [ ] Upgrade to TypeScript version 5.5 or later.
  - [ ] Ensure your Node.js version is at least 20.11.1 and not v18 or v22.0-v22.10 before upgrading to Angular v20. Check https://angular.dev/reference/versions for the full list of supported Node.js versions.
  - [ ] Upgrade your project's TypeScript version to at least 5.8 before upgrading to Angular v20 to ensure compatibility.
- Commands to run (4 total):
  - [ ] In the application's project directory, run ng update @angular/core@17 @angular/cli@17 to update your application to Angular v17.
  - [ ] In the application's project directory, run ng update @angular/core@18 @angular/cli@18 to update your application to Angular v18.
  - [ ] In the application's project directory, run ng update @angular/core@19 @angular/cli@19 to update your application to Angular v19.
  - [ ] In the application's project directory, run ng update @angular/core@20 @angular/cli@20 to update your application to Angular v20.
- Values to update (18 total, 3 test):
  - [ ] Angular now automatically removes styles of destroyed components, which may impact your existing apps in cases you rely on leaked styles. To change this update the value of the REMOVE_STYLES_ON_COMPONENT_DESTROY provider to false.
  - [ ] Change references to AnimationDriver.NOOP to use NoopAnimationDriver because AnimationDriver.NOOP is now deprecated.
  - [ ] Use update instead of mutate in Angular Signals. For example items.mutate(itemsArray => itemsArray.push(newItem)); will now be items.update(itemsArray => [itemsArray, …newItem]);
  - [ ] Replace async from @angular/core with waitForAsync.
  - [ ] Remove calls to matchesElement because it's now not part of AnimationDriver.
  - [ ] Update the application to remove isPlatformWorkerUi and isPlatformWorkerApp since they were part of platform WebWorker which is now not part of Angular.
  - [ ] Remove calls to Testability methods increasePendingRequestCount, decreasePendingRequestCount, and getPendingRequestCount. This information is tracked by ZoneJS.
  - [ ] Replace the usage of platformDynamicServer with platformServer. Also, add an import @angular/compiler.
  - [ ] Replace usages of BrowserModule.withServerTransition() with injection of the APP_ID token to set the application id instead.
  - [ ] Rename ExperimentalPendingTasks to PendingTasks.
  - [ ] Rename the afterRender lifecycle hook to afterEveryRender
  - [ ] Replace uses of TestBed.flushEffects() with TestBed.tick(), the closest equivalent to synchronously flush effects.
  - [ ] Rename provideExperimentalCheckNoChangesForDebug to provideCheckNoChangesConfig. Note its behavior now applies to all checkNoChanges runs. The useNgZoneOnStable option is no longer available.
  - [ ] Rename the request property passed in resources to params.
  - [ ] Rename the loader property passed in rxResources to stream.
  - [ ] ResourceStatus is no longer an enum. Use the corresponding constant string values instead.
  - [ ] Rename provideExperimentalZonelessChangeDetection to provideZonelessChangeDetection.
  - [ ] Replace all occurrences of the deprecated TestBed.get() method with TestBed.inject() in your Angular tests for dependency injection.
- Configuration changes (4 total):
  - [ ] Make sure you configure setupTestingRouter, canceledNavigationResolution, paramsInheritanceStrategy, titleStrategy, urlUpdateStrategy, urlHandlingStrategy, and malformedUriErrorHandler in provideRouter or RouterModule.forRoot since these properties are now not part of the Router's public API
  - [ ] In @angular/platform-server now pathname is always suffixed with / and the default ports for http: and https: respectively are 80 and 443.
  - [ ] Provide an absolute url instead of using useAbsoluteUrl and baseUrl from PlatformConfig.
  - [ ] In angular.json, replace the "name" option with "project" for the @angular/localize builder.
- Changes to core logic (38 total, 13 test):
  - [ ] For dynamically instantiated components we now execute ngDoCheck during change detection if the component is marked as dirty. You may need to update your tests or logic within ngDoCheck for dynamically instantiated components.
  - [ ] Handle URL parsing errors in the UrlSerializer.parse instead of malformedUriErrorHandler because it's now part of the public API surface.
  - [ ] You may need to adjust your router configuration to prevent infinite redirects after absolute redirects. In v17 we no longer prevent additional redirects after absolute redirects.
  - [ ] To disable hydration use ngSkipHydration or remove the provideClientHydration call from the provider list since withNoDomReuse is no longer part of the public API.
  - [ ] If you want the child routes of loadComponent routes to inherit data from their parent specify the paramsInheritanceStrategy to always, which in v17 is now set to emptyOnly.
  - [ ] Use includeRequestsWithAuthHeaders: true in withHttpTransferCache to opt-in of caching for HTTP requests that require authorization.
  - [ ] Tests may run additional rounds of change detection to fully reflect test state in the DOM. As a last resort, revert to the old behavior by adding provideZoneChangeDetection({ignoreChangesOutsideZone: true}) to the TestBed providers.
  - [ ] Remove expressions that write to properties in templates that use [(ngModel)]
  - [ ] Move any environment providers that should be available to routed components from the component that defines the RouterOutlet to the providers of bootstrapApplication or the Route config.
  - [ ] When a guard returns a UrlTree as a redirect, the redirecting navigation will now use replaceUrl if the initial navigation was also using the replaceUrl option. If you prefer the previous behavior, configure the redirect using the new NavigationBehaviorOptions by returning a RedirectCommand with the desired options instead of UrlTree.
  - [ ] Remove dependencies of RESOURCE_CACHE_PROVIDER since it's no longer part of the Angular runtime.
  - [ ] Route.redirectTo can now include a function in addition to a string. Any code which reads Route objects directly and expects redirectTo to be a string may need to update to account for functions as well.
  - [ ] Route guards and resolvers can now return a RedirectCommand object in addition to a UrlTree and boolean. Any code which reads Route objects directly and expects only boolean or UrlTree may need to update to account for RedirectCommand as well.
  - [ ] For any components using OnPush change detection, ensure they are properly marked dirty to enable host binding updates.
  - [ ] Be aware that newly created views or views marked for check and reattached during change detection are now guaranteed to be refreshed in that same change detection cycle.
  - [ ] After aligning the semantics of ComponentFixture.whenStable and ApplicationRef.isStable, your tests may wait longer when using whenStable.
  - [ ] Angular directives, components and pipes are now standalone by default. Specify "standalone: false" for declarations that are currently declared in an NgModule. The Angular CLI will automatically update your code to reflect that.
  - [ ] The factories property in KeyValueDiffers has been removed.
  - [ ] Update tests that relied on the Promise timing of effects to use await whenStable() or call .detectChanges() to trigger effects. For effects triggered during change detection, ensure they don't depend on the application being fully rendered or consider using afterRenderEffect(). Tests using faked clocks may need to fast-forward/flush the clock.
  - [ ] Update tests using fakeAsync that rely on specific timing of zone coalescing and scheduling when a change happens outside the Angular zone (hybrid mode scheduling) as these timers are now affected by tick and flush.
  - [ ] When using createComponent API and not passing content for the first ng-content, provide document.createTextNode('') as a projectableNode to prevent rendering the default fallback content.
  - [ ] Update tests that rely on specific timing or ordering of change detection around custom elements, as the timing may have changed due to the switch to the hybrid scheduler.
  - [ ] Migrate from using Router.errorHandler to withNavigationErrorHandler from provideRouter or errorHandler from RouterModule.forRoot.
  - [ ] Update tests to handle errors thrown during ApplicationRef.tick by either triggering change detection synchronously or rejecting outstanding ComponentFixture.whenStable promises.
  - [ ] Update usages of Resolve interface to include RedirectCommand in its return type.
  - [ ] fakeAsync will flush pending timers by default. For tests that require the previous behavior, explicitly pass {flush: false} in the options parameter.
  - [ ] Refactor application and test code to avoid relying on ng-reflect-\* attributes. If needed temporarily for migration, use provideNgReflectAttributes() from @angular/core in bootstrap providers to re-enable them in dev mode only.
  - [ ] Adjust code that directly calls functions returning RedirectFn. These functions can now also return an Observable or Promise; ensure your logic correctly handles these asynchronous return types.
  - [ ] The type for the commands arrays passed to Router methods (createUrlTree, navigate, createUrlTreeFromSnapshot) have been updated to use readonly T[] since the array is not mutated. Code which extracts these types (e.g. with typeof) may need to be adjusted if it expects mutable arrays.
  - [ ] Review and update tests asserting on DOM elements involved in animations. Animations are now guaranteed to be flushed with change detection or ApplicationRef.tick, potentially altering previous test outcomes.
  - [ ] In tests, uncaught errors in event listeners are now rethrown by default. Previously, these were only logged to the console by default. Catch them if intentional for the test case, or use rethrowApplicationErrors: false in configureTestingModule as a last resort.
  - [ ] The any type is removed from the Route guard arrays (canActivate, canDeactivate, etc); ensure guards are functions, ProviderToken<T>, or (deprecated) strings. Refactor string guards to ProviderToken<T> or functions.
  - [ ] Remove InjectFlags enum and its usage from inject, Injector.get, EnvironmentInjector.get, and TestBed.inject calls. Use options like {optional: true} for inject or handle null for \*.get methods.
  - [ ] Update injector.get() calls to use a specific ProviderToken<T> instead of relying on the removed any overload. If using string tokens (deprecated since v4), migrate them to ProviderToken<T>.
  - [ ] Unhandled errors in subscriptions/promises of AsyncPipe are now directly reported to ErrorHandler. This may alter test outcomes; ensure tests correctly handle these reported errors.
  - [ ] If relying on the return value of PendingTasks.run, refactor to use PendingTasks.add. Handle promise results/rejections manually, especially for SSR to prevent node process shutdown on unhandled rejections.
  - [ ] Review DatePipe usages. Using the Y (week-numbering year) formatter without also including w (week number) is now detected as suspicious. Use y (year) if that was the intent, or include w alongside Y.
  - [ ] In templates parentheses are now always respected. This can lead to runtime breakages when nullish coalescing were nested in parathesis. eg (foo?.bar).baz will throw if foo is nullish as it would in native JavaScript.
- Changes to import statements (3 total):
  - [ ] Change Zone.js deep imports like zone.js/bundles/zone-testing.js and zone.js/dist/zone to zone.js and zone.js/testing.
  - [ ] Import StateKey and TransferState from @angular/core instead of @angular/platform-browser.
  - [ ] Remove all imports of ServerTransferStateModule from your application. It is no longer needed.
- Changes to templates (4 total):
  - [ ] You may need to adjust the equality check for NgSwitch because now it defaults to stricter check with === instead of ==. Angular will log a warning message for the usages where you'd need to provide an adjustment.
  - [ ] Remove this. prefix when accessing template reference variables. For example, refactor <div #foo></div>{{ this.foo }} to <div #foo></div>{{ foo }}
  - [ ] If your templates use {{ in }} or in in expressions to refer to a component property named 'in', change it to {{ this.in }} or this.in as 'in' now refers to the JavaScript 'in' operator. If you're using in as a template reference, you'd have to rename the reference.f your templates use {{ in }} or in in expressions to refer to a component property named 'in', change it to {{ this.in }} or this.in as 'in' now refers to the JavaScript 'in' operator. If you're using in as a template reference, you'd have to rename the reference.
  - [ ] If your templates use {{ void }} or void in expressions to refer to a component property named 'void', change it to {{ this.void }} or this.void as 'void' now refers to the JavaScript void operator.

## Solution domain

### Which changes can be automized?

- Version checks (8 total): Versions need to be updated.
- Commands to run (4 total): These commands need to be executed.
- Values to update (18 total, 3 test): These values have either been removed or deprecated, changing them should not change the program.
- Configuration changes (4 total): This can cause major changes, each configuration change should be evaluated individually.
- Changes to core logic (38 total, 13 test): Most of these are not possible to automate since there is a change in logic. Should be evaluated individually.
- Changes to import statements (3 total): Should not change the program, and additional check should be made to see if the old import is still needed.
- Changes to templates (4 total): Don't know if possible since Angular templates are interpreted html.

From a glace it appears that 33/79 (41.77%) of the total changes are definitly possible to automate.
If we ignore the changes to tests, this comes to 30/63 (47.61%)
