/******************************************************************************
 *
 *
 * Contains input/output operations for TypeScript projects.
 *
 *
 *****************************************************************************/

import { exit } from "process";
import { Project } from "ts-morph";

/**
 * Loads in the test environment based on command line args.
 */
export function loadTestenv(): Project {
  const projectRoot = process.argv[2];
  if (!projectRoot) {
    console.error(`No path to testenv provided, exiting...`);
    exit(-1);
  }
  console.debug(`Loading testenv at: ${projectRoot}`);
  return new Project({
    tsConfigFilePath: `${projectRoot}/tsconfig.json`,
  });
}

/**
 * Loads in the control environmetn based on command line args.
 */
export function loadControlenv(): Project {
  const projectRoot = process.argv[3];
  if (!projectRoot) {
    console.error(`No path to controlenv provided, exiting...`);
    exit(-1);
  }
  console.debug(`Loading controlenv at: ${projectRoot}`);
  return new Project({
    tsConfigFilePath: `${projectRoot}/tsconfig.json`,
  });
}

/**
 * Save all changes made to the AST of the project.
 *
 * @param {Project} project - The project to save.
 * @param {boolean} force - Try to save changes regardless of errors.
 */
export async function saveProject(
  project: Project,
  force: boolean = false,
): Promise<boolean> {
  console.debug(`Checking for errors...`);
  const diagnostics = project.getPreEmitDiagnostics();
  console.log(`Errors: ${diagnostics.length}`);

  if (diagnostics.length) {
    console.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
    if (force) await project.save();
    return false;
  }
  await project.save();
  return true;
}
