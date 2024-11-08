// sensorsCheck.js
import { DeviceCheck } from "./deviceCheck.js";

export class SensorsCheck extends DeviceCheck {
	constructor() {
		super("sensor-info");
		this.checkSensors();
	}

	checkSensors() {
		const sensors = {
			Accelerometer: typeof Accelerometer !== "undefined",
			Gyroscope: typeof Gyroscope !== "undefined",
			Magnetometer: typeof Magnetometer !== "undefined",
			AbsoluteOrientationSensor:
				typeof AbsoluteOrientationSensor !== "undefined",
			RelativeOrientationSensor:
				typeof RelativeOrientationSensor !== "undefined",
			AmbientLightSensor: typeof AmbientLightSensor !== "undefined",
		};

		this.updateElement(
			this.formatList(
				Object.entries(sensors).map(
					([sensor, available]) =>
						`${sensor}: ${available ? '<span class="text-green-600">Available</span>' : '<span class="text-red-600">Not Available</span>'}`,
				),
				"Sensors",
			),
		);
	}
}
