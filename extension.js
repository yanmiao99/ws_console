const vscode = require('vscode');

function activate(context) {
	// 注册代码片段
	context.subscriptions.push(vscode.commands.registerCommand('extension.consoleLog', function () {
		// 获取编辑器
		const editor = vscode.window.activeTextEditor;

		// 获取当前光标的前四个字符是不是.log
		const line = editor.document.lineAt(editor.selection.start.line);
		const lineText = line.text;
		const position = editor.selection.start.character;
		const isLog = lineText.substring(position - 4, position) === '.log';
		if (!isLog) {
			return;
		}

		// 获取.log前面的所有字符, 也就是变量名
		let variable = '';
		for (let i = position - 5; i >= 0; i--) {
			const char = lineText[i];
			if (char === ' ' || char === '=') {
				break;
			}
			variable = char + variable;
		}

		// 如果变量名为空, 则不做任何操作
		if (!variable) {
			return;
		}

		// 判断 variable 是中文和数字开头, 则直接转换为字符串
		let constant = ''
		if (/^[\u4e00-\u9fa5]/.test(variable) || /^\d/.test(variable)) {
			constant = `'${variable}'`;
		}

		// 插入代码
		editor.edit(editBuilder => {
			const newText = `console.log('${variable.trim()}=======>', ${constant ? constant : variable.trim()})`

			// 获取当前行前面有多少个空格
			const space = lineText.match(/^\s*/)[0];

			// 把当前行的所有内容替换成新的内容
			editBuilder.replace(new vscode.Range(line.range.start, line.range.end), `${space}${newText}`);
		});
	}));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
