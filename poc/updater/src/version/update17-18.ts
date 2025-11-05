/******************************************************************************
 *
 *
 * Updates Angular from version 17 to 18.
 *
 *
 *****************************************************************************/

import { Project, SyntaxKind } from "ts-morph";
import { loadProject, saveProject } from "../util/projectio.js";
import { Capability, Change, logStepData, StepData } from "../util/metrics.js";
import {
  accessedFrom,
  findNodes,
  getAncestor,
  lastInstanceInTree,
} from "../util/traversal.js";

const project = loadProject();

/******************************************************************************
 * Define steps.
 *****************************************************************************/

function step19(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "async") &&
        node.getKind() !== SyntaxKind.AsyncKeyword,
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("waitForAsync");
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    description: "Replace async from @angular/core with waitForAsync.",
  };
}

function step20(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "matchesElement") &&
        accessedFrom(node, "AnimationDriver"),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.PARTIALLY;
        getAncestor(node, 3)?.replaceWithText("");
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    description:
      "Remove calls to matchesElement because it's now not part of AnimationDriver.",
  };
}

/******************************************************************************
 * Execute steps and register data.
 *****************************************************************************/

const metrics: StepData[] = [];
metrics.push({
  // 16 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description:
    "Make sure that you are using a supported version of node.js before you upgrade your application. Angular v18 supports node.js versions: v18.19.0 and newer",
});
metrics.push({
  // 17 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description:
    "In the application's project directory, run ng update @angular/core@18 @angular/cli@18 to update your application to Angular v18.",
});
metrics.push({
  // 18 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description: "Update TypeScript to versions 5.4 or newer.",
});
metrics.push(step19(project));
metrics.push(step20(project));

logStepData(metrics);

await saveProject(project, true);
