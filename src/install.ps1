# Installation script for Windows
# Change this variable if you want to install into a different IDE (e.g. 'code', 'cursor', 'windsurf')
$CLI_CMD = "antigravity"

Write-Host "Installing $($extensions.length) extensions using '$CLI_CMD'..."

$extensions = Get-Content -Path ".\extensions.txt"
foreach ($ext in $extensions) {
    if (-not [string]::IsNullOrWhiteSpace($ext)) {
        Write-Host "Installing $ext..."
        & $CLI_CMD --install-extension $ext
    }
}

Write-Host "Done!"
