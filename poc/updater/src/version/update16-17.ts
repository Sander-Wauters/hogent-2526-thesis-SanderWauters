/******************************************************************************
 *
 *
 * Updates Angular from version 16 to 17.
 *
 *
 *****************************************************************************/

import { Project } from "ts-morph";
import { loadProject, saveProject } from "../util/projectio.js";
import { Capability, Change, logStepData, StepData } from "../util/metrics.js";
import {
  findNodes,
  getAncestor,
  lastInstanceInTree,
} from "../util/traversal.js";

const project = loadProject();

/******************************************************************************
 * Define steps.
 *****************************************************************************/

function step5(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "REMOVE_STYLES_ON_COMPONENT_DESTROY"),
      (node) => {
        detection = Capability.PARTIALLY;
        findNodes(
          getAncestor(node, 2)!,
          (node) => lastInstanceInTree(node, "useValue: true"),
          (node) => {
            automation = Capability.PARTIALLY;
            node.replaceWithText("useValue: false");
          },
        );
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX | Change.TO_SEMANTICS,
    description:
      "Angular now automatically removes styles of destroyed components, which may impact your existing apps in cases you rely on leaked styles. To change this update the value of the REMOVE_STYLES_ON_COMPONENT_DESTROY provider to false.",
  };
}

/******************************************************************************
 * Execute steps and register data.
 *****************************************************************************/

const metrics: StepData[] = [];
metrics.push({
  // 1
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_JSON,
  description:
    "Make sure that you are using a supported version of node.js before you upgrade your application. Angular v17 supports node.js versions: v18.13.0 and newer",
});
metrics.push({
  // 2
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description:
    "Make sure that you are using a supported version of TypeScript before you upgrade your application. Angular v17 supports TypeScript version 5.2 or later.",
});
metrics.push({
  // 3
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  description:
    "Make sure that you are using a supported version of Zone.js before you upgrade your application. Angular v17 supports Zone.js version 0.14.x or later.",
});
metrics.push({
  // 4
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_CLI,
  description:
    "In the application's project directory, run ng update @angular/core@17 @angular/cli@17 to update your application to Angular v17.",
});
metrics.push(step5(project));

logStepData(metrics);

await saveProject(project, true);
