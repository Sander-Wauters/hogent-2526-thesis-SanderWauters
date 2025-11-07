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

function step72(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "get") &&
        !!inScopeOf(node, SyntaxKind.CallExpression) &&
        accessedFrom(node, "TestBed"),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("inject");
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SYNTAX,
    description:
      "Replace all occurrences of the deprecated TestBed.get() method with TestBed.inject() in your Angular tests for dependency injection.",
  };
}

function step73(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) => {
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.Default"),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("{}"); // Hacky way to ensure that there are not trailing comma's.
      },
    );
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.Host"),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("{ host: true }");
      },
    );
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.Self"),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("{ self: true }");
      },
    );
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.SkipSelf"),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("{ skipSelf: true }");
      },
    );
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.Optional"),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("{ optional: true }");
      },
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SYNTAX,
    description:
      "Remove InjectFlags enum and its usage from inject, Injector.get, EnvironmentInjector.get, and TestBed.inject calls. Use options like {optional: true} for inject or handle null for \*.get methods.",
  };
}

function step74(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "get") &&
        !!inScopeOf(node, SyntaxKind.CallExpression) &&
        accessedFrom(node, "Injector"),
      () => {
        detection = Capability.FULLY;
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    description:
      "Update injector.get() calls to use a specific ProviderToken<T> instead of relying on the removed any overload. If using string tokens (deprecated since v4), migrate them to ProviderToken<T>.",
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
metrics.push({
  // 71 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description:
    "Ensure your Node.js version is at least 20.11.1 and not v18 or v22.0-v22.10 before upgrading to Angular v20. Check https://angular.dev/reference/versions for the full list of supported Node.js versions.",
});
metrics.push(step72(project));
metrics.push(step73(project));
metrics.push(step74(project));
metrics.push({
  // 75 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description:
    "Upgrade your project's TypeScript version to at least 5.8 before upgrading to Angular v20 to ensure compatibility.",
});

logStepData(metrics);

await saveProject(project, true);
