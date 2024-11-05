// deviceCheck.js
export class DeviceCheck {
	constructor(elementId) {
		this.elementId = elementId;
		this.element = document.getElementById(elementId);
	}

	updateElement(content) {
		if (this.element) {
			this.element.innerHTML = content;
		}
	}

	formatList(items, type) {
		if (items.length === 0) return `<p>No ${type} found</p>`;

		return `
        <ul class="list-disc pl-5">
          ${items.map((item) => this.formatListItem(item)).join("")}
        </ul>
      `;
	}

	formatListItem(item) {
		return `<li class="mb-2">${item}</li>`;
	}
}
