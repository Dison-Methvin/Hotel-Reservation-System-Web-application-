// -------------------------------------------------------------
// Date pickers – enforce that check-out is always AFTER check-in
// -------------------------------------------------------------

const ONE_DAY = 24 * 60 * 60 * 1000;
let checkInPicker;   // will hold AirDatepicker instance for check-in
let checkOutPicker;  // will hold AirDatepicker instance for check-out

// Helper – format DD Mon YYYY (e.g. "14 Jun 2025")
function formatDisplayDate(date) {
    return date.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}

checkInPicker = new AirDatepicker('#check-in-input', {
    minDate: new Date(), // today or later
    onSelect({ date }) {
        if (!date) return;

        // Show formatted date in the text box
        document.getElementById('check-in-input').value = formatDisplayDate(date);

        // Make sure the check-out calendar can only pick AFTER the selected check-in
        const minCheckout = new Date(date.getTime() + ONE_DAY);
        checkOutPicker.update({ minDate: minCheckout });

        // If a check-out date is already chosen and is now invalid, reset it
        const currentCheckOut = checkOutPicker.date;
        if (currentCheckOut && currentCheckOut < minCheckout) {
            checkOutPicker.clear();
            document.getElementById('check-out-input').value = '';
            alert('Check-out date must be after the check-in date. Please choose again.');
        }
    }
});

checkOutPicker = new AirDatepicker('#check-out-input', {
    minDate: new Date(Date.now() + ONE_DAY), // at least tomorrow
    onSelect({ date }) {
        if (!date) return;

        document.getElementById('check-out-input').value = formatDisplayDate(date);

        // Double-check – if user somehow selects a date not after check-in, warn & reset
        const checkInDate = checkInPicker.date;
        if (checkInDate && date <= checkInDate) {
            alert('Check-out date must be after the check-in date.');
            checkOutPicker.clear();
            document.getElementById('check-out-input').value = '';
        }
    }
});

const apiService = new ApiService();

// Show/hide guest details and set default values based on room selection
document.getElementById('roomSelection').addEventListener('change', function() {
    const guestDetails = document.querySelector('.guest-details');
    const adultCount = document.getElementById('adultCount');
    const childCount = document.getElementById('childCount');

    if (this.value === 'single') {
        guestDetails.style.display = 'block';
        adultCount.value = '1';
        adultCount.max = '1';
        childCount.value = '0';
        childCount.max = '0';
    } else if (this.value === 'double') {
        guestDetails.style.display = 'block';
        adultCount.value = '2';
        adultCount.max = '2';
        childCount.value = '1';
        childCount.max = '1';
    } else {
        guestDetails.style.display = 'none';
    }
});

// Booking form functionality
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent form submission
    
    const rawCheckIn = document.getElementById('check-in-input').value;
    const rawCheckOut = document.getElementById('check-out-input').value;
    const roomSelection = document.getElementById('roomSelection').value;
    const adultCount = parseInt(document.getElementById('adultCount').value);
    const childCount = parseInt(document.getElementById('childCount').value);

    // Convert to ISO yyyy-mm-dd if parseable
    const formatToISO = (str) => {
        const d = new Date(str);
        return isNaN(d) ? str : d.toISOString().split('T')[0];
    };

    const checkInDate = formatToISO(rawCheckIn);
    const checkOutDate = formatToISO(rawCheckOut);

    // Validation
    if (!checkInDate || !checkOutDate || !roomSelection) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
        alert('Check-out date must be after check-in date');
        return;
    }

    // Validate guest counts based on room type
    if (roomSelection === 'single' && (adultCount !== 1 || childCount !== 0)) {
        alert('Single room allows only one adult guest with no children');
        return;
    }

    if (roomSelection === 'double' && (adultCount !== 2 || childCount > 1)) {
        alert('Double room allows exactly 2 adults and up to 1 child');
        return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please sign in to make a reservation');
        window.location.href = '/html/login.html';
        return;
    }

    try {
        // Instead of immediately creating the reservation, we simply store the
        // validated booking data locally. The actual reservation will be
        // created once the user confirms on the next page.

        const bookingData = {
            checkInDate,
            checkOutDate,
            roomType: roomSelection,
            adultCount,
            childCount
            // reservationId will be added later, after creation on confirm
        };
        localStorage.setItem('bookingData', JSON.stringify(bookingData));

        // Redirect based on room selection using absolute paths
        if (roomSelection === 'single') {
            window.location.replace('/html/SingleRoom.html');
        } else if (roomSelection === 'double') {
            window.location.replace('/html/DoubleRoom.html');
        }
    } catch (error) {
        console.error('Error preparing booking data:', error);
        alert(error.message || 'Failed to prepare booking. Please try again.');
    }
});

// Function to animate numbers
function animateNumber(element, start, end, finalValue) {
    let current = start;
    const range = end - start;
    const duration = 2000; // milliseconds
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;

        if (progress < 1) {
            current = Math.floor(start + range * progress);
            element.textContent = current + finalValue.replace(/\d/g, ''); // Append non-numeric part
            requestAnimationFrame(step);
        } else {
            element.textContent = finalValue; // Ensure final value is exactly displayed
        }
    }

    requestAnimationFrame(step);
}

// Animate stats on scroll
const stats = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.stats');

const animateStats = () => {
    if (!statsSection) return; // Exit if statsSection is not found

    const sectionTop = statsSection.getBoundingClientRect().top + window.pageYOffset;
    const sectionHeight = statsSection.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > sectionTop - windowHeight + sectionHeight / 2) {
        stats.forEach((stat) => {
            const finalValue = stat.textContent;
            // Use regex to get only the numeric part, then parse it
            const numericValueMatch = finalValue.match(/\d+/);
            const numericValue = numericValueMatch ? parseInt(numericValueMatch[0]) : 0;
            
            if (!stat.classList.contains('animated')) {
                stat.classList.add('animated');
                animateNumber(stat, 0, numericValue, finalValue);
            }
        });
    }
};

window.addEventListener('scroll', animateStats);
// Trigger once on load in case the section is already in view
animateStats();