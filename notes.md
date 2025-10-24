# Notes

## Include in thesis

- Mention the practical and organizational aspects of every descision made. Don't focus on only the academic.
- When talking about the time to implement something, mention how that time is spent. Is it research, implementation, communication, etc.

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

Legend:
x = Not possible.
c = CLI operation.
t = Change to template.
o = Possible.
? = Can't find info about this.

1.  Make sure that you are using a supported version of node.js before you upgrade your application. Angular v17 supports node.js versions: v18.13.0 and newer
    [oc] CLI operation.
2.  Make sure that you are using a supported version of TypeScript before you upgrade your application. Angular v17 supports TypeScript version 5.2 or later.
    [oc] CLI operation.
3.  Make sure that you are using a supported version of Zone.js before you upgrade your application. Angular v17 supports Zone.js version 0.14.x or later.
    [oc] CLI operation.
4.  In the application's project directory, run ng update @angular/core@17 @angular/cli@17 to update your application to Angular v17.
    [oc] CLI operation.
5.  Angular now automatically removes styles of destroyed components, which may impact your existing apps in cases you rely on leaked styles. To change this update the value of the REMOVE_STYLES_ON_COMPONENT_DESTROY provider to false.
    [o] Done.
6.  Make sure you configure setupTestingRouter, canceledNavigationResolution, paramsInheritanceStrategy, titleStrategy, urlUpdateStrategy, urlHandlingStrategy, and malformedUriErrorHandler in provideRouter or RouterModule.forRoot since these properties are now not part of the Router's public API
    [x?] Way to specific.
7.  For dynamically instantiated components we now execute ngDoCheck during change detection if the component is marked as dirty. You may need to update your tests or logic within ngDoCheck for dynamically instantiated components.
    [x?] Way to specific.
8.  Handle URL parsing errors in the UrlSerializer.parse instead of malformedUriErrorHandler because it's now part of the public API surface.
    [x] This is a change over multiple classes and function.
9.  Change Zone.js deep imports like zone.js/bundles/zone-testing.js and zone.js/dist/zone to zone.js and zone.js/testing.
    [x?] Imports do not exist.
10. You may need to adjust your router configuration to prevent infinite redirects after absolute redirects. In v17 we no longer prevent additional redirects after absolute redirects.
    [x?] Way to specific.
11. Change references to AnimationDriver.NOOP to use NoopAnimationDriver because AnimationDriver.NOOP is now deprecated.
    [o] Done.
12. You may need to adjust the equality check for NgSwitch because now it defaults to stricter check with === instead of ==. Angular will log a warning message for the usages where you'd need to provide an adjustment.
    [xt] Can't access templates.
13. Use update instead of mutate in Angular Signals. For example items.mutate(itemsArray => itemsArray.push(newItem)); will now be items.update(itemsArray => [itemsArray, …newItem]);
    [o] Done.
14. To disable hydration use ngSkipHydration or remove the provideClientHydration call from the provider list since withNoDomReuse is no longer part of the public API.
    [o] Done.
15. If you want the child routes of loadComponent routes to inherit data from their parent specify the paramsInheritanceStrategy to always, which in v17 is now set to emptyOnly.
    [x?] Way to specific.
16. Make sure that you are using a supported version of node.js before you upgrade your application. Angular v18 supports node.js versions: v18.19.0 and newer
    [oc] CLI operation.
17. In the application's project directory, run ng update @angular/core@18 @angular/cli@18 to update your application to Angular v18.
    [oc] CLI operation.
18. Update TypeScript to versions 5.4 or newer.
    [oc] CLI operation.
19. Replace async from @angular/core with waitForAsync.
    [o] Done.
20. Remove calls to matchesElement because it's now not part of AnimationDriver.
    [x] To complex.
21. Import StateKey and TransferState from @angular/core instead of @angular/platform-browser.
    [o] Done.
22. Use includeRequestsWithAuthHeaders: true in withHttpTransferCache to opt-in of caching for HTTP requests that require authorization.
    [x] Can't find withHttpTransferCache anyware.
23. Update the application to remove isPlatformWorkerUi and isPlatformWorkerApp since they were part of platform WebWorker which is now not part of Angular.
    [o] Done.
24. Tests may run additional rounds of change detection to fully reflect test state in the DOM. As a last resort, revert to the old behavior by adding provideZoneChangeDetection({ignoreChangesOutsideZone: true}) to the TestBed providers.
    [x] Way to specific.
25. Remove expressions that write to properties in templates that use [(ngModel)]
    [xt] Can't access templates.
26. Remove calls to Testability methods increasePendingRequestCount, decreasePendingRequestCount, and getPendingRequestCount. This information is tracked by ZoneJS.
    [x] To complex, needs to be evaluated case by case.
27. Move any environment providers that should be available to routed components from the component that defines the RouterOutlet to the providers of bootstrapApplication or the Route config.
    [x?] What?
28. When a guard returns a UrlTree as a redirect, the redirecting navigation will now use replaceUrl if the initial navigation was also using the replaceUrl option. If you prefer the previous behavior, configure the redirect using the new NavigationBehaviorOptions by returning a RedirectCommand with the desired options instead of UrlTree.
    [x?] Way to specific.
29. Remove dependencies of RESOURCE_CACHE_PROVIDER since it's no longer part of the Angular runtime.
    [o] Done... sort of. It's possible but there are edge cases.
30. In @angular/platform-server now pathname is always suffixed with / and the default ports for http: and https: respectively are 80 and 443.
    [x?] What needs to change here?
31. Provide an absolute url instead of using useAbsoluteUrl and baseUrl from PlatformConfig.
    [o] Done... sort of. It leaves a ',' that get's picked up by the compiler as an error.
32. Replace the usage of platformDynamicServer with platformServer. Also, add an import @angular/compiler.
    [o] Done.
33. Remove all imports of ServerTransferStateModule from your application. It is no longer needed.
    [o] Done... sort of. It leaves a ',' that get's picked up by the compiler as an error.
34. Route.redirectTo can now include a function in addition to a string. Any code which reads Route objects directly and expects redirectTo to be a string may need to update to account for functions as well.
    [ ]
35. Route guards and resolvers can now return a RedirectCommand object in addition to a UrlTree and boolean. Any code which reads Route objects directly and expects only boolean or UrlTree may need to update to account for RedirectCommand as well.
    [ ]
36. For any components using OnPush change detection, ensure they are properly marked dirty to enable host binding updates.
    [ ]
37. Be aware that newly created views or views marked for check and reattached during change detection are now guaranteed to be refreshed in that same change detection cycle.
    [x?] Way to specific.
38. After aligning the semantics of ComponentFixture.whenStable and ApplicationRef.isStable, your tests may wait longer when using whenStable.
    [x?] Way to specific.
39. You may experience tests failures if you have tests that rely on change detection execution order when using ComponentFixture.autoDetect because it now executes change detection for fixtures within ApplicationRef.tick. For example, this will cause test fixture to refresh before any dialogs that it creates whereas this may have been the other way around in the past.
    [x?] Way to specific.
40. In the application's project directory, run ng update @angular/core@19 @angular/cli@19 to update your application to Angular v19.
    [oc] CLI operation.
41. Angular directives, components and pipes are now standalone by default. Specify "standalone: false" for declarations that are currently declared in an NgModule. The Angular CLI will automatically update your code to reflect that.
    [ ]
42. Remove this. prefix when accessing template reference variables. For example, refactor <div #foo></div>{{ this.foo }} to <div #foo></div>{{ foo }}
    [xt] Can't access templates.
43. Replace usages of BrowserModule.withServerTransition() with injection of the APP_ID token to set the application id instead.
    [ ]
44. The factories property in KeyValueDiffers has been removed.
    [ ]
45. In angular.json, replace the "name" option with "project" for the @angular/localize builder.
    [x] Can't access json.
46. Rename ExperimentalPendingTasks to PendingTasks.
    [x] Added in v18.
47. Update tests that relied on the Promise timing of effects to use await whenStable() or call .detectChanges() to trigger effects. For effects triggered during change detection, ensure they don't depend on the application being fully rendered or consider using afterRenderEffect(). Tests using faked clocks may need to fast-forward/flush the clock.
    [x?] Way to specific.
48. Upgrade to TypeScript version 5.5 or later.
    [x] CLI operation.
49. Update tests using fakeAsync that rely on specific timing of zone coalescing and scheduling when a change happens outside the Angular zone (hybrid mode scheduling) as these timers are now affected by tick and flush.
    [ ]
50. When using createComponent API and not passing content for the first ng-content, provide document.createTextNode('') as a projectableNode to prevent rendering the default fallback content.
    [ ]
51. Update tests that rely on specific timing or ordering of change detection around custom elements, as the timing may have changed due to the switch to the hybrid scheduler.
    [x?] Way to specific.
52. Migrate from using Router.errorHandler to withNavigationErrorHandler from provideRouter or errorHandler from RouterModule.forRoot.
    [ ]
53. Update tests to handle errors thrown during ApplicationRef.tick by either triggering change detection synchronously or rejecting outstanding ComponentFixture.whenStable promises.
    [ ]
54. Update usages of Resolve interface to include RedirectCommand in its return type.
    [ ]
55. fakeAsync will flush pending timers by default. For tests that require the previous behavior, explicitly pass {flush: false} in the options parameter.
    [ ]
56. In the application's project directory, run ng update @angular/core@20 @angular/cli@20 to update your application to Angular v20.
    [oc] CLI operation.
57. Rename the afterRender lifecycle hook to afterEveryRender
    [ ]
58. Replace uses of TestBed.flushEffects() with TestBed.tick(), the closest equivalent to synchronously flush effects.
    [x] Added in v17.
59. Rename provideExperimentalCheckNoChangesForDebug to provideCheckNoChangesConfig. Note its behavior now applies to all checkNoChanges runs. The useNgZoneOnStable option is no longer available.
    [x] Added in v18.
60. Refactor application and test code to avoid relying on ng-reflect-\* attributes. If needed temporarily for migration, use provideNgReflectAttributes() from @angular/core in bootstrap providers to re-enable them in dev mode only.
    [x] Can't access templates.
61. Adjust code that directly calls functions returning RedirectFn. These functions can now also return an Observable or Promise; ensure your logic correctly handles these asynchronous return types.
    [x?] Can't find any reference to RedirectFn.
62. Rename the request property passed in resources to params.
    [x] Added in v19.
63. Rename the loader property passed in rxResources to stream.
    [x] Added in v19.
64. ResourceStatus is no longer an enum. Use the corresponding constant string values instead.
    [x] Added in v19.
65. Rename provideExperimentalZonelessChangeDetection to provideZonelessChangeDetection.
    [x] Added in v18.
66. If your templates use {{ in }} or in in expressions to refer to a component property named 'in', change it to {{ this.in }} or this.in as 'in' now refers to the JavaScript 'in' operator. If you're using in as a template reference, you'd have to rename the reference.
    [xt] Can't access templates.
67. The type for the commands arrays passed to Router methods (createUrlTree, navigate, createUrlTreeFromSnapshot) have been updated to use readonly T[] since the array is not mutated. Code which extracts these types (e.g. with typeof) may need to be adjusted if it expects mutable arrays.
    [ ]
68. Review and update tests asserting on DOM elements involved in animations. Animations are now guaranteed to be flushed with change detection or ApplicationRef.tick, potentially altering previous test outcomes.
    [ ]
69. In tests, uncaught errors in event listeners are now rethrown by default. Previously, these were only logged to the console by default. Catch them if intentional for the test case, or use rethrowApplicationErrors: false in configureTestingModule as a last resort.
    [ ]
70. The any type is removed from the Route guard arrays (canActivate, canDeactivate, etc); ensure guards are functions, ProviderToken<T>, or (deprecated) strings. Refactor string guards to ProviderToken<T> or functions.
    [ ]
71. Ensure your Node.js version is at least 20.11.1 and not v18 or v22.0-v22.10 before upgrading to Angular v20. Check https://angular.dev/reference/versions for the full list of supported Node.js versions.
    [oc] CLI operation.
72. Replace all occurrences of the deprecated TestBed.get() method with TestBed.inject() in your Angular tests for dependency injection.
    [ ]
73. Remove InjectFlags enum and its usage from inject, Injector.get, EnvironmentInjector.get, and TestBed.inject calls. Use options like {optional: true} for inject or handle null for \*.get methods.
    [ ]
74. Update injector.get() calls to use a specific ProviderToken<T> instead of relying on the removed any overload. If using string tokens (deprecated since v4), migrate them to ProviderToken<T>.
    [ ]
75. Upgrade your project's TypeScript version to at least 5.8 before upgrading to Angular v20 to ensure compatibility.
    [oc] CLI operation.
76. Unhandled errors in subscriptions/promises of AsyncPipe are now directly reported to ErrorHandler. This may alter test outcomes; ensure tests correctly handle these reported errors.
    [ ]
77. If relying on the return value of PendingTasks.run, refactor to use PendingTasks.add. Handle promise results/rejections manually, especially for SSR to prevent node process shutdown on unhandled rejections.
    [x] Added in v19.
78. If your templates use {{ void }} or void in expressions to refer to a component property named 'void', change it to {{ this.void }} or this.void as 'void' now refers to the JavaScript void operator.
    [xt] Can't access templates.
79. Review DatePipe usages. Using the Y (week-numbering year) formatter without also including w (week number) is now detected as suspicious. Use y (year) if that was the intent, or include w alongside Y.
    [xt] Can't access templates.
80. In templates parentheses are now always respected. This can lead to runtime breakages when nullish coalescing were nested in parathesis. eg (foo?.bar).baz will throw if foo is nullish as it would in native JavaScript.
    [xt] Can't access templates.

### Catagories

Total changes: 80
Changes to templates: 7
CLI operations: 11
Changes to features after added after v16: 8
