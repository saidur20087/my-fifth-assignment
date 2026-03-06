// --- Global Variables ---
let allIssues = [];
const issuesGrid = document.getElementById('issues-grid');
const loader = document.getElementById('loader');
const issueCountText = document.getElementById('issue-count');

// --- 1. Login Function ---
function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        
        // Login houar por "All" button-e default color set koro
        const allBtn = document.getElementById('tab-all');
        allBtn.classList.add('bg-indigo-600', 'text-white', 'px-4', 'rounded');
        
        fetchIssues(); 
    } else {
        alert('Invalid Credentials!');
    }
}

// --- 2. Fetch Data ---
async function fetchIssues() {
    showLoader(true);
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        allIssues = Array.isArray(data) ? data : (data.data || []);
        
        displayIssues(allIssues);
        updateCount(allIssues.length); // Total count set koro
    } catch (err) {
        console.error("Error:", err);
    }
    showLoader(false);
}

// --- 3. Display Cards ---
function displayIssues(issues) {
    issuesGrid.innerHTML = '';
    issues.forEach(issue => {
        const isOpen = issue.status.toLowerCase() === 'open';
        // Open = Green Top Border, Closed = Purple Top Border
        const borderColor = isOpen ? 'border-t-green-500' : 'border-t-purple-500';

        const card = `
            <div onclick="openSingleIssue('${issue.id}')" class="bg-white p-4 rounded-lg shadow-sm border-t-4 ${borderColor} cursor-pointer hover:shadow-md transition flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-sm text-gray-800 truncate">${issue.title}</h3>
                    <p class="text-[11px] text-gray-500 mt-2 mb-4 line-clamp-2">${issue.description}</p>
                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-medium">${issue.category}</span>
                        <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-medium">${issue.priority}</span>
                    </div>
                </div>
                <div class="text-[10px] text-gray-400 border-t pt-3">
                    By ${issue.author} • ${new Date(issue.createdAt).toLocaleDateString()}
                </div>
            </div>`;
        issuesGrid.innerHTML += card;
    });
}

// --- 4. Filter Data (With Active Color Logic) ---
function filterData(status) {
    const tabs = ['all', 'open', 'closed'];
    
    tabs.forEach(tab => {
        const btn = document.getElementById(`tab-${tab}`);
        // Click kora button-e color thakbe, bakigulo default hobe
        if (tab === status) {
            btn.classList.add('bg-indigo-600', 'text-white', 'px-4', 'rounded');
        } else {
            btn.classList.remove('bg-indigo-600', 'text-white', 'px-4', 'rounded');
        }
    });

    if (status === 'all') {
        displayIssues(allIssues);
        updateCount(allIssues.length);
    } else {
        const filtered = allIssues.filter(i => i.status.toLowerCase() === status);
        displayIssues(filtered);
        updateCount(filtered.length);
    }
}

// --- 5. Search Issues ---
async function searchIssues() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) {
        displayIssues(allIssues);
        updateCount(allIssues.length);
        return;
    }

    showLoader(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${query}`);
        const result = await res.json();
        const results = Array.isArray(result) ? result : (result.data || []);
        displayIssues(results);
        updateCount(results.length);
    } catch (err) { console.error(err); }
    showLoader(false);
}

// --- 6. Modal Functions ---
async function openSingleIssue(id) {
    showLoader(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const issue = await res.json();
        
        document.getElementById('modal-content').innerHTML = `
            <h2 class="text-xl font-bold mb-2">${issue.title}</h2>
            <p class="text-sm text-gray-600 mb-4">${issue.description}</p>
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <p><b>Status:</b> ${issue.status}</p>
                <p><b>Author:</b> ${issue.author}</p>
            </div>`;
        document.getElementById('modal').classList.remove('hidden');
    } catch (e) { alert("Error!"); }
    showLoader(false);
}

function closeModal() { document.getElementById('modal').classList.add('hidden'); }

// --- Helpers ---
function showLoader(show) { loader.classList.toggle('hidden', !show); }
function updateCount(num) { issueCountText.innerText = `${num} Issues`; }