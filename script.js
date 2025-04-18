document.addEventListener('DOMContentLoaded', function() {
    // Gestione del login
    const loginButton = document.getElementById("login-button");
    const authorizedEmails = ["elisabetta093@live.it", "tonysgobio@gmail.com"];
    
    loginButton.addEventListener("click", function () {
        const emailInput = document.getElementById("email").value;
        const loginMessage = document.getElementById("login-message");
        const calendarSection = document.getElementById("calendar-section");
        const loginSection = document.getElementById("login-section");

        // Verifica l'email
        if (authorizedEmails.includes(emailInput)) {
            loginMessage.textContent = "Login effettuato con successo!";
            loginMessage.style.color = "green";
            loginSection.style.display = "none";
            calendarSection.style.display = "block";
            initializeCalendar();
        } else {
            loginMessage.textContent = "Email non autorizzata";
            loginMessage.style.color = "red";
        }
    });
});

function initializeCalendar(year = 2025, month = 3) {
    const calendarDiv = document.getElementById("calendar");
    const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    const mesi = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    const totalDays = new Date(year, month + 1, 0).getDate();
    
    let calendarHTML = `
        <div class="calendar-header">
            <button id="prevMonth">&lt;</button>
            <h3>${mesi[month]} ${year}</h3>
            <button id="nextMonth">&gt;</button>
        </div>
        <table class="calendar-table">
            <thead>
                <tr>
                    ${giorni.map(giorno => `<th>${giorno}</th>`).join('')}
                </tr>
            </thead>
            <tbody>`;
    
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    let dayCount = 1;

    for (let week = 0; week < 6; week++) {
        calendarHTML += '<tr>';
        for (let day = 0; day < 7; day++) {
            if ((week === 0 && day < firstDay) || dayCount > totalDays) {
                calendarHTML += '<td></td>';
            } else {
                calendarHTML += `
                    <td class="calendar-cell" data-date="${year}-${month+1}-${dayCount}">
                        <div class="date">${dayCount}</div>
                        <div class="shift shift-type" contenteditable="true" placeholder="Tipo turno"></div>
                        <div class="shift shift-location" contenteditable="true" placeholder="Luogo e ora"></div>
                        <div class="shift-result"></div>
                    </td>`;
                dayCount++;
            }
        }
        calendarHTML += '</tr>';
        if (dayCount > totalDays) break;
    }
    
    calendarHTML += `</tbody></table>`;
    calendarDiv.innerHTML = calendarHTML;

    document.getElementById('prevMonth').addEventListener('click', () => {
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }
        if (newYear >= 2025) {
            initializeCalendar(newYear, newMonth);
        }
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        initializeCalendar(newYear, newMonth);
    });

    document.querySelectorAll('.calendar-cell').forEach(cell => {
        const typeDiv = cell.querySelector('.shift-type');
        const locationDiv = cell.querySelector('.shift-location');
        const resultDiv = cell.querySelector('.shift-result');

        function updateResult() {
            const type = typeDiv.textContent.trim().toLowerCase();
            const location = locationDiv.textContent.trim().toUpperCase();

            // Se una delle due caselle è vuota, svuota anche il risultato
            if (!type || !location) {
                resultDiv.textContent = '';
                return;
            }

            // Logica per determinare il risultato
            if (type === 'mattino') {
                if (location.includes('CASA 17.30')) {
                    resultDiv.textContent = 'IMPEGNI DOPO LE 17.30';
                } else if (location.includes('MILANO 17.30')) {
                    resultDiv.textContent = 'IMPEGNI DOPO LE 18.45';
                } else if (location.includes('MILANO 18')) {
                    resultDiv.textContent = 'IMPEGNI DOPO LE 19.15';
                } else if (location.includes('CASA 18')) {
                    resultDiv.textContent = 'IMPEGNI DOPO LE 18.10';
                } else {
                    resultDiv.textContent = ''; // Se non corrisponde a nessuna condizione
                }
            } else if (type === 'pomeriggio') {
                resultDiv.textContent = 'NESSUN IMPEGNO';
            } else {
                resultDiv.textContent = ''; // Se il tipo non è valido
            }

            // Salva i dati
            saveShift(cell.dataset.date, {
                type: type,
                location: location,
                result: resultDiv.textContent
            });
        }

        typeDiv.addEventListener('input', updateResult);
        locationDiv.addEventListener('input', updateResult);
    });

    loadSavedData();
}

function saveShift(date, shiftData) {
    const shifts = JSON.parse(localStorage.getItem('shifts') || '{}');
    shifts[date] = shiftData;
    localStorage.setItem('shifts', JSON.stringify(shifts));
}

function loadSavedData() {
    const shifts = JSON.parse(localStorage.getItem('shifts') || '{}');
    document.querySelectorAll('.calendar-cell').forEach(cell => {
        const date = cell.dataset.date;
        if (shifts[date]) {
            const typeDiv = cell.querySelector('.shift-type');
            const locationDiv = cell.querySelector('.shift-location');
            const resultDiv = cell.querySelector('.shift-result');
            
            typeDiv.textContent = shifts[date].type;
            locationDiv.textContent = shifts[date].location;
            resultDiv.textContent = shifts[date].result;
        }
    });
}