// IP Pulling Tool - Browser Version

const API_BASE = 'https://ip-api.com/json';
const BATCH_LIMIT = 45;

const ipInput = document.getElementById('ipInput');
const lookupBtn = document.getElementById('lookupBtn');
const myIpBtn = document.getElementById('myIpBtn');
const batchInput = document.getElementById('batchInput');
const batchBtn = document.getElementById('batchBtn');
const resultsCard = document.getElementById('resultsCard');
const results = document.getElementById('results');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const errorDiv = document.getElementById('error');

let currentResults = [];

lookupBtn.addEventListener('click', () => lookupSingleIP());
myIpBtn.addEventListener('click', () => getMyIP());
batchBtn.addEventListener('click', () => lookupBatch());
copyBtn.addEventListener('click', () => copyToClipboard());
downloadBtn.addEventListener('click', () => downloadAsCSV());

ipInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') lookupSingleIP();
});

async function lookupSingleIP() {
    const ip = ipInput.value.trim();
    
    if (!ip) {
        showError('Please enter an IP address');
        return;
    }
    
    if (!isValidIP(ip)) {
        showError('Invalid IP address format');
        return;
    }
    
    await performLookup([ip]);
}

async function getMyIP() {
    try {
        lookupBtn.disabled = true;
        lookupBtn.innerHTML = '<span class="loading"></span>Detecting...';
        
        const response = await fetch(`${API_BASE}?fields=query`);
        const data = await response.json();
        
        ipInput.value = data.query;
        lookupBtn.disabled = false;
        lookupBtn.innerHTML = 'Lookup';
        
        await lookupSingleIP();
    } catch (error) {
        showError('Failed to detect your IP address');
        lookupBtn.disabled = false;
        lookupBtn.innerHTML = 'Lookup';
    }
}

async function lookupBatch() {
    const ips = batchInput.value
        .split('\n')
        .map(ip => ip.trim())
        .filter(ip => ip.length > 0);
    
    if (ips.length === 0) {
        showError('Please enter at least one IP address');
        return;
    }
    
    if (ips.length > BATCH_LIMIT) {
        showError(`Maximum ${BATCH_LIMIT} IPs allowed per batch`);
        return;
    }
    
    const validIps = ips.filter(ip => isValidIP(ip));
    
    if (validIps.length !== ips.length) {
        showError(`${ips.length - validIps.length} invalid IP(s) found`);
        return;
    }
    
    await performLookup(validIps);
}

async function performLookup(ips) {
    clearError();
    results.innerHTML = '';
    resultsCard.classList.add('show');
    currentResults = [];
    
    lookupBtn.disabled = true;
    batchBtn.disabled = true;
    myIpBtn.disabled = true;
    
    const promises = ips.map(ip => 
        fetch(`${API_BASE}?query=${ip}&fields=status,query,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,mobile,proxy,hosting,type`)
            .then(res => res.json())
            .catch(error => ({ status: 'fail', query: ip, message: 'Request failed' }))
    );
    
    const ipResults = await Promise.all(promises);
    currentResults = ipResults;
    
    displayResults(ipResults);
    
    lookupBtn.disabled = false;
    batchBtn.disabled = false;
    myIpBtn.disabled = false;
}

function displayResults(ipResults) {
    results.innerHTML = '';
    
    if (ipResults.length === 0) {
        results.innerHTML = '<p>No results to display</p>';
        return;
    }
    
    ipResults.forEach((data, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${data.status === 'success' ? 'success' : 'error'}`;
        
        const header = document.createElement('div');
        header.className = 'result-header';
        header.innerHTML = `
            <div>
                <h3>${data.query}</h3>
                <span class="status-badge ${data.status === 'success' ? 'success' : 'error'}">
                    ${data.status === 'success' ? '✓ Success' : '✗ Failed'}
                </span>
            </div>
            <span class="toggle-icon">▸</span>
        `;
        
        const content = document.createElement('div');
        content.className = 'result-content';
        
        if (data.status === 'success') {
            const table = document.createElement('table');
            table.className = 'result-table';
            
            const fields = [
                ['IP Address', data.query],
                ['Country', `${data.country} (${data.countryCode})`],
                ['Region', data.regionName || '-'],
                ['City', data.city || '-'],
                ['Postal Code', data.zip || '-'],
                ['Coordinates', `${data.lat}, ${data.lon}`],
                ['Timezone', data.timezone || '-'],
                ['ISP', data.isp || '-'],
                ['Organization', data.org || '-'],
                ['AS Number', data.as || '-'],
                ['AS Name', data.asname || '-'],
                ['Type', data.type || '-'],
                ['Mobile', data.mobile ? 'Yes' : 'No'],
                ['Proxy/VPN', data.proxy ? 'Yes' : 'No'],
                ['Hosting', data.hosting ? 'Yes' : 'No'],
            ];
            
            fields.forEach(([label, value]) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${label}</td><td>${value}</td>`;
                table.appendChild(row);
            });
            
            content.appendChild(table);
        } else {
            const error = document.createElement('p');
            error.style.color = 'var(--error)';
            error.textContent = data.message || 'Unknown error occurred';
            content.appendChild(error);
        }
        
        resultItem.appendChild(header);
        resultItem.appendChild(content);
        
        header.addEventListener('click', () => {
            resultItem.classList.toggle('collapsed');
        });
        
        results.appendChild(resultItem);
    });
}

function isValidIP(ip) {
    const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    resultsCard.classList.remove('show');
}

function clearError() {
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
}

function copyToClipboard() {
    const json = JSON.stringify(currentResults, null, 2);
    navigator.clipboard.writeText(json).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        showError('Failed to copy to clipboard');
    });
}

function downloadAsCSV() {
    if (currentResults.length === 0) {
        showError('No results to download');
        return;
    }
    
    const flatResults = currentResults.map(data => ({
        'IP Address': data.query,
        'Status': data.status,
        'Country': data.country || '-',
        'Country Code': data.countryCode || '-',
        'Region': data.regionName || '-',
        'City': data.city || '-',
        'Postal Code': data.zip || '-',
        'Latitude': data.lat || '-',
        'Longitude': data.lon || '-',
        'Timezone': data.timezone || '-',
        'ISP': data.isp || '-',
        'Organization': data.org || '-',
        'AS Number': data.as || '-',
        'AS Name': data.asname || '-',
        'Type': data.type || '-',
        'Mobile': data.mobile ? 'Yes' : 'No',
        'Proxy/VPN': data.proxy ? 'Yes' : 'No',
        'Hosting': data.hosting ? 'Yes' : 'No',
    }));
    
    const headers = Object.keys(flatResults[0]);
    const csv = [
        headers.join(','),
        ...flatResults.map(row => 
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            }).join(',')
        )
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-results-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}