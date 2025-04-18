document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const emailInput = document.getElementById('email');
    const loginSection = document.getElementById('login-section');
    const calendarSection = document.getElementById('calendar-section');
    const shiftsDiv = document.getElementById('shifts');
    const calendarDiv = document.getElementById('calendar');
    const saveButton = document.getElementById('save-button');
    const locationInput = document.getElementById('location');
    const timeInput = document.getElementById('time');
    const notesInput = document.getElementById('notes');
    
    let currentUser = null;
    let selectedDate = null;

    loginButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (email) {
            currentUser = email;
            loginSection.style.display = 'none';
            calendarSection.style.display = 'block';
            loadCalendar();
            loadSavedData();
        }
    });

    saveButton.addEventListener('click', () => {
        if (selectedDate && locationInput.value && timeInput.value) {
            const data = {
                location: locationInput.value,
                time: timeInput.value,
                notes: notesInput.value
            };
            saveData(selectedDate, data);
            locationInput.value = '';
            timeInput.value = '';
            notesInput.value = '';
        }
    });

    function loadCalendar() {
        const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        calendarDiv.innerHTML = '';
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day header';
            dayHeader.textContent = day;
            calendarDiv.appendChild(dayHeader);
        });

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(currentYear, currentMonth, i);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.textContent = i;
            dayDiv.dataset.date = date.toISOString().split('T')[0];
            dayDiv.addEventListener('click', () => selectDate(dayDiv));
            calendarDiv.appendChild(dayDiv);
        }
    }

    function selectDate(dayDiv) {
        const previousSelected = document.querySelector('.calendar-day.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        dayDiv.classList.add('selected');
        selectedDate = dayDiv.dataset.date;
    }

    function getSavedData() {
        const saved = localStorage.getItem(currentUser);
        return saved ? JSON.parse(saved) : {};
    }

    function saveData(date, data) {
        const saved = getSavedData();
        saved[date] = data;
        localStorage.setItem(currentUser, JSON.stringify(saved));
        displaySavedData(date, data);
    }

    function displaySavedData(date, data) {
        const existingData = document.querySelector(`[data-date="${date}"]`);
        if (!existingData) {
            const savedDiv = document.createElement('div');
            savedDiv.className = 'saved-data';
            savedDiv.dataset.date = date;
            savedDiv.innerHTML = `
                <span>${new Date(date).toLocaleDateString()} - ${data.location} alle ${data.time}
                ${data.notes ? `<br>Note: ${data.notes}` : ''}</span>
                <button class="delete-btn" onclick="deleteData('${date}')">×</button>
            `;
            shiftsDiv.appendChild(savedDiv);
        }
    }

    window.deleteData = function(date) {
        const saved = getSavedData();
        delete saved[date];
        localStorage.setItem(currentUser, JSON.stringify(saved));
        const dataDiv = document.querySelector(`[data-date="${date}"]`);
        if (dataDiv) {
            dataDiv.remove();
        }
    }

    function loadSavedData() {
        const saved = getSavedData();
        Object.entries(saved).forEach(([date, data]) => {
            displaySavedData(date, data);
        });
    }
});