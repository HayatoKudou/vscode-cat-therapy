import * as vscode from 'vscode';
import axios from "axios";

var cats: string[] = [];

export function activate(context: vscode.ExtensionContext) {

	getCatsGif();
	
	const callCat = 'catCommand.callCat';

	context.subscriptions.push(vscode.commands.registerCommand(callCat, () => {
		const panel = vscode.window.createWebviewPanel(
			'catCommand',
			'This is a cat',
			vscode.ViewColumn.One,
			{}
		);
		panel.webview.html = getWebviewContent();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('catCommand.changeCats', () => {
		getCatsGif();
	}))

	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	myStatusBarItem.command = callCat;
	myStatusBarItem.text = `$(comment) Hey Cat!!`;
	context.subscriptions.push(myStatusBarItem);
	myStatusBarItem.show();
}

function getCatsGif() {
	cats = [];
	const search = "cat";
	const key = "VHVLGLNA2hlgRyYY1MaxMFXTuS3Lus38";
	const limit = 100;

	const url = `https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${key}&limit=${limit}`;

	axios.get(url).then(res => {
		const data = res.data.data;
		data.map((val: any) => {
			cats.push(val.images.downsized.url);
		})
	});
}

function getWebviewContent() {
	const cat = cats[Math.floor(Math.random() * cats.length)];
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="${cat}" width="50%" />
</body>
</html>`;
}