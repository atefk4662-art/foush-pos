/**
 * Tawajen Foush - FINAL PRODUCTION v10.0 (Clean & Synced)
 */

// 1. DATA & STATE
const DEFAULT_MENU = [
    { id: 101, name: 'طاجن لحم بالبصل', price: 165, category: 'طواجن', stock: 15 },
    { id: 102, name: 'طاجن عكاوي فوش', price: 280, category: 'طواجن', stock: 8 },
    { id: 103, name: 'طاجن موزة ضاني معمر', price: 240, category: 'طواجن', stock: 10 },
    { id: 104, name: 'فرخة مشوية على الفحم', price: 210, category: 'مشويات', stock: 12 },
    { id: 105, name: 'نصف كفتة مشوية خاصة', price: 180, category: 'مشويات', stock: 20 },
    { id: 106, name: 'كيلو كباب وكفتة فوش', price: 480, category: 'مشويات', stock: 5 },
    { id: 107, name: 'حمام محشي أرز (فردتين)', price: 190, category: 'طواجن', stock: 6 },
    { id: 108, name: 'أرز معمر سادة كبير', price: 65, category: 'مقبلات', stock: 30 },
    { id: 109, name: 'شوربة لسان عصفور', price: 35, category: 'مقبلات', stock: 50 },
    { id: 110, name: 'سلطة بلدي خضراء', price: 20, category: 'مقبلات', stock: 100 },
    { id: 111, name: 'طحينة بيضاء خام', price: 15, category: 'مقبلات', stock: 100 },
    { id: 112, name: 'ممبار فوش (طبق)', price: 85, category: 'طواجن', stock: 15 },
    { id: 113, name: 'بيبسي عائلي', price: 45, category: 'مشروبات', stock: 24 },
    { id: 114, name: 'مياه معدنية كبيرة', price: 15, category: 'مشروبات', stock: 48 },
    { id: 115, name: 'عصير برتقال فريش', price: 35, category: 'مشروبات', stock: 20 }
];

const DEFAULT_TABLES = Array.from({length: 12}, (_, i) => ({ id: i+1, number: (i+1).toString(), status: 'available' }));

function safeParse(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        if (!item || item === "undefined" || item === "null") return fallback;
        return JSON.parse(item);
    } catch (e) { return fallback; }
}

// DATA & STATE INITIALIZATION
function getRole() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const r = urlParams.get('role');
        if (r) {
            localStorage.setItem('foush_role', r);
            return r;
        }
        return localStorage.getItem('foush_role');
    } catch (e) { return localStorage.getItem('foush_role'); }
}

window.state = {
    role: getRole() || null,
    currentPage: localStorage.getItem('foush_last_page') || 'pos',
    data: { 
        menu: safeParse('foush_menu', DEFAULT_MENU), 
        orders: safeParse('foush_orders', []), 
        tables: safeParse('foush_tables', DEFAULT_TABLES),
        expenses: safeParse('foush_expenses', []),
        shifts: safeParse('foush_shifts', []),
        activeShift: safeParse('foush_active_shift', null)
    },
    cart: [],
    activeCategory: 'الكل',
    posSearchQuery: '',
    activeOrderType: 'salla'
};

console.log("System Initialized v10.9. Role:", window.state.role);

// 2. CORE SYSTEM
async function sync() {
    try {
        localStorage.setItem('foush_menu', JSON.stringify(window.state.data.menu));
        localStorage.setItem('foush_orders', JSON.stringify(window.state.data.orders));
        localStorage.setItem('foush_tables', JSON.stringify(window.state.data.tables));
        localStorage.setItem('foush_expenses', JSON.stringify(window.state.data.expenses));
        localStorage.setItem('foush_shifts', JSON.stringify(window.state.data.shifts));
        localStorage.setItem('foush_active_shift', JSON.stringify(window.state.data.activeShift));
        
        if(typeof CloudDB !== 'undefined' && CloudDB.isConfigured()) {
            CloudDB.set('menu', window.state.data.menu);
            CloudDB.set('orders', window.state.data.orders);
            CloudDB.set('tables', window.state.data.tables);
            CloudDB.set('expenses', window.state.data.expenses);
            CloudDB.set('shifts', window.state.data.shifts);
            CloudDB.set('activeShift', window.state.data.activeShift);
        }
        window.renderCurrentPage();
    } catch (e) {
        console.error("Sync Error:", e);
    }
}

window.navigate = (p) => { 
    window.state.currentPage = p; 
    localStorage.setItem('foush_last_page', p); 
    
    // Total Isolation: Clear content and reset state variables for the new page
    const main = document.getElementById('main-content');
    if(main) main.innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100%;"><i class="fa-solid fa-spinner fa-spin" style="font-size:3rem; color:var(--primary);"></i></div>';
    
    window.renderSidebar(); 
    setTimeout(() => window.renderCurrentPage(), 50); // Tiny delay for smooth transition
};

window.renderCurrentPage = () => {
    try {
        const main = document.getElementById('main-content');
        if(!main) return;
        const p = window.state.currentPage;
        console.log("Rendering page:", p);
        
        if(p === 'pos') renderPOS(main);
        else if(p === 'dashboard') renderDashboard(main);
        else if(p === 'inventory') renderInventory(main);
        else if(p === 'expenses') renderExpenses(main);
        else if(p === 'tables') renderTables(main);
        else if(p === 'kitchen') renderKitchen(main);
    } catch (e) {
        console.error("Render Page Error:", e);
        const main = document.getElementById('main-content');
        if(main) main.innerHTML = `<div class="glass-panel" style="margin:2rem; padding:2rem; border:1px solid var(--danger);"><h2 style="color:var(--danger)">⚠️ خطأ في العرض</h2><p>${e.message}</p><button onclick="location.reload()" class="btn-luxury">إعادة تحميل</button></div>`;
    }
};

// 3. VIEWS
function renderPOS(c) {
    const shift = window.state.data.activeShift;
    const total = window.state.cart.reduce((s,i)=>s+(i.price*i.qty),0);
    const lowStock = window.state.data.menu.filter(m => m.stock < 5);
    
    // If no active shift, show STRONG blocking screen
    if (!shift && window.state.role !== 'waiter') {
        c.innerHTML = `
            <div class="view-container" style="display:flex; align-items:center; justify-content:center; height:calc(100vh - 4.5rem); background:radial-gradient(circle at center, rgba(239,68,68,0.08) 0%, transparent 70%);">
                <div style="text-align:center; padding:4rem 3rem; max-width:560px; background:rgba(10,10,20,0.95); border-radius:30px; border:3px solid var(--danger); box-shadow: 0 0 100px rgba(239,68,68,0.25), inset 0 0 60px rgba(239,68,68,0.05);">
                    <div style="width:100px; height:100px; background:rgba(239,68,68,0.15); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 2rem; border:3px solid var(--danger); animation:pulse 2s infinite;">
                        <i class="fa-solid fa-ban" style="font-size:3rem; color:var(--danger);"></i>
                    </div>
                    <div style="background:var(--danger); color:#fff; padding:6px 20px; border-radius:20px; display:inline-block; font-weight:900; font-size:0.8rem; letter-spacing:3px; margin-bottom:1.5rem; text-transform:uppercase;">⛔ محطوق - ممنوع العمل</div>
                    <h2 style="font-size:2.2rem; font-weight:900; margin-bottom:1rem; color:#fff;">لا توجد وردية نشطة!</h2>
                    <p style="color:rgba(255,255,255,0.55); margin-bottom:0.8rem; line-height:1.9; font-size:1rem;">
                        ⚠️ لا يمكن تسجيل أي طلبات أو عمليات بيع الآن.<br>
                        يجب فتح وردية جديدة أولاً للبدء في استقبال الطلبات.
                    </p>
                    <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:15px; padding:12px; margin-bottom:2.5rem; font-size:0.85rem; color:rgba(255,255,255,0.4);">
                        <i class="fa-solid fa-circle-info"></i> جميع أزرار نقطة البيع معطّلة حتى فتح الوردية
                    </div>
                    <button onclick="window.startShift()" 
                        style="width:100%; padding:1.5rem; font-size:1.3rem; background:var(--primary); color:#000; border:none; border-radius:20px; font-weight:900; cursor:pointer; font-family:'Cairo'; box-shadow:0 10px 40px rgba(245,158,11,0.3); transition:all 0.3s;"
                        onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 20px 50px rgba(245,158,11,0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 40px rgba(245,158,11,0.3)'">
                        <i class="fa-solid fa-play-circle"></i> فتح وردية جديدة الآن
                    </button>
                </div>
            </div>
        `;
        return;
    }

    c.innerHTML = `
        <div class="view-container" style="display:grid; grid-template-columns: 1fr 380px; gap:1.5rem; height:calc(100vh - 4.5rem); padding:1rem; overflow:hidden;">
            <!-- Left Side: Menu -->
            <div style="display:flex; flex-direction:column; gap:1rem; overflow:hidden;">
                <!-- Search & Filters -->
                <div class="glass-panel" style="padding:1rem; display:flex; flex-direction:column; gap:1rem; background:rgba(30, 41, 59, 0.4);">
                    <div style="display:flex; gap:15px; align-items:center; background:rgba(0,0,0,0.2); padding:12px 20px; border-radius:15px; border:1px solid rgba(255,255,255,0.05);">
                        <i class="fa-solid fa-magnifying-glass" style="opacity:0.4;"></i>
                        <input type="text" placeholder="ابحث عن صنف..." oninput="window.searchPOS(this.value)" 
                            style="flex:1; background:transparent; border:none; color:#fff; font-size:1.1rem; outline:none; font-family:'Cairo';">
                    </div>
                    
                    <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:5px;" class="hide-scroll">
                        ${['الكل', ...new Set(window.state.data.menu.map(i=>i.category))].map(cat => `
                            <button onclick="window.filterCategory('${cat}')" 
                                style="background:${window.state.activeCategory===cat?'var(--primary)':'rgba(255,255,255,0.05)'}; 
                                       color:${window.state.activeCategory===cat?'#000':'#fff'}; 
                                       border:none; padding:10px 22px; border-radius:12px; font-weight:900; cursor:pointer; white-space:nowrap; transition:0.2s;">
                                ${cat}
                            </button>
                        `).join('')}
                    </div>
                </div>

                ${lowStock.length > 0 ? `
                <div style="background:var(--danger); color:#fff; padding:15px; border-radius:15px; font-weight:900; box-shadow: 0 10px 20px rgba(239,68,68,0.3); margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fa-solid fa-triangle-exclamation fa-beat"></i>
                        <span>تنبيه نواقص فوري: ${lowStock.map(i=>`${i.name} (${i.stock})`).join(' - ')}</span>
                    </div>
                </div>` : ''}

                <!-- Menu Grid -->
                <div style="flex:1; overflow-y:auto; display:grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap:1rem; padding:5px;" class="hide-scroll">
                    ${window.state.data.menu
                        .filter(i=>(window.state.activeCategory==='الكل' || i.category===window.state.activeCategory) && i.name.includes(window.state.posSearchQuery))
                        .map(m => {
                            const cartItem = window.state.cart.find(c => c.id === m.id);
                            return `
                            <div class="pos-card ${m.stock<=0?'out-of-stock':''} ${cartItem?'active-item':''}" 
                                 onclick="window.addToCart(${m.id})" 
                                 style="background:rgba(30, 41, 59, 0.6); padding:1.5rem 1rem; border-radius:20px; text-align:center; cursor:pointer; position:relative; border:1px solid rgba(255,255,255,0.03);">
                                ${cartItem ? `<div style="position:absolute; top:10px; left:10px; background:var(--primary); color:#000; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.9rem;">${cartItem.qty}</div>` : ''}
                                <div style="font-size:2.8rem; margin-bottom:10px;">${getCatIcon(m.category)}</div>
                                <div style="font-weight:900; font-size:1rem; margin-bottom:8px; line-height:1.2; height:2.4rem; overflow:hidden;">${m.name}</div>
                                <div style="color:var(--primary); font-weight:900; font-size:1.2rem;">${m.price} <span style="font-size:0.8rem;">ج.م</span></div>
                                ${m.stock < 10 ? `<div style="font-size:0.7rem; color:${m.stock<5?'var(--danger)':'var(--primary)'}; margin-top:5px; opacity:0.8;">المتبقي: ${m.stock}</div>` : ''}
                            </div>`;
                        }).join('')}
                </div>
            </div>

            <!-- Right Side: Cart -->
            <div class="glass-panel" style="display:flex; flex-direction:column; padding:1.5rem; background:rgba(15, 23, 42, 0.8); border:1px solid rgba(251,191,36,0.1); overflow:hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <h2 style="margin:0; font-weight:900; font-size:1.4rem;"><i class="fa-solid fa-receipt" style="color:var(--primary);"></i> طلب جديد</h2>
                    <button onclick="window.clearCart()" style="background:transparent; border:none; color:var(--danger); font-weight:bold; cursor:pointer; font-size:0.9rem;">مسح الكل</button>
                </div>

                <div style="flex:1; overflow-y:auto; margin-bottom:1.5rem; display:flex; flex-direction:column; gap:10px;" class="hide-scroll">
                    ${window.state.cart.length === 0 ? 
                        `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; opacity:0.1;">
                            <i class="fa-solid fa-basket-shopping" style="font-size:5rem;"></i>
                            <p style="margin-top:1rem; font-weight:bold;">سلة المشتريات فارغة</p>
                        </div>` :
                        window.state.cart.map((c, idx) => `
                            <div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:15px; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(255,255,255,0.05);">
                                <div style="flex:1;">
                                    <div style="font-weight:900; font-size:0.95rem;">${c.name}</div>
                                    <div style="color:var(--primary); font-weight:900; font-size:0.9rem;">${c.price * c.qty} ج.م</div>
                                </div>
                                <div style="display:flex; align-items:center; gap:12px; background:rgba(0,0,0,0.3); padding:5px 10px; border-radius:10px;">
                                    <button onclick="window.updateQty(${idx},-1)" style="background:transparent; border:none; color:#fff; font-size:1.2rem; cursor:pointer; width:20px;">-</button>
                                    <span style="font-weight:900; min-width:20px; text-align:center;">${c.qty}</span>
                                    <button onclick="window.updateQty(${idx},1)" style="background:transparent; border:none; color:var(--primary); font-size:1.2rem; cursor:pointer; width:20px;">+</button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>

                <div style="border-top:2px solid rgba(255,255,255,0.1); padding-top:1.5rem;">
                    <div style="display:flex; gap:8px; margin-bottom:1.2rem; background:rgba(0,0,0,0.3); padding:5px; border-radius:15px;">
                        ${[{id:'salla',label:'صالة',icon:'chair'},{id:'takeaway',label:'تيك واي',icon:'bag-shopping'},{id:'delivery',label:'دليفري',icon:'motorcycle'}].map(t => `
                            <button onclick="window.setOrderType('${t.id}')" 
                                style="flex:1; padding:12px 8px; border-radius:12px; border:none; 
                                       background:${window.state.activeOrderType===t.id?'var(--primary)':'transparent'}; 
                                       color:${window.state.activeOrderType===t.id?'#000':'var(--text-dim)'}; 
                                       font-weight:900; font-size:0.85rem; transition:0.3s; cursor:pointer;">
                                <i class="fa-solid fa-${t.icon}"></i> ${t.label}
                            </button>
                        `).join('')}
                    </div>

                    ${window.state.activeOrderType==='salla' ? `
                        <div style="margin-bottom:1.2rem;">
                            <label style="display:block; font-size:0.8rem; color:var(--text-dim); margin-bottom:8px; margin-right:5px;">رقم الطاولة</label>
                            <select id="table-select" style="width:100%; padding:15px; background:#000; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:15px; font-weight:900; outline:none; appearance:none;">
                                <option value="">-- اختر الطاولة --</option>
                                ${window.state.data.tables.map(t => `<option value="${t.id}" ${t.status==='occupied'?'disabled':''}>طاولة ${t.number} ${t.status==='occupied'?'(مشغولة)':''}</option>`).join('')}
                            </select>
                        </div>` : ''}

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; padding:0 5px;">
                        <span style="font-weight:bold; color:var(--text-dim); font-size:1.1rem;">الإجمالي النهائي</span>
                        <span style="font-size:2rem; font-weight:900; color:var(--primary);">${total} <span style="font-size:1rem;">ج.م</span></span>
                    </div>

                    <button onclick="window.confirmOrder()" class="btn-luxury" 
                        style="width:100%; padding:1.5rem; background:var(--primary); color:#000; font-weight:900; font-size:1.4rem; border-radius:20px; box-shadow:0 10px 30px rgba(245,158,11,0.2);">
                        تأكيد الطلب ✔
                    </button>
                </div>
            </div>
        </div>
    `;
}

// 3. ACTIONS: SHIFT MANAGEMENT
window.startShift = async () => {
    if(window.state.data.activeShift) return alert("الوردية مفتوحة بالفعل!");
    const shift = {
        id: "SH-" + Date.now(),
        startTime: Date.now(),
        user: window.state.role,
        totalSales: 0,
        totalExpenses: 0,
        status: 'open'
    };
    window.state.data.activeShift = shift;
    await sync();
    alert("🚀 تم بدء وردية جديدة بنجاح");
};

function renderDashboard(c) {
    const shift = window.state.data.activeShift;
    const allOrders = window.state.data.orders || [];
    const activeOrders = allOrders.filter(o => o.status !== 'completed' && o.status !== 'delivered');
    const shiftOrders = shift ? allOrders.filter(o => o.shiftId === shift.id) : [];
    
    // Stats Calculations
    const completedOrders = shiftOrders.filter(o => o.status === 'completed' || o.status === 'delivered');
    const completedSales = completedOrders.reduce((s,o)=>s+o.total, 0);
    const expensesTotal = (window.state.data.expenses || []).filter(e => e.shiftId === (shift?.id)).reduce((s,e)=>s+e.amount, 0);
    const drawerCash = completedSales - expensesTotal;

    // Advanced Stats
    const avgPrepTime = completedOrders.length > 0 
        ? Math.round(completedOrders.reduce((s,o)=>s+(o.completedTime?o.completedTime-o.timestamp:0), 0) / completedOrders.length / 60000)
        : 0;

    c.innerHTML = `
        <div class="view-container" style="padding:1.5rem; overflow-y:auto; height:calc(100vh - 4.5rem);">
            <!-- DASHBOARD HEADER & STATS -->
            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:1.5rem; margin-bottom:2rem;">
                <!-- SHIFT DRAWER CARD -->
                <div class="glass-panel" style="padding:1.5rem; display:flex; flex-direction:column; justify-content:center; border:2px solid ${shift?'var(--success)':'var(--primary)'}; background:linear-gradient(135deg, rgba(0,0,0,0.6), rgba(16, 185, 129, 0.1)); position:relative; overflow:hidden;">
                    <div style="position:absolute; top:-20px; right:-20px; font-size:8rem; opacity:0.05; transform:rotate(-15deg); color:var(--success);"><i class="fa-solid fa-vault"></i></div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; position:relative;">
                        <h2 style="margin:0; font-weight:900; color:var(--primary); font-size:1rem;">السيولة المتوفرة بالدرج 💰</h2>
                        ${shift ? `<button onclick="window.endShift()" style="background:rgba(239, 68, 68, 0.2); color:var(--danger); border:1px solid var(--danger); padding:6px 15px; border-radius:12px; font-size:0.8rem; font-weight:900; cursor:pointer; transition:0.3s;" onmouseover="this.style.background='var(--danger)'; this.style.color='#000';"><i class="fa-solid fa-power-off"></i> إنهاء الوردية</button>` : ''}
                    </div>
                    
                    ${!shift ? 
                        `<button onclick="window.startShift()" class="btn-luxury" style="background:var(--primary); padding:1.2rem; font-size:1.1rem;"><i class="fa-solid fa-play"></i> فتح وردية جديدة</button>` :
                        `<div style="text-align:center; padding:15px 0; position:relative;">
                            <div style="font-size:3.5rem; font-weight:900; color:var(--success); line-height:1; filter: drop-shadow(0 0 10px rgba(16,185,129,0.3));">${drawerCash} <span style="font-size:1.2rem;">ج.م</span></div>
                            <div style="font-size:0.85rem; opacity:0.6; margin-top:12px; font-weight:bold;"><i class="fa-solid fa-clock-rotate-left"></i> منذ ${new Date(shift.startTime).toLocaleTimeString('ar-EG')}</div>
                         </div>`
                    }
                </div>

                <!-- SUB STATS -->
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:1rem;">
                    <div class="glass-panel kpi-card" onclick="window.showDrillModal('expenses')" style="text-align:center; display:flex; flex-direction:column; justify-content:center; background:rgba(239, 68, 68, 0.08); border-bottom:4px solid var(--danger); cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.15)'" onmouseout="this.style.background='rgba(239,68,68,0.08)'">
                        <div style="font-size:0.75rem; opacity:0.6; margin-bottom:8px;">إجمالي المصروفات <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.6rem;"></i></div>
                        <div style="font-size:1.8rem; font-weight:900; color:var(--danger);">${expensesTotal} <span style="font-size:0.7rem;">ج.م</span></div>
                    </div>
                    <div class="glass-panel kpi-card" onclick="window.showDrillModal('shift-orders')" style="text-align:center; display:flex; flex-direction:column; justify-content:center; background:rgba(99, 102, 241, 0.08); border-bottom:4px solid var(--accent); cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(99,102,241,0.15)'" onmouseout="this.style.background='rgba(99,102,241,0.08)'">
                        <div style="font-size:0.75rem; opacity:0.6; margin-bottom:8px;">طلبات الوردية <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.6rem;"></i></div>
                        <div style="font-size:1.8rem; font-weight:900; color:var(--accent);">${shiftOrders.length}</div>
                    </div>
                    <div class="glass-panel kpi-card" onclick="window.showDrillModal('active-orders')" style="text-align:center; display:flex; flex-direction:column; justify-content:center; background:rgba(245, 158, 11, 0.08); border-bottom:4px solid var(--primary); cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(245,158,11,0.15)'" onmouseout="this.style.background='rgba(245,158,11,0.08)'">
                        <div style="font-size:0.75rem; opacity:0.6; margin-bottom:8px;">نشط حالياً <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.6rem;"></i></div>
                        <div style="font-size:1.8rem; font-weight:900; color:var(--primary);">${activeOrders.length}</div>
                    </div>
                    <div class="glass-panel kpi-card" onclick="window.showDrillModal('low-stock')" style="text-align:center; display:flex; flex-direction:column; justify-content:center; background:rgba(16, 185, 129, 0.08); border-bottom:4px solid var(--success); cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(16,185,129,0.15)'" onmouseout="this.style.background='rgba(16,185,129,0.08)'">
                        <div style="font-size:0.75rem; opacity:0.6; margin-bottom:8px;">نواقص المخزن <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.6rem;"></i></div>
                        <div style="font-size:1.8rem; font-weight:900; color:var(--success);">${window.state.data.menu.filter(m=>m.stock<5).length} <span style="font-size:0.7rem;">صنف</span></div>
                    </div>
                </div>
            </div>

            <!-- MAIN CONTENT: ACTIVE ORDERS MONITORING -->
            <div class="glass-panel" style="padding:1.5rem; background:rgba(15, 23, 42, 0.6); border-radius:30px; border:1px solid rgba(255,255,255,0.05);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:1.2rem;">
                    <h2 style="margin:0; font-weight:900; display:flex; align-items:center; gap:12px; font-size:1.4rem;">
                        <i class="fa-solid fa-microchip" style="color:var(--primary);"></i> مركز التحكم والمراقبة الذكي
                    </h2>
                    <div style="display:flex; gap:10px;">
                        <div style="background:rgba(255,255,255,0.05); padding:8px 15px; border-radius:15px; display:flex; align-items:center; gap:10px;">
                            <span class="live-pulse" style="background:var(--success);"></span>
                            <span style="font-weight:900; font-size:0.85rem; opacity:0.8;">بث مباشر للنظام</span>
                        </div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap:1.5rem;">
                    ${activeOrders.map(o => renderOrderMonitorCard(o)).join('') || 
                        '<div style="grid-column: 1/-1; text-align:center; padding:8rem; opacity:0.2; display:flex; flex-direction:column; align-items:center; gap:20px;">
                            <i class="fa-solid fa-satellite-dish" style="font-size:5rem;"></i>
                            <div style="font-size:1.2rem; font-weight:900;">لا توجد عمليات جارية حالياً</div>
                         </div>'}
                </div>
            </div>
        </div>
    `;
    updateTimers();
}

function renderOrderMonitorCard(o) {
    const isLate = (Date.now() - o.timestamp) > 15 * 60 * 1000;
    return `
        <div class="glass-panel" style="padding:0; overflow:hidden; border-radius:20px; border:1px solid ${isLate?'var(--danger)':'rgba(255,255,255,0.1)'}; background:rgba(30, 41, 59, 0.8);">
            <div style="background:rgba(0,0,0,0.2); padding:1rem; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.05);">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:40px; height:40px; background:var(--primary); color:#000; border-radius:10px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.2rem;">${o.tableNumber || '✈'}</div>
                    <div>
                        <div style="font-weight:900; font-size:0.9rem;">#${o.id}</div>
                        <div style="font-size:0.7rem; opacity:0.6;">${o.type === 'dine-in' ? 'صالة' : (o.type === 'delivery' ? 'دليفري' : 'تيك واي')}</div>
                    </div>
                </div>
                <div style="text-align:left;">
                    <div style="font-weight:900; color:var(--primary); font-size:1.1rem;">${o.total} ج.م</div>
                    <div style="font-size:0.8rem; font-family:monospace;" class="order-timer" data-start="${o.timestamp}">00:00</div>
                </div>
            </div>
            <div style="padding:1rem; max-height:150px; overflow-y:auto;" class="hide-scroll">
                ${o.items.map(i => `<div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:5px; opacity:0.8;"><span>${i.name}</span><span style="font-weight:bold;">x${i.qty}</span></div>`).join('')}
            </div>
            <div style="padding:1rem; border-top:1px solid rgba(255,255,255,0.05); display:flex; gap:10px;">
                <button onclick="window.finalizeTable('${o.id}')" style="flex:1; background:var(--success); color:#fff; border:none; padding:10px; border-radius:10px; font-weight:bold; cursor:pointer; font-size:0.85rem;">تحصيل 🧾</button>
                <button onclick="window.cancelOrder('${o.id}')" style="background:rgba(239, 68, 68, 0.1); color:var(--danger); border:none; padding:10px; border-radius:10px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `;
}

function renderSallaCard(o) {
    const statusColor = o.status === 'preparing' ? 'var(--primary)' : 'var(--success)';
    return `
        <div class="glass-panel" style="padding:0; overflow:hidden; border-radius:25px; border:1px solid rgba(255,255,255,0.1); animation: slideIn 0.3s ease;">
            <div style="background:linear-gradient(135deg, rgba(251,191,36,0.1), rgba(0,0,0,0.4)); padding:1.5rem; display:flex; justify-content:space-between; align-items:start;">
                <div>
                    <div style="font-weight:900; font-size:1.8rem; color:var(--accent);">طاولة ${o.tableNumber}</div>
                    <div style="margin-top:8px; display:inline-block; background:${statusColor}; color:#000; padding:4px 12px; border-radius:20px; font-weight:900; font-size:0.8rem;">${o.status==='preparing'?'👨‍🍳 قيد التحضير':'✅ جاهز'}</div>
                </div>
                <div style="text-align:left;">
                    <div style="font-weight:900; font-size:1.6rem; color:var(--primary);">${o.total} ج.م</div>
                    <div style="font-size:0.8rem; opacity:0.6; margin-top:5px;"><i class="fa-solid fa-clock"></i> <span class="order-timer" data-start="${o.timestamp}">--:--</span></div>
                </div>
            </div>
            <div style="padding:1.5rem; flex-grow:1;">
                ${o.items.map(i => `<div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:5px;"><span>${i.name}</span><span style="font-weight:900; color:var(--primary);">x${i.qty}</span></div>`).join('')}
            </div>
            <div style="padding:1.2rem; background:rgba(0,0,0,0.2);">
                <button onclick="window.finalizeTable('${o.id}')" class="btn-luxury" style="width:100%; background:var(--primary); color:#000; font-weight:900; padding:15px; border-radius:15px;">إخلاء وتحصيل الطاولة 🧾</button>
            </div>
        </div>
    `;
}

function renderExpenses(c) {
    const expenses = window.state.data.expenses || [];
    c.innerHTML = `
        <div class="view-container" style="padding:1rem; height:calc(100vh - 4.5rem); display:flex; flex-direction:column; overflow:hidden;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <h1 style="font-weight:900; margin:0; font-size:1.8rem; color:var(--primary);"><i class="fa-solid fa-receipt"></i> المصروفات</h1>
                <div style="background:rgba(255,255,255,0.05); padding:8px 15px; border-radius:10px; font-weight:900; border:1px solid rgba(255,255,255,0.1);">إجمالي اليوم: <span style="color:var(--primary);">${expenses.reduce((s,e)=>s+(parseFloat(e.amount)||0),0)} ج.م</span></div>
            </div>
            <div class="glass-panel" style="padding:1rem; margin-bottom:1rem; border-radius:15px; border:1px solid rgba(251,191,36,0.2);">
                <div style="display:grid; grid-template-columns: 1fr 1.5fr 120px 180px; gap:12px; align-items:end;">
                    <div style="display:flex; flex-direction:column; gap:5px;"><label style="font-size:0.75rem; opacity:0.6;">الاسم</label><input type="text" id="exp-name" placeholder="مثلاً: كهرباء" style="padding:10px; background:rgba(0,0,0,0.3); color:#fff; border-radius:10px; border:1px solid rgba(255,255,255,0.1); outline:none;"></div>
                    <div style="display:flex; flex-direction:column; gap:5px;"><label style="font-size:0.75rem; opacity:0.6;">البيان</label><input type="text" id="exp-desc" placeholder="وصف سريع..." style="padding:10px; background:rgba(0,0,0,0.3); color:#fff; border-radius:10px; border:1px solid rgba(255,255,255,0.1); outline:none;"></div>
                    <div style="display:flex; flex-direction:column; gap:5px;"><label style="font-size:0.75rem; opacity:0.6;">المبلغ</label><input type="number" id="exp-amount" placeholder="0" style="padding:10px; background:rgba(0,0,0,0.3); color:var(--primary); font-weight:900; border-radius:10px; border:1px solid rgba(255,255,255,0.1); outline:none;"></div>
                    <button onclick="window.saveExpense()" class="btn-luxury" style="padding:10px; background:var(--primary); color:#000; font-weight:900; border-radius:10px; height:42px;">حفظ وتوثيق ✔</button>
                </div>
            </div>
            <div class="glass-panel" style="flex:1; padding:0; overflow-y:auto; border-radius:15px; border:1px solid rgba(255,255,255,0.05); background:rgba(0,0,0,0.2);">
                <table style="width:100%; text-align:right; border-collapse:collapse;">
                    <thead style="background:rgba(0,0,0,0.5); position:sticky; top:0; z-index:10;">
                        <tr><th style="padding:1rem;">اسم المصروف</th><th>البيان</th><th>المبلغ</th><th>التاريخ</th><th>الوقت</th></tr>
                    </thead>
                    <tbody>
                        ${expenses.map(e => {
                            const d = e.timestamp ? new Date(e.timestamp) : null;
                            return `<tr style="border-bottom:1px solid rgba(255,255,255,0.03);"><td style="padding:1rem; font-weight:900; color:var(--accent);">${e.name||'غير معروف'}</td><td>${e.details||'-'}</td><td style="font-weight:900; color:var(--primary);">${e.amount||0} ج.م</td><td>${d?d.toLocaleDateString('ar-EG'):'سابق'}</td><td>${d?d.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'}):'--:--'}</td></tr>`;
                        }).reverse().join('') || '<tr><td colspan="5" style="padding:3rem; text-align:center; opacity:0.3;">سجل فارغ</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderInventory(c) {
    if (!window.state.invCategory) window.state.invCategory = 'الكل';
    const menu = window.state.data.menu.filter(m => window.state.invCategory === 'الكل' || m.category === window.state.invCategory);
    const lowStockCount = window.state.data.menu.filter(m => m.stock < 5).length;
    c.innerHTML = `
        <div class="view-container" style="padding:1.5rem; overflow-y:auto; height:calc(100vh - 4.5rem);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
                <div>
                    <h1 style="font-weight:900; margin:0; color:var(--primary);"><i class="fa-solid fa-boxes-stacked"></i> إدارة المخزون</h1>
                    <div style="font-size:0.85rem; opacity:0.5; margin-top:5px;">إجمالي الأصناف: ${menu.length} ${lowStockCount > 0 ? `| <span style="color:var(--danger);">⚠️ ${lowStockCount} أصناف تحت الحد الأدنى</span>` : ''}</div>
                </div>
                <button onclick="window.showAddItemModal()" 
                    style="background:var(--primary); color:#000; border:none; padding:14px 24px; border-radius:15px; font-weight:900; font-size:1rem; cursor:pointer; font-family:'Cairo'; display:flex; align-items:center; gap:10px; box-shadow:0 8px 25px rgba(245,158,11,0.3); transition:0.3s;"
                    onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fa-solid fa-plus"></i> إضافة صنف جديد
                </button>
            </div>
            
            <div style="display:flex; gap:10px; overflow-x:auto; margin-bottom:2rem; padding-bottom:5px;">
                ${['الكل', 'طواجن', 'مشويات', 'مقبلات', 'مشروبات'].map(cat => `<button onclick="window.filterInventory('${cat}')" class="btn-luxury" style="background:${window.state.invCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)'}; color:${window.state.invCategory === cat ? '#000' : '#fff'}; border:none; padding:12px 22px; border-radius:12px; font-weight:900;">${cat}</button>`).join('')}
            </div>

            <div class="glass-panel" style="padding:0; overflow:hidden; border-radius:20px; border:1px solid rgba(255,255,255,0.05);">
                <table style="width:100%; text-align:right; border-collapse:collapse; font-size:1.1rem;">
                    <thead style="background:rgba(0,0,0,0.4); border-bottom:2px solid rgba(255,255,255,0.1);">
                        <tr>
                            <th style="padding:1.5rem;">الصنف</th>
                            <th>القسم</th>
                            <th style="text-align:center;">الرصيد الحالى</th>
                            <th style="text-align:center;">تحديث المخزون</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${menu.map(m => `
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.03); transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                                <td style="padding:1.2rem; font-weight:900; color:var(--accent);">${m.name || 'صنف مجهول'}</td>
                                <td style="opacity:0.7; font-size:0.9rem;">${m.category || 'عام'}</td>
                                <td style="text-align:center; font-weight:900; font-size:1.5rem; color:${m.stock < 5 ? 'var(--danger)' : 'var(--success)'}">${m.stock || 0}</td>
                                <td style="text-align:center;">
                                    <div style="display:inline-flex; gap:10px; align-items:center; background:rgba(0,0,0,0.2); padding:5px; border-radius:12px;">
                                        <input type="number" id="stk-${m.id}" placeholder="0" style="width:70px; padding:10px; background:transparent; border:none; color:#fff; text-align:center; outline:none; font-weight:900;">
                                        <button onclick="window.saveManualStock(${m.id})" class="btn-luxury" style="padding:10px 15px; font-size:0.9rem;">إضافة +</button>
                                    </div>
                                </td>
                            </tr>`).join('') || '<tr><td colspan="4" style="padding:5rem; text-align:center; opacity:0.3;">لا توجد أصناف في هذا القسم</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderTables(c) {
    const role = window.state.role;
    const tablesToShow = window.state.data.tables.filter(t => role === 'waiter' ? (t.id >= 1 && t.id <= 4) : true);
    c.innerHTML = `
        <div class="view-container" style="padding:1.5rem;">
            <h1 style="font-weight:900; margin-bottom:2rem; color:var(--primary);">خريطة الطاولات 🪑</h1>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px,1fr)); gap:2rem;">
                ${tablesToShow.map(t => `
                    <div class="glass-panel" style="text-align:center; padding:2.5rem; border-bottom:10px solid ${t.status==='occupied'?'var(--danger)':'var(--success)'}; border-radius:25px;">
                        <div style="font-size:4rem; margin-bottom:15px;">${t.status==='occupied'?'🍽️':'✨'}</div>
                        <h2 style="margin:0; font-weight:900;">طاولة ${t.number}</h2>
                        <div style="margin-top:10px; font-weight:bold; color:${t.status==='occupied'?'var(--danger)':'var(--success)'}">${t.status==='occupied'?'مشغولة':'متاحة'}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.renderKitchen = (c) => { 
    const all = window.state.data.orders || [];
    const preparing = all.filter(o => o.status === 'preparing');
    const ready = all.filter(o => o.status === 'ready');
    c.innerHTML = `
        <div class="view-container" style="padding:1rem; height:calc(100vh - 4.5rem); display:flex; flex-direction:column; overflow:hidden; background:rgba(0,0,0,0.2);">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; flex:1; overflow:hidden;">
                <div class="glass-panel" style="display:flex; flex-direction:column; border:2px solid var(--primary); background:rgba(0,0,0,0.5); padding:1rem; overflow:hidden; border-radius:25px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--primary); padding-bottom:15px; margin-bottom:1rem;">
                        <h2 style="margin:0; font-weight:900; color:var(--primary); font-size:2rem;"><i class="fa-solid fa-fire-burner"></i> قيد التجهيز (${preparing.length})</h2>
                    </div>
                    <div style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:1.5rem; padding:10px;">
                        ${preparing.map(o => `
                            <div style="background:#fff; color:#000; border-radius:20px; overflow:hidden; box-shadow:0 15px 40px rgba(0,0,0,0.5); animation: slideIn 0.3s ease;">
                                <div style="background:#000; color:var(--primary); padding:15px 25px; display:flex; justify-content:space-between; align-items:center;">
                                    <span style="font-weight:900; font-size:1.8rem;">#${o.id.split('-')[1]}</span>
                                    <span style="background:var(--primary); color:#000; padding:4px 15px; border-radius:12px; font-weight:900; font-size:1rem;">${o.type==='salla'?'طاولة '+o.tableNumber:'خارجي'}</span>
                                </div>
                                <div style="padding:1.5rem;">
                                    ${o.items.map(i => `<div style="display:flex; justify-content:space-between; border-bottom:2px solid #f0f0f0; padding:10px 0; font-size:1.5rem; font-weight:900;"><span>${i.name}</span><span style="background:#000; color:#fff; padding:0 12px; border-radius:8px;">x${i.qty}</span></div>`).join('')}
                                    <button onclick="window.updateOrderStatus('${o.id}','ready')" style="width:100%; padding:20px; background:#000; color:var(--primary); border:none; border-radius:15px; font-weight:900; font-size:1.6rem; cursor:pointer; margin-top:1rem;">تم التجهيز ✔</button>
                                </div>
                            </div>
                        `).join('') || '<div style="opacity:0.3; padding:5rem; text-align:center;">بانتظار طلبات...</div>'}
                    </div>
                </div>
                <div class="glass-panel" style="display:flex; flex-direction:column; border:2px solid var(--success); background:rgba(34,197,94,0.05); padding:1rem; overflow:hidden; border-radius:25px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--success); padding-bottom:15px; margin-bottom:1rem;">
                        <h2 style="margin:0; font-weight:900; color:var(--success); font-size:2rem;"><i class="fa-solid fa-bell"></i> جاهز للاستلام (${ready.length})</h2>
                    </div>
                    <div style="flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:1.5rem; padding:10px;">
                        ${ready.map(o => `
                            <div style="background:rgba(34,197,94,0.1); border:3px solid var(--success); border-radius:20px; overflow:hidden;">
                                <div style="background:var(--success); color:#fff; padding:15px 25px; display:flex; justify-content:space-between; align-items:center;">
                                    <span style="font-weight:900; font-size:1.8rem;">#${o.id.split('-')[1]}</span>
                                    <span style="font-weight:900; font-size:1.1rem;">${o.tableNumber?'طاولة '+o.tableNumber:'خارجي'}</span>
                                </div>
                                <div style="padding:1.5rem; text-align:center;">
                                    <button onclick="window.updateOrderStatus('${o.id}','completed')" style="width:100%; padding:18px; background:var(--success); color:#fff; border:none; border-radius:15px; font-weight:900; font-size:1.5rem; cursor:pointer;">تم التسليم (إخفاء) ✔</button>
                                </div>
                            </div>
                        `).join('') || '<div style="opacity:0.2; padding:5rem; text-align:center;">لا يوجد طلبات جاهزة</div>'}
                    </div>
                </div>
            </div>
        </div>
    `;
};

// 4. ACTIONS
window.confirmOrder = async () => {
    const shift = window.state.data.activeShift;
    if(!shift) return alert("⚠️ يجب بدء الوردية أولاً من لوحة المتابعة!");
    if(window.state.cart.length === 0) return;

    let tableId = null, tableNumber = null;
    if(window.state.activeOrderType === 'salla') {
        tableId = document.getElementById('table-select').value;
        if(!tableId) { alert("يجب اختيار الطاولة!"); return; }
        const t = window.state.data.tables.find(x=>x.id==tableId);
        if(t) { t.status = 'occupied'; tableNumber = t.number; }
    }

    const order = { 
        id: "F-"+Date.now().toString().slice(-4), 
        type: window.state.activeOrderType, 
        tableId, 
        tableNumber, 
        items: [...window.state.cart], 
        total: window.state.cart.reduce((s,i)=>s+(i.price*i.qty),0), 
        status: 'preparing', 
        timestamp: Date.now(), 
        source: window.state.role,
        shiftId: shift.id 
    };

    window.state.cart.forEach(c => { 
        const m = window.state.data.menu.find(x=>x.id===c.id); 
        if(m) m.stock -= c.qty; 
    });

    window.state.data.orders.unshift(order);
    try { window.printSingleKitchenOrder(order); } catch(err) { console.error(err); }
    await sync();
    window.state.cart = [];
    window.renderCurrentPage();
    alert("✅ تم إرسال الطلب للمطبخ!");
};

window.endShift = async () => {
    const shift = window.state.data.activeShift;
    if (!shift) return;

    if (!confirm("هل أنت متأكد من إنهاء الوردية الحالية؟")) return;

    // Calculate final stats
    const allOrders = window.state.data.orders || [];
    const shiftOrders = allOrders.filter(o => o.shiftId === shift.id);
    const salesTotal = shiftOrders.reduce((s,o)=>s+o.total, 0);
    const expensesTotal = (window.state.data.expenses || []).filter(e => e.shiftId === shift.id).reduce((s,e)=>s+e.amount, 0);

    shift.endTime = Date.now();
    shift.totalSales = salesTotal;
    shift.totalExpenses = expensesTotal;
    shift.status = 'closed';

    // Move to shifts history
    window.state.data.shifts.unshift(shift);
    window.state.data.activeShift = null;

    await sync();
    alert("✅ تم إغلاق الوردية وأرشفتها بنجاح");
};

window.cancelOrder = async (id) => {
    if (!confirm("هل أنت متأكد من إلغاء هذا الطلب؟")) return;
    const o = window.state.data.orders.find(x=>x.id===id);
    if (o) {
        // Return stock
        o.items.forEach(c => {
            const m = window.state.data.menu.find(x=>x.id===c.id);
            if (m) m.stock += c.qty;
        });
        
        // Free table
        if (o.tableId) {
            const t = window.state.data.tables.find(x=>x.id==o.tableId);
            if (t) t.status = 'available';
        }

        // Filter out order
        window.state.data.orders = window.state.data.orders.filter(x=>x.id!==id);
        await sync();
        alert("🗑️ تم إلغاء الطلب");
    }
};

window.saveExpense = async () => {
    const shift = window.state.data.activeShift;
    if(!shift) return alert("⚠️ يجب بدء الوردية أولاً لتسجيل المصروفات!");

    const name = document.getElementById('exp-name').value;
    const details = document.getElementById('exp-desc').value;
    const amount = parseFloat(document.getElementById('exp-amount').value);

    if(!name || isNaN(amount)) { alert("يرجى إدخال البيانات!"); return; }

    window.state.data.expenses.push({ 
        id: Date.now(), 
        name, 
        details, 
        amount, 
        timestamp: Date.now(),
        shiftId: shift.id 
    });

    await sync();
    document.getElementById('exp-name').value = ''; 
    document.getElementById('exp-desc').value = ''; 
    document.getElementById('exp-amount').value = '';
    alert("✅ تم تسجيل المصروف بنجاح");
};

window.addToCart = (id) => {
    const m = window.state.data.menu.find(x=>x.id===id);
    if(m && m.stock > 0) {
        const c = window.state.cart.find(x=>x.id===id);
        if(c) { if(c.qty < m.stock) c.qty++; }
        else window.state.cart.push({...m, qty: 1});
        window.renderCurrentPage();
    } else alert("غير متوفر في المخزن!");
};

window.updateQty = (idx, delta) => {
    const item = window.state.cart[idx];
    if(item) {
        item.qty += delta;
        if(item.qty <= 0) window.state.cart.splice(idx, 1);
        window.renderCurrentPage();
    }
};

window.finalizeTable = async (id) => {
    const o = window.state.data.orders.find(x=>x.id===id);
    if(o && confirm("تحصيل وإخلاء الطاولة؟")) {
        if(o.tableId) { const t = window.state.data.tables.find(x=>x.id==o.tableId); if(t) t.status = 'available'; }
        o.status = 'completed';
        o.completedTime = Date.now();
        await sync();
        
        // Print receipt for cashier/manager
        if (window.state.role === 'cashier' || window.state.role === 'manager') {
            window.printReceipt(o);
        }
    }
};

window.printReceipt = async (order) => {
    try {
        const response = await fetch('/api/print-receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        const result = await response.json();
        if (result.success) {
            console.log("Silent receipt print succeeded");
            return;
        }
    } catch (e) {
        console.warn("Silent receipt printing failed, falling back to browser print:", e);
    }

    const printWindow = window.open('', '_blank', 'width=350,height=600');
    if (!printWindow) return alert("يرجى السماح بالنوافذ المنبثقة للطباعة");
    
    const itemsHtml = order.items.map(i => `
        <div style="display:flex; justify-content:space-between; margin:5px 0; border-bottom:1px dashed #eee; padding-bottom:5px;">
            <span style="flex:1;">${i.name}</span>
            <span style="width:40px; text-align:center;">x${i.qty}</span>
            <span style="width:70px; text-align:left;">${i.price * i.qty} ج.م</span>
        </div>
    `).join('');

    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>فاتورة #${order.id}</title>
            <style>
                @font-face { font-family: 'Cairo'; font-weight: 400; src: url('css/fonts/Cairo-400.ttf') format('truetype'); }
                @font-face { font-family: 'Cairo'; font-weight: 700; src: url('css/fonts/Cairo-700.ttf') format('truetype'); }
                body { font-family: 'Cairo', sans-serif; padding: 10px; color: #333; line-height: 1.6; text-align:right; font-size: 12px; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
                .total { font-size: 1.4rem; font-weight: bold; text-align: center; margin-top: 15px; border-top: 2px solid #000; padding-top: 10px; }
                .footer { text-align: center; margin-top: 20px; font-size: 0.7rem; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
            </style>
        </head>
        <body onload="window.print(); setTimeout(()=>window.close(), 500)">
            <div class="header">
                <h1 style="margin:0; font-size:1.8rem;">طواجن فوش</h1>
                <p style="margin:5px 0;">تاريخ: ${new Date(order.timestamp).toLocaleString('ar-EG')}</p>
                <div style="font-weight:bold; font-size:1.1rem; margin-top:5px;">طلب #${order.id} | ${order.type==='dine-in'?'طاولة '+order.tableNumber:order.type}</div>
            </div>
            <div class="items">${itemsHtml}</div>
            <div class="total">الإجمالي: ${order.total} ج.م</div>
            <div class="footer">شكراً لزيارتكم! نرجو أن تنال خدمتنا إعجابكم.</div>
        </body>
        </html>
    `);
    printWindow.document.close();
};


window.printSingleKitchenOrder = async (order) => {
    if (window.isLocalServer) {
        try {
            const response = await fetch('/api/print-kitchen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            const result = await response.json();
            if (result.success) {
                console.log("Silent kitchen order print succeeded");
                return;
            } else {
                console.warn("Silent kitchen printing failed on server:", result.error);
                if (typeof window.showToast === 'function') window.showToast("⚠️ لم يتم طباعة بون المطبخ تلقائياً. تحقق من الطابعة.", "warning");
                return;
            }
        } catch (e) {
            console.warn("Silent kitchen printing failed:", e);
            if (typeof window.showToast === 'function') window.showToast("⚠️ فشل الاتصال بالطابعة التلقائية للمطبخ.", "warning");
            return;
        }
    }

    const printWindow = window.open('', '_blank', 'width=350,height=600');
    if (!printWindow) return alert("يرجى السماح بالنوافذ المنبثقة لطباعة بون المطبخ");
    
    const itemsHtml = order.items.map(i => `
        <div style="display:flex; justify-content:space-between; margin:8px 0; border-bottom:1px dashed #000; padding-bottom:8px; font-size:1.4rem; font-weight:bold;">
            <span style="flex:1;">${i.name}</span>
            <span style="width:50px; text-align:center; font-size:1.6rem; border:2px solid #000; padding:2px; border-radius:5px;">x${i.qty}</span>
        </div>
    `).join('');

    const typeLabel = order.type === 'salla' ? 'طاولة: ' + (order.tableNumber || 'خارجي') : order.type === 'delivery' ? 'توصيل / دليفري' : 'تيك أواي / سفري';

    printWindow.document.write(`
        <html dir="rtl">
        <head>
            <title>بون المطبخ #${order.id}</title>
            <style>
                @font-face { font-family: 'Cairo'; font-weight: 400; src: url('css/fonts/Cairo-400.ttf') format('truetype'); }
                @font-face { font-family: 'Cairo'; font-weight: 700; src: url('css/fonts/Cairo-700.ttf') format('truetype'); }
                body { font-family: 'Cairo', sans-serif; padding: 15px; color: #000; line-height: 1.4; text-align:right; font-size: 13px; }
                .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px; }
                .footer { text-align: center; margin-top: 20px; font-size: 0.9rem; font-weight: bold; border-top: 1px dashed #000; padding-top: 10px; }
            </style>
        </head>
        <body onload="window.print(); setTimeout(()=>window.close(), 500)">
            <div class="header">
                <h1 style="margin:0; font-size:1.6rem; font-weight:900;">بون المطبخ 🥘</h1>
                <h2 style="font-size:2.2rem; margin:10px 0; font-weight:900;">#${order.id.includes('-') ? order.id.split('-')[1] : order.id}</h2>
                <div style="font-weight:bold; font-size:1.3rem; margin-top:5px;">${typeLabel}</div>
                <p style="margin:5px 0; font-size:0.85rem;">الوقت: ${new Date(order.timestamp || Date.now()).toLocaleTimeString('ar-EG')} | ${new Date(order.timestamp || Date.now()).toLocaleDateString('ar-EG')}</p>
            </div>
            <div class="items">${itemsHtml}</div>
            ${order.notes ? `<div style="margin-top:15px; padding:8px; border:2px solid #000; font-weight:bold; font-size:1.1rem; text-align:right;">ملاحظات: ${order.notes}</div>` : ''}
            <div class="footer">طواجن فؤش ابن سيد</div>
        </body>
        </html>
    `);
    printWindow.document.close();
};


window.updateOrderStatus = async (id, status) => {
    const o = window.state.data.orders.find(x=>x.id===id);
    if(o) { 
        o.status = status; 
        if(status === 'completed' || status === 'delivered') o.completedTime = Date.now();
        await sync(); 
    }
};



window.saveManualStock = async (id) => {
    const input = document.getElementById(`stk-${id}`);
    const val = parseInt(input.value);
    if(!isNaN(val)) {
        const m = window.state.data.menu.find(x=>x.id===id);
        if(m) { m.stock = (parseInt(m.stock)||0) + val; await sync(); input.value = ''; alert(`✅ تم تحديث ${m.name}`); }
    }
};

window.searchPOS = (v) => { window.state.posSearchQuery = v; window.renderCurrentPage(); };
window.filterCategory = (c) => { window.state.activeCategory = c; window.renderCurrentPage(); };
window.filterInventory = (c) => { window.state.invCategory = c; window.renderCurrentPage(); };
window.setOrderType = (t) => { window.state.activeOrderType = t; window.renderCurrentPage(); };
window.onRoleSelected = (r) => { 
    console.log("Role Selected:", r);
    localStorage.setItem('foush_role', r); 
    location.href = window.location.pathname; // Clear URL params and reload
};

window.resetSystem = () => {
    if(confirm("⚠️ هل أنت متأكد من مسح جميع البيانات وتصفير النظام؟")) {
        localStorage.clear();
        location.reload();
    }
};

window.logout = () => { 
    localStorage.removeItem('foush_role'); 
    localStorage.removeItem('foush_last_page');
    location.reload(); 
};

function getCatIcon(c) { const i={'طواجن':'🥘','مشويات':'🍖','مقبلات':'🥗','مشروبات':'🥤'}; return i[c]||'🍽️'; }

function updateTimers() {
    document.querySelectorAll('.order-timer').forEach(el => {
        const start = parseInt(el.dataset.start);
        const age = Math.floor((Date.now() - start) / 1000);
        const m = Math.floor(age / 60); const s = age % 60;
        el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        el.style.color = m >= 15 ? 'var(--danger)' : (m >= 10 ? 'var(--accent)' : 'var(--success)');
    });
}

window.renderSidebar = () => {
    try {
        const c = document.getElementById('side-nav-links');
        if(!c) return;
        const links = {
            waiter: [{id:'tables',label:'الصالة',icon:'chair'},{id:'pos',label:'طلب جديد',icon:'plus'}],
            kitchen: [{id:'kitchen',label:'إدارة الطلبات',icon:'desktop'}],
            cashier: [{id:'pos',label:'نقطة البيع',icon:'cash-register'},{id:'inventory',label:'المخزون',icon:'box'},{id:'dashboard',label:'متابعة الطلبات',icon:'desktop'},{id:'expenses',label:'مصروفات',icon:'money-bill-transfer'}],
            manager: [{id:'dashboard',label:'لوحة التحكم',icon:'chart-pie'},{id:'pos',label:'نقطة البيع',icon:'cash-register'},{id:'inventory',label:'المخزون',icon:'box'},{id:'expenses',label:'مصروفات',icon:'money-bill-transfer'}]
        };
        const role = window.state.role;
        console.log("Rendering sidebar for role:", role);
        c.innerHTML = (links[role]||[]).map(l => `<button class="sidebar-link ${window.state.currentPage===l.id?'active':''}" onclick="window.navigate('${l.id}')"><i class="fa-solid fa-${l.icon}"></i> <span>${l.label}</span></button>`).join('');
    } catch (e) {
        console.error("Sidebar Render Error:", e);
    }
};

window.boot = () => {
    console.log("Booting system...");
    const role = window.state.role;
    const appEl = document.getElementById('app');
    const roleScreenEl = document.getElementById('role-screen');

    if(role) {
        console.log("Role found:", role);
        if(appEl) appEl.style.display = 'grid';
        if(roleScreenEl) roleScreenEl.style.display = 'none';
        
        // Display role name
        const roleDisplay = document.getElementById('role-name-display');
        if(roleDisplay) {
            const roleNames = { manager: 'المدير العام', cashier: 'الكاشير', waiter: 'الويتر', kitchen: 'مدير المطبخ' };
            roleDisplay.textContent = roleNames[role] || role;
        }

        window.renderSidebar();
        
        // Final sanity check for navigation
        const lastPage = localStorage.getItem('foush_last_page');
        const defaultPage = role === 'kitchen' ? 'kitchen' : (role === 'manager' ? 'dashboard' : 'pos');
        window.navigate(lastPage || defaultPage);
        
        if(typeof CloudDB !== 'undefined') {
            CloudDB.onLive('menu', d => { if(d) { window.state.data.menu = d; window.renderCurrentPage(); } });
            CloudDB.onLive('orders', d => { if(d) { window.state.data.orders = d; window.renderCurrentPage(); } });
            CloudDB.onLive('tables', d => { if(d) { window.state.data.tables = d; window.renderCurrentPage(); } });
            CloudDB.onLive('expenses', d => { if(d) { window.state.data.expenses = d; window.renderCurrentPage(); } });
        }
    } else {
        console.log("No role found. Showing role selection screen.");
        if(appEl) appEl.style.display = 'none';
        if(roleScreenEl) roleScreenEl.style.display = 'flex';
    }
};

// Immediate Boot if possible
window.boot(); 

if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
    window.addEventListener('DOMContentLoaded', window.boot);
}

window.addEventListener('load', () => {
    console.log("Page fully loaded.");
        // Extra check to ensure boot ran
        const appEl = document.getElementById('app');
        if (window.state.role && appEl && appEl.style.display === 'none') {
            console.warn("Safety trigger: App was hidden but role exists. Booting again.");
            window.boot();
        }

        // Show Ready status
        const dot = document.getElementById('status-dot');
        const txt = document.getElementById('status-text');
        if(dot && txt) {
            dot.style.background = '#10b981';
            dot.style.boxShadow = '0 0 10px #10b981';
            txt.textContent = 'النظام جاهز (v10.7)';
            txt.style.opacity = '1';
        }
    });

// ============================================================
// MODAL SYSTEM - Add Item & Drilldown
// ============================================================

window.showAddItemModal = () => {
    const categories = [...new Set(window.state.data.menu.map(m => m.category))];
    const overlay = document.createElement('div');
    overlay.id = 'app-modal-overlay';
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px); animation:fadeIn 0.2s ease;';
    overlay.innerHTML = `
        <div style="background:#0f172a; border:1px solid rgba(251,191,36,0.2); border-radius:30px; padding:2.5rem; width:500px; max-width:90vw; box-shadow:0 50px 100px rgba(0,0,0,0.8); position:relative; animation:slideInUp 0.3s ease;">
            <button onclick="window.closeAppModal()" style="position:absolute; top:20px; left:20px; background:rgba(255,255,255,0.05); border:none; color:#fff; width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:1rem;">✕</button>
            <div style="text-align:center; margin-bottom:2rem;">
                <div style="width:70px; height:70px; background:rgba(245,158,11,0.15); border-radius:20px; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; border:2px solid rgba(245,158,11,0.3);">
                    <i class="fa-solid fa-box-open" style="font-size:1.8rem; color:var(--primary);"></i>
                </div>
                <h2 style="margin:0; font-weight:900; font-size:1.5rem;">إضافة صنف جديد للمخزن</h2>
                <p style="color:rgba(255,255,255,0.4); font-size:0.85rem; margin-top:8px;">أدخل تفاصيل الصنف الجديد بالكامل</p>
            </div>
            <div style="display:flex; flex-direction:column; gap:1rem;">
                <div>
                    <label style="display:block; font-size:0.8rem; color:rgba(255,255,255,0.5); margin-bottom:6px; font-weight:bold;">اسم الصنف *</label>
                    <input id="modal-item-name" type="text" placeholder="مثلاً: طاجن لحمة بالكريمة" style="width:100%; padding:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:#fff; font-family:'Cairo'; font-size:1rem; outline:none; box-sizing:border-box;">
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div>
                        <label style="display:block; font-size:0.8rem; color:rgba(255,255,255,0.5); margin-bottom:6px; font-weight:bold;">القسم *</label>
                        <select id="modal-item-cat" style="width:100%; padding:14px; background:#0a0f1e; border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:#fff; font-family:'Cairo'; font-size:0.95rem; outline:none;">
                            ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                            <option value="أخرى">أخرى</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; font-size:0.8rem; color:rgba(255,255,255,0.5); margin-bottom:6px; font-weight:bold;">سعر البيع (ج.م) *</label>
                        <input id="modal-item-price" type="number" placeholder="0" min="0" style="width:100%; padding:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:var(--primary); font-weight:900; font-family:'Cairo'; font-size:1rem; outline:none; box-sizing:border-box;">
                    </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                    <div>
                        <label style="display:block; font-size:0.8rem; color:rgba(255,255,255,0.5); margin-bottom:6px; font-weight:bold;">الرصيد الابتدائي</label>
                        <input id="modal-item-stock" type="number" placeholder="0" min="0" style="width:100%; padding:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:#fff; font-family:'Cairo'; font-size:1rem; outline:none; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.8rem; color:rgba(255,255,255,0.5); margin-bottom:6px; font-weight:bold;">حد التنبيه (أدنى)</label>
                        <input id="modal-item-min" type="number" placeholder="5" min="0" style="width:100%; padding:14px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:12px; color:#fff; font-family:'Cairo'; font-size:1rem; outline:none; box-sizing:border-box;">
                    </div>
                </div>
                <button onclick="window.saveNewItem()" 
                    style="width:100%; margin-top:0.5rem; padding:1.2rem; background:var(--primary); color:#000; border:none; border-radius:15px; font-weight:900; font-size:1.1rem; cursor:pointer; font-family:'Cairo'; box-shadow:0 8px 25px rgba(245,158,11,0.3); transition:0.3s;"
                    onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fa-solid fa-check"></i> حفظ الصنف الجديد
                </button>
            </div>
        </div>
    `;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) window.closeAppModal(); });
    document.body.appendChild(overlay);
    setTimeout(() => document.getElementById('modal-item-name')?.focus(), 100);
};

window.closeAppModal = () => {
    const overlay = document.getElementById('app-modal-overlay');
    if (overlay) overlay.remove();
};

window.saveNewItem = async () => {
    const name  = document.getElementById('modal-item-name')?.value?.trim();
    const cat   = document.getElementById('modal-item-cat')?.value;
    const price = parseFloat(document.getElementById('modal-item-price')?.value);
    const stock = parseInt(document.getElementById('modal-item-stock')?.value) || 0;
    const minStock = parseInt(document.getElementById('modal-item-min')?.value) || 5;

    if (!name || !cat || isNaN(price) || price <= 0) {
        const nameInput = document.getElementById('modal-item-name');
        const priceInput = document.getElementById('modal-item-price');
        if (nameInput) nameInput.style.borderColor = !name ? 'var(--danger)' : 'rgba(255,255,255,0.1)';
        if (priceInput) priceInput.style.borderColor = (isNaN(price)||price<=0) ? 'var(--danger)' : 'rgba(255,255,255,0.1)';
        return;
    }

    const newId = Math.max(...window.state.data.menu.map(m => m.id), 200) + 1;
    const newItem = { id: newId, name, category: cat, price, stock, minStock, available: true };
    window.state.data.menu.push(newItem);
    await sync();
    window.closeAppModal();
    window.showToast ? window.showToast(`✅ تم إضافة "${name}" للمخزن`, 'success') : alert(`✅ تم إضافة "${name}" بنجاح!`);
};

window.showDrillModal = (type) => {
    const shift = window.state.data.activeShift;
    const allOrders = window.state.data.orders || [];
    const shiftOrders = shift ? allOrders.filter(o => o.shiftId === shift.id) : [];
    const activeOrders = allOrders.filter(o => o.status !== 'completed' && o.status !== 'delivered');
    const expenses = (window.state.data.expenses || []).filter(e => shift && e.shiftId === shift.id);
    const lowStock = window.state.data.menu.filter(m => m.stock < 5);

    let title = '', content = '';

    if (type === 'active-orders') {
        title = `الطلبات النشطة حالياً (${activeOrders.length})`;
        content = activeOrders.length === 0
            ? '<div style="text-align:center; padding:3rem; opacity:0.3;"><i class="fa-solid fa-satellite-dish" style="font-size:3rem;"></i><p>لا توجد طلبات نشطة</p></div>'
            : activeOrders.map(o => `
                <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:15px; padding:1rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:900; color:var(--primary);">#${o.id}</div>
                        <div style="font-size:0.8rem; opacity:0.6; margin-top:3px;">${o.items.map(i=>i.name+' x'+i.qty).join(' | ')}</div>
                        <div style="font-size:0.75rem; margin-top:5px; color:${o.type==='salla'?'var(--accent)':'var(--success)'}">${o.type==='salla'?'🪑 صالة '+(o.tableNumber||''):(o.type==='delivery'?'🛵 دليفري':'🛍️ تيك واي')}</div>
                    </div>
                    <div style="text-align:left;">
                        <div style="font-weight:900; font-size:1.2rem; color:var(--primary);">${o.total} ج.م</div>
                        <div style="font-size:0.75rem; opacity:0.5; margin-top:3px; background:${o.status==='preparing'?'rgba(245,158,11,0.2)':'rgba(16,185,129,0.2)'}; padding:3px 10px; border-radius:10px; color:${o.status==='preparing'?'var(--primary)':'var(--success)'}">${o.status==='preparing'?'قيد التحضير':'جاهز'}</div>
                    </div>
                </div>`).join('');
    } else if (type === 'shift-orders') {
        title = `طلبات الوردية الحالية (${shiftOrders.length})`;
        const completedSales = shiftOrders.filter(o=>o.status==='completed'||o.status==='delivered').reduce((s,o)=>s+o.total,0);
        content = `<div style="background:rgba(99,102,241,0.1); border-radius:15px; padding:1rem; margin-bottom:1rem; display:flex; justify-content:space-between;">
            <span style="opacity:0.7;">إجمالي المبيعات المكتملة</span>
            <span style="font-weight:900; color:var(--accent); font-size:1.2rem;">${completedSales} ج.م</span>
        </div>` + (shiftOrders.length === 0
            ? '<div style="text-align:center; padding:3rem; opacity:0.3;"><i class="fa-solid fa-inbox" style="font-size:3rem;"></i><p>لا توجد طلبات في هذه الوردية</p></div>'
            : shiftOrders.map(o => `
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                        <span style="font-weight:900; color:var(--accent);">#${o.id}</span>
                        <span style="font-size:0.8rem; opacity:0.5; margin-right:10px;">${o.items.length} صنف</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-weight:900; color:var(--primary);">${o.total} ج.م</span>
                        <span style="font-size:0.75rem; padding:3px 10px; border-radius:10px; background:${o.status==='completed'||o.status==='delivered'?'rgba(16,185,129,0.15)':'rgba(245,158,11,0.15)'}; color:${o.status==='completed'||o.status==='delivered'?'var(--success)':'var(--primary)'}">${o.status==='completed'||o.status==='delivered'?'مكتمل':'جاري'}</span>
                    </div>
                </div>`).join(''));
    } else if (type === 'expenses') {
        title = `مصروفات الوردية (${expenses.length})`;
        const total = expenses.reduce((s,e)=>s+e.amount, 0);
        content = `<div style="background:rgba(239,68,68,0.1); border-radius:15px; padding:1rem; margin-bottom:1rem; display:flex; justify-content:space-between;">
            <span style="opacity:0.7;">الإجمالي</span>
            <span style="font-weight:900; color:var(--danger); font-size:1.2rem;">${total} ج.م</span>
        </div>` + (expenses.length === 0
            ? '<div style="text-align:center; padding:3rem; opacity:0.3;"><i class="fa-solid fa-receipt" style="font-size:3rem;"></i><p>لا توجد مصروفات في هذه الوردية</p></div>'
            : expenses.map(e => `
                <div style="background:rgba(255,255,255,0.03); border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                        <div style="font-weight:900;">${e.name || 'مصروف'}</div>
                        <div style="font-size:0.8rem; opacity:0.5;">${e.details || ''}</div>
                    </div>
                    <span style="font-weight:900; color:var(--danger);">${e.amount} ج.م</span>
                </div>`).join(''));
    } else if (type === 'low-stock') {
        title = `أصناف تحت الحد الأدنى (${lowStock.length})`;
        content = lowStock.length === 0
            ? '<div style="text-align:center; padding:3rem; opacity:0.3;"><i class="fa-solid fa-check-circle" style="font-size:3rem; color:var(--success);"></i><p>المخزن بحالة ممتازة!</p></div>'
            : lowStock.map(m => `
                <div style="background:rgba(239,68,68,0.07); border:1px solid rgba(239,68,68,0.2); border-radius:12px; padding:14px; display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                        <div style="font-weight:900;">${m.name}</div>
                        <div style="font-size:0.8rem; opacity:0.5;">${m.category}</div>
                    </div>
                    <div style="text-align:left;">
                        <div style="font-size:1.5rem; font-weight:900; color:${m.stock===0?'var(--danger)':'var(--primary)'}">${m.stock}</div>
                        <div style="font-size:0.7rem; opacity:0.5;">متبقي</div>
                    </div>
                </div>`).join('');
    }

    const overlay = document.createElement('div');
    overlay.id = 'app-modal-overlay';
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px);';
    overlay.innerHTML = `
        <div style="background:#0f172a; border:1px solid rgba(255,255,255,0.1); border-radius:25px; padding:2rem; width:560px; max-width:90vw; max-height:80vh; overflow-y:auto; box-shadow:0 50px 100px rgba(0,0,0,0.8); position:relative;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid rgba(255,255,255,0.07); padding-bottom:1rem;">
                <h3 style="margin:0; font-weight:900; font-size:1.2rem;">${title}</h3>
                <button onclick="window.closeAppModal()" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:1rem;">✕</button>
            </div>
            <div>${content}</div>
        </div>
    `;
    overlay.addEventListener('click', e => { if (e.target === overlay) window.closeAppModal(); });
    document.body.appendChild(overlay);
};

setInterval(() => {
    try {
        const c = document.getElementById('digital-clock');
        if(c) c.textContent = new Date().toLocaleTimeString('ar-EG');
    } catch (e) {
        const c = document.getElementById('digital-clock');
        if(c) c.textContent = new Date().toLocaleTimeString();
    }
    if(window.state && window.state.currentPage === 'dashboard') {
        try { updateTimers(); } catch(e) {}
    }
}, 1000);
