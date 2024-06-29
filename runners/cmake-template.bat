@echo off
set scriptDir=%~dp0
set scriptPath=%scriptDir%..\build\main.js
node "%scriptPath%" %*