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
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const currentMonthSpan = document.getElementById('current-month');

    let giornoSelezionato = null;
    let utenteCorrente = null;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    // Login
    loginButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (email) {
            utenteCorrente = email;
            loginSection.style.display = 'none';
            calendarSection.style.display = 'block';
            creaCalendario(currentMonth, currentYear);
            caricaDatiSalvati();
        }
    });

    // Gestione navigazione mesi
    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        creaCalendario(currentMonth, currentYear);
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        creaCalendario(currentMonth, currentYear);
    });

    // Gestione selezioni e risultato
    function aggiornaRisultato() {
        const periodo = periodoSelect.value;
        const luogo = luogoSelect.value;
        let risultato = '';

        if (periodo === 'pomeriggio') {
            risultato = 'NON PRENDERE IMPEGNI';
        } else if (periodo === 'mattino') {
            if (luogo.includes('casa')) {
                risultato = 'IMPEGNI DOPO LE 18';
            } else if (luogo.includes('milano')) {
                risultato = 'IMPEGNI DOPO LE 19';
            }
        }

        risultatoDiv.textContent = risultato;
        return risultato;
    }

    periodoSelect.addEventListener('change', aggiornaRisultato);
    luogoSelect.addEventListener('change', aggiornaRisultato);

    // Creazione calendario con date corrette
    function creaCalendario(month, year) {
        const giorni = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
        const primoGiorno = new Date(year, month, 1);
        const ultimoGiorno = new Date(year, month + 1, 0).getDate();
        const nomeMese = new Date(year, month, 1).toLocaleString('default', { month: 'long' });

        currentMonthSpan.textContent = `${nomeMese} ${year}`;
        calendarioDiv.innerHTML = '';
        
        // Intestazioni giorni
        giorni.forEach(g => {
            const div = document.createElement('div');
            div.className = 'giorno header';
            div.textContent = g;
            calendarioDiv.appendChild(div);
        });

        // Offset per iniziare dal giorno corretto
        let offset = primoGiorno.getDay() - 1;
        if (offset === -1) offset = 6; // Domenica

        // Celle vuote per l'offset
        for (let i = 0; i < offset; i++) {
            calendarioDiv.appendChild(document.createElement('div'));
        }

        // Giorni del mese
        for (let i = 1; i <= ultimoGiorno; i++) {
            const div = document.createElement('div');
            div.className = 'giorno';
            div.textContent = i;
            const data = new Date(year, month, i);
            div.dataset.data = data.toISOString().split('T')[0];
            
            const oggi = new Date();
            if (data.getDate() === oggi.getDate() && data.getMonth() === oggi.getMonth() && data.getFullYear() === oggi.getFullYear()) {
                div.classList.add('oggi');
            }

            div.addEventListener('click', () => selezionaGiorno(div));
            calendarioDiv.appendChild(div);
        }

        caricaDatiSalvati();
    }

    // Gestione salvataggio
    salvaButton.addEventListener('click', () => {
        if (!giornoSelezionato || !periodoSelect.value || !luogoSelect.value) {
            alert('Seleziona un giorno e compila tutti i campi');
            return;
        }

        const risultato = aggiornaRisultato();
        const data = {
            periodo: periodoSelect.value,
            luogo: luogoSelect.value,
            risultato: risultato
        };

        salvaDati(giornoSelezionato.dataset.data, data);
        mostraRisultatoGiorno(giornoSelezionato, risultato);
    });

    function selezionaGiorno(div) {
        if (giornoSelezionato) {
            giornoSelezionato.classList.remove('selezionato');
        }
        div.classList.add('selezionato');
        giornoSelezionato = div;
    }

    function salvaDati(data, dati) {
        let salvati = JSON.parse(localStorage.getItem(utenteCorrente) || '{}');
        salvati[data] = dati;
        localStorage.setItem(utenteCorrente, JSON.stringify(salvati));
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

    function caricaDatiSalvati() {
        const salvati = JSON.parse(localStorage.getItem(utenteCorrente) || '{}');
        Object.entries(salvati).forEach(([data, dati]) => {
            const giorno = document.querySelector(`[data-data="${data}"]`);
            if (giorno) {
                mostraRisultatoGiorno(giorno, dati.risultato);
            }
        });
    }
});