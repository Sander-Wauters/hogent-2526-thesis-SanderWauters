# hogent-2526-thesis-SanderWauters

This project is based on the [thesis template from HOGENT](https://github.com/HoGentTIN/latex-hogent-bachproef).
Some changes have been made to the project, mainly that I have replaces the compilation setup with my own.

If you just want to view the documents as a `pdf`, check out the `output` directory.

## Project layout

- `bachproef/`: Contains the LaTeX files for the thesis.
- `diagrams/`: Contains plantuml diagrams.
- `fonts/`: Contains used fonts.
- `graphics/`: Contains used images and logo's.
- `output/`: Contains the compiled LaTeX documents.
- `poc/`: Contains the code for the proof of concept.
- `poc/__testenv__/`: Contains the code for the test environment. **NEVER** run the updater on this, make a copy of this directory and run the updater on that.
- `poc/updater/`: Contains the code for the updater.
- `poster/`: Contains the LaTeX files for the thesis poster.
- `voorstel/`: Contains the LaTeX files for the thesis proposal.

## Compiling the project

Use `make.sh <path-to-main-tex-file>` to compile one of the documents (bachproef, poster, voorstel).
You may need to rerun this script multiple times since the commands used for compilation relies on it's own output.
Note that this script assumes that a `.bib` is present and will always try to generate a bibliography.
In the case of the `poster` the errors thrown by `biber` can be ignored since no bibliography is present.
The `output`directory is where all compiled documents end up.

All files in the `diagrams` directory are compiled using [plantuml](https://plantuml.com/).

To compile the updater, first install the dependancies with `yarn install` in the `poc/updater/` directory, then run `yarn build` in the `poc/updater/` directory.
The compiled updater is put in the `poc/updater/dist/` directory.
To run the updater use `node poc/updater/dist/<name_of_the_updater>.js <path_to_the_project_to_update>`.
**NEVER** run the updater directly on `poc/updater/__testenv__/`.

The test environment in `poc/updater/__testenv__/` is not a real project.
It is just a collection of code fragments meant to be updated by the updater.
Therefore no compilation steps are provided.

## Running the PoC

The `runpoc.sh` script runs the entire proof of concept.
It creates a copy of the `__testenv__` directory, build the `updaters` and runs them.
Add the `-c` option to remove the test environment after the `updaters` have finished.
