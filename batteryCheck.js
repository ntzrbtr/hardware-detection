// batteryCheck.js
import { DeviceCheck } from "./deviceCheck.js";

export class BatteryCheck extends DeviceCheck {
	constructor() {
		super("battery-info");
		this.battery = null;
		this.initBattery();
	}

	async initBattery() {
		try {
			this.battery = await navigator.getBattery();
			this.updateBatteryInfo();
			this.setupEventListeners();
		} catch (error) {
			this.updateElement(`
        <div class="text-red-600">
          Battery status not available: ${error.message}
        </div>`);
		}
	}

	setupEventListeners() {
		if (this.battery) {
			// Update on any battery event
			[
				"chargingchange",
				"levelchange",
				"chargingtimechange",
				"dischargingtimechange",
			].forEach((event) => {
				this.battery.addEventListener(event, () => this.updateBatteryInfo());
			});
		}
	}

	updateBatteryInfo() {
		if (!this.battery) {
			return;
		}

		const batteryLevel = (this.battery.level * 100).toFixed(1);
		const charging = this.battery.charging;
		const chargingTime = this.battery.chargingTime;
		const dischargingTime = this.battery.dischargingTime;

		// Color class based on battery level
		let levelColorClass = "text-green-600";
		if (batteryLevel <= 20) {
			levelColorClass = "text-red-600";
		} else if (batteryLevel <= 50) {
			levelColorClass = "text-yellow-600";
		}

		const content = `
      <ul class="list-disc pl-5">
        <li>Battery Level:
          <span class="${levelColorClass}">
            ${batteryLevel}%
          </span>
        </li>
        <li>Charging Status:
          <span class="${charging ? "text-green-600" : "text-yellow-600"}">
            ${charging ? "⚡ Charging" : "🔋 Not Charging"}
          </span>
        </li>
        ${
					charging && chargingTime !== Number.POSITIVE_INFINITY
						? `<li>Time until fully charged: ${this.formatTime(chargingTime)}</li>`
						: ""
				}
        ${
					!charging && dischargingTime !== Number.POSITIVE_INFINITY
						? `<li>Time until empty: ${this.formatTime(dischargingTime)}</li>`
						: ""
				}
      </ul>`;

		this.updateElement(content);
	}

	formatTime(seconds) {
		if (seconds === Number.POSITIVE_INFINITY) {
			return "Unknown";
		}

		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		let timeString = "";
		if (hours > 0) {
			timeString += `${hours}h `;
		}
		if (minutes > 0) {
			timeString += `${minutes}m`;
		}

		return timeString.trim() || "less than 1m";
	}
}
