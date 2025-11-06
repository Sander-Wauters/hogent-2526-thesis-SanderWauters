/******************************************************************************
 *
 *
 * Updates Angular from version 18 to 19.
 *
 *
 *****************************************************************************/

import { loadProject, saveProject } from "../util/projectio.js";
import { Capability, Change, logStepData, StepData } from "../util/metrics.js";
import { Project, SyntaxKind } from "ts-morph";
import {
  findNodes,
  getAncestor,
  hasType,
  lastInstanceInTree,
} from "../util/traversal.js";

const project = loadProject();

/******************************************************************************
 * Define steps.
 *****************************************************************************/

function step43(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "withServerTransition") &&
        findNodes(
          getAncestor(node, 3)!,
          (ancestor) => hasType(ancestor, "BrowserModule"),
          () => {},
        ),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.PARTIALLY;
        node
          .getFirstAncestorByKind(SyntaxKind.CallExpression)
          ?.replaceWithText(`BrowserModule`);
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    description:
      "Replace usages of BrowserModule.withServerTransition() with injection of the APP_ID token to set the application id instead.",
  };
}

function step44(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "factories") &&
        findNodes(
          getAncestor(node, 3)!,
          (ancestor) => hasType(ancestor, "KeyValueDiffers"),
          () => {},
        ),
      () => {
        detection = Capability.FULLY;
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    description: "The factories property in KeyValueDiffers has been removed.",
  };
}

function step49(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "fakeAsync") &&
        node.getKind() == SyntaxKind.Identifier &&
        node.getParent()?.getKind() === SyntaxKind.CallExpression,
      () => {
        detection = Capability.FULLY;
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
    description:
      "Update tests using fakeAsync that rely on specific timing of zone coalescing and scheduling when a change happens outside the Angular zone (hybrid mode scheduling) as these timers are now affected by tick and flush.",
  };
}

/******************************************************************************
 * Execute steps and register data.
 *****************************************************************************/

const metrics: StepData[] = [];
metrics.push({
  // 40 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description:
    "In the application's project directory, run ng update @angular/core@19 @angular/cli@19 to update your application to Angular v19.",
});
metrics.push({
  // 41 - Angular CLI already does this.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  description: `Angular directives, components and pipes are now standalone by default. Specify "standalone: false" for declarations that are currently declared in an NgModule. The Angular CLI will automatically update your code to reflect that.`,
});
metrics.push({
  // 42 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  description:
    "Remove this. prefix when accessing template reference variables. For example, refactor <div #foo></div>{{ this.foo }} to <div #foo></div>{{ foo }}",
});
metrics.push(step43(project));
metrics.push(step44(project));
metrics.push({
  // 45 - Can't access JSON.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_JSON | Change.TO_SYNTAX,
  description: `In angular.json, replace the "name" option with "project" for the @angular/localize builder.`,
});
metrics.push({
  // 46 - Feature added in v18.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  description: "Rename ExperimentalPendingTasks to PendingTasks.",
});
metrics.push({
  // 47 - Way to many variables to chack.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  description:
    "Update tests that relied on the Promise timing of effects to use await whenStable() or call .detectChanges() to trigger effects. For effects triggered during change detection, ensure they don't depend on the application being fully rendered or consider using afterRenderEffect(). Tests using faked clocks may need to fast-forward/flush the clock.",
});
metrics.push({
  // 48 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description: "Upgrade to TypeScript version 5.5 or later.",
});
metrics.push(step49(project));
metrics.push({
  // 50 - Detection is dependant on templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEMPLATE | Change.TO_SEMANTICS,
  description:
    "When using createComponent API and not passing content for the first ng-content, provide document.createTextNode('') as a projectableNode to prevent rendering the default fallback content.",
});

logStepData(metrics);

await saveProject(project, true);
