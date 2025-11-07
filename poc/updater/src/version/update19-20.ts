/******************************************************************************
 *
 *
 * Updates Angular from version 19 to 20.
 *
 *
 *****************************************************************************/

import { loadProject, saveProject } from "../util/projectio.js";
import { Capability, Change, logStepData, StepData } from "../util/metrics.js";
import { Project, SyntaxKind } from "ts-morph";
import {
  accessedFrom,
  findNodes,
  inScopeOf,
  lastInstanceInTree,
} from "../util/traversal.js";

const project = loadProject();

/******************************************************************************
 * Define steps.
 *****************************************************************************/

function step57(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "afterRender") &&
        (node.getParent()?.getKind() === SyntaxKind.CallExpression ||
          !!inScopeOf(node, SyntaxKind.ImportDeclaration)),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("afterEveryRender");
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    description: "Rename the afterRender lifecycle hook to afterEveryRender",
  };
}

function step70(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) => {
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "canActivate") && accessedFrom(node, "Route"),
      () => {
        detection = Capability.FULLY;
      },
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "canDeactivate") &&
        accessedFrom(node, "Route"),
      () => {
        detection = Capability.FULLY;
      },
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "canMatch") && accessedFrom(node, "Route"),
      () => {
        detection = Capability.FULLY;
      },
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "canActivateChild") &&
        accessedFrom(node, "Route"),
      () => {
        detection = Capability.FULLY;
      },
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    description:
      "The any type is removed from the Route guard arrays (canActivate, canDeactivate, etc); ensure guards are functions, ProviderToken<T>, or (deprecated) strings. Refactor string guards to ProviderToken<T> or functions.",
  };
}

/******************************************************************************
 * Execute steps and register data.
 *****************************************************************************/

const metrics: StepData[] = [];
metrics.push({
  // 56 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description:
    "In the application's project directory, run ng update @angular/core@20 @angular/cli@20 to update your application to Angular v20.",
});
metrics.push(step57(project));
metrics.push({
  // 58 - Feature added in v17.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  description:
    "Replace uses of TestBed.flushEffects() with TestBed.tick(), the closest equivalent to synchronously flush effects.",
});
metrics.push({
  // 59 - Feature added in v18.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  description:
    "Rename provideExperimentalCheckNoChangesForDebug to provideCheckNoChangesConfig. Note its behavior now applies to all checkNoChanges runs. The useNgZoneOnStable option is no longer available.",
});
metrics.push({
  // 60 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags:
    Change.IN_TYPESCRIPT |
    Change.IN_TEMPLATE |
    Change.IN_TEST |
    Change.TO_SEMANTICS,
  description:
    "Refactor application and test code to avoid relying on ng-reflect-\* attributes. If needed temporarily for migration, use provideNgReflectAttributes() from @angular/core in bootstrap providers to re-enable them in dev mode only.",
});
metrics.push({
  // 61 - To many variables.
  detection: Capability.PARTIALLY,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  description:
    "Adjust code that directly calls functions returning RedirectFn. These functions can now also return an Observable or Promise; ensure your logic correctly handles these asynchronous return types.",
});
metrics.push({
  // 62 - Feature added in v19.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  description: "Rename the request property passed in resources to params.",
});
metrics.push({
  // 63 - Feature added in v19.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  description: "Rename the loader property passed in rxResources to stream.",
});
metrics.push({
  // 64 - Feature added in v19.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  description:
    "ResourceStatus is no longer an enum. Use the corresponding constant string values instead.",
});
metrics.push({
  // 65 - Feature added in v18.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  description:
    "Rename provideExperimentalZonelessChangeDetection to provideZonelessChangeDetection.",
});
metrics.push({
  // 66 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  description:
    "If your templates use {{ in }} or in in expressions to refer to a component property named 'in', change it to {{ this.in }} or this.in as 'in' now refers to the JavaScript 'in' operator. If you're using in as a template reference, you'd have to rename the reference.",
});
metrics.push({
  // 67 - To many variables. Type extraction is to complex to detect.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  description:
    "The type for the commands arrays passed to Router methods (createUrlTree, navigate, createUrlTreeFromSnapshot) have been updated to use readonly T[] since the array is not mutated. Code which extracts these types (e.g. with typeof) may need to be adjusted if it expects mutable arrays.",
});
metrics.push({
  // 68 - To complex to figure out if a test case checks a dom element involved in an animation.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  description:
    "Review and update tests asserting on DOM elements involved in animations. Animations are now guaranteed to be flushed with change detection or ApplicationRef.tick, potentially altering previous test outcomes.",
});
metrics.push({
  // 69 - Event listeners are a template thing. Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags:
    Change.IN_TYPESCRIPT |
    Change.IN_TEST |
    Change.IN_TEMPLATE |
    Change.TO_SEMANTICS,
  description:
    "In tests, uncaught errors in event listeners are now rethrown by default. Previously, these were only logged to the console by default. Catch them if intentional for the test case, or use rethrowApplicationErrors: false in configureTestingModule as a last resort.",
});
metrics.push(step70(project));

logStepData(metrics);

await saveProject(project, true);
