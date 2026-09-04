//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let electron = require("electron");
let path = require("path");
path = __toESM(path);
let node_fs_promises = require("node:fs/promises");
node_fs_promises = __toESM(node_fs_promises);
let node_path = require("node:path");
node_path = __toESM(node_path);
//#endregion
//#region src/api/ai.ts
var import_main = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$1 = require("fs");
	var path$3 = require("path");
	var os = require("os");
	var crypto$1 = require("crypto");
	var TIPS = [
		"◈ encrypted .env [www.dotenvx.com]",
		"◈ secrets for agents [www.dotenvx.com]",
		"⌁ auth for agents [www.vestauth.com]",
		"⌘ custom filepath { path: '/custom/path/.env' }",
		"⌘ enable debugging { debug: true }",
		"⌘ override existing { override: true }",
		"⌘ suppress logs { quiet: true }",
		"⌘ multiple files { path: ['.env.local', '.env'] }"
	];
	function _getRandomTip() {
		return TIPS[Math.floor(Math.random() * TIPS.length)];
	}
	function parseBoolean(value) {
		if (typeof value === "string") return ![
			"false",
			"0",
			"no",
			"off",
			""
		].includes(value.toLowerCase());
		return Boolean(value);
	}
	function supportsAnsi() {
		return process.stdout.isTTY;
	}
	function dim(text) {
		return supportsAnsi() ? `\x1b[2m${text}\x1b[0m` : text;
	}
	var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
	function parse(src) {
		const obj = {};
		let lines = src.toString();
		lines = lines.replace(/\r\n?/gm, "\n");
		let match;
		while ((match = LINE.exec(lines)) != null) {
			const key = match[1];
			let value = match[2] || "";
			value = value.trim();
			const maybeQuote = value[0];
			value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
			if (maybeQuote === "\"") {
				value = value.replace(/\\n/g, "\n");
				value = value.replace(/\\r/g, "\r");
			}
			obj[key] = value;
		}
		return obj;
	}
	function _parseVault(options) {
		options = options || {};
		const vaultPath = _vaultPath(options);
		options.path = vaultPath;
		const result = DotenvModule.configDotenv(options);
		if (!result.parsed) {
			const err = /* @__PURE__ */ new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
			err.code = "MISSING_DATA";
			throw err;
		}
		const keys = _dotenvKey(options).split(",");
		const length = keys.length;
		let decrypted;
		for (let i = 0; i < length; i++) try {
			const attrs = _instructions(result, keys[i].trim());
			decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
			break;
		} catch (error) {
			if (i + 1 >= length) throw error;
		}
		return DotenvModule.parse(decrypted);
	}
	function _warn(message) {
		console.error(`⚠ ${message}`);
	}
	function _debug(message) {
		console.log(`┆ ${message}`);
	}
	function _log(message) {
		console.log(`◇ ${message}`);
	}
	function _dotenvKey(options) {
		if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) return options.DOTENV_KEY;
		if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
		return "";
	}
	function _instructions(result, dotenvKey) {
		let uri;
		try {
			uri = new URL(dotenvKey);
		} catch (error) {
			if (error.code === "ERR_INVALID_URL") {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			}
			throw error;
		}
		const key = uri.password;
		if (!key) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing key part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environment = uri.searchParams.get("environment");
		if (!environment) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing environment part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		const ciphertext = result.parsed[environmentKey];
		if (!ciphertext) {
			const err = /* @__PURE__ */ new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
			err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
			throw err;
		}
		return {
			ciphertext,
			key
		};
	}
	function _vaultPath(options) {
		let possibleVaultPath = null;
		if (options && options.path && options.path.length > 0) {
			if (Array.isArray(options.path)) {
				for (const filepath of options.path) if (fs$1.existsSync(filepath)) possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
			} else possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
		} else possibleVaultPath = path$3.resolve(process.cwd(), ".env.vault");
		if (fs$1.existsSync(possibleVaultPath)) return possibleVaultPath;
		return null;
	}
	function _resolveHome(envPath) {
		return envPath[0] === "~" ? path$3.join(os.homedir(), envPath.slice(1)) : envPath;
	}
	function _configVault(options) {
		const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
		const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
		if (debug || !quiet) _log("loading env from encrypted .env.vault");
		const parsed = DotenvModule._parseVault(options);
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsed, options);
		return { parsed };
	}
	function configDotenv(options) {
		const dotenvPath = path$3.resolve(process.cwd(), ".env");
		let encoding = "utf8";
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
		let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
		if (options && options.encoding) encoding = options.encoding;
		else if (debug) _debug("no encoding is specified (UTF-8 is used by default)");
		let optionPaths = [dotenvPath];
		if (options && options.path) {
			if (!Array.isArray(options.path)) optionPaths = [_resolveHome(options.path)];
			else {
				optionPaths = [];
				for (const filepath of options.path) optionPaths.push(_resolveHome(filepath));
			}
		}
		let lastError;
		const parsedAll = {};
		for (const path$4 of optionPaths) try {
			const parsed = DotenvModule.parse(fs$1.readFileSync(path$4, { encoding }));
			DotenvModule.populate(parsedAll, parsed, options);
		} catch (e) {
			if (debug) _debug(`failed to load ${path$4} ${e.message}`);
			lastError = e;
		}
		const populated = DotenvModule.populate(processEnv, parsedAll, options);
		debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
		quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
		if (debug || !quiet) {
			const keysCount = Object.keys(populated).length;
			const shortPaths = [];
			for (const filePath of optionPaths) try {
				const relative = path$3.relative(process.cwd(), filePath);
				shortPaths.push(relative);
			} catch (e) {
				if (debug) _debug(`failed to load ${filePath} ${e.message}`);
				lastError = e;
			}
			_log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
		}
		if (lastError) return {
			parsed: parsedAll,
			error: lastError
		};
		else return { parsed: parsedAll };
	}
	function config(options) {
		if (_dotenvKey(options).length === 0) return DotenvModule.configDotenv(options);
		const vaultPath = _vaultPath(options);
		if (!vaultPath) {
			_warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
			return DotenvModule.configDotenv(options);
		}
		return DotenvModule._configVault(options);
	}
	function decrypt(encrypted, keyStr) {
		const key = Buffer.from(keyStr.slice(-64), "hex");
		let ciphertext = Buffer.from(encrypted, "base64");
		const nonce = ciphertext.subarray(0, 12);
		const authTag = ciphertext.subarray(-16);
		ciphertext = ciphertext.subarray(12, -16);
		try {
			const aesgcm = crypto$1.createDecipheriv("aes-256-gcm", key, nonce);
			aesgcm.setAuthTag(authTag);
			return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
		} catch (error) {
			const isRange = error instanceof RangeError;
			const invalidKeyLength = error.message === "Invalid key length";
			const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
			if (isRange || invalidKeyLength) {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			} else if (decryptionFailed) {
				const err = /* @__PURE__ */ new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
				err.code = "DECRYPTION_FAILED";
				throw err;
			} else throw error;
		}
	}
	function populate(processEnv, parsed, options = {}) {
		const debug = Boolean(options && options.debug);
		const override = Boolean(options && options.override);
		const populated = {};
		if (typeof parsed !== "object") {
			const err = /* @__PURE__ */ new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
			err.code = "OBJECT_REQUIRED";
			throw err;
		}
		for (const key of Object.keys(parsed)) if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
			if (override === true) {
				processEnv[key] = parsed[key];
				populated[key] = parsed[key];
			}
			if (debug) {
				if (override === true) _debug(`"${key}" is already defined and WAS overwritten`);
				else _debug(`"${key}" is already defined and was NOT overwritten`);
			}
		} else {
			processEnv[key] = parsed[key];
			populated[key] = parsed[key];
		}
		return populated;
	}
	var DotenvModule = {
		configDotenv,
		_configVault,
		_parseVault,
		config,
		decrypt,
		parse,
		populate
	};
	module.exports.configDotenv = DotenvModule.configDotenv;
	module.exports._configVault = DotenvModule._configVault;
	module.exports._parseVault = DotenvModule._parseVault;
	module.exports.config = DotenvModule.config;
	module.exports.decrypt = DotenvModule.decrypt;
	module.exports.parse = DotenvModule.parse;
	module.exports.populate = DotenvModule.populate;
	module.exports = DotenvModule;
})))());
var ENDPOINT = "https://openai.rc.asu.edu/v1/chat/completions";
var MODEL = "glm-4-5v";
async function ask(image, question, history) {
	const key = process.env.ASU_API_KEY;
	if (!key) throw new Error("ASU_API_KEY is not set");
	const messages = [...history.map((m) => ({
		role: m.role,
		content: m.content
	})), {
		role: "user",
		content: [{
			type: "text",
			text: question || "What is this?"
		}, {
			type: "image_url",
			image_url: { url: image }
		}]
	}];
	const res = await fetch(ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${key}`
		},
		body: JSON.stringify({
			model: MODEL,
			messages,
			max_tokens: 1500
		})
	});
	if (!res.ok) throw new Error(`ASU API ${res.status}: ${await res.text()}`);
	const content = (await res.json()).choices?.[0]?.message?.content;
	if (!content) throw new Error("Model returned empty content");
	return content;
}
//#endregion
//#region src/api/storage.ts
function getStorageDir() {
	return node_path.default.join(electron.app.getPath("userData"), "conversations");
}
async function ensureDirectory() {
	await node_fs_promises.default.mkdir(getStorageDir(), { recursive: true });
}
async function loadAll() {
	try {
		await ensureDirectory();
		const jsonFiles = (await node_fs_promises.default.readdir(getStorageDir())).filter((f) => f.endsWith(".json"));
		const conversations = [];
		for (const file of jsonFiles) try {
			const filePath = node_path.default.join(getStorageDir(), file);
			const data = await node_fs_promises.default.readFile(filePath, "utf-8");
			conversations.push(JSON.parse(data));
		} catch (err) {
			console.error(`Failed to parse conversation file ${file}:`, err);
		}
		return conversations.sort((a, b) => {
			const timeA = typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : a.createdAt;
			return ((typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : b.createdAt) || 0) - (timeA || 0);
		});
	} catch (err) {
		console.error("Failed to load conversations:", err);
		return [];
	}
}
async function getConversation(id) {
	try {
		const filePath = node_path.default.join(getStorageDir(), `${id}.json`);
		const data = await node_fs_promises.default.readFile(filePath, "utf-8");
		return JSON.parse(data);
	} catch {
		return null;
	}
}
async function save(conversation) {
	await ensureDirectory();
	const updatedConversation = {
		...conversation,
		updatedAt: Date.now()
	};
	const filePath = node_path.default.join(getStorageDir(), `${updatedConversation.id}.json`);
	await node_fs_promises.default.writeFile(filePath, JSON.stringify(updatedConversation, null, 2), "utf-8");
}
async function createConversation(title = "New Conversation") {
	const now = Date.now();
	const conversation = {
		id: crypto.randomUUID(),
		title,
		createdAt: now,
		updatedAt: now,
		messages: []
	};
	await save(conversation);
	return conversation;
}
async function deleteConversation(id) {
	try {
		const filePath = node_path.default.join(getStorageDir(), `${id}.json`);
		await node_fs_promises.default.unlink(filePath);
	} catch (err) {
		console.error(`Failed to delete conversation ${id}:`, err);
	}
}
//#endregion
//#region src/capture/captureRegion.ts
async function captureRegion() {
	const display = electron.screen.getPrimaryDisplay();
	const scale = display.scaleFactor;
	const shot = (await electron.desktopCapturer.getSources({
		types: ["screen"],
		thumbnailSize: {
			width: Math.round(display.size.width * scale),
			height: Math.round(display.size.height * scale)
		}
	}))[0].thumbnail;
	const overlay = new electron.BrowserWindow({
		...display.bounds,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		resizable: false,
		movable: false,
		skipTaskbar: true,
		webPreferences: {
			preload: node_path.default.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false
		}
	});
	if (process.env.VITE_DEV_SERVER_URL) await overlay.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/overlay`);
	else await overlay.loadFile(node_path.default.join(__dirname, "../dist/index.html"), { hash: "/overlay" });
	const rect = await new Promise((resolve) => {
		overlay.webContents.once("did-finish-load", () => {
			overlay.webContents.send("overlay:image", shot.toDataURL());
		});
		electron.ipcMain.once("capture:selection", (_event, selectionRect) => {
			resolve(selectionRect);
		});
		overlay.once("closed", () => resolve(null));
	});
	if (!overlay.isDestroyed()) overlay.close();
	if (!rect || rect.width < 4 || rect.height < 4) return null;
	return shot.crop({
		x: Math.round(rect.x * scale),
		y: Math.round(rect.y * scale),
		width: Math.round(rect.width * scale),
		height: Math.round(rect.height * scale)
	}).toDataURL();
}
//#endregion
//#region src/main.ts
import_main.default.config();
var mainWindow = null;
function createWindow() {
	mainWindow = new electron.BrowserWindow({
		width: 520,
		height: 640,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false
		}
	});
	mainWindow.loadURL("http://localhost:5173").catch((err) => {
		console.error("Failed to load renderer URL:", err);
	});
	mainWindow.webContents.openDevTools();
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}
function registerIpcHandlers() {
	electron.ipcMain.handle("get-app-version", () => electron.app.getVersion());
	electron.ipcMain.handle("capture:region", async () => {
		return await captureRegion();
	});
	electron.ipcMain.handle("ai:ask", async (_event, imageBase64, question, history = []) => {
		return await ask(imageBase64, question, history);
	});
	electron.ipcMain.handle("storage:save", (_event, conversation) => save(conversation));
	electron.ipcMain.handle("storage:loadAll", () => loadAll());
	electron.ipcMain.handle("storage:create", (_event, title) => createConversation(title));
	electron.ipcMain.handle("storage:delete", (_event, id) => deleteConversation(id));
	electron.ipcMain.handle("storage:get", (_event, id) => getConversation(id));
}
electron.app.whenReady().then(() => {
	registerIpcHandlers();
	createWindow();
	electron.app.on("activate", () => {
		if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
//#endregion
