/******************************************************************************
 *
 *
 * Updates Angular from version 16 to 20.
 *
 *
 *****************************************************************************/

import { Project, SyntaxKind } from "ts-morph";
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
  inScopeOf,
  lastInstanceInTree,
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
      (node) => lastInstanceInTree(node, "REMOVE_STYLES_ON_COMPONENT_DESTROY"),
      (node) => {
        findNodes(
          getAncestor(node, 2)!,
          (node) => lastInstanceInTree(node, "useValue: true"),
          (node) => {
            detection = Capability.PARTIALLY;
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
        lastInstanceInTree(node, "AnimationDriver.NOOP") &&
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
        lastInstanceInTree(node, "mutate") &&
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
        lastInstanceInTree(node, "provideClientHydration") &&
        findNodes(
          getAncestor(node, 3)!,
          (node) => lastInstanceInTree(node, "providers"),
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

function step19(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "async") &&
        node.getKind() !== SyntaxKind.AsyncKeyword,
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("waitForAsync");
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
    description: "Replace async from @angular/core with waitForAsync.",
  };
}

function step20(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "matchesElement") &&
        accessedFrom(node, "AnimationDriver"),
      (node) => {
        detection = Capability.FULLY;
        getAncestor(node, 3)?.replaceWithText("");
        automation = Capability.PARTIALLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    changedFiles,
    changeImplemented: true,
    description:
      "Remove calls to matchesElement because it's now not part of AnimationDriver.",
  };
}

function step21(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
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
            node.replaceWithText(`"@angular/core"`);
            automation = Capability.FULLY;
            changedFiles.push(file.getBaseName());
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
            node.replaceWithText(`"@angular/core"`);
            automation = Capability.FULLY;
            changedFiles.push(file.getBaseName());
          },
        ),
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    changedFiles,
    changeImplemented: true,
    description:
      "Import StateKey and TransferState from @angular/core instead of @angular/platform-browser.",
  };
}

function step23(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) => {
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "isPlatformWorkerUi") &&
        node.getParent()?.getKind() === SyntaxKind.CallExpression,
      (node) => {
        detection = Capability.FULLY;
        node.getParent()?.replaceWithText("false");
        automation = Capability.PARTIALLY;
        changedFiles.push(file.getBaseName());
      },
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "isPlatformWorkerApp") &&
        node.getParent()?.getKind() === SyntaxKind.CallExpression,
      (node) => {
        detection = Capability.FULLY;
        node.getParent()?.replaceWithText("false");
        automation = Capability.PARTIALLY;
        changedFiles.push(file.getBaseName());
      },
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    changedFiles,
    changeImplemented: true,
    description:
      "Update the application to remove isPlatformWorkerUi and isPlatformWorkerApp since they were part of platform WebWorker which is now not part of Angular.",
  };
}

function step29(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "...RESOURCE_CACHE_PROVIDER"),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("");
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
      "Remove dependencies of RESOURCE_CACHE_PROVIDER since it's no longer part of the Angular runtime.",
  };
}

function step31(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
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
        node.getParent()?.replaceWithText("");
        automation = Capability.FULLY;
        changedFiles.push(file.getBaseName());
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
        node.getParent()?.replaceWithText(`url: "TODO"`);
        automation = Capability.PARTIALLY;
        changedFiles.push(file.getBaseName());
      },
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX,
    changedFiles,
    changeImplemented: true,
    description:
      "Provide an absolute url instead of using useAbsoluteUrl and baseUrl from PlatformConfig.",
  };
}

function step32(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "platformDynamicServer") &&
        (!!inScopeOf(node, SyntaxKind.CallExpression) ||
          !!inScopeOf(node, SyntaxKind.ImportDeclaration)),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("platformServer");
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
      "Replace the usage of platformDynamicServer with platformServer. Also, add an import @angular/compiler.",
  };
}

function step33(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "ServerTransferStateModule") &&
        !inScopeOf(node, SyntaxKind.ImportDeclaration),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("");
        automation = Capability.PARTIALLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    changedFiles,
    changeImplemented: true,
    description:
      "Remove all imports of ServerTransferStateModule from your application. It is no longer needed.",
  };
}

function step36(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "OnPush") &&
        accessedFrom(node, "ChangeDetectionStrategy") &&
        !!inScopeOf(node, SyntaxKind.Decorator),
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
    changeImplemented: true,
    description:
      "For any components using OnPush change detection, ensure they are properly marked dirty to enable host binding updates.",
  };
}

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
    changeImplemented: true,
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
    changeImplemented: true,
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
    changeImplemented: true,
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
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    changedFiles,
    changeImplemented: true,
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
    changeImplemented: true,
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
    changeImplemented: true,
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
    changeImplemented: true,
    description:
      "fakeAsync will flush pending timers by default. For tests that require the previous behavior, explicitly pass {flush: false} in the options parameter.",
  };
}

function step57(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "afterRender") &&
        (node.getParent()?.getKind() === SyntaxKind.CallExpression ||
          !!inScopeOf(node, SyntaxKind.ImportDeclaration)),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("afterEveryRender");
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
    description: "Rename the afterRender lifecycle hook to afterEveryRender",
  };
}

function step70(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) => {
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "canActivate") && accessedFrom(node, "Route"),
      () => {
        detection = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "canDeactivate") &&
        accessedFrom(node, "Route"),
      () => {
        detection = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "canMatch") && accessedFrom(node, "Route"),
      () => {
        detection = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    );
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "canActivateChild") &&
        accessedFrom(node, "Route"),
      () => {
        detection = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    changedFiles,
    changeImplemented: true,
    description:
      "The any type is removed from the Route guard arrays (canActivate, canDeactivate, etc); ensure guards are functions, ProviderToken<T>, or (deprecated) strings. Refactor string guards to ProviderToken<T> or functions.",
  };
}

function step72(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "get") &&
        !!inScopeOf(node, SyntaxKind.CallExpression) &&
        accessedFrom(node, "TestBed"),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("inject");
        automation = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SYNTAX,
    changedFiles,
    changeImplemented: true,
    description:
      "Replace all occurrences of the deprecated TestBed.get() method with TestBed.inject() in your Angular tests for dependency injection.",
  };
}

function step73(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) => {
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.Default"),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("{}"); // Hacky way to ensure that there are not trailing comma's.
        automation = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    );
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.Host"),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("{ host: true }");
        automation = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    );
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.Self"),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("{ self: true }");
        automation = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    );
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.SkipSelf"),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("{ skipSelf: true }");
        automation = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    );
    findNodes(
      file,
      (node) => lastInstanceInTree(node, "InjectFlags.Optional"),
      (node) => {
        detection = Capability.FULLY;
        node.replaceWithText("{ optional: true }");
        automation = Capability.FULLY;
        changedFiles.push(file.getBaseName());
      },
    );
  });
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SYNTAX,
    changedFiles,
    changeImplemented: true,
    description:
      "Remove InjectFlags enum and its usage from inject, Injector.get, EnvironmentInjector.get, and TestBed.inject calls. Use options like {optional: true} for inject or handle null for \*.get methods.",
  };
}

function step74(project: Project): StepData {
  let detection = Capability.NOT;
  let automation = Capability.NOT;
  let changedFiles: string[] = [];
  project.getSourceFiles().forEach((file) =>
    findNodes(
      file,
      (node) =>
        lastInstanceInTree(node, "get") &&
        !!inScopeOf(node, SyntaxKind.CallExpression) &&
        accessedFrom(node, "Injector"),
      () => {
        detection = Capability.PARTIALLY;
        changedFiles.push(file.getBaseName());
      },
    ),
  );
  return {
    detection,
    automation,
    changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
    changedFiles,
    changeImplemented: true,
    description:
      "Update injector.get() calls to use a specific ProviderToken<T> instead of relying on the removed any overload. If using string tokens (deprecated since v4), migrate them to ProviderToken<T>.",
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
metrics.push({
  // 16 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Make sure that you are using a supported version of node.js before you upgrade your application. Angular v18 supports node.js versions: v18.19.0 and newer",
});
metrics.push({
  // 17 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "In the application's project directory, run ng update @angular/core@18 @angular/cli@18 to update your application to Angular v18.",
});
metrics.push({
  // 18 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description: "Update TypeScript to versions 5.4 or newer.",
});
metrics.push(step19(project));
metrics.push(step20(project));
metrics.push(step21(project));
metrics.push({
  // 22 - Can't find any references to withHttpTransferCache. It should be fully detectable and partially automatable, depends on the type of project.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Use includeRequestsWithAuthHeaders: true in withHttpTransferCache to opt-in of caching for HTTP requests that require authorization.",
});
metrics.push(step23(project));
metrics.push({
  // 24 - Change in how Angular tests work under the hood. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Tests may run additional rounds of change detection to fully reflect test state in the DOM. As a last resort, revert to the old behavior by adding provideZoneChangeDetection({ignoreChangesOutsideZone: true}) to the TestBed providers.",
});
metrics.push({
  // 25 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Remove expressions that write to properties in templates that use [(ngModel)]",
});
metrics.push({
  // 26 - Change effects test behavior, detection is doable. To many variables.
  detection: Capability.FULLY,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Remove calls to Testability methods increasePendingRequestCount, decreasePendingRequestCount, and getPendingRequestCount. This information is tracked by ZoneJS.",
});
metrics.push({
  // 27 - Has to do with how routes are inherited. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Move any environment providers that should be available to routed components from the component that defines the RouterOutlet to the providers of bootstrapApplication or the Route config.",
});
metrics.push({
  // 28 - Should be evaluated case by case. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "When a guard returns a UrlTree as a redirect, the redirecting navigation will now use replaceUrl if the initial navigation was also using the replaceUrl option. If you prefer the previous behavior, configure the redirect using the new NavigationBehaviorOptions by returning a RedirectCommand with the desired options instead of UrlTree.",
});
metrics.push(step29(project));
metrics.push({
  // 30 - Change in string literal. If it is hardcoded then it's fine but different kinds of string concatination make this hard to automate.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SYNTAX | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
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
  changedFiles: [],
  changeImplemented: false,
  description:
    "Route.redirectTo can now include a function in addition to a string. Any code which reads Route objects directly and expects redirectTo to be a string may need to update to account for functions as well.",
});
metrics.push({
  // 35 - To error prone. The type change could require a change in logic.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Route guards and resolvers can now return a RedirectCommand object in addition to a UrlTree and boolean. Any code which reads Route objects directly and expects only boolean or UrlTree may need to update to account for RedirectCommand as well.",
});
metrics.push(step36(project));
metrics.push({
  // 37 - Way to complex to find or automate this.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Be aware that newly created views or views marked for check and reattached during change detection are now guaranteed to be refreshed in that same change detection cycle.",
});
metrics.push({
  // 38 - Way to complex to find or automate this.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "After aligning the semantics of ComponentFixture.whenStable and ApplicationRef.isStable, your tests may wait longer when using whenStable.",
});
metrics.push({
  // 39 - Way to complex to find or automate this.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "You may experience tests failures if you have tests that rely on change detection execution order when using ComponentFixture.autoDetect because it now executes change detection for fixtures within ApplicationRef.tick. For example, this will cause test fixture to refresh before any dialogs that it creates whereas this may have been the other way around in the past.",
});
metrics.push({
  // 40 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "In the application's project directory, run ng update @angular/core@19 @angular/cli@19 to update your application to Angular v19.",
});
metrics.push({
  // 41 - Angular CLI already does this.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
  description: `Angular directives, components and pipes are now standalone by default. Specify "standalone: false" for declarations that are currently declared in an NgModule. The Angular CLI will automatically update your code to reflect that.`,
});
metrics.push({
  // 42 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  changedFiles: [],
  changeImplemented: false,
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
  changeImplemented: false,
  description: `In angular.json, replace the "name" option with "project" for the @angular/localize builder.`,
});
metrics.push({
  // 46 - Feature added in v18.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
  description: "Rename ExperimentalPendingTasks to PendingTasks.",
});
metrics.push({
  // 47 - Way to many variables to chack.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Update tests that relied on the Promise timing of effects to use await whenStable() or call .detectChanges() to trigger effects. For effects triggered during change detection, ensure they don't depend on the application being fully rendered or consider using afterRenderEffect(). Tests using faked clocks may need to fast-forward/flush the clock.",
});
metrics.push({
  // 48 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description: "Upgrade to TypeScript version 5.5 or later.",
});
metrics.push(step49(project));
metrics.push({
  // 50 - Detection is dependant on templates.
  detection: Capability.PARTIALLY,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEMPLATE | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "When using createComponent API and not passing content for the first ng-content, provide document.createTextNode('') as a projectableNode to prevent rendering the default fallback content.",
});
metrics.push({
  // 51 - Timing and ordering of change detection is way to hard to find. To many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Update tests that rely on specific timing or ordering of change detection around custom elements, as the timing may have changed due to the switch to the hybrid scheduler.",
});
metrics.push(step52(project));
metrics.push(step53(project));
metrics.push(step54(project));
metrics.push(step55(project));
metrics.push({
  // 56 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "In the application's project directory, run ng update @angular/core@20 @angular/cli@20 to update your application to Angular v20.",
});
metrics.push(step57(project));
metrics.push({
  // 58 - Feature added in v17.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Replace uses of TestBed.flushEffects() with TestBed.tick(), the closest equivalent to synchronously flush effects.",
});
metrics.push({
  // 59 - Feature added in v18.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
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
  changedFiles: [],
  changeImplemented: false,
  description:
    "Refactor application and test code to avoid relying on ng-reflect-\* attributes. If needed temporarily for migration, use provideNgReflectAttributes() from @angular/core in bootstrap providers to re-enable them in dev mode only.",
});
metrics.push({
  // 61 - To many variables.
  detection: Capability.PARTIALLY,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Adjust code that directly calls functions returning RedirectFn. These functions can now also return an Observable or Promise; ensure your logic correctly handles these asynchronous return types.",
});
metrics.push({
  // 62 - Feature added in v19.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
  description: "Rename the request property passed in resources to params.",
});
metrics.push({
  // 63 - Feature added in v19.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
  description: "Rename the loader property passed in rxResources to stream.",
});
metrics.push({
  // 64 - Feature added in v19.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
  description:
    "ResourceStatus is no longer an enum. Use the corresponding constant string values instead.",
});
metrics.push({
  // 65 - Feature added in v18.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Rename provideExperimentalZonelessChangeDetection to provideZonelessChangeDetection.",
});
metrics.push({
  // 66 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  changedFiles: [],
  changeImplemented: false,
  description:
    "If your templates use {{ in }} or in in expressions to refer to a component property named 'in', change it to {{ this.in }} or this.in as 'in' now refers to the JavaScript 'in' operator. If you're using in as a template reference, you'd have to rename the reference.",
});
metrics.push({
  // 67 - To many variables. Type extraction is to complex to detect.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "The type for the commands arrays passed to Router methods (createUrlTree, navigate, createUrlTreeFromSnapshot) have been updated to use readonly T[] since the array is not mutated. Code which extracts these types (e.g. with typeof) may need to be adjusted if it expects mutable arrays.",
});
metrics.push({
  // 68 - To complex to figure out if a test case checks a dom element involved in an animation.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Review and update tests asserting on DOM elements involved in animations. Animations are now guaranteed to be flushed with change detection or ApplicationRef.tick, potentially altering previous test outcomes.",
});
metrics.push({
  // 69 - Event listeners are a template thing. Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags:
    Change.IN_TYPESCRIPT |
    Change.IN_TEST |
    Change.IN_TEMPLATE |
    Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "In tests, uncaught errors in event listeners are now rethrown by default. Previously, these were only logged to the console by default. Catch them if intentional for the test case, or use rethrowApplicationErrors: false in configureTestingModule as a last resort.",
});
metrics.push(step70(project));
metrics.push({
  // 71 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Ensure your Node.js version is at least 20.11.1 and not v18 or v22.0-v22.10 before upgrading to Angular v20. Check https://angular.dev/reference/versions for the full list of supported Node.js versions.",
});
metrics.push(step72(project));
metrics.push(step73(project));
metrics.push(step74(project));
metrics.push({
  // 75 - CLI operation.
  detection: Capability.NOT,
  automation: Capability.FULLY,
  changeFlags: Change.IN_JSON | Change.IN_CLI,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Upgrade your project's TypeScript version to at least 5.8 before upgrading to Angular v20 to ensure compatibility.",
});
metrics.push({
  // 76 - To complex. Way to many variables.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TYPESCRIPT | Change.IN_TEST | Change.TO_SEMANTICS,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Unhandled errors in subscriptions/promises of AsyncPipe are now directly reported to ErrorHandler. This may alter test outcomes; ensure tests correctly handle these reported errors.",
});
metrics.push({
  // 77 - Feature added in v19.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.NOT_APPLICABLE,
  changedFiles: [],
  changeImplemented: false,
  description:
    "If relying on the return value of PendingTasks.run, refactor to use PendingTasks.add. Handle promise results/rejections manually, especially for SSR to prevent node process shutdown on unhandled rejections.",
});
metrics.push({
  // 78 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  changedFiles: [],
  changeImplemented: false,
  description:
    "If your templates use {{ void }} or void in expressions to refer to a component property named 'void', change it to {{ this.void }} or this.void as 'void' now refers to the JavaScript void operator.",
});
metrics.push({
  // 79 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  changedFiles: [],
  changeImplemented: false,
  description:
    "Review DatePipe usages. Using the Y (week-numbering year) formatter without also including w (week number) is now detected as suspicious. Use y (year) if that was the intent, or include w alongside Y.",
});
metrics.push({
  // 80 - Can't access templates.
  detection: Capability.NOT,
  automation: Capability.NOT,
  changeFlags: Change.IN_TEMPLATE | Change.TO_SYNTAX,
  changedFiles: [],
  changeImplemented: false,
  description:
    "In templates parentheses are now always respected. This can lead to runtime breakages when nullish coalescing were nested in parathesis. eg (foo?.bar).baz will throw if foo is nullish as it would in native JavaScript.",
});

validate(project, control, metrics);
logStepData(metrics);

await saveProject(project, true);
