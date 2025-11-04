/*****************************************************************************
 *
 * Collection of helper funtion to acquire metrics for the updater.
 *
 *****************************************************************************/

export enum Capability {
  NOT,
  FULLY,
  PARTIALLY,
}

export enum Change {
  NOT_APPLICABLE = 0,
  IN_TEMPLATE = 1 << 0,
  IN_TEST = 1 << 1,
  IN_JSON = 1 << 2,
  IN_CLI = 1 << 3,
  TO_SYNTAX = 1 << 4,
  TO_SEMANTICS = 1 << 5,
}

export interface StepData {
  detection: Capability;
  automation: Capability;
  changeFlags: number;
  description: string;
}

interface StepTotals {
  numSteps: number;

  numNotAutomatable: number;
  numFullyAutomatable: number;
  numPartiallyAutomatable: number;

  numNotDetectable: number;
  numFullyDetectable: number;
  numPartiallyDetectable: number;

  numChangesNotApplicable: number;
  numChangesInTemplate: number;
  numChangesInTest: number;
  numChangesInJson: number;
  numChangesInCli: number;
  numChangesToSyntax: number;
  numChangesToSemantics: number;
}

const EMPTY_STEP_TOTALS: StepTotals = {
  numSteps: 0,

  numNotAutomatable: 0,
  numFullyAutomatable: 0,
  numPartiallyAutomatable: 0,

  numNotDetectable: 0,
  numFullyDetectable: 0,
  numPartiallyDetectable: 0,

  numChangesNotApplicable: 0,
  numChangesInTemplate: 0,
  numChangesInTest: 0,
  numChangesInJson: 0,
  numChangesInCli: 0,
  numChangesToSyntax: 0,
  numChangesToSemantics: 0,
};

function addTotals(step: StepData, total: StepTotals) {
  total.numSteps += 1;

  total.numNotAutomatable += step.automation === Capability.NOT ? 1 : 0;
  total.numFullyAutomatable += step.automation === Capability.FULLY ? 1 : 0;
  total.numPartiallyAutomatable +=
    step.automation === Capability.PARTIALLY ? 1 : 0;

  total.numNotDetectable += step.detection === Capability.NOT ? 1 : 0;
  total.numFullyDetectable += step.detection === Capability.FULLY ? 1 : 0;
  total.numPartiallyDetectable +=
    step.detection === Capability.PARTIALLY ? 1 : 0;

  total.numChangesNotApplicable +=
    step.changeFlags & Change.NOT_APPLICABLE ? 1 : 0;
  total.numChangesInTemplate += step.changeFlags & Change.IN_TEMPLATE ? 1 : 0;
  total.numChangesInTest += step.changeFlags & Change.IN_TEST ? 1 : 0;
  total.numChangesInJson += step.changeFlags & Change.IN_JSON ? 1 : 0;
  total.numChangesInCli += step.changeFlags & Change.IN_CLI ? 1 : 0;
  total.numChangesToSyntax += step.changeFlags & Change.TO_SYNTAX ? 1 : 0;
  total.numChangesToSemantics += step.changeFlags & Change.TO_SEMANTICS ? 1 : 0;
}

function logStepTotals(totals: StepTotals, label: string) {
  const pad = Math.max(label.length + 1, 7);

  console.log(
    `| Type                  | #%s | %%%s |`,
    label.padEnd(pad - 1, " "),
    label.padEnd(pad - 1, " "),
  );
  console.log(
    `|-----------------------|%s|%s|`,
    "".padEnd(pad + 2, "-"),
    "".padEnd(pad + 2, "-"),
  );
  console.log(
    `| #Steps                | %s | %s |`,
    totals.numSteps.toString().padEnd(pad, " "),
    "1OO.00%".padEnd(pad, " "),
  );
  console.log(
    `|-----------------------|%s|%s|`,
    "".padEnd(pad + 2, "-"),
    "".padEnd(pad + 2, "-"),
  );
  console.log(
    `| Not automatable       | %s | %s |`,
    totals.numNotAutomatable.toString().padEnd(pad, " "),
    ((totals.numNotAutomatable * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Partially automatable | %s | %s |`,
    totals.numPartiallyAutomatable.toString().padEnd(pad, " "),
    ((totals.numPartiallyAutomatable * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Fully automatable     | %s | %s |`,
    totals.numFullyAutomatable.toString().padEnd(pad, " "),
    ((totals.numFullyAutomatable * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `|-----------------------|%s|%s|`,
    "".padEnd(pad + 2, "-"),
    "".padEnd(pad + 2, "-"),
  );
  console.log(
    `| Not detectable        | %s | %s |`,
    totals.numNotDetectable.toString().padEnd(pad, " "),
    ((totals.numNotDetectable * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Partially detectable  | %s | %s |`,
    totals.numPartiallyDetectable.toString().padEnd(pad, " "),
    ((totals.numPartiallyDetectable * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Fully detectable      | %s | %s |`,
    totals.numFullyDetectable.toString().padEnd(pad, " "),
    ((totals.numFullyDetectable * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `|-----------------------|%s|%s|`,
    "".padEnd(pad + 2, "-"),
    "".padEnd(pad + 2, "-"),
  );
  console.log(
    `| Change not applicable | %s | %s |`,
    totals.numChangesNotApplicable.toString().padEnd(pad, " "),
    ((totals.numChangesNotApplicable * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Change in template    | %s | %s |`,
    totals.numChangesInTemplate.toString().padEnd(pad, " "),
    ((totals.numChangesInTemplate * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Change in test        | %s | %s |`,
    totals.numChangesInTest.toString().padEnd(pad, " "),
    ((totals.numChangesInTest * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Change in JSON        | %s | %s |`,
    totals.numChangesInJson.toString().padEnd(pad, " "),
    ((totals.numChangesInJson * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Change in CLI         | %s | %s |`,
    totals.numChangesInCli.toString().padEnd(pad, " "),
    ((totals.numChangesInCli * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Change in syntax      | %s | %s |`,
    totals.numChangesToSyntax.toString().padEnd(pad, " "),
    ((totals.numChangesToSyntax * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
  console.log(
    `| Change in semantics   | %s | %s |`,
    totals.numChangesToSemantics.toString().padEnd(pad, " "),
    ((totals.numChangesToSemantics * 100) / totals.numSteps)
      .toFixed(2)
      .concat("%")
      .padEnd(pad, " "),
  );
}

export function logStepData(stepData: StepData[]) {
  const total: StepTotals = { ...EMPTY_STEP_TOTALS };

  const ts: StepTotals = { ...EMPTY_STEP_TOTALS };
  const tsSyntax: StepTotals = { ...EMPTY_STEP_TOTALS };
  const tsSemantics: StepTotals = { ...EMPTY_STEP_TOTALS };
  const tsNoTest: StepTotals = { ...EMPTY_STEP_TOTALS };
  const tsSyntaxNoTest: StepTotals = { ...EMPTY_STEP_TOTALS };
  const tsSemanticNoTest: StepTotals = { ...EMPTY_STEP_TOTALS };

  stepData.forEach((step) => {
    addTotals(step, total);

    const onlyTs =
      !(step.changeFlags & Change.IN_TEMPLATE) &&
      !(step.changeFlags & Change.IN_JSON) &&
      !(step.changeFlags & Change.IN_CLI);
    if (onlyTs) addTotals(step, ts);

    const onlyTsSyntax = onlyTs && step.changeFlags & Change.TO_SYNTAX;
    if (onlyTsSyntax) addTotals(step, tsSyntax);

    const onlyTsSemantics = onlyTs && step.changeFlags & Change.TO_SEMANTICS;
    if (onlyTsSemantics) addTotals(step, tsSemantics);

    const onlyTsNoTest = onlyTs && !(step.changeFlags & Change.IN_TEST);
    if (onlyTsNoTest) addTotals(step, tsNoTest);

    const onlyTsSyntaxNoTest = onlyTsNoTest && onlyTsSyntax;
    if (onlyTsSyntaxNoTest) addTotals(step, tsSyntaxNoTest);

    const onlyTsSemanticsNoTest = onlyTsNoTest && onlyTsSemantics;
    if (onlyTsSemanticsNoTest) addTotals(step, tsSemanticNoTest);
  });

  logStepTotals(total, "Total");
  console.log();
  logStepTotals(ts, "TS");
  console.log();
  logStepTotals(tsSyntax, "TS syntax");
  console.log();
  logStepTotals(tsSemantics, "TS semantics");
  console.log();
  logStepTotals(tsNoTest, "TS no test");
  console.log();
  logStepTotals(tsSyntaxNoTest, "TS syntax no test");
  console.log();
  logStepTotals(tsSemanticNoTest, "TS semantics no test");
}
