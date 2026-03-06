const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxB3etmbNzmPhw9bLu_wdSlO-p6pO184_xOGTYcmm9mFeOcDxFktYsew4dcTaQPR48y-Q/exec";
let myTeam = "", myToken = "";

async function api(action) {
    const params = new URLSearchParams({ action: action });
    const status = document.getElementById('status-msg');
    
    if (action === 'register') {
        params.append('teamId', val('team-id'));
        params.append('email', val('email-id'));
    } else if (action === 'login') {
        params.append('teamId', val('team-id'));
        params.append('token', val('token-id'));
    } else if (action === 'uplink') {
        params.append('myTeam', myTeam); params.append('myToken', myToken);
        params.append('target', val('up-target')); params.append('rap', val('up-rap'));
        params.append('rdep', val('up-rdep')); params.append('aap', val('up-aap'));
        params.append('adep', val('up-adep')); params.append('scor', val('up-scor'));
        params.append('autos', val('up-autos'));
    } else if (action === 'intel') {
        params.append('myTeam', myTeam); params.append('myToken', myToken);
        params.append('target', val('search-target'));
    } else if (action === 'mydata') {
        params.append('myTeam', myTeam); params.append('myToken', myToken);
    }

    try {
        const res = await fetch(`${SCRIPT_URL}?${params.toString()}`);
        const data = await res.json();
        
        if (action === 'login' && data.success) {
            myTeam = val('team-id'); myToken = val('token-id');
            document.getElementById('auth-box').classList.add('hidden');
            document.getElementById('main-box').classList.remove('hidden');
        } else if (action === 'intel' && data.success) {
            document.getElementById('intel-results').innerHTML = `
                <div class="stat-box">
                    <b>Count:</b> ${data.stats.count} | <b>Scor:</b> ${data.stats.avgScor}<br>
                    <b>RAP:</b> ${data.stats.avgRap} | <b>RDEP:</b> ${data.stats.avgRdep}<br>
                    <b>Autos:</b> <small>${data.stats.autoHistory}</small>
                </div>`;
        } else if (action === 'mydata' && data.success) {
            let h = '<table>' + data.table.map(r => '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</table>';
            document.getElementById('table-container').innerHTML = h;
        } else if (data.success) {
            alert("Success!");
        } else {
            alert(data.msg || "Error");
        }
    } catch(e) { alert("Server Connection Error"); }
}

function val(id) { return document.getElementById(id).value; }
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById('page-' + id).classList.remove('hidden');
    if(id === 'database') api('mydata');
}
