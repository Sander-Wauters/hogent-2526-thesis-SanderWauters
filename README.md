# hogent-2526-thesis-SanderWauters

This project is base on the [thesis template from HOGENT](https://github.com/HoGentTIN/latex-hogent-bachproef).
Some changes have been made to the project, mainly that I have replaces the compilation setup with my own.

I you just want to view the documents as a `pdf`, check out the `output` directory.

## Compiling the project

Use `make.sh <path-to-main-tex-file>` to compile one of the documents (bachproef, poster, voorstel).
You may need to rerun this script multiple times since the commands used for compilation rely on the output of each other.
Note that this script assumes that a `.bib` is present and will always try to generate a bibliography.
In the case of the `poster` the errors thrown by `biber` can be ignored since no bibliography is present.
The `output`directory is where all compiled documents end up.
