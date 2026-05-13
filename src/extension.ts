import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension-exporter.export', async () => {
        // 1. Get all installed extensions, excluding built-in ones
        const extensions = vscode.extensions.all
            .filter(ext => !ext.packageJSON.isBuiltin)
            .map(ext => ext.id);

        if (extensions.length === 0) {
            vscode.window.showInformationMessage('No non-builtin extensions found.');
            return;
        }

        // 2. Ask user for a folder to save the output files
        const folderUri = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: 'Select folder to save export'
        });

        if (!folderUri || folderUri.length === 0) {
            return; // User canceled
        }

        const targetFolder = folderUri[0].fsPath;

        // 3. Detect the CLI command based on the IDE
        const appName = vscode.env.appName.toLowerCase();
        let cliCommand = 'code';
        if (appName.includes('cursor')) {
            cliCommand = 'cursor';
        } else if (appName.includes('windsurf')) {
            cliCommand = 'windsurf';
        } else if (appName.includes('antigravity')) {
            cliCommand = 'antigravity';
        } else if (appName.includes('insiders')) {
            cliCommand = 'code-insiders';
        }

        // 4. Generate extensions.txt
        const txtPath = path.join(targetFolder, 'extensions.txt');
        fs.writeFileSync(txtPath, extensions.join('\n'), 'utf8');

        // 5. Generate install.ps1 (for Windows)
        const ps1Path = path.join(targetFolder, 'install.ps1');
        const ps1Content = `# Installation script for Windows
# Change this variable if you want to install into a different IDE (e.g. 'code', 'cursor', 'windsurf')
$CLI_CMD = "${cliCommand}"

Write-Host "Installing $($extensions.length) extensions using '$CLI_CMD'..."

$extensions = Get-Content -Path ".\\extensions.txt"
foreach ($ext in $extensions) {
    if (-not [string]::IsNullOrWhiteSpace($ext)) {
        Write-Host "Installing $ext..."
        & $CLI_CMD --install-extension $ext
    }
}

Write-Host "Done!"
`;
        fs.writeFileSync(ps1Path, ps1Content, 'utf8');

        // 6. Generate install.sh (for Mac/Linux)
        const shPath = path.join(targetFolder, 'install.sh');
        const shContent = `#!/bin/bash
# Installation script for Mac/Linux
# Change this variable if you want to install into a different IDE (e.g. 'code', 'cursor', 'windsurf')
CLI_CMD="${cliCommand}"

echo "Installing extensions using '$CLI_CMD'..."

while IFS= read -r ext
do
  if [ -n "$ext" ]; then
    echo "Installing $ext..."
    $CLI_CMD --install-extension "$ext"
  fi
done < "extensions.txt"

echo "Done!"
`;
        fs.writeFileSync(shPath, shContent, 'utf8');
        // make install.sh executable (best effort)
        try {
            fs.chmodSync(shPath, '755');
        } catch (e) {
            // ignore
        }

        vscode.window.showInformationMessage(`Exported ${extensions.length} extensions to ${targetFolder}`);
    });

    let importDisposable = vscode.commands.registerCommand('extension-exporter.import', async () => {
        // 1. Ask user to select the extensions.txt file
        const fileUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select extensions.txt to import',
            filters: {
                'Text files': ['txt'],
                'All files': ['*']
            }
        });

        if (!fileUri || fileUri.length === 0) {
            return; // User canceled
        }

        const filePath = fileUri[0].fsPath;

        // 2. Read file and extract IDs
        let content: string;
        try {
            content = fs.readFileSync(filePath, 'utf8');
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to read file: ${err}`);
            return;
        }

        const extensions = content.split(/\r?\n/).map(ext => ext.trim()).filter(ext => ext.length > 0);

        if (extensions.length === 0) {
            vscode.window.showInformationMessage('No extensions found in the selected file.');
            return;
        }

        // 3. Install extensions with progress notification
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Installing Extensions",
            cancellable: false
        }, async (progress) => {
            let installedCount = 0;
            for (let i = 0; i < extensions.length; i++) {
                const ext = extensions[i];
                progress.report({ message: `Installing ${ext} (${i + 1}/${extensions.length})...`, increment: (1 / extensions.length) * 100 });
                try {
                    await vscode.commands.executeCommand('workbench.extensions.installExtension', ext);
                    installedCount++;
                } catch (e) {
                    vscode.window.showErrorMessage(`Failed to install ${ext}: ${e}`);
                }
            }
            vscode.window.showInformationMessage(`Successfully installed ${installedCount} out of ${extensions.length} extensions!`);
        });
    });

    context.subscriptions.push(disposable, importDisposable);
}

export function deactivate() {}
