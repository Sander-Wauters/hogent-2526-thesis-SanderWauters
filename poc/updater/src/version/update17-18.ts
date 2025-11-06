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
  hasType,
  inScopeOf,
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

function step21(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) => {
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "StateKey") &&
        !!inScopeOf(node, SyntaxKind.ImportDeclaration),
      (node) =>
        findNodes(
          getAncestor(node, 4)!,
          (node) =>
            lastInstanceInTree(node, `"@angular/platform-browser"`) &&
            !!inScopeOf(node, SyntaxKind.ImportDeclaration),
          (node) => {
            detection = Capability.FULLY;
            automation = Capability.FULLY;
            node.replaceWithText(`"@angular/core"`);
          },
        ),
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "TransferState") &&
        !!inScopeOf(node, SyntaxKind.ImportDeclaration),
      (node) =>
        findNodes(
          getAncestor(node, 4)!,
          (node) =>
            lastInstanceInTree(node, `"@angular/platform-browser"`) &&
            !!inScopeOf(node, SyntaxKind.ImportDeclaration),
          (node) => {
            detection = Capability.FULLY;
            automation = Capability.FULLY;
            node.replaceWithText(`"@angular/core"`);
          },
        ),
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    description:
      "Import StateKey and TransferState from @angular/core instead of @angular/platform-browser.",
  };
}

function step23(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) => {
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "isPlatformWorkerUi") &&
        node.getParent()?.getKind() === SyntaxKind.CallExpression,
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.PARTIALLY;
        node.getParent()?.replaceWithText("false");
      },
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "isPlatformWorkerApp") &&
        node.getParent()?.getKind() === SyntaxKind.CallExpression,
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.PARTIALLY;
        node.getParent()?.replaceWithText("false");
      },
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    description:
      "Update the application to remove isPlatformWorkerUi and isPlatformWorkerApp since they were part of platform WebWorker which is now not part of Angular.",
  };
}

function step29(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "...RESOURCE_CACHE_PROVIDER"),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("");
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    description:
      "Remove dependencies of RESOURCE_CACHE_PROVIDER since it's no longer part of the Angular runtime.",
  };
}

function step31(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) => {
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "useAbsoluteUrl") &&
        findNodes(
          getAncestor(node, 3)!,
          (ancestor) => hasType(ancestor, "PlatformConfig"),
          () => {},
        ),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.getParent()?.replaceWithText("");
      },
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "baseUrl") &&
        findNodes(
          getAncestor(node, 3)!,
          (ancestor) => hasType(ancestor, "PlatformConfig"),
          () => {},
        ),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.PARTIALLY;
        node.getParent()?.replaceWithText(`url: TODO`);
      },
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    description:
      "Provide an absolute url instead of using useAbsoluteUrl and baseUrl from PlatformConfig.",
  };
}

function step32(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "platformDynamicServer") &&
        (!!inScopeOf(node, SyntaxKind.CallExpression) ||
          !!inScopeOf(node, SyntaxKind.ImportDeclaration)),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.FULLY;
        node.replaceWithText("platformServer");
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    description:
      "Replace the usage of platformDynamicServer with platformServer. Also, add an import @angular/compiler.",
  };
}

function step33(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "ServerTransferStateModule") &&
        !inScopeOf(node, SyntaxKind.ImportDeclaration),
      (node) => {
        detection = Capability.FULLY;
        automation = Capability.PARTIALLY;
        node.replaceWithText("");
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    description:
      "Remove all imports of ServerTransferStateModule from your application. It is no longer needed.",
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
metrics.push(step21(project));
metrics.push({
  // 22 - Can't find any references to withHttpTransferCache. It should be fully detectable and partially automatable, depends on the type of project.
  detection: Capability.FULLY,
  automation: Capability.PARTIALLY,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  description:
    "Use includeRequestsWithAuthHeaders: true in withHttpTransferCache to opt-in of caching for HTTP requests that require authorization.",
});
metrics.push(step23(project));
metrics.push({
  // 24 - Change in how Angular tests work under the hood. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  description:
    "Tests may run additional rounds of change detection to fully reflect test state in the DOM. As a last resort, revert to the old behavior by adding provideZoneChangeDetection({ignoreChangesOutsideZone: true}) to the TestBed providers.",
});
metrics.push({
  // 25 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  description:
    "Remove expressions that write to properties in templates that use [(ngModel)]",
});
metrics.push({
  // 26 - Change effects test behavior, detection is doable. To many variables.
  detection: Capability.FULLY,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  description:
    "Remove calls to Testability methods increasePendingRequestCount, decreasePendingRequestCount, and getPendingRequestCount. This information is tracked by ZoneJS.",
});
metrics.push({
  // 27 - Has to do with how routes are inherited. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  description:
    "Move any environment providers that should be available to routed components from the component that defines the RouterOutlet to the providers of bootstrapApplication or the Route config.",
});
metrics.push({
  // 28 - Should be evaluated case by case. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  description:
    "When a guard returns a UrlTree as a redirect, the redirecting navigation will now use replaceUrl if the initial navigation was also using the replaceUrl option. If you prefer the previous behavior, configure the redirect using the new NavigationBehaviorOptions by returning a RedirectCommand with the desired options instead of UrlTree.",
});
metrics.push(step29(project));
metrics.push({
  // 30 - Change in string literal. If it is hardcoded then it's fine but different kinds of string concatination make this hard to automate.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX | Change.TO_SEMANTICS,
  description:
    "In @angular/platform-server now pathname is always suffixed with / and the default ports for http: and https: respectively are 80 and 443.",
});
metrics.push(step31(project));
metrics.push(step32(project));
metrics.push(step33(project));
metrics.push({
  // 34 - To error prone. The type change could require a change in logic.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  description:
    "Route.redirectTo can now include a function in addition to a string. Any code which reads Route objects directly and expects redirectTo to be a string may need to update to account for functions as well.",
});
metrics.push({
  // 35 - To error prone. The type change could require a change in logic.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  description:
    "Route guards and resolvers can now return a RedirectCommand object in addition to a UrlTree and boolean. Any code which reads Route objects directly and expects only boolean or UrlTree may need to update to account for RedirectCommand as well.",
});

logStepData(metrics);

await saveProject(project, true);
