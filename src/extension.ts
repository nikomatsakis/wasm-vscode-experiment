// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WasmContext, Memory } from '@vscode/wasm-component-model';
import {Types,  calculator} from './calculator';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// The channel for printing the result.
	const channel = vscode.window.createOutputChannel('Calculator');
	context.subscriptions.push(channel);

	// The channel for printing the log.
	const log = vscode.window.createOutputChannel('Calculator - Log', { log: true });
	context.subscriptions.push(log);

	// Load the Wasm module
	const filename = vscode.Uri.joinPath(
		context.extensionUri,
		'target',
		'wasm32-unknown-unknown',
		'debug',
		'calculator.wasm'
	);
	const bits = await vscode.workspace.fs.readFile(filename);
	const module = await WebAssembly.compile(bits);

	// The context for the WASM module
	const wasmContext: WasmContext.Default = new WasmContext.Default();

	// The implementation of the log function that is called from WASM
	const service: calculator.Imports = {
		log: (msg: string) => {
			log.info(msg);
		}
	};

	// Create the bindings to import the log function into the WASM module
	const imports = calculator._.imports.create(service, wasmContext);
	// Instantiate the module
	const instance = await WebAssembly.instantiate(module, imports);

	// Bind the WASM memory to the context
	wasmContext.initialize(new Memory.Default(instance.exports));

	// Bind the TypeScript Api
	const api = calculator._.exports.bind(instance.exports as calculator._.Exports, wasmContext);

	context.subscriptions.push(vscode.commands.registerCommand('wasm-experiment.helloWorld', () => {
		channel.show();
		channel.appendLine('Running calculator example');
		const add = Types.Operation.Add({ left: 1, right: 2});
		channel.appendLine(`Add ${api.calc(add)}`);
		const sub = Types.Operation.Sub({ left: 10, right: 8 });
		channel.appendLine(`Sub ${api.calc(sub)}`);
		const mul = Types.Operation.Mul({ left: 3, right: 7 });
		channel.appendLine(`Mul ${api.calc(mul)}`);
		const div = Types.Operation.Div({ left: 10, right: 2 });
		channel.appendLine(`Div ${api.calc(div)}`);
	}));
}

// This method is called when your extension is deactivated
export function deactivate() { }
