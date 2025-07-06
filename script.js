document.addEventListener('DOMContentLoaded', function() {
    // --- Image Data ---
    const images = [
        'https://picsum.photos/id/237/800/450', // Dog
        'https://picsum.photos/id/238/800/450', // City
        'https://picsum.photos/id/239/800/450', // Desert
        'https://picsum.photos/id/240/800/450', // Mountains
        'https://picsum.photos/id/241/800/450'  // Waterfall
    ];

    // --- DOM Elements ---
    const galleryImage = document.getElementById('galleryImage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const transitionSelect = document.getElementById('transitionSelect');
    const imageDisplayArea = document.querySelector('.image-display-area'); // Get reference to parent

    // --- Gallery State Variables ---
    let currentImageIndex = 0;
    let currentTransition = transitionSelect.value;
    let isTransitioning = false; // Flag to prevent rapid clicking

    // Define transition duration from CSS for JavaScript use
    const TRANSITION_DURATION = 500; // in milliseconds (matches CSS transition: 0.5s)

    // --- Functions ---

    // Function to display an image with a transition
    function displayImage(index, direction = 'next') { // direction helps with slide transitions
        if (isTransitioning) return;
        isTransitioning = true;

        // Save the old image path
        const oldImagePath = galleryImage.src;
        // Determine the new image path
        const newImagePath = images[(index + images.length) % images.length];

        // --- Step 1: Animate out the old image (if not initial load) ---
        if (galleryImage.classList.contains('active')) { // Only animate out if an image is already active
            // Apply the 'exiting' class and the current transition class
            galleryImage.classList.remove('active'); // Remove active class to start transition out
            galleryImage.classList.add('exiting', currentTransition);

            // Set a timeout for when the old image should be fully out
            setTimeout(() => {
                // After old image has exited, remove its classes
                galleryImage.classList.remove('exiting', currentTransition);

                // --- Step 2: Prepare and animate in the new image ---
                galleryImage.src = newImagePath; // Change image source
                
                // Crucial for re-triggering CSS transition: Force reflow
                // Remove all transition related classes, force reflow, then add 'entering'
                galleryImage.classList.remove('entering', currentTransition); 
                void galleryImage.offsetWidth; // Force reflow

                galleryImage.classList.add('entering', currentTransition); // Apply 'entering' state

                // After a very short delay (allowing 'entering' state to apply)
                setTimeout(() => {
                    galleryImage.classList.remove('entering');
                    galleryImage.classList.add('active'); // Transition to 'active' (fully visible)
                    isTransitioning = false; // Allow new transitions
                }, 50); // Small delay, ensures 'entering' state is applied before 'active'
            }, TRANSITION_DURATION); // Wait for the old image to exit
        } else {
            // Initial load: Just set the image and make it active without animation
            galleryImage.src = newImagePath;
            galleryImage.classList.add('active');
            isTransitioning = false; // Allow new transitions
        }

        currentImageIndex = (index + images.length) % images.length;
    }


    function showNextImage() {
        displayImage(currentImageIndex + 1, 'next');
    }

    function showPrevImage() {
        displayImage(currentImageIndex - 1, 'prev');
    }

    // --- Event Listeners ---
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    transitionSelect.addEventListener('change', (e) => {
        currentTransition = e.target.value;
        // When transition changes, redraw the current image to apply the new effect
        // We trigger the transition on the current image.
        // It will animate 'out' (to its entering state) and then 'in' again with the new transition.
        isTransitioning = false; // Allow it to transition
        displayImage(currentImageIndex); 
    });

    // --- Initial Setup ---
    // Load the first image (this call handles initial visibility without animation)
    displayImage(currentImageIndex); 
});