$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$scriptPath = Join-Path $scriptDir "..\build\main.js"
node $scriptPath $args