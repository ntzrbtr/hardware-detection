// systemCheck.js
import { DeviceCheck } from "./deviceCheck.js";

export class SystemCheck extends DeviceCheck {
	constructor() {
		super("system-info");
		this.checkSystem();
	}

	checkSystem() {
		const systemInfo = [
			`Logical Processors: ${navigator.hardwareConcurrency}`,
			`Memory: ${navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Unknown"}`,
			`Platform: ${navigator.platform}`,
			`User Agent: ${navigator.userAgent}`,
			`Language: ${navigator.language}`,
			`Online Status: ${navigator.onLine ? "Online" : "Offline"}`,
		];

		this.updateElement(this.formatList(systemInfo, "System Information"));
	}
}
