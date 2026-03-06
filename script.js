const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzsGAe1GrAsISRhEyfAjJ4g-vQnTmNylAilVQsGL8pWT84WMaVA0EQOeOafYTaeuWPmAA/exec";

let myTeam = "";
let myToken = "";

async function api(action) {
    const params = new URLSearchParams({ action: action });
    
    // Logică pentru colectare parametri în funcție de acțiune
    if (action === 'register') {
        params.append('teamId', val('team-id'));
        params.append('email', val('email-id'));
    } 
    else if (action === 'login') {
        params.append('teamId', val('team-id'));
        params.append('token', val('token-id'));
    } 
    else if (action === 'uplink') {
        params.append('myTeam', myTeam);
        params.append('myToken', myToken);
        params.append('target', val('up-target'));
        params.append('rap', val('up-rap'));
        params.append('rdep', val('up-rdep'));
        params.append('aap', val('up-aap'));
        params.append('adep', val('up-adep'));
        params.append('scor', val('up-scor'));
        params.append('autos', val('up-autos'));
    } 
    else if (action === 'intel') {
        params.append('myTeam', myTeam);
        params.append('myToken', myToken);
        params.append('target', val('search-target'));
    } 
    else if (action === 'mydata') {
        params.append('myTeam', myTeam);
        params.append('myToken', myToken);
    }

    try {
        const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        const data = await response.json();
        processResponse(action, data);
    } catch (error) {
        alert("Eroare de conexiune la server.");
    }
}

function processResponse(action, data) {
    if (!data.success) {
        alert("Eroare: " + (data.msg || "Acțiune eșuată."));
        return;
    }

    if (action === 'login') {
        myTeam = val('team-id');
        myToken = val('token-id');
        document.getElementById('auth-box').classList.add('hidden');
        document.getElementById('main-box').classList.remove('hidden');
    } 
    else if (action === 'register') {
        alert("Cont creat! Verifică e-mail-ul pentru Token.");
    } 
    else if (action === 'intel') {
        renderIntel(data.stats);
    } 
    else if (action === 'mydata') {
        renderTable(data.table);
    } 
    else if (action === 'uplink') {
        alert("Datele au fost trimise cu succes!");
        // Resetăm câmpurile de scout
        ['up-target', 'up-rap', 'up-rdep', 'up-aap', 'up-adep', 'up-scor', 'up-autos'].forEach(id => document.getElementById(id).value = "");
    }
}

function renderIntel(stats) {
    const container = document.getElementById('intel-results');
    container.innerHTML = `
        <div class="stat-grid">
            <div class="stat-item"><label>Matches</label><span>${stats.count}</span></div>
            <div class="stat-item"><label>Avg Scor</label><span>${stats.avgScor}</span></div>
            <div class="stat-item"><label>Avg RAP</label><span>${stats.avgRap}</span></div>
            <div class="stat-item"><label>Avg RDEP</label><span>${stats.avgRdep}</span></div>
        </div>
        <div class="auto-box">
            <b>Istoric Secvențe Auto:</b><br>
            <span style="color: #10b981;">${stats.autoHistory}</span>
        </div>
    `;
}

function renderTable(tableData) {
    let html = '<table><thead><tr>';
    // Generăm capul de tabel
    tableData[0].forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    // Generăm rândurile (fără header)
    for (let i = 1; i < tableData.length; i++) {
        html += '<tr>' + tableData[i].map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    }
    document.getElementById('table-container').innerHTML = html + '</tbody></table>';
}

function val(id) { return document.getElementById(id).value; }

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById('page-' + pageId).classList.remove('hidden');
    if (pageId === 'database') api('mydata');
}
