/******************************************************************************
 *
 *
 * Updates Angular from version 18 to 19.
 *
 *
 *****************************************************************************/

import { loadProject, saveProject } from "../util/projectio.js";
import { Capability, Change, logStepData, StepData } from "../util/metrics.js";

const project = loadProject();

/******************************************************************************
 * Define steps.
 *****************************************************************************/

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

logStepData(metrics);

await saveProject(project, true);
