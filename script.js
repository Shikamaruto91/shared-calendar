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
    function creaCalendario() {
        const giorni = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
        const oggi = new Date();
        const primoGiorno = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
        const ultimoGiorno = new Date(oggi.getFullYear(), oggi.getMonth() + 1, 0).getDate();

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
            const data = new Date(oggi.getFullYear(), oggi.getMonth(), i);
            div.dataset.data = data.toISOString().split('T')[0];
            
            if (i === oggi.getDate()) {
                div.classList.add('oggi');
            }

            div.addEventListener('click', () => selezionaGiorno(div));
            calendarioDiv.appendChild(div);
        }
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

        // Reset campi
        periodoSelect.value = '';
        luogoSelect.value = '';
        risultatoDiv.textContent = '';
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