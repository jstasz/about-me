"use strict";

//map

import { leaflet } from "leaflet/dist/leaflet.js";

if (navigator.geolocation)
	navigator.geolocation.getCurrentPosition(
		function (position) {
			const { latitude } = position.coords;
			const { longitude } = position.coords;

			const map = L.map("map").setView([51.505, -0.09], 13);

			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(map);

			L.marker([51.5, -0.09])
				.addTo(map)
				.bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
				.openPopup();
		},

		function () {
			alert("could not get your position");
		}
	);

// active add and find restaurant

const addBtn = document.querySelector(".main__icon--add");
const mapBox = document.querySelector(".main__map");
const addBox = document.querySelector(".main__add-restaurant");
const addForm = document.querySelector(".restaurant__form--add");
const findBtn = document.querySelector(".main__icon--find");
const findForm = document.querySelector(".restaurant__form--find");
const icons = document.querySelector(".main__icons");
const addSubmitBtn = document.querySelector(".form__btn--add");
const findSubmitBtn = document.querySelector(".form__btn--find");
const restaurantlistSection = document.querySelector(".restaurants");

const firstLayout = function () {
	mapBox.style.height = "65%";
	addBox.style.height = "15%";
};

const changeLayout = function () {
	mapBox.style.height = "40%";
	addBox.style.height = "40%";
};

const showAddForm = function () {
	addForm.classList.remove("form--hidden");
	icons.classList.add("hidden");
};

addBtn.addEventListener("click", changeLayout);
addBtn.addEventListener("click", showAddForm);

const showFindForm = function () {
	findForm.classList.remove("form--hidden");
	icons.classList.add("hidden");
};

const changeLayout1 = function () {
	mapBox.style.height = "50%";
	addBox.style.height = "30%";
};

findBtn.addEventListener("click", changeLayout1);
findBtn.addEventListener("click", showFindForm);

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
