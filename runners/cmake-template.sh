#!/bin/bash

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
scriptPath="$scriptDir/../build/main.js"
node "$scriptPath" "$@"