// barcodeCheck.js
import { DeviceCheck } from "./deviceCheck.js";

export class BarcodeCheck extends DeviceCheck {
	constructor() {
		super("barcode-info");
		this.checkCapabilities();
	}

	async checkCapabilities() {
		try {
			if (!("BarcodeDetector" in window)) {
				throw new Error("Barcode Detection API not supported");
			}

			const formats = await BarcodeDetector.getSupportedFormats();
			const content = `
        <ul class="list-disc pl-5">
          <li class="text-green-600">✓ Barcode Detection API is supported</li>
          <li>Supported formats:
            <ul class="list-circle pl-5">
              ${formats.map((format) => `<li>${format}</li>`).join("")}
            </ul>
          </li>
        </ul>`;

			this.updateElement(content);
		} catch (error) {
			this.updateElement(`
        <div class="text-red-600">
          Barcode detection not available: ${error.message}
        </div>`);
		}
	}
}
