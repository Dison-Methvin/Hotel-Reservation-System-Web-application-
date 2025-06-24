// Simple redirection script
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const roomSelection = document.getElementById('roomSelection').value;
    
    // Simple validation
    if (!roomSelection) {
        alert('Please select a room type');
        return;
    }

    // Get the current directory path
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    
    // Redirect based on room selection using the correct path
    if (roomSelection === 'single') {
        window.location.href = basePath + 'SingleRoom.html';
    } else if (roomSelection === 'double') {
        window.location.href = basePath + 'DoubleRoom.html';
    }
});
