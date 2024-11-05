// networkCheck.js
import { DeviceCheck } from "./deviceCheck.js";

export class NetworkCheck extends DeviceCheck {
	constructor() {
		super("network-info");
		this.checkNetwork();
		this.setupEventListeners();
	}

	setupEventListeners() {
		window.addEventListener("online", () => this.checkNetwork());
		window.addEventListener("offline", () => this.checkNetwork());
		if ("connection" in navigator) {
			navigator.connection.addEventListener("change", () =>
				this.checkNetwork(),
			);
		}
	}

	checkNetwork() {
		const connection =
			navigator.connection ||
			navigator.mozConnection ||
			navigator.webkitConnection;

		if (connection) {
			const content = `
        <ul class="list-disc pl-5">
          <li>Online Status:
            <span class="${navigator.onLine ? "text-green-600" : "text-red-600"}">
              ${navigator.onLine ? "✓ Online" : "✗ Offline"}
            </span>
          </li>
          <li>Connection Type: ${connection.type || "Unknown"}</li>
          <li>Effective Type: ${connection.effectiveType || "Unknown"}</li>
          <li>Downlink Speed: ${connection.downlink || "Unknown"} Mbps</li>
          <li>RTT (Round Trip Time): ${connection.rtt || "Unknown"} ms</li>
          ${connection.saveData ? '<li class="text-yellow-600">Data Saver is enabled</li>' : ""}
          ${
						typeof connection.maxDownlink !== "undefined"
							? `<li>Maximum Downlink Speed: ${connection.maxDownlink} Mbps</li>`
							: ""
					}
        </ul>`;

			this.updateElement(content);
		} else {
			const content = `
        <ul class="list-disc pl-5">
          <li>Online Status:
            <span class="${navigator.onLine ? "text-green-600" : "text-red-600"}">
              ${navigator.onLine ? "✓ Online" : "✗ Offline"}
            </span>
          </li>
          <li>Detailed network information not available</li>
        </ul>`;

			this.updateElement(content);
		}
	}
}
