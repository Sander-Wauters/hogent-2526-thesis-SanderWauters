/******************************************************************************
 *
 *
 * Updates Angular from version 16 to 17.
 *
 *
 *****************************************************************************/

import { Project } from "ts-morph";
import { loadControlenv, loadTestenv, saveProject } from "../util/projectio.js";
import {
  Capability,
  Change,
  logStepData,
  StepData,
  validate,
} from "../util/metrics.js";
import {
  accessedFrom,
  findNodes,
  getAncestor,
  hasType,
  deepestInstanceOf,
} from "../util/traversal.js";

const project = loadTestenv();
const control = loadControlenv();

/******************************************************************************
 * Define steps.
 *****************************************************************************/

function step05(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) => deepestInstanceOf(node, "REMOVE_STYLES_ON_COMPONENT_DESTROY"),
      (node) => {
        detection = Capability.PARTIALLY;
        findNodes(
          getAncestor(node, 2)!,
          (node) => deepestInstanceOf(node, "useValue: true"),
          (node) => {
            node.replaceWithText("useValue: false");
            automation = Capability.PARTIALLY;
            changedFiles.push(file.getBaseName());
          },
        );
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX | Change.TO_SEMANTICS,
    changedFiles,
    changeImplemented: true,
    description:
      "Angular now automatically removes styles of destroyed components, which may impact your existing apps in cases you rely on leaked styles. To change this update the value of the REMOVE_STYLES_ON_COMPONENT_DESTROY provider to false.",
  };
}

function step11(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        deepestInstanceOf(node, "AnimationDriver.NOOP") &&
        hasType(node, "AnimationDriver"),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("NoopAnimationDriver");
        automation = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    changedFiles,
    changeImplemented: true,
    description:
      "Change references to AnimationDriver.NOOP to use NoopAnimationDriver because AnimationDriver.NOOP is now deprecated.",
  };
}

function step13(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        deepestInstanceOf(node, "mutate") &&
        accessedFrom(node, "WritableSignal"),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("update");
        automation = Capability.PARTIALLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX | Change.TO_SEMANTICS,
    changedFiles,
    changeImplemented: true,
    description:
      "Use update instead of mutate in Angular Signals. For example items.mutate(itemsArray => itemsArray.push(newItem)); will now be items.update(itemsArray => [itemsArray, …newItem]);",
  };
}

function step14(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        deepestInstanceOf(node, "provideClientHydration") &&
        findNodes(
          getAncestor(node, 3)!,
          (node) => deepestInstanceOf(node, "providers"),
          () => {},
        ),
      (node) => {
        detection = Capability.PARTIALLY;
        node.getParent()!.replaceWithText("");
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
    changeImplemented: true,
    description:
      "To disable hydration use ngSkipHydration or remove the provideClientHydration call from the provider list since withNoDomReuse is no longer part of the public API.",
  };
}

/******************************************************************************
 * Execute steps and register data.
 *****************************************************************************/

const metrics: StepData[] = [];
metrics.push({
  // 1 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Make sure that you are using a supported version of node.js before you upgrade your application. Angular v17 supports node.js versions: v18.13.0 and newer",
});
metrics.push({
  // 2 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Make sure that you are using a supported version of TypeScript before you upgrade your application. Angular v17 supports TypeScript version 5.2 or later.",
});
metrics.push({
  // 3 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Make sure that you are using a supported version of Zone.js before you upgrade your application. Angular v17 supports Zone.js version 0.14.x or later.",
});
metrics.push({
  // 4 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "In the application's project directory, run ng update @angular/core@17 @angular/cli@17 to update your application to Angular v17.",
});
metrics.push(step05(project));
metrics.push({
  // 6 - Config is specific to each project.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Make sure you configure setupTestingRouter, canceledNavigationResolution, paramsInheritanceStrategy, titleStrategy, urlUpdateStrategy, urlHandlingStrategy, and malformedUriErrorHandler in provideRouter or RouterModule.forRoot since these properties are now not part of the Router's public API",
});
metrics.push({
  // 7 - Logic is specific to how the components are used. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "For dynamically instantiated components we now execute ngDoCheck during change detection if the component is marked as dirty. You may need to update your tests or logic within ngDoCheck for dynamically instantiated components.",
});
metrics.push({
  // 8 - Logic is specific to how errors are handled. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Handle URL parsing errors in the UrlSerializer.parse instead of malformedUriErrorHandler because it's now part of the public API surface.",
});
metrics.push({
  // 9 - Can't reproduce. Should be easily fixable.
  detection: Capability.FULLY,
  automation: Capability.FULLY,
  changeFlags: Change.IN_TYPESCRIPT | Change.NOT_APPLICABLE | Change.TO_SYNTAX,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Change Zone.js deep imports like zone.js/bundles/zone-testing.js and zone.js/dist/zone to zone.js and zone.js/testing.",
});
metrics.push({
  // 10 - Logic is specif to each redirect. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "You may need to adjust your router configuration to prevent infinite redirects after absolute redirects. In v17 we no longer prevent additional redirects after absolute redirects.",
});
metrics.push(step11(project));
metrics.push({
  // 12 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "You may need to adjust the equality check for NgSwitch because now it defaults to stricter check with === instead of ==. Angular will log a warning message for the usages where you'd need to provide an adjustment.",
});
metrics.push(step13(project));
metrics.push(step14(project));
metrics.push({
  // 15 - Depends on inheritance. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "If you want the child routes of loadComponent routes to inherit data from their parent specify the paramsInheritanceStrategy to always, which in v17 is now set to emptyOnly.",
});

validate(project, control, metrics);
logStepData(metrics);

await saveProject(project, Number.MAX_VALUE);
