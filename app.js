// app.js
import { DeviceCheck } from "./deviceCheck.js";
import { MediaDevicesCheck } from "./mediaDevicesCheck.js";
import { USBCheck } from "./usbCheck.js";
import { BluetoothCheck } from "./bluetoothCheck.js";
import { BarcodeCheck } from "./barcodeCheck.js";
import { NetworkCheck } from "./networkCheck.js";
import { BatteryCheck } from "./batteryCheck.js";
import { SensorsCheck } from "./sensorsCheck.js";
import { SystemCheck } from "./systemCheck.js";

class DeviceCapabilitiesApp {
	constructor() {
		this.mediaDevices = new MediaDevicesCheck();
		this.usb = new USBCheck();
		this.bluetooth = new BluetoothCheck();
		this.barcode = new BarcodeCheck();
		this.network = new NetworkCheck();
		this.battery = new BatteryCheck();
		this.sensors = new SensorsCheck();
		this.system = new SystemCheck();
	}

	initialize() {
		// Initialize media devices
		this.mediaDevices.initialize();

		// Set up USB button
		document.getElementById("check-usb")?.addEventListener("click", () => {
			this.usb.checkDevices();
		});

		// Set up Bluetooth button
		document
			.getElementById("check-bluetooth")
			?.addEventListener("click", () => {
				this.bluetooth.scanDevices();
			});

		// Initial screen info update
		this.updateScreenInfo();

		// Set up window event listeners
		window.addEventListener("resize", () => this.updateScreenInfo());
	}

	updateScreenInfo() {
		const screen = window.screen;
		const screenInfo = [
			`Screen Width: ${screen.width}px`,
			`Screen Height: ${screen.height}px`,
			`Available Width: ${screen.availWidth}px`,
			`Available Height: ${screen.availHeight}px`,
			`Color Depth: ${screen.colorDepth} bits`,
			`Pixel Depth: ${screen.pixelDepth} bits`,
			`Device Pixel Ratio: ${window.devicePixelRatio}`,
		];

		document.getElementById("screen-info").innerHTML =
			new DeviceCheck().formatList(screenInfo, "Screen Information");
	}
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	const app = new DeviceCapabilitiesApp();
	app.initialize();
});
