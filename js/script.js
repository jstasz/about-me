"use strict";

const nav = document.querySelector(".nav__container");

// nav links animation

const handleHover = function (e) {
	if (e.target.classList.contains("nav__link")) {
		const clickedLink = e.target;
		const siblings = clickedLink
			.closest(".nav__container")
			.querySelectorAll(".nav__link");

		siblings.forEach((el) => {
			if (el !== clickedLink) el.style.opacity = this;
		});
	}
};

nav.addEventListener("mouseover", handleHover.bind(0.3));
nav.addEventListener("mouseout", handleHover.bind(1));
