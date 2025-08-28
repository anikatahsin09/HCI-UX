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
function simulateProgress(progressBarId, callback) {
    const progressBar = document.getElementById(progressBarId);
    const progressFill = progressBar.querySelector('.progress-fill');
    
    progressBar.style.display = 'block';
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += 10 + Math.random() * 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                progressBar.style.display = 'none';
                progressFill.style.width = '0%';
                callback();
            }, 300);
        }
        progressFill.style.width = progress + '%';
    }, 100);
}

// Dynamic content generation for search results
function generateFlightCard(flight) {
    const card = document.createElement('div');
    card.className = 'flight-card';
    card.innerHTML = `
        <div class="flight-info">
            <div>
                <div class="flight-time">${flight.time}</div>
                <div style="color: #666; font-size: 0.9rem;">${flight.stops} • ${flight.duration}</div>
            </div>
            <div class="flight-price">${flight.price}</div>
        </div>
    `;
    return card;
}

function generateCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
        <div class="car-image">
            <div class="car-placeholder">🚗</div>
        </div>
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
        </div>
    `;
    return card;
}

function generateHotelCard(hotel) {
    const card = document.createElement('div');
    card.className = 'hotel-card';
    card.innerHTML = `
        <div class="hotel-image">
            <div class="hotel-placeholder">🏨</div>
        </div>
        <div class="hotel-info">
            <h4>${hotel.name}</h4>
            <p class="hotel-details">${hotel.details}</p>
            <div class="hotel-features">
                ${hotel.features.map(f => `<span class="feature">${f}</span>`).join('')}
            </div>
        </div>
        <div class="hotel-price">
            <div class="price-amount">${hotel.price}</div>
            <button class="book-button">Book Now</button>
        </div>
    `;
    return card;
}

// Dashboard tab switching logic
document.querySelectorAll('.dashboard-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // Remove active class from all tabs and content
        document.querySelectorAll('.dashboard-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.dashboard-content').forEach(content => content.classList.remove('active'));

        // Add active class to the clicked tab and its corresponding content
        tab.classList.add('active');
        document.getElementById(`${targetTab}-dashboard`).classList.add('active');
    });
});

// Flights Dashboard
document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const resultsContainer = document.getElementById('flights-results-container');
    resultsContainer.innerHTML = '';
    
    simulateProgress('search-progress', () => {
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
    const resultsContainer = document.getElementById('cars-results-container');
    resultsContainer.innerHTML = '';

    const progress = document.createElement('div');
    progress.className = 'progress-bar';
    progress.id = 'car-search-progress';
    progress.innerHTML = '<div class="progress-fill"></div>';
    e.target.insertBefore(progress, e.target.querySelector('button'));
    
    simulateProgress('car-search-progress', () => {
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
    const resultsContainer = document.getElementById('hotels-results-container');
    resultsContainer.innerHTML = '';

    const progress = document.createElement('div');
    progress.className = 'progress-bar';
    progress.id = 'hotel-search-progress';
    progress.innerHTML = '<div class="progress-fill"></div>';
    e.target.insertBefore(progress, e.target.querySelector('button'));

    simulateProgress('hotel-search-progress', () => {
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
    
    // Simulate AI response
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

// Login and Sign Up modal logic
const authModal = document.createElement('div');
authModal.className = 'modal';
authModal.id = 'auth-modal';
authModal.innerHTML = `
    <div class="modal-content">
        <button class="modal-close" id="auth-modal-close">&times;</button>
        <div style="text-align: center; margin-bottom: 1rem;">
            <img src="https://placehold.co/100x100/667eea/ffffff?text=Travel" alt="Travel Icon" style="border-radius: 50%;">
        </div>
        <h2 id="auth-modal-title">Log In</h2>
        <form id="auth-form">
            <div class="form-group">
                <label class="form-label" for="auth-email">Email</label>
                <input type="email" id="auth-email" class="form-input" required>
            </div>
            <div class="form-group">
                <label class="form-label" for="auth-password">Password</label>
                <input type="password" id="auth-password" class="form-input" required>
            </div>
            <button type="submit" class="search-button" id="auth-button">Log In</button>
        </form>
        <p style="margin-top: 1rem; font-size: 0.9rem;">
            Don't have an account? <a href="#" id="toggle-auth-mode">Sign Up</a>
        </p>
    </div>
`;
document.body.appendChild(authModal);

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
        link.parentNode.childNodes[0].nodeValue = 'Don\'t have an account? ';
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

// Event listener for the new "Login/Sign Up" navigation link
document.getElementById('nav-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('auth-modal').style.display = 'flex';
});

// Discount Modal on page load
const discountModal = document.createElement('div');
discountModal.className = 'modal';
discountModal.id = 'discount-modal';
discountModal.innerHTML = `
    <div class="modal-content" style="text-align: center;">
        <h2 style="font-size: 2rem; color: #ff6b6b; margin-bottom: 0.5rem;">🎉 Flash Sale! 🎉</h2>
        <p style="font-size: 1.2rem; color: #555;">Get <strong style="color: #ff6b6b;">20% OFF</strong> all bookings today!</p>
        <p style="font-size: 0.9rem; color: #888; margin-top: 0.5rem;">Use code: TRAVEL20</p>
        <button class="search-button" id="discount-modal-close" style="margin-top: 1.5rem;">Awesome!</button>
    </div>
`;
document.body.appendChild(discountModal);

document.getElementById('discount-modal-close').addEventListener('click', () => {
    document.getElementById('discount-modal').style.display = 'none';
});

// Set minimum date for date inputs
document.addEventListener('DOMContentLoaded', () => {
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

    // Show discount modal on page load
    setTimeout(() => {
        document.getElementById('discount-modal').style.display = 'flex';
    }, 500);
});
