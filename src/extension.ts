import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

const cats = {
	'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
	'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
	'Testing Cat': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
};

export function activate(context: vscode.ExtensionContext) {

	const quickPick = 'terminalLog.quickPick';

	context.subscriptions.push(vscode.commands.registerCommand(quickPick, () => {
		if (vscode.window.registerWebviewPanelSerializer) {
			vscode.window.registerWebviewPanelSerializer(CatCodingPanel.viewType, {
				async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
					webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
					CatCodingPanel.revive(webviewPanel, context.extensionUri);
				}
			});
		} else {
			vscode.window.showWarningMessage('失敗');
		}
	}));

	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	myStatusBarItem.command = quickPick;
	myStatusBarItem.text = 'Cat!!';
	context.subscriptions.push(myStatusBarItem);
	myStatusBarItem.show();
}

// webview設定
function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		enableScripts: true,
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

class CatCodingPanel {

	public static readonly viewType = 'catCoding';
	public static currentPanel: CatCodingPanel | undefined;
	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;

	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;
		const webview = this._panel.webview;

		this._updateForCat(webview, 'Compiling Cat');
	}

	private _updateForCat(webview: vscode.Webview, catName: keyof typeof cats) {
		this._panel.title = catName;
		this._panel.webview.html = this._getHtmlForWebview(webview, cats[catName]);
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionUri);
	}

	private _getHtmlForWebview(webview: vscode.Webview, catGifPath: string) {

		return `<!DOCTYPE html>
			<html lang="en">
			<body>
				<img src="${catGifPath}" width="300" />
				<h1 id="lines-of-code-counter">0</h1>
			</body>
			</html>`;
	}
}
