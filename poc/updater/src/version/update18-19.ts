/******************************************************************************
 *
 *
 * Updates Angular from version 18 to 19.
 *
 *
 *****************************************************************************/

import { loadControlenv, loadTestenv, saveProject } from "../util/projectio.js";
import {
  Capability,
  Change,
  logStepData,
  StepData,
  validate,
} from "../util/metrics.js";
import { Project, SyntaxKind } from "ts-morph";
import {
  accessedFrom,
  findNodes,
  getAncestor,
  hasType,
  lastInstanceInTree,
} from "../util/traversal.js";

const project = loadTestenv();
const control = loadControlenv();

/******************************************************************************
 * Define steps.
 *****************************************************************************/

function step43(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
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
        node
          .getFirstAncestorByKind(SyntaxKind.CallExpression)
          ?.replaceWithText(`BrowserModule`);
        automation = Capability.PARTIALLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    changedFiles,
    description:
      "Replace usages of BrowserModule.withServerTransition() with injection of the APP_ID token to set the application id instead.",
  };
}

function step44(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
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
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    changedFiles,
    description: "The factories property in KeyValueDiffers has been removed.",
  };
}

function step49(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "fakeAsync") &&
        node.getKind() == SyntaxKind.Identifier &&
        node.getParent()?.getKind() === SyntaxKind.CallExpression,
      () => {
        detection = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
    changedFiles,
    description:
      "Update tests using fakeAsync that rely on specific timing of zone coalescing and scheduling when a change happens outside the Angular zone (hybrid mode scheduling) as these timers are now affected by tick and flush.",
  };
}

function step52(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "errorHandler") &&
        findNodes(
          getAncestor(node, 3)!,
          (ancestor) => hasType(ancestor, "Router"),
          () => {},
        ),
      () => {
        detection = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    changedFiles,
    description:
      "Migrate from using Router.errorHandler to withNavigationErrorHandler from provideRouter or errorHandler from RouterModule.forRoot.",
  };
}

function step53(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "tick") &&
        node.getParent()?.getKind() == SyntaxKind.CallExpression &&
        findNodes(
          getAncestor(node, 3)!,
          (ancestor) => hasType(ancestor, "ApplicationRef"),
          () => {},
        ),
      () => {
        detection = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
    changedFiles,
    description:
      "Update tests to handle errors thrown during ApplicationRef.tick by either triggering change detection synchronously or rejecting outstanding ComponentFixture.whenStable promises.",
  };
}

function step54(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "resolve") && accessedFrom(node, "Resolve"),
      () => {
        detection = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    changedFiles,
    description:
      "Update usages of Resolve interface to include RedirectCommand in its return type.",
  };
}

function step55(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "fakeAsync") &&
        node.getKind() === SyntaxKind.Identifier &&
        node.getParent()?.getKind() === SyntaxKind.CallExpression,
      () => {
        detection = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
    changedFiles,
    description:
      "fakeAsync will flush pending timers by default. For tests that require the previous behavior, explicitly pass {flush: false} in the options parameter.",
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
  changedFiles: [],
  description:
    "In the application's project directory, run ng update @angular/core@19 @angular/cli@19 to update your application to Angular v19.",
});
metrics.push({
  // 41 - Angular CLI already does this.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  description: `Angular directives, components and pipes are now standalone by default. Specify "standalone: false" for declarations that are currently declared in an NgModule. The Angular CLI will automatically update your code to reflect that.`,
});
metrics.push({
  // 42 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  changedFiles: [],
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
  changedFiles: [],
  description: `In angular.json, replace the "name" option with "project" for the @angular/localize builder.`,
});
metrics.push({
  // 46 - Feature added in v18.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  description: "Rename ExperimentalPendingTasks to PendingTasks.",
});
metrics.push({
  // 47 - Way to many variables to chack.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  description:
    "Update tests that relied on the Promise timing of effects to use await whenStable() or call .detectChanges() to trigger effects. For effects triggered during change detection, ensure they don't depend on the application being fully rendered or consider using afterRenderEffect(). Tests using faked clocks may need to fast-forward/flush the clock.",
});
metrics.push({
  // 48 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  description: "Upgrade to TypeScript version 5.5 or later.",
});
metrics.push(step49(project));
metrics.push({
  // 50 - Detection is dependant on templates.
  detection: Capability.PARTIALLY,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEMPLATE | Change.TO_SEMANTICS,
  changedFiles: [],
  description:
    "When using createComponent API and not passing content for the first ng-content, provide document.createTextNode('') as a projectableNode to prevent rendering the default fallback content.",
});
metrics.push({
  // 51 - Timing and ordering of change detection is way to hard to find. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  description:
    "Update tests that rely on specific timing or ordering of change detection around custom elements, as the timing may have changed due to the switch to the hybrid scheduler.",
});
metrics.push(step52(project));
metrics.push(step53(project));
metrics.push(step54(project));
metrics.push(step55(project));

validate(project, control, metrics);
logStepData(metrics);

await saveProject(project, true);
