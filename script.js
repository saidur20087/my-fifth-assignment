// --- get Variables ---
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

        // "All" button color set 
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
        updateCount(allIssues.length);
    } catch (err) {
        console.error("Error:", err);
    }
    showLoader(false);
}

// --- 3. Display Cards ---
function displayIssues(issues) {
    issuesGrid.innerHTML = '';
    issues.forEach(issue => {
        // Status check
        const status = issue.status ? issue.status.toLowerCase() : '';
        const isOpen = status === 'open';
        let borderColor = isOpen ? 'border-t-green-500' : 'border-t-purple-500';

        const card = `
        <div onclick="openSingleIssue('${issue.id}')" class="cursor-pointer bg-white border-t-4 ${borderColor} rounded-xl shadow-sm flex flex-col h-full">
        
        <div class="p-5 flex-grow">
            <div class="flex items-center justify-between mb-4">
                <div class="w-7 h-7 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                    <img src="./assets/Open-Status.png" alt="">
                </div>
                <span class="text-[10px] font-extrabold px-3 py-1 rounded-full bg-red-50 text-red-500 uppercase tracking-tighter">
                    ${issue.priority}
                </span>
            </div>

            <h3 class="text-[17px] font-bold text-slate-600 leading-snug mb-2">
                ${issue.title}
            </h3>

            <p class="text-[13px] text-slate-500 leading-relaxed mb-5 line-clamp-2">
            ${issue.description}
            </p>

            <div class="flex flex-wrap gap-2 mb-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-500 text-[11px] font-bold border border-red-100">
                    <i class="fa-solid fa-bug text-[10px]"></i> ${issue.labels?.[0] || ''}
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold border border-amber-100">
                    <i class="fa-regular fa-life-ring"></i>  ${issue.labels?.[1] || ''}
                </span>
            </div>
        </div>

        <div class="px-5 py-4 border-t border-gray-50 bg-gray-50/20 mt-auto">
            <div class="text-[12px] text-slate-400">
                <p class="mb-0.5">#1 by <span class="font-bold text-slate-600 italic">${issue.author}</span></p>
                <p class="font-medium">1/15/2024</p>
            </div>
        </div>
    </div>`;
    
        issuesGrid.innerHTML += card;
    });
}


// --- 4. Filter Data 
function filterData(status) {
    const tabs = ['all', 'open', 'closed'];

    tabs.forEach(tab => {
        const btn = document.getElementById(`tab-${tab}`);
        // Click kora button-e color thakbe
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
        const result = await res.json();
        const issue = result.data || result;

        // modal content update
        document.getElementById('modal-content').innerHTML = `
            <h2 class="text-xl font-bold mb-2">${issue.title || 'No Title'}</h2>
            <p class="text-sm text-gray-600 mb-4">${issue.description || 'No Description'}</p>
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <p><b>Status:</b> ${issue.status || 'N/A'}</p>
                <p><b>Author:</b> ${issue.author || 'Unknown'}</p>
            </div>
        `;

        // modal show
        const modal = document.getElementById('modal');
        modal.classList.remove('hidden'); // remove hidden
        modal.classList.add('flex');       // add flex to center content

    } catch (e) {
        alert("Error!");
        console.error(e);
    }
    showLoader(false);
}

// Close modal function
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}



function closeModal() { document.getElementById('modal').classList.add('hidden'); }

// --- Helpers ---
function showLoader(show) { loader.classList.toggle('hidden', !show); }
function updateCount(num) { issueCountText.innerText = `${num} Issues`; }