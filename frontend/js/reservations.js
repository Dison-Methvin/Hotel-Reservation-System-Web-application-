document.addEventListener('DOMContentLoaded', function() {
    // Handle room type buttons
    const handleRoomSelection = (roomType) => {
        let pageUrl;
        switch(roomType) {
            case 'single':
                pageUrl = 'SingleRoom.html';
                break;
            case 'double':
                pageUrl = 'DoubleRoom.html';
                break;
            case 'suite':
                pageUrl = 'Suites.html';
                break;
            default:
                return;
        }
        window.location.href = pageUrl;
    };

    // Add click event listeners to room type buttons
    document.querySelectorAll('.room-type-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const roomType = e.target.closest('.room-type-btn').dataset.roomType;
            handleRoomSelection(roomType);
        });
    });

    // Handle date selection
    const checkInDate = document.getElementById('check-in-date');
    const checkOutDate = document.getElementById('check-out-date');

    if (checkInDate && checkOutDate) {
        // Set minimum date as today for check-in
        const today = new Date().toISOString().split('T')[0];
        checkInDate.min = today;

        // Update check-out minimum date when check-in is selected
        checkInDate.addEventListener('change', () => {
            checkOutDate.min = checkInDate.value;
            if (checkOutDate.value && checkOutDate.value <= checkInDate.value) {
                // If check-out date is before check-in, set it to the day after check-in
                const nextDay = new Date(checkInDate.value);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOutDate.value = nextDay.toISOString().split('T')[0];
            }
        });
    }

    // Handle reservation form submission
    const reservationForm = document.querySelector('.reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Collect form data
            const formData = {
                checkIn: checkInDate.value,
                checkOut: checkOutDate.value,
                adults: document.getElementById('adults').value,
                children: document.getElementById('children').value
            };

            // Store reservation data (you would typically send this to a server)
            console.log('Reservation data:', formData);
            
            // Redirect to confirmation page
            window.location.href = 'ConfirmReservation.html';
        });
    }

    // Handle navigation buttons
    document.querySelectorAll('.room-nav-btn').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        });
    });
});