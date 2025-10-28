#!/bin/bash

[ $# -ne 1 ] && { echo "Usage: $0 <path_to_main_tex_file>"; exit -1; }

readonly SRC_DIR="$(dirname "$1")"
readonly SRC_FILE="$(basename "$1")"
readonly SRC_NAME="${SRC_FILE%.*}"
readonly OUT_DIR="output"

cd "${SRC_DIR}"

compile_latex() {
  latexmk \
    -file-line-error \
    -interaction=nonstopmode \
    -output-directory="../${OUT_DIR}" \
    -shell-escape \
    -synctex=1 \
    -xelatex \
    -f \
    "${SRC_FILE}"
}

echo "========== Compiling ${SRC_DIR}/${SRC_FILE} =========="
compile_latex

echo "========== Compiling ../${OUT_DIR}/${SRC_NAME} =========="
biber "../${OUT_DIR}/${SRC_NAME}"

echo "========== Recompiling ${SRC_DIR}/${SRC_FILE} =========="
compile_latex
