// usbCheck.js
import { DeviceCheck } from "./deviceCheck.js";

export class USBCheck extends DeviceCheck {
	constructor() {
		super("usb-info");
	}

	async checkDevices() {
		try {
			if (!navigator.usb) {
				throw new Error("WebUSB not supported");
			}

			const devices = await navigator.usb.getDevices();
			this.updateElement(
				this.formatList(
					devices.map((device) => this.formatUSBDevice(device)),
					"USB Devices",
				),
			);
		} catch (error) {
			this.updateElement(`USB access not available: ${error.message}`);
		}
	}

	formatUSBDevice(device) {
		return `
      <strong>${device.productName || "Unknown Device"}</strong>
      <ul class="list-circle pl-5">
        <li>Vendor ID: ${device.vendorId}</li>
        <li>Product ID: ${device.productId}</li>
        <li>Serial Number: ${device.serialNumber || "N/A"}</li>
      </ul>
    `;
	}
}
