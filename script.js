document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...

    const locationSelect = document.getElementById('location');
    const timeSelect = document.getElementById('time');
    const notesInput = document.getElementById('notes');

    function updateNotes() {
        const location = locationSelect.value;
        const time = timeSelect.value;
        
        if (location === 'mattino') {
            if (time === 'casa17.30' || time === 'casa18') {
                notesInput.value = 'IMPEGNI DOPO LE 18';
            } else if (time === 'milano18' || time === 'milano17.30') {
                notesInput.value = 'IMPEGNI DOPO LE 19';
            } else {
                notesInput.value = '';
            }
        } else if (location === 'pomeriggio') {
            notesInput.value = 'NON PRENDERE IMPEGNI';
        } else {
            notesInput.value = '';
        }
    }

    locationSelect.addEventListener('change', updateNotes);
    timeSelect.addEventListener('change', updateNotes);

    function saveData(date, data) {
        const saved = getSavedData();
        // Verifica se la data è nel passato
        const selectedDate = new Date(date);
        const today = new Date();
        
        if (selectedDate.getMonth() < today.getMonth() && 
            selectedDate.getFullYear() <= today.getFullYear()) {
            return; // Non salvare date nel passato
        }
        
        saved[date] = data;
        localStorage.setItem(currentUser, JSON.stringify(saved));
        displaySavedData(date, data);
    }

    function displaySavedData(date, data) {
        const dayDiv = document.querySelector(`[data-date="${date}"]`);
        if (dayDiv) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'day-result';
            resultDiv.textContent = data.notes;
            
            // Rimuovi risultati precedenti
            const oldResult = dayDiv.querySelector('.day-result');
            if (oldResult) oldResult.remove();
            
            dayDiv.appendChild(resultDiv);
        }
    }

    // Pulizia automatica dati vecchi
    function cleanOldData() {
        const saved = getSavedData();
        const today = new Date();
        
        Object.keys(saved).forEach(date => {
            const savedDate = new Date(date);
            if (savedDate.getMonth() < today.getMonth() && 
                savedDate.getFullYear() <= today.getFullYear()) {
                delete saved[date];
            }
        });
        
        localStorage.setItem(currentUser, JSON.stringify(saved));
    }

    // Esegui pulizia all'avvio
    cleanOldData();
});