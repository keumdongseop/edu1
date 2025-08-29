const API_URL = '/api';

// TODO: Complete this function to load rooms from the API
async function loadRooms() {
  try {
    // 1. Fetch rooms from /api/rooms
    // 2. Get the room select element by ID
    // 3. Clear existing options and add default option
    // 4. Loop through rooms and add each as an option
    
    // Your code here
    
  } catch (error) {
    console.error('Error loading rooms:', error);
  }
}

// TODO: Complete this function to load and display bookings
async function loadBookings() {
  try {
    // 1. Fetch bookings from /api/bookings
    // 2. Fetch rooms to get room names
    // 3. Get the bookingsList element
    // 4. Generate HTML for each booking
    // 5. Display the bookings
    
    // Your code here
    
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
}

// TODO: Complete this function to create a new booking
async function createBooking(event) {
  event.preventDefault();
  
  // 1. Get form data from input elements
  // 2. Create formData object with all booking details
  // 3. Send POST request to /api/bookings
  // 4. Handle success: show message, reset form, reload bookings
  // 5. Handle errors: show error message
  
  // Your code here
}

// TODO: Complete this function to delete a booking
async function deleteBooking(id) {
  // 1. Confirm with user
  // 2. Send DELETE request to /api/bookings/:id
  // 3. Handle success: show message, reload bookings
  // 4. Handle errors: show error message
  
  // Your code here
}

// Helper function to show messages (already complete)
function showMessage(text, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = text;
  
  document.querySelector('.booking-form').insertBefore(messageDiv, document.querySelector('form'));
  
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Make deleteBooking available globally
window.deleteBooking = deleteBooking;

// Set up event listeners and initial load
document.getElementById('bookingForm').addEventListener('submit', createBooking);

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').min = today;
document.getElementById('date').value = today;

// Load initial data
loadRooms();
loadBookings();