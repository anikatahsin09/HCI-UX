// User Tracking and Logging
let logs = [];
let errorRecoveryStart = null;

function logEvent(type, details = {}) {
    logs.push({
        timestamp: Date.now(),
        type,
        details
    });
}

function downloadLogs() {
    let csv = 'timestamp,type,details\n';
    logs.forEach(log => {
        csv += `${log.timestamp},${log.type},"${JSON.stringify(log.details)}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_logs.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to show a notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    notificationText.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Function to show a modal
function showModal(title, message) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    modal.style.display = 'flex';
}

// Function to hide the modal
function hideModal() {
    document.getElementById('modal').style.display = 'none';
}

// Simulate a progress bar for searches
function simulateProgress(callback) {
    setTimeout(callback, 2000);
}

// Dynamic content generation for search results
function generateFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'flight-card';
    card.innerHTML = `
        <img src="https://placehold.co/280x150/667eea/ffffff?text=Flight" alt="Flight Image" class="card-image">
        <div class="flight-info">
            <div>
                <div class="flight-time">${flight.time}</div>
                <div style="color: #666; font-size: 0.9rem;">${flight.stops} • ${flight.duration}</div>
            </div>
            <div class="flight-price">${flight.price}</div>
        </div>
        <button class="continue-button" data-continue="cars">Continue to Cars</button>
    `;
    card.querySelector('.continue-button').addEventListener('click', () => {
        switchTab('cars');
        prefillCarForm(flight);
    });
    return card;
}

function generateCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
        <img src="https://placehold.co/280x150/51cf66/ffffff?text=Car" alt="Car Image" class="card-image">
        <div class="car-info">
            <h4>${car.name}</h4>
            <p class="car-details">${car.details}</p>
            <div class="car-features">
                ${car.features.map(f => `<span class="feature">${f}</span>`).join('')}
            </div>
        </div>
        <div class="car-price">
            <div class="price-amount">${car.price}</div>
            <button class="book-button">Book Now</button>
            <button class="continue-button" data-continue="hotels">Continue to Hotels</button>
        </div>
    `;
    card.querySelector('.continue-button').addEventListener('click', () => {
        switchTab('hotels');
        prefillHotelForm(car);
    });
    return card;
}

function generateHotelCard(hotel) {
    const card = document.createElement('div');
    card.className = 'hotel-card';
    card.innerHTML = `
        <img src="https://placehold.co/280x150/764ba2/ffffff?text=Hotel" alt="Hotel Image" class="card-image">
        <div class="hotel-info">
            <h4>${hotel.name}</h4>
            <p class="hotel-details">${hotel.details}</p>
            <div class="hotel-features">
                ${card.features.map(f => `<span class="feature">${f}</span>`).join('')}
            </div>
        </div>
        <div class="hotel-price">
            <div class="price-amount">${hotel.price}</div>
            <button class="book-button">Book Now</button>
            <button class="continue-button" data-continue="debrief">Complete Study</button>
        </div>
    `;
    card.querySelector('.continue-button').addEventListener('click', () => {
        document.getElementById('debrief-modal').style.display = 'flex';
    });
    return card;
}

// Function to switch tabs
function switchTab(tabName) {
    document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dashboard-content').forEach(content => content.classList.remove('active'));

    const tab = document.querySelector(`.dashboard-tab[data-tab="${tabName}"]`);
    if (tab) {
        tab.classList.add('active');
        document.getElementById(`${tabName}-dashboard`).classList.add('active');
    }
}

// Multi-step flow prefill with carry-over errors
function prefillCarForm(flight) {
    const departureDate = new Date(document.getElementById('departure-date').value);
    departureDate.setDate(departureDate.getDate() - 1); // Intentional error: Set to previous day
    document.getElementById('pickup-location').value = document.getElementById('to').value;
    document.getElementById('dropoff-location').value = document.getElementById('from').value;
    document.getElementById('pickup-date').value = departureDate.toISOString().split('T')[0];
    document.getElementById('dropoff-date').value = new Date(departureDate.getTime() + 86400000 * 3).toISOString().split('T')[0];
    logEvent('prefill_error', { from: 'flight', error: 'date_mismatch' });
}

function prefillHotelForm(car) {
    const pickupDate = new Date(document.getElementById('pickup-date').value);
    pickupDate.setDate(pickupDate.getDate() + 1);
    document.getElementById('destination').value = document.getElementById('pickup-location').value;
    document.getElementById('checkin-date').value = pickupDate.toISOString().split('T')[0];
    document.getElementById('checkout-date').value = new Date(pickupDate.getTime() + 86400000 * 2).toISOString().split('T')[0];
    logEvent('prefill_error', { from: 'car', error: 'date_mismatch' });
}

// Dashboard tab switching logic
document.querySelectorAll('.dashboard-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
        logEvent('tab_switch', { tab: tab.dataset.tab });
    });
});

// Form validation with error tracking
function validateDate(inputId) {
    const input = document.getElementById(inputId);
    const today = new Date();
    const selected = new Date(input.value);
    if (selected < today) {
        return false;
    }
    return true;
}

// Flights Dashboard
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    logEvent('form_submit', { form: 'flights' });
    const isValid = validateDate('departure-date');
    if (!isValid) {
        showNotification('Invalid departure date!', 'error');
        logEvent('invalid_submission', { form: 'flights', error: 'date_invalid' });
        if (!errorRecoveryStart) errorRecoveryStart = Date.now();
        return;
    }
    if (errorRecoveryStart) {
        const recoveryTime = Date.now() - errorRecoveryStart;
        logEvent('recovery_attempt', { form: 'flights', time: recoveryTime });
        errorRecoveryStart = null;
    }

    const resultsContainer = document.getElementById('flights-results-container');
    resultsContainer.innerHTML = '';
    
    simulateProgress(() => {
        const mockFlights = [
            { time: '10:30 AM - 2:45 PM', stops: 'Direct', duration: '4h 15m', price: '$299' },
            { time: '2:15 PM - 7:30 PM', stops: '1 Stop', duration: '5h 15m', price: '$249' },
            { time: '6:00 PM - 10:15 PM', stops: 'Direct', duration: '4h 15m', price: '$279' }
        ];

        mockFlights.forEach(flight => {
            resultsContainer.appendChild(generateFlightCard(flight));
        });

        resultsContainer.style.display = 'grid';
        showNotification('Flights found! Check out the best options.');
    });
});

// Cars Dashboard
document.getElementById('car-booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    logEvent('form_submit', { form: 'cars' });
    const isValid = validateDate('pickup-date') && validateDate('dropoff-date');
    if (!isValid) {
        showNotification('Invalid pickup/dropoff dates!', 'error');
        logEvent('invalid_submission', { form: 'cars', error: 'date_invalid' });
        if (!errorRecoveryStart) errorRecoveryStart = Date.now();
        return;
    }
    if (errorRecoveryStart) {
        const recoveryTime = Date.now() - errorRecoveryStart;
        logEvent('recovery_attempt', { form: 'cars', time: recoveryTime });
        errorRecoveryStart = null;
    }

    const resultsContainer = document.getElementById('cars-results-container');
    resultsContainer.innerHTML = '';
    
    simulateProgress(() => {
        const mockCars = [
            { name: 'Toyota Camry', details: 'Midsize • Automatic • 5 Seats', features: ['AC', 'Bluetooth', 'GPS'], price: '$45/day' },
            { name: 'Honda CR-V', details: 'SUV • Automatic • 5 Seats', features: ['AC', 'Bluetooth', '4WD'], price: '$55/day' },
            { name: 'Nissan Versa', details: 'Economy • Manual • 5 Seats', features: ['AC', 'Bluetooth'], price: '$35/day' }
        ];

        mockCars.forEach(car => {
            resultsContainer.appendChild(generateCarCard(car));
        });
        
        resultsContainer.style.display = 'grid';
        showNotification('Cars found! Find the perfect ride for your trip.');
    });
});

// Hotels Dashboard
document.getElementById('hotel-booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    logEvent('form_submit', { form: 'hotels' });
    const isValid = validateDate('checkin-date') && validateDate('checkout-date');
    if (!isValid) {
        showNotification('Invalid check-in/check-out dates!', 'error');
        logEvent('invalid_submission', { form: 'hotels', error: 'date_invalid' });
        if (!errorRecoveryStart) errorRecoveryStart = Date.now();
        return;
    }
    if (errorRecoveryStart) {
        const recoveryTime = Date.now() - errorRecoveryStart;
        logEvent('recovery_attempt', { form: 'hotels', time: recoveryTime });
        errorRecoveryStart = null;
    }

    const resultsContainer = document.getElementById('hotels-results-container');
    resultsContainer.innerHTML = '';
    
    simulateProgress(() => {
        const mockHotels = [
            { name: 'Grand Hyatt', details: '5-Star • City Center • Free WiFi', features: ['Pool', 'Gym', 'Spa'], price: '$250/night' },
            { name: 'Beachside Motel', details: '3-Star • Beachfront • Pet-friendly', features: ['Free Parking', 'Kitchenette'], price: '$90/night' }
        ];

        mockHotels.forEach(hotel => {
            resultsContainer.appendChild(generateHotelCard(hotel));
        });

        resultsContainer.style.display = 'grid';
        showNotification('Hotels found! Book your ideal stay today.');
    });
});

// Support Dashboard
document.getElementById('support-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const messageText = document.getElementById('support-message').value;
    if (!messageText) return;

    appendMessage('user', messageText);
    document.getElementById('support-message').value = '';
    logEvent('support_message', { message: messageText });
    
    setTimeout(() => {
        const aiResponse = "Thank you for your message. We have received it and will get back to you shortly.";
        appendMessage('ai', aiResponse);
    }, 1500);
});

function appendMessage(sender, text) {
    const supportHistoryDiv = document.getElementById('support-history');
    const messageBubble = document.createElement('div');
    messageBubble.className = `support-message-bubble message-${sender}`;
    messageBubble.textContent = text;
    supportHistoryDiv.appendChild(messageBubble);
    supportHistoryDiv.scrollTop = supportHistoryDiv.scrollHeight;
}

// Modal event handlers
document.getElementById('modal-close').addEventListener('click', hideModal);
document.getElementById('modal-ok').addEventListener('click', hideModal);

// Accessibility Toggle
document.getElementById('accessibility-toggle').addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
    logEvent('accessibility_toggle', { state: document.body.classList.contains('high-contrast') ? 'on' : 'off' });
});

// Onboarding Modal and Query Parameter Handling
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('onboarding-modal').style.display = 'flex';
    document.getElementById('onboarding-close').addEventListener('click', () => {
        document.getElementById('onboarding-modal').style.display = 'none';
        setTimeout(() => {
            document.getElementById('discount-modal').style.display = 'flex';
        }, 500);
    });

    // Parse query parameter to select tab
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
        switchTab(tab);
        if (tab === 'login') {
            document.getElementById('auth-modal').style.display = 'flex';
        }
        logEvent('tab_switch_query', { tab });
    }

    // Set minimum date for date inputs
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dateInputs = ['departure-date', 'checkin-date', 'checkout-date', 'pickup-date', 'dropoff-date'];
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.min = tomorrow.toISOString().split('T')[0];
        }
    });

    // Footer Navigation Logging
    document.getElementById('footer-nav').addEventListener('click', () => {
        logEvent('footer_nav_click', { to: 'showcase.html' });
    });

    // Interactive Hover Effects for Showcase Cards
    document.querySelectorAll('.flight-card, .hotel-card, .car-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.02)';
            logEvent('card_hover', { type: card.dataset.type });
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
        // The issue is here: this is a client-side click event that prevents the default browser behavior.
        // It should be removed, as the anchor tag already handles the redirection.
        // card.querySelector('.book-button').addEventListener('click', (e) => {
        //     e.preventDefault(); // Prevent the default anchor tag behavior
        //     logEvent('book_now_click', { type: card.dataset.type });
        //     switchTab(card.querySelector('.book-button').dataset.tab);
        // });
    });
});

// Debrief Form Submit
document.getElementById('debrief-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const scores = {
        mental: document.getElementById('mental-demand').value,
        physical: document.getElementById('physical-demand').value,
        temporal: document.getElementById('temporal-demand').value,
        performance: document.getElementById('performance').value,
        effort: document.getElementById('effort').value,
        frustration: document.getElementById('frustration').value
    };
    logEvent('debrief_scores', scores);
    document.getElementById('debrief-modal').style.display = 'none';
    downloadLogs();
    showModal('Study Complete', 'Thank you for participating! Your logs have been downloaded.');
});

// Login and Sign Up modal logic
const authModal = document.getElementById('auth-modal');
document.getElementById('toggle-auth-mode').addEventListener('click', (e) => {
    e.preventDefault();
    const title = document.getElementById('auth-modal-title');
    const button = document.getElementById('auth-button');
    const link = document.getElementById('toggle-auth-mode');
    if (title.textContent === 'Log In') {
        title.textContent = 'Sign Up';
        button.textContent = 'Sign Up';
        link.textContent = 'Log In';
        link.parentNode.childNodes[0].nodeValue = 'Already have an account? ';
    } else {
        title.textContent = 'Log In';
        button.textContent = 'Log In';
        link.textContent = 'Sign Up';
        link.parentNode.childNodes[0].nodeValue = "Don't have an account? ";
    }
});

document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const mode = document.getElementById('auth-modal-title').textContent;
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    if (mode === 'Log In') {
        showModal('Login Successful!', `Welcome back, ${email}!`);
    } else {
        showModal('Sign Up Successful!', `Account created for ${email}. Please log in.`);
    }
    document.getElementById('auth-modal').style.display = 'none';
});

document.getElementById('auth-modal-close').addEventListener('click', () => {
    document.getElementById('auth-modal').style.display = 'none';
});

document.getElementById('nav-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('auth-modal').style.display = 'flex';
});

document.getElementById('discount-modal-close').addEventListener('click', () => {
    document.getElementById('discount-modal').style.display = 'none';
});