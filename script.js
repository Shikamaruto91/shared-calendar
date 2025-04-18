document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const calendarSection = document.getElementById('calendar-section');
    const loginButton = document.getElementById('login-button');
    const emailInput = document.getElementById('email');
    const periodoSelect = document.getElementById('periodo');
    const luogoSelect = document.getElementById('luogo');
    const risultatoDiv = document.getElementById('risultato');
    const salvaButton = document.getElementById('salva');
    const calendarioDiv = document.getElementById('calendario');

    let giornoSelezionato = null;
    let utenteCorrente = null;

    // Login
    loginButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (email) {
            utenteCorrente = email;
            loginSection.style.display = 'none';
            calendarSection.style.display = 'block';
            creaCalendario();
            caricaDatiSalvati();
        }
    });

    // Gestione selezioni
    periodoSelect.addEventListener('change', aggiornaRisultato);
    luogoSelect.addEventListener('change', aggiornaRisultato);

    function aggiornaRisultato() {
        const periodo = periodoSelect.value;
        const luogo = luogoSelect.value;
        
        if (periodo === 'pomeriggio') {
            risultatoDiv.textContent = 'NON PRENDERE IMPEGNI';
        } else if (periodo === 'mattino') {
            if (luogo === 'casa17.30' || luogo === 'casa18') {
                risultatoDiv.textContent = 'IMPEGNI DOPO LE 18';
            } else if (luogo === 'milano17.30' || luogo === 'milano18') {
                risultatoDiv.textContent = 'IMPEGNI DOPO LE 19';
            }
        }
    }

    // Creazione calendario
    function creaCalendario() {
        const giorni = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
        const oggi = new Date();
        const ultimoGiorno = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0).getDate();

        calendarioDiv.innerHTML = '';
        
        // Intestazioni giorni
        giorni.forEach(g => {
            const div = document.createElement('div');
            div.className = 'giorno header';
            div.textContent = g;
            calendarioDiv.appendChild(div);
        });

        // Giorni del mese
        for (let i = 1; i <= ultimoGiorno; i++) {
            const div = document.createElement('div');
            div.className = 'giorno';
            div.textContent = i;
            div.dataset.data = `${oggi.getFullYear()}-${(oggi.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            
            div.addEventListener('click', () => selezionaGiorno(div));
            calendarioDiv.appendChild(div);
        }
    }

    function selezionaGiorno(div) {
        if (giornoSelezionato) {
            giornoSelezionato.classList.remove('selezionato');
        }
        div.classList.add('selezionato');
        giornoSelezionato = div;
    }

    // Salvataggio dati
    salvaButton.addEventListener('click', () => {
        if (!giornoSelezionato || !periodoSelect.value || !luogoSelect.value) return;

        const data = {
            periodo: periodoSelect.value,
            luogo: luogoSelect.value,
            risultato: risultatoDiv.textContent
        };

        salvaDati(giornoSelezionato.dataset.data, data);
        mostraRisultatoGiorno(giornoSelezionato, data.risultato);

        // Reset campi
        periodoSelect.value = '';
        luogoSelect.value = '';
        risultatoDiv.textContent = '';
    });

    function salvaDati(data, dati) {
        let salvati = JSON.parse(localStorage.getItem(utenteCorrente) || '{}');
        salvati[data] = dati;
        localStorage.setItem(utenteCorrente, JSON.stringify(salvati));
    }

    function caricaDatiSalvati() {
        const salvati = JSON.parse(localStorage.getItem(utenteCorrente) || '{}');
        Object.entries(salvati).forEach(([data, dati]) => {
            const giorno = document.querySelector(`[data-data="${data}"]`);
            if (giorno) {
                mostraRisultatoGiorno(giorno, dati.risultato);
            }
        });
    }

    function mostraRisultatoGiorno(giorno, risultato) {
        let risultatoDiv = giorno.querySelector('.risultato-giorno');
        if (!risultatoDiv) {
            risultatoDiv = document.createElement('div');
            risultatoDiv.className = 'risultato-giorno';
            giorno.appendChild(risultatoDiv);
        }
        risultatoDiv.textContent = risultato;
    }
});