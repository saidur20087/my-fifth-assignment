// --- Common Variables ---
let allIssues = []; 

// --- Select Elements ---
const loginPage = document.getElementById('login-page');
const mainPage = document.getElementById('main-page');
const loginBtn = document.getElementById('loginBtn');
const issuesGrid = document.getElementById('issues-grid');
const loader = document.getElementById('loader');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('closeModalBtn');

// --- 1. Login Functionality ---
loginBtn.addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    //  Demo Credentials 
    if (user === 'admin' && pass === 'admin123') {
        loginPage.classList.add('hidden'); 
        mainPage.classList.remove('hidden'); 
        fetchAllIssues(); 
    } else {
        alert('Invalid Username or Password! Check demo credentials.');
    }
});

// --- 2. API theke Data Load (All Issues) ---
async function fetchAllIssues() {
    toggleLoader(true);
    try {
        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const result = await response.json();

      
        if (Array.isArray(result)) {
            allIssues = result;
        } else if (result.data && Array.isArray(result.data)) {
            allIssues = result.data;
        } else {
            allIssues = []; 
        }

        if (allIssues.length > 0) {
            renderIssues(allIssues);
        } else {
            issuesGrid.innerHTML = `<p class="text-gray-500">No issues found.</p>`;
        }
        
    } catch (error) {
        console.error("Error fetching data:", error);
        issuesGrid.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load data. API issue or Internet connection.</p>`;
    }
    toggleLoader(false);
}

// --- 3. Cards Render kora (UI Design) ---
function renderIssues(data) {
    issuesGrid.innerHTML = ''; // Age grid clear koro

    data.forEach(issue => {
        // Requirement: Open = Green Top Border, Closed = Purple Top Border
        const isStatusOpen = issue.status.toLowerCase() === 'open';
        const borderColor = isStatusOpen ? 'border-t-green-500' : 'border-t-purple-600';

        // Card Structure
        const card = document.createElement('div');
        card.className = `bg-white p-5 rounded shadow-sm border-t-4 ${borderColor} cursor-pointer hover:shadow-md transition`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800 text-md truncate pr-2">${issue.title}</h3>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded ${isStatusOpen ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}">
                    ${issue.status}
                </span>
            </div>
            <p class="text-xs text-gray-500 mb-4 line-clamp-2">${issue.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                <span class="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded">Category: ${issue.category}</span>
                <span class="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded">Label: ${issue.label}</span>
            </div>
            <div class="flex justify-between items-center text-[10px] text-gray-400 border-t pt-3 mt-auto">
                <span>User: ${issue.author}</span>
                <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
        `;

        // Card-e click korle Modal/Popup open hobe
        card.onclick = () => openSingleIssue(issue.id);
        issuesGrid.appendChild(card);
    });
}

// --- 4. Single Issue Details (Modal) ---
async function openSingleIssue(id) {
    toggleLoader(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const issue = await res.json();
        
        // Single Card details in Modal
        modalContent.innerHTML = `
            <h2 class="text-xl font-bold mb-2 text-gray-800 border-b pb-2">${issue.title}</h2>
            <div class="space-y-3 mt-4 text-sm">
                <p class="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded italic">"${issue.description}"</p>
                <div class="grid grid-cols-2 gap-4">
                    <p><b>Status:</b> ${issue.status}</p>
                    <p><b>Category:</b> ${issue.category}</p>
                    <p><b>Author:</b> ${issue.author}</p>
                    <p><b>Priority:</b> ${issue.priority}</p>
                    <p><b>Label:</b> ${issue.label}</p>
                    <p><b>Date:</b> ${new Date(issue.createdAt).toLocaleString()}</p>
                </div>
            </div>
        `;
        modal.classList.remove('hidden'); // Modal show koro
    } catch (err) {
        alert("Could not load details");
    }
    toggleLoader(false);
}

// --- 5. Tabs Filtering (All, Open, Closed) ---
const tabs = {
    all: document.getElementById('btn-all'),
    open: document.getElementById('btn-open'),
    closed: document.getElementById('btn-closed')
};

Object.keys(tabs).forEach(status => {
    tabs[status].addEventListener('click', () => {
        // UI Tab Active Style Change
        Object.values(tabs).forEach(btn => btn.classList.remove('active-tab'));
        tabs[status].classList.add('active-tab');

        // Logic Filtering
        if (status === 'all') {
            renderIssues(allIssues);
        } else {
            const filtered = allIssues.filter(item => item.status.toLowerCase() === status);
            renderIssues(filtered);
        }
    });
});

// --- 6. Search Functionality ---
searchBtn.addEventListener('click', async () => {
    const searchText = searchInput.value.trim();
    if (!searchText) {
        renderIssues(allIssues); // Search khali thakle shob dekhaw
        return;
    }

    toggleLoader(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
        const searchResults = await res.json();
        renderIssues(searchResults);
    } catch (error) {
        console.error("Search failed:", error);
    }
    toggleLoader(false);
});

// --- Helpers ---
function toggleLoader(show) {
    loader.classList.toggle('hidden', !show);
}

closeModalBtn.onclick = () => modal.classList.add('hidden');

// Close modal if user clicks outside the content
window.onclick = (event) => {
    if (event.target == modal) modal.classList.add('hidden');
}