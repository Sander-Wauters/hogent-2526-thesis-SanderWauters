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
 * Loads in a project based on command line args.
 */
export function loadProject(): Project {
  const projectRoot = process.argv[2];
  if (!projectRoot) {
    console.error(`No path to project provided, exiting...`);
    exit(-1);
  }
  console.log(`Loading project at: ${projectRoot}`);
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
  console.log(`Checking for errors...`);
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
