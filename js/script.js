"use strict";

const mapBox = document.querySelector(".main__map");

const formsBox = document.querySelector(".main__forms");
const formsBoxContent = document.querySelector(".main__forms-box");

const addForm = document.querySelector(".main__forms--add");
const findForm = document.querySelector(".main__forms--find");

const findActivator = document.querySelector(".activator__form--find");
const findSubmitBtn = document.querySelector(".form__btn--find");
const closeFormIcon = document.querySelectorAll(".form__close");

const inputName = addForm.querySelector(".form__input--name");
const inputFood = addForm.querySelector(".form__input--food");
const inputService = addForm.querySelector(".form__input--service");
const inputPrice = addForm.querySelector(".form__input--price");
const inputImpress = addForm.querySelector(".form__input--impress");

const restaurantsSection = document.querySelector(".restaurants");

const restaurantList = document.querySelector(".restaurants__all");
const restaurantActiveList = document.querySelector(".restaurants__active");
const restaurantListEl = restaurantList.querySelectorAll(".restaurant");

const pages = document.querySelector(".restaurants__pages");
const nextPage = document.querySelector(".restaurants__pages-change--next");
const previousPage = document.querySelector(
	".restaurants__pages-change--previous"
);

class Restaurants {
	date = new Date();
	id = (Date.now() + "").slice(-10);

	constructor(coords, name, food, service, price, impress) {
		this.coords = coords;
		this.name = name;
		this.food = food;
		this.service = service;
		this.price = price;
		this.impress = impress;
		this._calcAverage();
	}

	_calcAverage() {
		this.average = (
			(this.food + this.service + this.price + this.impress) /
			4
		).toFixed(2);
		return this.average;
	}
}

class App {
	#map;
	#mapZoomLevel = 14;
	#mapEvent;
	#restaurants = [];
	#marker;
	#page = 1;

	constructor() {
		this._getLocalStorage();
		this._getPosition();
		this._generatePagesMarkup();
		addForm.addEventListener("submit", this._newRestaurant.bind(this));
		findForm.addEventListener("submit", this._findRestaurant.bind(this));
		findActivator.addEventListener("click", this._showFindForm.bind(this));
		closeFormIcon.forEach((icon) =>
			icon.addEventListener("click", this._startedLayout.bind(this))
		);
		restaurantList.addEventListener("click", this._moveToPopup.bind(this));
		nextPage.addEventListener("click", this._changePage.bind(this));
		previousPage.addEventListener("click", this._changePage.bind(this));
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

	_newRestaurant(e) {
		e.preventDefault();
		const name =
			inputName.value[0].toUpperCase() + inputName.value.slice(1).toLowerCase();
		const food = +inputFood.value;
		const service = +inputService.value;
		const price = +inputPrice.value;
		const impress = +inputImpress.value;
		const { lat, lng } = this.#mapEvent.latlng;
		let restaurant;
		const numPages = Math.ceil(this.#restaurants.length / 5);

		restaurant = new Restaurants(
			[lat, lng],
			name,
			food,
			service,
			price,
			impress
		);

		this._clearActiveRestaurants();

		this.#restaurants.push(restaurant);

		this._renderRestaurant(restaurant, restaurantActiveList);

		if (restaurantList.childElementCount >= 5 && this.#page === numPages)
			this._renderRestaurantsPage(this.#page++);

		this._renderRestaurantsPage(this.#page);

		this._generatePagesMarkup();

		this._renderRestaurantPopup(restaurant);

		this._startedLayout();

		this._setLocalStorage();

		setTimeout(this._scrolltoList, 1500);
	}

	_renderRestaurant(restaurant, list) {
		let html = `
		<li class="restaurant restaurant-${
			restaurant.average >= 6 ? "heighscore" : "lowscore"
		}" data-id="${restaurant.id}" data-rname="${restaurant.name}" >
			<div class="restaurant__header">
				<h3 class="restaurant__header-title">${restaurant.name}</h3>
				<p class="restaurant__header-average">${restaurant.average >= 7 ? "" : ""} ${
			restaurant.average
		}</p>
			</div>
			<div class="restaurant__scoores">
				<p class="restaurant__icon--eat">🍔 = ${restaurant.food}</p>
				<p class="restaurant__icon--service">🍽 = ${restaurant.service}</p>
				<p class="restaurant__icon--price">💸 = ${restaurant.price}</p>
				<p class="restaurant__icon--impress">❤️ = ${restaurant.impress}</p>
			</div>
		</li>
		`;

		list.insertAdjacentHTML("beforeend", html);

		if (list === restaurantActiveList)
			restaurantActiveList.classList.remove("hidden");
	}

	_renderRestaurantsPage(page) {
		const renderRestaurants = this._divideSerchResults(page);

		const restaurantListEl = restaurantList.querySelectorAll(".restaurant");
		restaurantListEl.forEach((el) => el.remove());

		renderRestaurants.forEach((restaurant) =>
			this._renderRestaurant(restaurant, restaurantList)
		);
	}

	_divideSerchResults(page) {
		const start = (page - 1) * 5; //0;
		const end = page * 5; // 5

		return this.#restaurants.slice(start, end);
	}

	_renderRestaurantMarker(restaurant) {
		this.#marker = L.marker(restaurant.coords)
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: true,
					closeOnClick: false,
					className: `${
						restaurant.average >= 7 ? "highscore" : "lowscore"
					}-popup`,
				})
			)
			.setPopupContent(`<b>${restaurant.name}</b> ${restaurant.average}`);
	}

	_renderRestaurantPopup(restaurant) {
		L.marker(restaurant.coords)
			.addTo(this.#map)
			.bindPopup(
				L.popup({
					maxWidth: 250,
					minWidth: 100,
					autoClose: true,
					closeOnClick: true,
					className: `${
						restaurant.average >= 7 ? "highscore" : "lowscore"
					}-popup`,
				})
			)
			.setPopupContent(`<b>${restaurant.name}</b> ${restaurant.average}`)
			.openPopup();
	}

	_moveToPopup(e) {
		const restaurantListEl = e.target.closest(".restaurant");

		if (!restaurantListEl) return;

		const restaurant = this.#restaurants.find(
			(rest) => rest.id === restaurantListEl.dataset.id
		);

		this._renderRestaurantPopup(restaurant);

		this.#map.setView(restaurant.coords, this.#mapZoomLevel, {
			animate: true,
			pan: { duration: 1 },
		});

		this._clearActiveRestaurants();
		restaurantListEl.classList.add("restaurant--active");
	}

	_findRestaurant(e) {
		e.preventDefault();

		const restaurantName = findForm.querySelector(".form__input--name").value;

		const restaurant = this.#restaurants.find(
			(rest) => rest.name.toUpperCase() === restaurantName.toUpperCase()
		);

		if (!restaurant) {
			const alert = document.querySelector(".not-find");
			findForm.querySelector(".form__input--name").value = "";

			const showAlert = function () {
				alert.classList.remove("hidden");
			};

			showAlert();

			const hideAlert = function () {
				alert.classList.add("hidden");
			};

			return setTimeout(hideAlert, 2000);
		}

		this._clearActiveRestaurants();

		this._renderRestaurant(restaurant, restaurantActiveList);

		this._renderRestaurantPopup(restaurant);

		this.#map.setView(restaurant.coords, this.#mapZoomLevel, {
			animate: true,
			pan: { duration: 1 },
		});

		this._startedLayout();

		setTimeout(this._scrolltoList, 2000);
	}

	_showAddForm(mapE) {
		if (!findForm.classList.contains("form--hidden")) return;

		this.#mapEvent = mapE;
		addForm.classList.remove("form--hidden");
		this._changeLayout();
	}

	_showFindForm() {
		findForm.classList.remove("form--hidden");
		this._changeLayout();
	}

	_changeLayout() {
		mapBox.style.height = "45%";
		formsBox.style.height = "35%";
		formsBoxContent.classList.add("hidden");
		inputName.focus();
	}

	_startedLayout() {
		this._clearForms(addForm);
		this._clearForms(findForm);
		mapBox.style.height = "65%";
		formsBox.style.height = "15%";
	}

	_clearForms(form) {
		formsBoxContent.classList.remove("hidden");
		form.classList.add("form--hidden");
		form.classList.add("form--hidden");
		form.querySelector(".form__input--name").value = "";

		if (form === addForm) {
			//prettier-ignore
			form.querySelector(".form__input--food").value = form.querySelector(".form__input--service").value = form.querySelector(".form__input--price").value = form.querySelector(".form__input--impress").value = "1"
		}
	}

	_clearActiveRestaurants() {
		const restaurants = restaurantList.querySelectorAll(".restaurant");

		restaurants.forEach((restaurant) =>
			restaurant.classList.remove("restaurant--active")
		);
		const activeRestaurants =
			restaurantActiveList.querySelectorAll(".restaurant");

		activeRestaurants.forEach((el) => el.remove());
	}

	_changePage(e) {
		const side = e.target.closest(".restaurants__pages-change");

		if (side === nextPage) this.#page++;
		if (side === previousPage) this.#page--;

		this._renderRestaurantsPage(this.#page);

		if (restaurantList.childElementCount === 0) {
			pages.style.display = "none";
		}
		this._generatePagesMarkup();
	}

	_generatePagesMarkup() {
		const numPages = Math.ceil(this.#restaurants.length / 5);

		if (this.#page === 1 && numPages > 1) {
			nextPage.classList.remove("hidden");
			previousPage.classList.add("hidden");
		}

		if (this.#page === numPages && numPages > 1) {
			nextPage.classList.add("hidden");
			previousPage.classList.remove("hidden");
		}

		if (this.#page < numPages && this.#page > 1) {
			nextPage.classList.remove("hidden");
			previousPage.classList.remove("hidden");
		}

		if (this.#page === 1 && numPages === 1) {
			nextPage.classList.add("hidden");
			previousPage.classList.add("hidden");
		}

		const pageNumber = document.querySelector(".restaurants__pages-number");
		pageNumber.textContent = this.#page;
	}

	_scrolltoList(e) {
		const listTop = restaurantsSection.offsetTop;
		window.scrollTo(0, listTop - 10);
	}

	_setLocalStorage() {
		localStorage.setItem("restaurants", JSON.stringify(this.#restaurants));
	}

	_getLocalStorage() {
		const data = JSON.parse(localStorage.getItem("restaurants"));

		if (!data) return;

		this.#restaurants = data;

		this._divideSerchResults(1).forEach((restaurant) =>
			this._renderRestaurant(restaurant, restaurantList)
		);
	}

	reset() {
		localStorage.removeItem("restaurants");
		location.reload();
	}
}

const Application = new App();
