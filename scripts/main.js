// main.js

// Define a global variable to hold the icon paths
let iconPaths;

// Function to generate icon paths based on the property
function generateIconPaths(property) {
    const basePath = './assets/frog/';
    let prefix;

    // Determine the prefix based on the property
    switch (property) {
        case 'frog-set':
            prefix = 'frog-set_';
            break;
        case 'frog-black-set':
            prefix = 'frog-black-set_';
            break;
        case 'frog-set3':
            prefix = 'frog-set3_';
            break;
        // Add more cases for other properties if needed
        default:
            // Default to 'frog-set' if property is not recognized
            console.log("property not found, use default image frog-set_' ", property)
            prefix = 'frog-set_';
            break;
    }

    // Generate the icon paths based on the prefix
    const paths = [];
    for (let i = 0; i <= 400; i += 100) {
        for (let j = 0; j <= 400; j += 100) {
            paths.push(`${basePath}${prefix}${i}_${j}.png`);
        }
    }

    return paths;
}



// Function to check if the icon is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function to handle scroll event
/*
function handleScroll() {
    const iconContainer = document.querySelector('.icon-container');
    if (isInViewport(iconContainer)) {
        iconContainer.classList.add('show'); // Add the show class to reveal the icon
    } else {
        iconContainer.classList.remove('show'); // Remove the show class to hide the icon
    }
}

// Add scroll event listener to window
window.addEventListener('scroll', handleScroll);
*/


//#####################################################################
//## LISTENER

document.addEventListener("DOMContentLoaded", function () {

 

    //#############################################################################
    // code for fading the header 
    // Existing code for the fading effect


    window.addEventListener('scroll', function () {
        var headers = document.querySelectorAll('.header');
        var scrollPosition = window.scrollY;

        headers.forEach(function (header) {
            var headerHeight = header.offsetHeight;
            var headerPosition = header.getBoundingClientRect().top + scrollPosition;
            var fadeStart = headerPosition - 0.5 * headerHeight; // Adjust this value as needed

            if (scrollPosition > fadeStart) {
                header.classList.add('fade-out');
            } else {
                header.classList.remove('fade-out');
            }
        });
    });

    //#############################################################################
    // code for the Bee movement

    // Function to handle the animation for a single icon container 
    function animateIcon(icon, iconStapple, iconPaths, positions) {
        const endX = 0.9 * window.innerWidth;
        let iconStappleName = "frog-staple";

        let positionIndex = 0;
        let stappleCounter = 1; // at the beginning there is already a frog in the staple, to which the other is running to
        if (iconStapple) {
            iconStapple.style.left = `${endX}px`;
            iconStapple.style.bottom = `${0}px`;
            iconStappleName = iconStapple.alt.split('.')[0]
        }


        // Animation loop
        function animate() {
            // Check if the icon is still in the viewport
            if (!isInViewport(icon)) {
                // Stop the animation if the icon is not visible

                //console.log("exit viewport, stop animation and call animateIconWhenVisible for icon ", icon.alt);
                animateIconWhenVisible(icon, iconStapple, iconPaths, positions);
                return;
            }

            // Get the current position
            const { x, y } = positions[positionIndex];

            // Update icon position
            icon.style.left = `${x}px`;
            icon.style.bottom = `${y}px`;

            // Load the corresponding icon for the current position
            icon.src = iconPaths[positionIndex];

            // Move to the next position
            positionIndex = (positionIndex + 1) % positions.length;

            // Update the staple icon if applicable
            if (iconStapple && (positionIndex % positions.length === 0)) {
                stappleCounter = (stappleCounter) % 10 + 1;
                iconStapple.src = `./assets/frog/${iconStappleName}_${stappleCounter}.png`;
                // Request next frame with a delay of 500ms (adjust as needed)
                icon.style.opacity = 0;
                setTimeout(() => {
                    requestAnimationFrame(animate);
                    icon.style.opacity = 1;
                }, 1500); //   delay at end stappel
                 

            }

            else {

                // Request next frame with a delay of 500ms (adjust as needed)
                setTimeout(() => {
                    requestAnimationFrame(animate);
                }, 100); // 500ms delay between movements
            }


        }

        // Start animation loop 
        animate();
    }

    // ######## optimisation : to stop animation calulation when out of the view port
    // Function to handle the animation for a single icon container
    function animateIconWhenVisible(icon, iconStapple, iconPaths, positions) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start the animation only when the target element is within the viewport
                    //console.log("from animateIconWhenVisible: call animateIcon   ", icon.alt);
                    animateIcon(icon, iconStapple, iconPaths, positions);
                    //console.log("from animateIconWhenVisible: call animateIcon stop observing n ", icon.alt);
                    observer.unobserve(entry.target); // Stop observing once the animation starts
                }
            });
        });

        // Start observing the target element
        observer.observe(icon);
    }

    // Call animateIconWhenVisible instead of animateIcon to trigger animation when the element is in view
    // animateIconWhenVisible(icon, iconStapple, iconPaths, positions);

    // Get all icon elements with the class 'scroll-icon'
    const icons = document.querySelectorAll('.scroll-icon');

    // Loop through each icon
    icons.forEach(icon => {
        // Find the parent container of the icon
        const iconContainer = icon.closest('.icon-container');
        if (!iconContainer) return; // If no container is found, exit the loop

        // Find the corresponding '.stapple-icon' within the parent container
        const iconStapple = iconContainer.querySelector('.stapple-icon');

        // Get the ID from the alt attribute
        const id = icon.alt.split('.')[1];
        // Get the property (without ID) from the alt attribute
        const property = icon.alt.split('.')[0];
        // Generate the icon paths based on the property
        const iconPaths = generateIconPaths(property);
        // Initialize positions array
        const positions = [];

        // Calculate positions only once
        const numPoints = 25;
        //console.log("iconContainer",iconContainer);
        //.log("window",window);
 
        const startX = 0.1 * window.innerWidth;
        const endX = 0.9 * window.innerWidth;
        const startY = 0.5 * window.innerHeight;
        const endY = 0.0 * window.innerHeight; 

        const stepX = (endX - startX) / (numPoints - 1);
        for (let i = 0; i < numPoints; i++) {
            const x = startX + i * stepX;
            let y;
            if (i % 8 < 4) {
                // Move downwards
                y = startY + (i % 4) * ((endY - startY) / 3);
            } else {
                // Move upwards
                y = endY - (i % 4) * ((endY - startY) / 3);
            }
            positions.push({ x, y });
        }

        // Start animation only when the icon is visible
        //console.log("initialisation: from addEventListener call animateIconWhenVisible for icon ", icon.alt);
        animateIconWhenVisible(icon, iconStapple, iconPaths, positions);
    });


    //#######################################################################
    // slideshowcontainer

    function initializeSlideshow(container) {
        let slideIndex = 0;
        const slides = container.getElementsByClassName("slides");
        showSlides();
    
        function showSlides() {
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slideIndex++;
            if (slideIndex > slides.length) { slideIndex = 1 }
            slides[slideIndex - 1].style.display = "block";
            setTimeout(showSlides, 3000); // Change image every 5 seconds
        }
    }
    const containers = document.getElementsByClassName("slideshow-container");
    for (let i = 0; i < containers.length; i++) {
        initializeSlideshow(containers[i]);
    }


    //#######################################################################
    // CAROUSEL
    // JavaScript for image carousel
    const imageContainers = document.querySelectorAll(".image-container");
    let cIndex = 0;

    function showImage(index) {
        // Hide all images
        imageContainers.forEach(container => {
            container.style.transform = `translateX(-${index * 100}%)`;
        });
    }

    function nextImage() {
        cIndex++;
        if (cIndex >= imageContainers.length) {
            cIndex = 0;
        }
        showImage(cIndex);
    }

    setInterval(nextImage, 2000); // Change image every x milliseconds

    
});

//###############################################################
// show bilder as 

/*
var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("slides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 5000); // Change image every 5 seconds
}
*/


 

