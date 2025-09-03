#!/bin/bash

[ $# -ne 2 ] && (echo "Usage: $0 <source_dir> <output_pdf_file_name>"; exit -1)

set -o errexit
set -o nounset

readonly source_dir="${1}"
readonly output_pdf_file_name="${2}"
readonly output_dir="../output"

cd "${source_dir}"

# Find all main .tex files (containing the \documentclass command)
source_files=$(grep --files-with-match '\\documentclass' ./*.tex)

# Loop over all found .tex source files and compile
for latex_file in ${source_files}; do
  echo "========== Compiling ${latex_file} =========="
  latexmk \
    -file-line-error \
    -interaction=nonstopmode \
    -output-directory="${output_dir}" \
    -shell-escape \
    -synctex=1 \
    -xelatex \
    "${latex_file}"
done

echo "========== Compiling bibliography =========="
biber "${output_dir}/${output_pdf_file_name}"
