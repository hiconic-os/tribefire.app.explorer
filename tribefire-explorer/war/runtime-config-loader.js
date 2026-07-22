// ============================================================================
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ============================================================================

let runtime = {};

try {
	const response = await fetch(new URL("runtime-config.json", import.meta.url), { cache: "no-store" });
	if (response.ok)
		runtime = await response.json();
	else
		console.warn(`Cannot load Explorer runtime configuration: ${response.status} ${response.statusText}`);
} catch (error) {
	console.warn("Cannot load Explorer runtime configuration", error);
}

globalThis.hiconicRuntime = Object.freeze(runtime);

// Compatibility bridge for GWT modules which still consume TribefireRuntime
// properties from tf:* meta elements. New code consumes hiconicRuntime directly.
const legacyPropertyNames = {
	servicesUrl: "TRIBEFIRE_PUBLIC_SERVICES_URL",
	websocketUrl: "TRIBEFIRE_WEBSOCKET_URL",
	controlCenterUrl: "TRIBEFIRE_CONTROL_CENTER_URL",
	explorerUrl: "TRIBEFIRE_EXPLORER_URL",
	tribefireJsUrl: "TRIBEFIRE_JS_URL",
	platformSetupSupport: "TRIBEFIRE_PLATFORM_SETUP_SUPPORT",
	webLoginRelativePath: "TRIBEFIRE_WEB_LOGIN_RELATIVE_PATH",
	webReaderUrl: "TRIBEFIRE_WEBREADER_URL"
};

Object.entries(legacyPropertyNames).forEach(([runtimeName, legacyName]) => {
	const value = runtime[runtimeName];
	if (value == null || document.querySelector(`meta[name="tf:${legacyName}"]`))
		return;

	const meta = document.createElement("meta");
	meta.name = `tf:${legacyName}`;
	meta.content = String(value);
	document.head.appendChild(meta);
});
