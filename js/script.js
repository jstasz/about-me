"use strict";

//map

import { leaflet } from "leaflet/dist/leaflet.js";
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
const inputName = addForm.querySelector(".form__input--name");
const inputType = addForm.querySelector(".form__input--type");
const inputFood = addForm.querySelector(".form__input--food");
const inputService = addForm.querySelector(".form__input--service");
const inputPrice = addForm.querySelector(".form__input--price");
const inputDescription = addForm.querySelector(".form__input--description");

const activeAddForm = function () {
	mapBox.style.height = "60%";
	addBox.style.height = "20%";
	addForm.classList.remove("form--hidden");
	icons.classList.add("hidden");
};

class Restaurants {
	constructor(coords, name, type, food, service, price, description) {
		this.coords = coords;
		this.name = name;
		this.type = type;
		this.food = food;
		this.service = service;
		this.price = price;
		this.description = description;
		this._calcAverage();
	}

	_calcAverage() {
		this.average = (this.food + this.service + this.price) / 3;
		return this.average;
	}
}

class App {
	#map;
	#mapZoomLevel = 14;
	#mapEvent;
	#restaurants = [];

	constructor() {
		this._getPosition();
		addForm.addEventListener("submit", this._newRestaurant.bind(this));
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

		this.#map.on("click", this._showAddForm.bind(this));

		this.#restaurants.forEach((restaurant) =>
			this._renderRestaurantMarker(restaurant)
		);
	}

	_showAddForm(mapE) {
		this.#mapEvent = mapE;
		addForm.classList.remove("form--hidden");
		this._changeLayout();
	}

	_changeLayout() {
		mapBox.style.height = "55%";
		addBox.style.height = "35%";
		icons.classList.add("hidden");
		inputName.focus();
	}

	_hideAddForm() {
		this._startedLayout();
		setTimeout(this._scrolltoList, 1500);
	}

	_startedLayout() {
		mapBox.style.height = "65%";
		addBox.style.height = "15%";
		icons.classList.remove("hidden");
		addForm.classList.add("form--hidden");
	}

	_scrolltoList(e) {
		const listTop = restaurantlistSection.offsetTop;
		window.scrollTo(0, listTop - 10);
	}

	_newRestaurant(e) {
		e.preventDefault();
		const name = inputName.value;
		const type = inputType.value;
		const food = +inputFood.value;
		const service = +inputService.value;
		const price = +inputPrice.value;
		const description = inputDescription.value;
		const { lat, lng } = this.#mapEvent.latlng;
		let restaurant;

		restaurant = new Restaurants(
			[lat, lng],
			name,
			type,
			food,
			service,
			price,
			description
		);

		this.#restaurants.push(restaurant);

		this._renderRestaurantMarker(restaurant);

		this._hideAddForm();
	}

	_renderRestaurantMarker(restaurant) {
		L.marker(restaurant.coords)
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: false,
					closeOnClick: false,
					// className: `${workout.type}-popup`,
				})
			)
			.setPopupContent(
				`${restaurant.name} (${restaurant.type}) ${restaurant.average}`
			)
			.openPopup();
	}
}

const Apllication = new App();
