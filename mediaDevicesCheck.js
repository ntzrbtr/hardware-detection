// mediaDevicesCheck.js
import { DeviceCheck } from "./deviceCheck.js";

export class MediaDevicesCheck extends DeviceCheck {
	constructor() {
		super("media-devices");
		this.currentStream = null;
		this.setupEventListeners();
	}

	async initialize() {
		try {
			await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			this.updateDeviceList();
			navigator.mediaDevices.addEventListener("devicechange", () =>
				this.updateDeviceList(),
			);
		} catch (error) {
			this.updateElement(
				`Permission denied or error occurred: ${error.message}`,
			);
		}
	}

	setupEventListeners() {
		// Device selection change listener
		document.getElementById("deviceSelect")?.addEventListener("change", (e) => {
			if (e.target.value) {
				this.stopVideoPreview(); // Stop any existing preview
			} else {
				this.stopVideoPreview();
			}
		});

		// Test device button listener
		document.getElementById("testDevice")?.addEventListener("click", () => {
			const selectedDeviceId = document.getElementById("deviceSelect")?.value;
			if (selectedDeviceId) {
				this.getDeviceCapabilities(selectedDeviceId);
			} else {
				this.showStatus("Please select a device first");
			}
		});
	}

	showStatus(message) {
		const statusDiv = document.getElementById("status");
		if (statusDiv) {
			const messageDiv = statusDiv.querySelector("div");
			messageDiv.textContent = message;
			statusDiv.classList.remove("hidden");
			setTimeout(() => {
				statusDiv.classList.add("hidden");
			}, 3000);
		}
	}

	async updateDeviceList() {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = devices.filter(
				(device) => device.kind === "videoinput",
			);
			const audioInputDevices = devices.filter(
				(device) => device.kind === "audioinput",
			);
			const audioOutputDevices = devices.filter(
				(device) => device.kind === "audiooutput",
			);

			this.updateDeviceDropdown(devices);
			this.updateDeviceLists(
				videoDevices,
				audioInputDevices,
				audioOutputDevices,
			);
		} catch (error) {
			this.showStatus(`Error listing devices: ${error.message}`);
		}
	}

	updateDeviceDropdown(devices) {
		const select = document.getElementById("deviceSelect");
		if (select) {
			select.innerHTML = '<option value="">Choose a device...</option>';
			devices.forEach((device) => {
				const option = document.createElement("option");
				option.value = device.deviceId;
				option.text =
					device.label || `${device.kind} (${device.deviceId.slice(0, 8)}...)`;
				select.appendChild(option);
			});
		}
	}

	updateDeviceLists(videoDevices, audioInputDevices, audioOutputDevices) {
		document.getElementById("videoDevices").innerHTML = this.formatList(
			videoDevices.map((device) => this.formatDeviceInfo(device)),
			"Video Devices",
		);
		document.getElementById("audioDevices").innerHTML = this.formatList(
			audioInputDevices.map((device) => this.formatDeviceInfo(device)),
			"Audio Input Devices",
		);
		document.getElementById("audioOutputs").innerHTML = this.formatList(
			audioOutputDevices.map((device) => this.formatDeviceInfo(device)),
			"Audio Output Devices",
		);
	}

	formatDeviceInfo(device) {
		return `
      <div>
        <strong>${device.label || "Unnamed Device"}</strong>
        <div class="text-xs text-gray-600">ID: ${device.deviceId.slice(0, 8)}...</div>
      </div>
    `;
	}

	async getDeviceCapabilities(deviceId) {
		try {
			// Stop any existing stream first
			this.stopVideoPreview();

			// Determine device type
			const devices = await navigator.mediaDevices.enumerateDevices();
			const device = devices.find((d) => d.deviceId === deviceId);

			if (!device) {
				throw new Error("Device not found");
			}

			// Set up constraints based on device type
			const constraints = {
				video:
					device.kind === "videoinput"
						? { deviceId: { exact: deviceId } }
						: false,
				audio: device.kind.includes("audioinput")
					? { deviceId: { exact: deviceId } }
					: false,
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);

			if (device.kind === "videoinput") {
				const track = stream.getVideoTracks()[0];
				if (track) {
					this.displayCapabilities(
						track.getCapabilities(),
						track.getSettings(),
					);
					this.updateVideoPreview(stream);
				}
			} else if (device.kind === "audioinput") {
				const track = stream.getAudioTracks()[0];
				if (track) {
					this.displayAudioCapabilities(
						track.getCapabilities(),
						track.getSettings(),
					);
				}
			}

			this.currentStream = stream;
		} catch (error) {
			this.showStatus(`Error testing device: ${error.message}`);
		}
	}

	displayCapabilities(capabilities, settings) {
		const content = `
      <div class="space-y-2">
        <h4 class="font-medium">Current Settings:</h4>
        <ul class="list-disc pl-5">
          <li>Resolution: ${settings.width}x${settings.height}</li>
          <li>Frame Rate: ${settings.frameRate?.toFixed(1) || "N/A"} fps</li>
          <li>Aspect Ratio: ${settings.aspectRatio?.toFixed(2) || "N/A"}</li>
        </ul>

        <h4 class="font-medium mt-4">Supported Capabilities:</h4>
        <ul class="list-disc pl-5">
          ${
						capabilities.width
							? `<li>Resolution Range: ${capabilities.width.min}x${capabilities.height.min} to ${capabilities.width.max}x${capabilities.height.max}</li>`
							: ""
					}
          ${
						capabilities.frameRate
							? `<li>Frame Rate Range: ${capabilities.frameRate.min} - ${capabilities.frameRate.max} fps</li>`
							: ""
					}
          ${
						capabilities.facingMode
							? `<li>Facing Modes: ${capabilities.facingMode.join(", ")}</li>`
							: ""
					}
          ${
						capabilities.zoom
							? `<li>Zoom Range: ${capabilities.zoom.min}x - ${capabilities.zoom.max}x</li>`
							: ""
					}
        </ul>
      </div>
    `;

		document.getElementById("deviceCapabilities").innerHTML = content;
	}

	displayAudioCapabilities(capabilities, settings) {
		const content = `
      <div class="space-y-2">
        <h4 class="font-medium">Current Settings:</h4>
        <ul class="list-disc pl-5">
          <li>Sample Rate: ${settings.sampleRate || "N/A"} Hz</li>
          <li>Channel Count: ${settings.channelCount || "N/A"}</li>
          <li>Latency: ${settings.latency || "N/A"} seconds</li>
          ${
						settings.echoCancellation !== undefined
							? `<li>Echo Cancellation: ${settings.echoCancellation ? "On" : "Off"}</li>`
							: ""
					}
          ${
						settings.autoGainControl !== undefined
							? `<li>Auto Gain Control: ${settings.autoGainControl ? "On" : "Off"}</li>`
							: ""
					}
          ${
						settings.noiseSuppression !== undefined
							? `<li>Noise Suppression: ${settings.noiseSuppression ? "On" : "Off"}</li>`
							: ""
					}
        </ul>

        <h4 class="font-medium mt-4">Supported Capabilities:</h4>
        <ul class="list-disc pl-5">
          ${
						capabilities.sampleRate
							? `<li>Sample Rate Range: ${capabilities.sampleRate.min} - ${capabilities.sampleRate.max} Hz</li>`
							: ""
					}
          ${
						capabilities.channelCount
							? `<li>Channel Count Range: ${capabilities.channelCount.min} - ${capabilities.channelCount.max}</li>`
							: ""
					}
        </ul>
      </div>
    `;

		document.getElementById("deviceCapabilities").innerHTML = content;
	}

	updateVideoPreview(stream) {
		const video = document.getElementById("preview");
		if (video) {
			video.classList.remove("hidden");
			video.srcObject = stream;
		}
	}

	stopVideoPreview() {
		const video = document.getElementById("preview");
		if (video) {
			video.classList.add("hidden");
			video.srcObject = null;
		}
		if (this.currentStream) {
			this.currentStream.getTracks().forEach((track) => track.stop());
			this.currentStream = null;
		}
	}
}
