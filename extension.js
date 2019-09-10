// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const _ = require('lodash');
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "apidoc" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.zsdoc', function () {
		// The code you place here will be executed every time your command is executed

		const message = '你方唱罢我登场'

		let editor = vscode.window.activeTextEditor;
		if (editor) {
			vscode.window.showErrorMessage(message)
		}

		let selection = editor.selection;
		let query = editor.document.getText(selection)

		let content = transformToDoc(query)
		
		replaceText(content)
		// Display a message box to the user
		vscode.window.showInformationMessage(message);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

function transformToDoc(query) {
	let text = `/**\n`
		+ ` * @api {get} /user/info 用户账户信息\n`
		+ ` * @apiName \n`
		+ ` * @apiGroup \n`
		+ ` * @apiVersion 0.1.0\n`
		+ ` * @apiDescription \n`
		+ ` * @apiPermission User\n`
		+ ` *\n`
		+ ` * @apiUse PublicParam\n`
		+ ` *\n`
		+ ` * @apiParamExample {json} Request-Example:\n`
		+ ` * Here is a request example.\n`
		+ ` *\n`;

	try {
		let temp = query;
		query = query.replace(/\ +/g,"");
		query = query.replace(/[\r\n]/g, "");
		let result = JSON.parse(query);
		getNodes(result);

		text += ` *\n`
		+ ` * @apiSuccessExample {json} Success-Response:\n`
		+ ` * HTTP/1.1 200 OK\n`;
		
		let strs = temp.split(/[\n,]/g);
		_.each(strs, (str) => {
			if (str) text += ` * ${str}\n`;
		});
		text += ' *\n';
		
	} catch (err) {
		console.log(err);
	}

	text += ` * @apiErrorExample {json} Error-Response:\n`
		+ ` * HTTP/1.1 401 TOKEN_INVALID\n`
		+ ` * {\n`
		+ ` * 	  "ecode": -101,\n`
		+ ` *     "message": '无效token',\n`
		+ ` * }\n`
		+ ` */`;
	return text;
	
	function outputApiDocLine(type, node, pNode) {
		type = _.capitalize(type) // 首字母大写
		let key = pNode ? `${pNode}.${node}` : `${node}`
		return ` * @apiSuccess {${type}} ${key}\n`
	}
	
	function getNodes(target, pNode = '') {
		for (let key in target) {
			let type = typeof target[key]
	
			if (_.isArray(target[key])) {
				let temp = target[key][0]
				if (_.isObject(temp)) {
					text += outputApiDocLine('object[]', key, pNode)
					let newPNode = pNode ? `${pNode}.${key}` : key
					getNodes(target[key][0], newPNode)
				} else {
					text += outputApiDocLine('array', key, pNode)
				}
			} else if (_.isObject(target[key])) {
				text += outputApiDocLine(type, key, pNode)
				let newPNode = pNode ? `${pNode}.${key}` : key
				getNodes(target[key], newPNode)
			} else {
				text += outputApiDocLine(type, key, pNode)
			}
		}
	}
}

function replaceText(content) {
	let editor = vscode.window.activeTextEditor
	editor.edit(
		edit => editor.selections.forEach(
			selection => {
				edit.replace(selection, content)
				// edit.insert(selection.end, "\n" + content)
			}
	))
}
