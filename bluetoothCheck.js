// bluetoothCheck.js
import { DeviceCheck } from "./deviceCheck.js";

export class BluetoothCheck extends DeviceCheck {
	constructor() {
		super("bluetooth-info");
	}

	async scanDevices() {
		try {
			if (!navigator.bluetooth) {
				throw new Error("Web Bluetooth not supported");
			}

			this.updateElement("Scanning for Bluetooth devices...");

			const device = await navigator.bluetooth.requestDevice({
				acceptAllDevices: true,
			});

			this.updateElement(
				this.formatList(
					[this.formatBluetoothDevice(device)],
					"Bluetooth Devices",
				),
			);
		} catch (error) {
			this.updateElement(`Bluetooth scanning failed: ${error.message}`);
		}
	}

	formatBluetoothDevice(device) {
		return `
      <strong>${device.name || "Unnamed Device"}</strong>
      <ul class="list-circle pl-5">
        <li>ID: ${device.id}</li>
        <li>Connected: ${device.gatt.connected}</li>
      </ul>
    `;
	}
}
