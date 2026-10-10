$ErrorActionPreference = 'Stop'
$taskEditorPath = Join-Path $PSScriptRoot 'admin.html'
$taskEditorUrl = ([Uri]$taskEditorPath).AbsoluteUri
$taskBrowserPaths = @(
    (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe'),
    (Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe'),
    (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
)
$taskBrowser = $taskBrowserPaths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $taskBrowser) { throw 'Open admin.html with Chrome or Edge.' }
# This visible browser is the editor the user explicitly opened.
Start-Process -FilePath $taskBrowser -ArgumentList @($taskEditorUrl)
