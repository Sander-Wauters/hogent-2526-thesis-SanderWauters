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
import { findNodes, inScopeOf, lastInstanceInTree } from "../util/traversal.js";

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

logStepData(metrics);

await saveProject(project, true);
