document.addEventListener('DOMContentLoaded', function() {
    // Get page type
    const pagePath = window.location.pathname;
    const isDoublePage = pagePath.includes('DoubleRoom');
    const isSinglePage = pagePath.includes('SingleRoom');
    const isSuitePage = pagePath.includes('Suites');

    // Handle booking buttons
    const bookingButtons = document.querySelectorAll('.book-now-btn, .reserve-btn');
    bookingButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get room details from the closest room container
            const roomContainer = button.closest('.room-container, .suite-container');
            if (roomContainer) {
                const roomData = {
                    type: isDoublePage ? 'double' : (isSinglePage ? 'single' : 'suite'),
                    name: roomContainer.querySelector('.room-name, .suite-name')?.textContent,
                    price: roomContainer.querySelector('.price')?.textContent,
                    // Add any other relevant room details
                };

                // Store selected room data (you would typically send this to a server)
                console.log('Selected room:', roomData);

                // Redirect to reservation page
                window.location.href = 'reservations.html';
            }
        });
    });

    // Handle amenity tooltips
    const amenityIcons = document.querySelectorAll('.amenity-icon');
    amenityIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function(e) {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            }
        });

        icon.addEventListener('mouseleave', function(e) {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            }
        });
    });

    // Handle room image gallery
    const roomImages = document.querySelectorAll('.room-gallery img');
    const mainImage = document.querySelector('.main-room-image');
    
    if (roomImages.length && mainImage) {
        roomImages.forEach(img => {
            img.addEventListener('click', function() {
                // Update main image
                mainImage.src = this.src;
                mainImage.alt = this.alt;
                
                // Update active state
                roomImages.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Handle "View More Details" buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detailsSection = this.closest('.room-container, .suite-container')
                                     .querySelector('.room-details');
            if (detailsSection) {
                detailsSection.classList.toggle('expanded');
                this.textContent = detailsSection.classList.contains('expanded') 
                    ? 'Show Less' 
                    : 'View More Details';
            }
        });
    });
});
