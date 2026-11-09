// ==========================================================================
// GREENLOOP STATE MANAGEMENT
// ==========================================================================

const state = {
    user: {
        points: 1250,
        wasteSaved: 8.4, // in kg
        co2Reduced: 2.1  // in kg (calculated as 0.25 * wasteSaved)
    },
    donationHistory: [
        {
            id: 'TX-001',
            date: '06 Agu 2026, 14:20',
            type: 'Sisa Makanan',
            weight: 5.4,
            points: 540,
            status: 'Selesai'
        },
        {
            id: 'TX-002',
            date: '03 Agu 2026, 09:15',
            type: 'Kulit Buah/Sayur',
            weight: 3.0,
            points: 300,
            status: 'Selesai'
        }
    ],
    pickupQueue: [],
    reactor: {
        totalWasteProcessed: 12.5, // in kg
        biogasGenerated: 5.6,       // in m3
        electricityConverted: 11.2, // in kWh
        maxCapacity: 50.0          // in kg
    },
    rewards: [
        {
            id: 'RWD-PLN-10',
            name: 'Token Listrik PLN Rp 10.000',
            cost: 1000,
            category: 'Listrik',
            icon: 'fa-bolt',
            colorClass: 'text-gold',
            bgClass: ''
        },
        {
            id: 'RWD-PLN-20',
            name: 'Token Listrik PLN Rp 20.000',
            cost: 2000,
            category: 'Listrik',
            icon: 'fa-bolt',
            colorClass: 'text-gold',
            bgClass: ''
        },
        {
            id: 'RWD-PLN-50',
            name: 'Token Listrik PLN Rp 50.000',
            cost: 5000,
            category: 'Listrik',
            icon: 'fa-bolt',
            colorClass: 'text-gold',
            bgClass: ''
        },
        {
            id: 'RWD-PDAM-15',
            name: 'Diskon Air PDAM Rp 15.000',
            cost: 1500,
            category: 'Air (PDAM)',
            icon: 'fa-droplet',
            colorClass: 'text-secondary',
            bgClass: 'bg-cyan'
        },
        {
            id: 'RWD-PDAM-30',
            name: 'Diskon Air PDAM Rp 30.000',
            cost: 3000,
            category: 'Air (PDAM)',
            icon: 'fa-droplet',
            colorClass: 'text-secondary',
            bgClass: 'bg-cyan'
        },
        {
            id: 'RWD-PLS-10',
            name: 'Pulsa Seluler Rp 10.000',
            cost: 1000,
            category: 'Pulsa',
            icon: 'fa-mobile-screen-button',
            colorClass: 'text-cyan',
            bgClass: ''
        },
        {
            id: 'RWD-PLS-25',
            name: 'Pulsa Seluler Rp 25.000',
            cost: 2500,
            category: 'Pulsa',
            icon: 'fa-mobile-screen-button',
            colorClass: 'text-cyan',
            bgClass: ''
        },
        {
            id: 'RWD-SPP-50',
            name: 'Subsidi SPP Sekolah Rp 50.000',
            cost: 5000,
            category: 'Pendidikan',
            icon: 'fa-graduation-cap',
            colorClass: 'text-emerald',
            bgClass: ''
        },
        {
            id: 'RWD-SPP-100',
            name: 'Subsidi SPP Sekolah Rp 100.000',
            cost: 10000,
            category: 'Pendidikan',
            icon: 'fa-graduation-cap',
            colorClass: 'text-emerald',
            bgClass: ''
        },
        {
            id: 'RWD-BLJ-25',
            name: 'Voucher Belanja Alfamart/Indomaret Rp 25.000',
            cost: 2500,
            category: 'Belanja',
            icon: 'fa-cart-shopping',
            colorClass: 'text-gold',
            bgClass: ''
        },
        {
            id: 'RWD-BLJ-50',
            name: 'Voucher Belanja Alfamart/Indomaret Rp 50.000',
            cost: 5000,
            category: 'Belanja',
            icon: 'fa-cart-shopping',
            colorClass: 'text-gold',
            bgClass: ''
        },
        {
            id: 'RWD-TUN-50',
            name: 'Pencairan Tunai Kantor Pos Rp 50.000',
            cost: 5000,
            category: 'Uang Tunai',
            icon: 'fa-money-bill-wave',
            colorClass: 'text-emerald',
            bgClass: ''
        },
        {
            id: 'RWD-TUN-100',
            name: 'Pencairan Tunai Bank NTB Syariah Rp 100.000',
            cost: 10000,
            category: 'Uang Tunai',
            icon: 'fa-money-bill-wave',
            colorClass: 'text-emerald',
            bgClass: ''
        }
    ]
};

// ==========================================================================
// INITIALIZATION & SCREEN SWAP LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    renderRewards();
});

function switchScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(screen => screen.classList.remove('active'));

    // Show selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Update active nav button
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Match screen with nav items
    if (screenId === 'screen-dashboard') {
        navItems[0].classList.add('active');
    } else if (screenId === 'screen-setor') {
        navItems[1].classList.add('active');
    } else if (screenId === 'screen-hadiah') {
        navItems[2].classList.add('active');
    }
}

// ==========================================================================
// RENDER & UPDATE UI ELEMENTS
// ==========================================================================

function updateUI() {
    // Update User Info
    document.getElementById('user-points').textContent = formatNumber(state.user.points);
    document.getElementById('reward-points-val').textContent = formatNumber(state.user.points);
    document.getElementById('user-waste-saved').textContent = `${state.user.wasteSaved.toFixed(1)} kg`;
    document.getElementById('user-co2-reduced').textContent = `${state.user.co2Reduced.toFixed(1)} kg`;

    // Update History List
    const historyContainer = document.getElementById('donation-history');
    historyContainer.innerHTML = '';
    
    state.donationHistory.forEach(item => {
        const isDone = item.status === 'Selesai';
        const itemHTML = `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-icon ${isDone ? 'status-done' : 'status-waiting'}">
                        <i class="fa-solid ${isDone ? 'fa-circle-check' : 'fa-clock'}"></i>
                    </div>
                    <div class="history-text">
                        <span class="history-type">${item.type}</span>
                        <span class="history-date">${item.date}</span>
                    </div>
                </div>
                <div class="history-amount">
                    <span class="history-weight">${item.weight.toFixed(1)} kg</span>
                    <span class="history-status-badge ${isDone ? 'status-done-bg' : 'status-waiting-bg'}">
                        ${isDone ? `+${item.points} Poin` : 'Menunggu'}
                    </span>
                </div>
            </div>
        `;
        historyContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Update Simulator Panel
    const emptyPickup = document.getElementById('empty-pickup');
    const pickupListContainer = document.getElementById('pickup-list');
    
    pickupListContainer.innerHTML = '';
    
    if (state.pickupQueue.length === 0) {
        emptyPickup.style.display = 'block';
    } else {
        emptyPickup.style.display = 'none';
        state.pickupQueue.forEach(item => {
            const cardHTML = `
                <div class="pickup-card" id="card-${item.id}">
                    <div class="pickup-details">
                        <span class="pickup-title">${item.donorName} (${item.type})</span>
                        <span class="pickup-weight">${item.weight.toFixed(1)} kg</span>
                    </div>
                    <div class="pickup-actions">
                        <button class="btn btn-primary btn-small" onclick="approvePickup('${item.id}')">
                            <i class="fa-solid fa-weight-scale"></i> Timbang & Selesai
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="cancelPickup('${item.id}')">
                            Tolak
                        </button>
                    </div>
                </div>
            `;
            pickupListContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // Update Reactor Stats
    document.getElementById('reactor-total-waste').textContent = `${state.reactor.totalWasteProcessed.toFixed(1)} kg`;
    document.getElementById('reactor-biogas').textContent = `${state.reactor.biogasGenerated.toFixed(1)} m³`;
    document.getElementById('reactor-electricity').textContent = `${state.reactor.electricityConverted.toFixed(1)} kWh`;
    
    const capacityPct = Math.min((state.reactor.totalWasteProcessed / state.reactor.maxCapacity) * 100, 100);
    document.getElementById('reactor-capacity-text').textContent = `${capacityPct.toFixed(0)}%`;
    document.getElementById('reactor-progress').style.width = `${capacityPct}%`;
}

let currentCategory = 'Semua';

function filterRewards(category) {
    currentCategory = category;
    
    // Update active pill UI
    const pills = document.querySelectorAll('.category-pill');
    pills.forEach(pill => {
        if (pill.getAttribute('onclick').includes(`'${category}'`)) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });

    renderRewards(category);
}

function renderRewards(category = 'Semua') {
    const container = document.getElementById('reward-items-container');
    container.innerHTML = '';

    const filtered = category === 'Semua' 
        ? state.rewards 
        : state.rewards.filter(r => r.category === category);

    filtered.forEach(reward => {
        const cardHTML = `
            <div class="reward-card">
                <div class="reward-card-info">
                    <div class="reward-logo-circle ${reward.bgClass}">
                        <i class="fa-solid ${reward.icon} ${reward.colorClass}"></i>
                    </div>
                    <div class="reward-details">
                        <span class="reward-name">${reward.name}</span>
                        <span class="reward-cost">${formatNumber(reward.cost)} Poin</span>
                    </div>
                </div>
                <button class="btn btn-primary btn-small" onclick="redeemReward('${reward.id}')">
                    Tukar
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// ==========================================================================
// FORM SUBMISSION & PHOTO UPLOAD SIMULATION
// ==========================================================================

let simulatedPhoto = false;

function simulatePhotoUpload() {
    const statusText = document.getElementById('photo-status');
    statusText.textContent = "Mengambil Gambar...";
    
    setTimeout(() => {
        statusText.innerHTML = `<i class="fa-solid fa-check-circle text-emerald"></i> Foto Terunggah`;
        simulatedPhoto = true;
    }, 1200);
}

function handleFormSetor(event) {
    event.preventDefault();

    const weightInput = document.getElementById('waste-weight');
    const typeInput = document.querySelector('input[name="waste-type"]:checked');
    
    const weight = parseFloat(weightInput.value);
    const type = typeInput.value;
    
    if (isNaN(weight) || weight <= 0) return alert('Berat tidak valid!');

    const txId = 'TX-' + Math.floor(100 + Math.random() * 900);
    const now = new Date();
    const dateStr = formatDate(now);

    // 1. Add to user donation history (Waiting state)
    const newDonation = {
        id: txId,
        date: dateStr,
        type: type,
        weight: weight,
        points: Math.round(weight * 100),
        status: 'Menunggu'
    };
    state.donationHistory.unshift(newDonation);

    // 2. Add to Simulator Pickup queue
    state.pickupQueue.push({
        id: txId,
        donorName: 'Kiran Lestari',
        type: type,
        weight: weight,
        date: dateStr
    });

    // Reset Form
    weightInput.value = '1.0';
    document.getElementById('photo-status').textContent = "Ambil Foto Sampah";
    simulatedPhoto = false;

    // Refresh UI & Switch screen
    updateUI();
    switchScreen('screen-dashboard');
}

// ==========================================================================
// SIMULATOR FUNCTIONS (COURIER & REACTOR INTERACTION)
// ==========================================================================

function approvePickup(txId) {
    // Find item in history
    const historyItem = state.donationHistory.find(item => item.id === txId);
    if (!historyItem) return;

    // 1. Mark as completed and assign points
    historyItem.status = 'Selesai';
    state.user.points += historyItem.points;
    state.user.wasteSaved += historyItem.weight;
    state.user.co2Reduced = state.user.wasteSaved * 0.25;

    // 2. Feed the Reactor Stats
    state.reactor.totalWasteProcessed += historyItem.weight;
    
    // Bioenergy conversion rate metrics:
    // 1 kg food waste ~ 0.45 m3 biogas metana
    // 1 m3 biogas ~ 2.0 kWh electricity output
    const biogasYield = historyItem.weight * 0.45;
    const electricityYield = biogasYield * 2.0;

    state.reactor.biogasGenerated += biogasYield;
    state.reactor.electricityConverted += electricityYield;

    // 3. Remove from pickup queue
    state.pickupQueue = state.pickupQueue.filter(item => item.id !== txId);

    // 4. Update UI
    updateUI();
}

function cancelPickup(txId) {
    // Remove from history
    state.donationHistory = state.donationHistory.filter(item => item.id !== txId);
    // Remove from queue
    state.pickupQueue = state.pickupQueue.filter(item => item.id !== txId);
    
    updateUI();
}

// ==========================================================================
// REWARDS REDEMPTION LOGIC
// ==========================================================================

function redeemReward(rewardId) {
    const reward = state.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (state.user.points < reward.cost) {
        alert('Poin Anda tidak mencukupi untuk melakukan penukaran ini!');
        return;
    }

    // Deduct points
    state.user.points -= reward.cost;

    // Generate random code depending on reward type
    let voucherCode = '';
    if (reward.category === 'Listrik') {
        // PLN Token is 20 digits: XXXX-XXXX-XXXX-XXXX-XXXX
        voucherCode = generateRandomPLNToken();
    } else if (reward.category === 'Air (PDAM)') {
        // PDAM discount code is alphanumeric 12 chars
        voucherCode = generateRandomPromoCode('PDAM');
    } else if (reward.category === 'Pulsa') {
        // Pulsa code
        voucherCode = generateRandomPromoCode('PULSA');
    } else if (reward.category === 'Pendidikan') {
        // SPP voucher
        voucherCode = generateRandomPromoCode('SPP');
    } else if (reward.category === 'Belanja') {
        // Shopping voucher
        voucherCode = generateRandomPromoCode('BLJ');
    } else if (reward.category === 'Uang Tunai') {
        // Cash payout code
        voucherCode = generateRandomPromoCode('CASH');
    } else {
        voucherCode = generateRandomPromoCode('VCHR');
    }

    // Show Success Modal
    document.getElementById('modal-reward-desc').textContent = reward.name;
    document.getElementById('voucher-code').textContent = voucherCode;
    document.getElementById('reward-modal').classList.add('active');

    updateUI();
}

function closeRewardModal() {
    document.getElementById('reward-modal').classList.remove('active');
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = String(date.getDate()).padStart(2, '0');
    const m = months[date.getMonth()];
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${d} ${m} ${y}, ${h}:${min}`;
}

function generateRandomPLNToken() {
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += Math.floor(1000 + Math.random() * 9000);
        if (i < 4) token += '-';
    }
    return token;
}

function generateRandomPromoCode(prefix) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    for (let i = 0; i < 8; i++) {
        suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${suffix}`;
}
