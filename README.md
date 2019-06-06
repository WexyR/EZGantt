# EZGantt
## Introduction
The objective was to create a simple gantt diagram framework, with a simple web GUI. As of today, the web commandline API is fully functionnal, while the GUI can only display and modifie basic data such as tasks, progress etc... The GUI will be improved in the next release.

## Basic structure of this repository
Most of the interesting code can be found at the root and in src/ts/*

## Build Instructions
You first need to get tsc (typescript-compiler) installed via npm. You can follow the instructions on typescriptlang.org for details.
Once you got it installed, run:
```./build.sh```
It will compile the typescript source code into js. You will now be able to open index.html

To clean your source file, you can then run:
```./clean.sh```
