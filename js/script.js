"use strict";

//map

import { leaflet } from "leaflet/dist/leaflet.js";

class App {
	#map;
	#mapZoomLevel = 13;
	#mapEvent;
	#restaurants = [];

	constructor() {
		this._getPosition();
	}

	_getPosition() {
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(
				this._loadMap.bind(this),
				function () {
					alert(`could not get your position`);
				}
			);
	}

	_loadMap(position) {
		const { latitude } = position.coords;
		const { longitude } = position.coords;

		const coords = [latitude, longitude];

		this.#map = L.map("map").setView(coords, this.#mapZoomLevel);

		L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(this.#map);

		// this.#map.on("click", this._showForm.bind(this));

		this.#restaurants.forEach((restaurant) =>
			this._renderRestaurantMarker(restaurant)
		);
	}
}

const Apllication = new App();

// active add and find restaurant

const addIcon = document.querySelector(".main__forms-icon--add");
const mapBox = document.querySelector(".main__map");
const addBox = document.querySelector(".main__forms");
const addForm = document.querySelector(".main__forms--add");
const findIcon = document.querySelector(".main__forms-icon--find");
const findForm = document.querySelector(".main__forms--find");
const icons = document.querySelector(".main__forms-icons");
const addSubmitBtn = document.querySelector(".form__btn--add");
const findSubmitBtn = document.querySelector(".form__btn--find");
const restaurantlistSection = document.querySelector(".restaurants");

const firstLayout = function () {
	mapBox.style.height = "65%";
	addBox.style.height = "15%";
};

const changeLayout = function () {
	mapBox.style.height = "60%";
	addBox.style.height = "20%";
};

const showAddForm = function () {
	addForm.classList.remove("form--hidden");
	icons.classList.add("hidden");
};

addIcon.addEventListener("click", changeLayout);
addIcon.addEventListener("click", showAddForm);

const showFindForm = function () {
	findForm.classList.remove("form--hidden");
	icons.classList.add("hidden");
};

findIcon.addEventListener("click", changeLayout);
findIcon.addEventListener("click", showFindForm);

const deleteAddForm = function () {
	icons.classList.remove("hidden");
	findForm.classList.add("form--hidden");
	addForm.classList.add("form--hidden");
};

const scrolltoList = function (e) {
	e.preventDefault();
	const listTop = restaurantlistSection.offsetTop;
	window.scrollTo(0, listTop - 10);
	deleteAddForm();
	firstLayout();
};

// scrolltoList();

addSubmitBtn.addEventListener("click", scrolltoList);
findSubmitBtn.addEventListener("click", scrolltoList);
