"use strict";

const nav = document.querySelector(".nav__container");

// nav links animation

const handleHover = function (e) {
	if (e.target.classList.contains("nav__link")) {
		const clickedLink = e.target;
		const siblings = clickedLink
			.closest(".nav__container")
			.querySelectorAll(".nav__link");
		const logo = clickedLink
			.closest(".nav__container")
			.querySelector(".nav__logo-img");

		siblings.forEach((el) => {
			if (el !== clickedLink) el.style.opacity = this;
		});

		logo.style.opacity = this;
	}
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));
