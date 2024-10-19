const left = document.querySelector(".left");
const right = document.querySelector(".right");
const slider = document.querySelector(".slider");
const images = document.querySelectorAll(".image");
const bottom = document.querySelector(".bottom");

// Initialize slideNumber
let slideNumber = 1;
// Store total number of images
const length = images.length;

for (let i = 0; i < length; i++) {
    const div = document.createElement("div")
    div.className = "button";
    bottom.appendChild(div)
}

const buttons = document.querySelectorAll(".button")
buttons[0].style.backgroundColor = "e0aaff"

const resetBackground = () => {
    buttons.forEach(button => {
        button.style.backgroundColor = "transparent";
    });
};

buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
        resetBackground()
        slider.style.transform = `translateX(-${i * 800}px)`;
        slideNumber = i + 1
        button.style.backgroundColor = "e0aaff";
    });
});

// Function nextSlide()
// Traverse to the next slide
const nextSlide = () => {
    // 800px because each img is 800px
    // We will traverse via units of 800px
    slider.style.transform = `translateX(-${slideNumber * 800}px)`;
    // Increment slide
    slideNumber++;
};

const prevSlide = () => {
    slider.style.transform = `translateX(-${(slideNumber - 2) * 800}px)`;
    // Decrement slide
    slideNumber--;
};
// Function restartSlide()
// Return to start of slide if none remain
const getFirstSlide = () => {
    slider.style.transform = `translateX(0px)`;
    slideNumber = 1;
};

const getLastSlide = () => {
    slider.style.transform = `translateX(-${(length - 1) * 800}px)`;
    slideNumber = length;
};

const changeColor = () => {
    resetBackground()
    buttons[slideNumber - 1].style.backgroundColor = "e0aaff";
}

// Check if right arrow is clicked
right.addEventListener("click", () => {
    if (slideNumber < length) {
        nextSlide();
    } else {
        // If no more images, restart loop
        getFirstSlide();
    }
    changeColor();
});

// Check if left arrow is clicked
left.addEventListener("click", () => {
    // Checks if the current slide number is greater than 1
    if (slideNumber > 1) {
        prevSlide();
    } else {
        // If no more images, restart loop
        getLastSlide();
    }
    changeColor();
});

