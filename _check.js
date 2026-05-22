
        const firebaseConfig = { apiKey: "AIzaSyCLUuixSAwBVGAIRqTbwC_QzwS-wknOEuc", authDomain: "tawajen-foush.firebaseapp.com", databaseURL: "https://tawajen-foush-default-rtdb.firebaseio.com", projectId: "tawajen-foush", storageBucket: "tawajen-foush.firebasestorage.app", messagingSenderId: "821143454397", appId: "1:821143454397:web:fab79978563ad46a1f2dd4", measurementId: "G-V04VKH29XW" };
        let database = null; try { if (typeof firebase !== 'undefined') { firebase.initializeApp(firebaseConfig); database = firebase.database(); } } catch (e) { }

        const DEFAULT_MENU = [{ id: 1, name: 'Ø·Ø§Ø¬Ù† Ù„Ø­Ù…', price: 250, category: 'Ø·ÙˆØ§Ø¬Ù†', stock: 100 }, { id: 2, name: 'Ø£Ø±Ø² Ø¨Ø§Ù„Ø´Ø¹ÙŠØ±ÙŠØ©', price: 40, category: 'Ø£Ø±Ø² ÙˆÙØªØ©', stock: 100, unlimited: true }, { id: 3, name: 'Ø´ÙˆØ±Ø¨Ø© Ø·ÙˆØ§Ø¬Ù†', price: 60, category: 'Ø´ÙˆØ±Ø¨Ø©', stock: 100 }];
        function safeGet(k, d) { try { const v = localStorage.getItem(k); return (v && v !== 'undefined') ? JSON.parse(v) : d; } catch (e) { return d; } }

        window.state = {
            role: sessionStorage.getItem('foush_role'), page: sessionStorage.getItem('foush_last_page') || 'pos',
            db: { menu: safeGet('f_menu', DEFAULT_MENU), orders: safeGet('f_orders', []), exp: safeGet('f_exp', []), shift: safeGet('f_shift', null), tables: safeGet('f_tables', []), shifts_history: safeGet('f_history', []), stock_history: safeGet('f_stock_history', []), employees: safeGet('f_employees', []), attendance: safeGet('f_attendance', []), main_inventory: safeGet('f_main_inventory', []), frequent_expenses: safeGet('f_frequent_expenses', []), waste_log: safeGet('f_waste_log', []) },
            cart: [], cat: 'Ø§Ù„ÙƒÙ„', invCat: 'Ø§Ù„ÙƒÙ„', type: 'takeaway', selectedTable: 'Ø®Ø§Ø±Ø¬ÙŠ', tempOrder: null, selectedItemId: null, editingTableId: null, custName: '', custPhone: ''
        };

        window.playSound = (type) => { try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); if (type === 'kitchen-alert') { for (let i = 0; i < 15; i++) { const t = i * 0.3; const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sawtooth'; osc.frequency.setValueAtTime(i % 2 === 0 ? 600 : 800, ctx.currentTime + t); gain.gain.setValueAtTime(1, ctx.currentTime + t); gain.gain.setTargetAtTime(0, ctx.currentTime + t + 0.25, 0.02); osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.3); } } else if (type === 'bell') { [880, 1100, 1320].forEach((f, i) => { const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'; osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.15); gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.4); osc.start(ctx.currentTime + i * 0.15); osc.stop(ctx.currentTime + i * 0.15 + 0.4); }); } else { const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine'; if (type === 'success') { osc.frequency.setValueAtTime(880, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1); gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); } else { osc.frequency.setValueAtTime(440, ctx.currentTime); gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); } osc.start(); osc.stop(ctx.currentTime + 0.5); } } catch (e) { } };

        window.save = () => {
            try {
                if (!window.state.db.employees) window.state.db.employees = [];
                if (!window.state.db.attendance) window.state.db.attendance = [];
                if (!window.state.db.menu) window.state.db.menu = [];
                if (!window.state.db.orders) window.state.db.orders = [];
                if (!window.state.db.exp) window.state.db.exp = [];
                if (!window.state.db.tables) window.state.db.tables = [];
                if (!window.state.db.shifts_history) window.state.db.shifts_history = [];
                if (!window.state.db.stock_history) window.state.db.stock_history = [];
                if (!window.state.db.main_inventory) window.state.db.main_inventory = [];
                if (!window.state.db.frequent_expenses) window.state.db.frequent_expenses = [];
                if (!window.state.db.waste_log) window.state.db.waste_log = [];

                localStorage.setItem('f_menu', JSON.stringify(window.state.db.menu));
                localStorage.setItem('f_orders', JSON.stringify(window.state.db.orders));
                localStorage.setItem('f_exp', JSON.stringify(window.state.db.exp));
                localStorage.setItem('f_shift', JSON.stringify(window.state.db.shift));
                localStorage.setItem('f_tables', JSON.stringify(window.state.db.tables));
                localStorage.setItem('f_history', JSON.stringify(window.state.db.shifts_history));
                localStorage.setItem('f_stock_history', JSON.stringify(window.state.db.stock_history));
                localStorage.setItem('f_employees', JSON.stringify(window.state.db.employees));
                localStorage.setItem('f_attendance', JSON.stringify(window.state.db.attendance));
                localStorage.setItem('f_main_inventory', JSON.stringify(window.state.db.main_inventory));
                localStorage.setItem('f_frequent_expenses', JSON.stringify(window.state.db.frequent_expenses));
                localStorage.setItem('f_waste_log', JSON.stringify(window.state.db.waste_log));
                if (database) { const safeDb = JSON.parse(JSON.stringify(window.state.db)); database.ref('foush').set(safeDb).catch(e => console.error("Firebase save error:", e)); }
                window.render();
            } catch (e) { console.error("Critical Save Error", e); window.render(); }
        };

        window.login = (role) => {
            window.state.tempLoginRole = role;
            const modal = document.getElementById('pin-login-modal');
            const icon = document.getElementById('pin-login-icon');
            const title = document.getElementById('pin-login-title');
            const subtitle = document.getElementById('pin-login-subtitle');
            const input = document.getElementById('pin-login-input');
            const error = document.getElementById('pin-login-error');

            input.value = '';
            error.textContent = '';

            if (role === 'manager') {
                title.textContent = "Ø¯Ø®ÙˆÙ„ Ø§Ù„Ù…Ø§Ù„Ùƒ ÙÙˆØ´ ðŸ‘‘";
                icon.className = "fa-solid fa-crown";
                icon.style.color = "var(--primary)";
                subtitle.textContent = "ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ù„ÙƒÙˆØ¯ Ø§Ù„Ø³Ø±ÙŠ Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø©";
            } else if (role === 'admin') {
                title.textContent = "Ø¯Ø®ÙˆÙ„ Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© ðŸ’¼";
                icon.className = "fa-solid fa-user-tie";
                icon.style.color = "#06b6d4";
                subtitle.textContent = "ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ ÙƒÙˆØ¯ Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø³Ø±ÙŠ Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø©";
            } else if (role === 'cashier') {
                title.textContent = "Ø¯Ø®ÙˆÙ„ Ø§Ù„ÙƒØ§Ø´ÙŠØ± ðŸ’°";
                icon.className = "fa-solid fa-cash-register";
                icon.style.color = "var(--primary)";
                subtitle.textContent = "ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø±Ù…Ø² ÙƒÙˆØ¯ Ø§Ù„Ø¨ØµÙ…Ø© Ø§Ù„Ø³Ø±ÙŠ Ù„Ù„ÙƒØ§Ø´ÙŠØ±";
            } else if (role === 'waiter') {
                title.textContent = "Ø¯Ø®ÙˆÙ„ Ø§Ù„ÙˆÙŠØªØ± ðŸ¤µ";
                icon.className = "fa-solid fa-bell-concierge";
                icon.style.color = "#a855f7";
                subtitle.textContent = "ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø±Ù…Ø² ÙƒÙˆØ¯ Ø§Ù„Ø¨ØµÙ…Ø© Ø§Ù„Ø³Ø±ÙŠ Ù„Ù„ÙˆÙŠØªØ±";
            } else if (role === 'kitchen') {
                title.textContent = "Ø¯Ø®ÙˆÙ„ Ø§Ù„Ù…Ø·Ø¨Ø® ðŸ”¥";
                icon.className = "fa-solid fa-fire-burner";
                icon.style.color = "var(--danger)";
                subtitle.textContent = "ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø±Ù…Ø² ÙƒÙˆØ¯ Ø§Ù„Ø¨ØµÙ…Ø© Ø§Ù„Ø³Ø±ÙŠ Ù„Ù„Ù…Ø·Ø¨Ø®";
            }

            modal.style.display = 'flex';
            setTimeout(() => input.focus(), 100);
        };

        window.closePinLogin = () => {
            document.getElementById('pin-login-modal').style.display = 'none';
        };

        window.submitPinLogin = () => {
            const pin = document.getElementById('pin-login-input').value;
            const error = document.getElementById('pin-login-error');
            const role = window.state.tempLoginRole;

            if (!pin) return;

            // Manager password check: '123' bypass or database manager PIN
            if (role === 'manager' && pin === '123') {
                sessionStorage.setItem('foush_role', 'manager');
                sessionStorage.setItem('foush_emp_name', 'Ø§Ù„Ù…Ø§Ù„Ùƒ ÙØ¤Ø´');
                window.state.role = 'manager';
                window.state.page = 'manager_home';
                sessionStorage.setItem('foush_last_page', 'manager_home');

                error.style.color = 'var(--success)';
                error.textContent = "ØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ù‡ÙˆÙŠØ© Ø§Ù„Ù…Ø§Ù„Ùƒ ðŸ‘‘";
                window.playSound('success');

                setTimeout(() => {
                    window.closePinLogin();
                    window.boot();
                }, 1200);
                return;
            }

            if (role === 'admin' && pin === '456') {
                sessionStorage.setItem('foush_role', 'admin');
                sessionStorage.setItem('foush_emp_name', 'Ø§Ù„Ù…Ø¯ÙŠØ± Ø§Ù„Ø¹Ø§Ù…');
                window.state.role = 'admin';
                window.state.page = 'admin_home';
                sessionStorage.setItem('foush_last_page', 'admin_home');

                error.style.color = 'var(--success)';
                error.textContent = "ØªÙ… Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Ù‡ÙˆÙŠØ© Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© ðŸ’¼";
                window.playSound('success');

                setTimeout(() => {
                    window.closePinLogin();
                    window.boot();
                }, 1200);
                return;
            }

            // Find employee by PIN
            const emp = (window.state.db.employees || []).find(e => e.pin === pin);

            if (!emp) {
                error.textContent = "ÙƒÙˆØ¯ Ø§Ù„Ø¨ØµÙ…Ø© Ø§Ù„Ø³Ø±ÙŠ ØºÙŠØ± ØµØ­ÙŠØ­! âŒ";
                window.playSound('error');
                return;
            }

            // Validate role matches
            if (emp.role !== role && role !== 'manager' && role !== 'admin') {
                const roleLabels = { waiter: 'ÙˆÙŠØªØ±ðŸ¤µ', cashier: 'ÙƒØ§Ø´ÙŠØ±ðŸ’°', kitchen: 'Ø·Ø¨Ø§Ø®ðŸ”¥', manager: 'Ø§Ù„Ù…Ø§Ù„ÙƒðŸ‘‘', admin: 'Ø¥Ø¯Ø§Ø±Ø©ðŸ’¼' };
                error.textContent = `Ø¹ÙÙˆØ§Ù‹ØŒ Ù‡Ø°Ø§ Ø§Ù„ÙƒÙˆØ¯ Ø®Ø§Øµ Ø¨Ù€ ${roleLabels[emp.role] || emp.role} ÙˆÙ„ÙŠØ³ ${roleLabels[role]}! âŒ`;
                window.playSound('error');
                return;
            }

            // Login success!
            sessionStorage.setItem('foush_role', emp.role);
            sessionStorage.setItem('foush_emp_name', emp.name);
            window.state.role = emp.role;

            let defaultPage = 'pos';
            if (emp.role === 'kitchen') defaultPage = 'kitchen';
            else if (emp.role === 'waiter') defaultPage = 'waiter';
            else if (emp.role === 'manager') defaultPage = 'manager_home';
            else if (emp.role === 'admin') defaultPage = 'admin_home';

            window.state.page = defaultPage;
            sessionStorage.setItem('foush_last_page', defaultPage);

            // Auto check-in attendance if not already clocked in
            const att = window.state.db.attendance || [];
            const lastRec = att.slice().reverse().find(a => a.empId === emp.id);
            if (!lastRec || lastRec.type !== 'in') {
                att.push({ empId: emp.id, type: 'in', time: Date.now() });
                window.state.db.attendance = att;
                window.save();
            }

            error.style.color = 'var(--success)';
            error.textContent = `Ù…Ø±Ø­Ø¨Ø§Ù‹ ${emp.name}ØŒ ØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø­Ø¶ÙˆØ±Ùƒ ÙˆØ§Ù„ÙˆÙ„ÙˆØ¬ Ø¨Ù†Ø¬Ø§Ø­! ðŸŸ¢`;
            window.playSound('success');

            setTimeout(() => {
                window.closePinLogin();
                window.boot();
            }, 1200);
        };

        window.logout = () => {
            sessionStorage.removeItem('foush_role');
            sessionStorage.removeItem('foush_emp_name');
            location.reload();
        };
        window.startShift = () => { window.state.db.shift = { start: Date.now() }; window.save(); };
        window.showToast = (m) => { const t = document.getElementById('toast'); t.textContent = m; t.style.display = 'block'; setTimeout(() => t.style.display = 'none', 2500); };

        window.showMobileMenu = () => {
            const links = {
                waiter: [{ id: 'waiter', label: 'Ø§Ù„Ø·Ø§ÙˆÙ„Ø§Øª', icon: 'bell-concierge' }],
                kitchen: [{ id: 'kitchen', label: 'Ø§Ù„Ù…Ø·Ø¨Ø®', icon: 'fire-burner' }],
                cashier: [{ id: 'pos', label: 'Ø§Ù„ÙƒØ§Ø´ÙŠØ±', icon: 'cash-register' }, { id: 'kitchen', label: 'Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø©', icon: 'desktop' }, { id: 'inventory', label: 'Ø§Ù„Ù…Ø®Ø²Ù†', icon: 'box' }, { id: 'expenses', label: 'Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª', icon: 'money-bill' }, { id: 'tables', label: 'Ø§Ù„Ø·Ø§ÙˆÙ„Ø§Øª', icon: 'chair' }],
                manager: [
                    { id: 'manager_home', label: 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©', icon: 'crown' },
                    { id: 'admin_inventory', label: 'Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ', icon: 'box-open' },
                    { id: 'expenses', label: 'Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª', icon: 'money-bill' },
                    { id: 'dashboard', label: 'Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª', icon: 'chart-line' },
                    { id: 'shift_ops', label: 'Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø­ÙŠØ©', icon: 'satellite-dish' },
                    { id: 'employees', label: 'Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†', icon: 'users' }
                ],
                admin: [
                    { id: 'admin_home', label: 'Ù„ÙˆØ­Ø© Ø§Ù„Ø¥Ø¯Ø§Ø±Ø©', icon: 'user-tie' },
                    { id: 'admin_inventory', label: 'Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ', icon: 'box-open' },
                    { id: 'expenses', label: 'Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª', icon: 'money-bill' },
                    { id: 'shift_ops', label: 'Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ÙˆØ±Ø¯ÙŠØ©', icon: 'satellite-dish' },
                    { id: 'employees', label: 'Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†', icon: 'users' }
                ]
            };
            const myLinks = links[window.state.role] || [];
            const hiddenLinks = myLinks.slice(4);
            const container = document.getElementById('mobile-menu-links');
            if (container) {
                container.innerHTML = hiddenLinks.map(x => `<button onclick="document.getElementById('mobile-menu-modal').style.display='none'; window.switchPage('${x.id}')" class="sidebar-link ${window.state.page === x.id ? 'active' : ''}" style="margin-bottom:5px; text-align:right;"><i class="fa-solid fa-${x.icon}"></i> ${x.label}</button>`).join('');
            }
            document.getElementById('mobile-menu-modal').style.display = 'flex';
        };

        window.addToCart = (id) => {
            const m = window.state.db.menu.find(x => x.id === id); if (!m) return;
            const inCartCount = window.state.cart.filter(x => x.id === id).reduce((s, x) => s + x.qty, 0);
            if (!m.unlimited && m.stock <= inCartCount) { window.showToast("Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø±ØµÙŠØ¯ ÙƒØ§ÙÙŠ!"); return; }
            const inCart = window.state.cart.find(x => x.id === id); if (inCart) inCart.qty++; else window.state.cart.push({ ...m, qty: 1 }); window.render();
        };

        window.confirmOrder = () => {
            try {
                if (window.state.cart.length === 0) return;
                if (!window.state.db.shift) { window.showToast("ÙŠØ±Ø¬Ù‰ ÙØªØ­ ÙˆØ±Ø¯ÙŠØ© Ø£ÙˆÙ„Ø§Ù‹!"); return; }
                if (window.state.type === 'salla' && window.state.selectedTable === 'Ø®Ø§Ø±Ø¬ÙŠ') { window.showToast("ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø·Ø§ÙˆÙ„Ø© Ø£ÙˆÙ„Ø§Ù‹! ðŸª‘"); return; }

                const tab = (window.state.db.tables || []).find(t => t.name === window.state.selectedTable);
                const sourceCol = tab ? (tab.source || 'cashier') : 'cashier';
                const notes = document.getElementById('pos-notes') ? document.getElementById('pos-notes').value : '';
                const o = { id: (window.state.db.orders || []).length + 1, items: [...window.state.cart], total: window.state.cart.reduce((s, i) => s + (i.price * i.qty), 0), type: window.state.type, table: window.state.selectedTable, status: 'preparing', time: Date.now(), source: sourceCol, paid: window.state.type !== 'salla', notes: notes };

                if (o.type === 'salla') {
                    o.items.forEach(item => { const m = window.state.db.menu.find(x => x.id === item.id); if (m && !m.unlimited) m.stock -= item.qty; });
                    if (!Array.isArray(window.state.db.orders)) window.state.db.orders = [];
                    window.state.db.orders.unshift(o);
                    window.state.cart = []; window.state.selectedTable = 'Ø®Ø§Ø±Ø¬ÙŠ'; window.state.posNotes = '';
                    window.save();
                    window.showToast("ØªÙ… Ø§Ù„Ø¥Ø±Ø³Ø§Ù„ Ù„Ù„Ù…Ø·Ø¨Ø® âœ…"); window.playSound('success');
                } else {
                    window.state.tempOrder = o;
                    window.showReceiptPreview(o);
                }
            } catch (e) { console.error("Confirm Order Error", e); window.showToast("Ø®Ø·Ø£ ÙÙŠ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø·Ù„Ø¨!"); }
        };

        window.showReceiptPreview = (o) => {
            window.state.tempOrder = o;
            document.getElementById('receipt-discount').value = o.discount || '';
            document.getElementById('receipt-payment').value = o.paymentMethod || 'cash';

            if (o.type !== 'salla' && !o.customerName) {
                document.getElementById('receipt-customer-info').style.display = 'block';
                document.getElementById('receipt-cust-name').value = '';
                document.getElementById('receipt-cust-phone').value = '';
            } else {
                document.getElementById('receipt-customer-info').style.display = 'none';
            }

            window.updateReceiptPreview();
            document.getElementById('receipt-modal').style.display = 'flex';

            setTimeout(() => {
                if (o.type === 'delivery') document.getElementById('receipt-cust-phone').focus();
                else document.getElementById('receipt-confirm-btn').focus();
            }, 100);
        };

        window.updateReceiptPreview = () => {
            const o = window.state.tempOrder; if (!o) return;
            const discount = Number(document.getElementById('receipt-discount').value) || 0;
            o.discount = discount; o.paymentMethod = document.getElementById('receipt-payment').value;
            if (o.type !== 'salla' && document.getElementById('receipt-customer-info').style.display === 'block') {
                o.customerName = document.getElementById('receipt-cust-name').value;
                o.customerPhone = document.getElementById('receipt-cust-phone').value;
            }
            const finalTotal = o.total - discount;
            const html = `<div style="text-align:center; color:#000;"><h1 style="font-family:'Orbitron'; font-size:1.8rem; margin:0;">FOUSH</h1><p style="font-weight:900; margin:0; font-size:0.9rem;">ÙØ¤Ø´ Ø§Ø¨Ù† Ø³ÙŠØ¯ Ù„Ù„Ø·ÙˆØ§Ø¬Ù†</p><p style="font-size:0.7rem; margin:0;">${new Date(o.time).toLocaleString('ar-EG')}</p><hr style="border:1px dashed #000; margin:5px 0;"><h2 style="font-size:2rem; margin:0;">#${o.id}</h2><p style="font-weight:900; margin:0;">${o.type === 'salla' ? `Ø§Ù„Ø·Ø§ÙˆÙ„Ø©: ${o.table}` : o.type === 'delivery' ? `Ø¯Ù„ÙŠÙØ±ÙŠ` : `ØªÙŠÙƒ Ø£ÙˆØ§ÙŠ`}</p>${o.customerName ? `<p style="font-weight:900; font-size:0.9rem; border:1px solid #000; padding:3px; border-radius:5px; margin:5px 0 0 0;">Ø§Ù„Ø¹Ù…ÙŠÙ„: ${o.customerName} | ${o.customerPhone}</p>` : ''}</div><div style="color:#000; margin-top:8px;">${o.items.map(i => `<div style="display:flex; justify-content:space-between; font-size:1rem; font-weight:900; margin-bottom:2px;"><span>${i.name} x${i.qty}</span><span>${i.price * i.qty} Ø¬</span></div>`).join('')}</div><hr style="border:1px dashed #000; margin:5px 0;">${discount > 0 ? `<div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:900; color:#ef4444; margin:0;"><span>Ø®ØµÙ…:</span><span>-${discount} Ø¬</span></div>` : ''}<div style="display:flex; justify-content:space-between; font-size:1.5rem; font-weight:900; color:#000; margin:0;"><span>Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ:</span><span>${finalTotal} Ø¬</span></div><p style="text-align:center; font-weight:900; font-size:0.9rem; margin:5px 0 0 0; color:#000; border-top:1px dashed #000; padding-top:3px;">Ø§Ù„Ø¯ÙØ¹: ${o.paymentMethod === 'visa' ? 'ÙÙŠØ²Ø§ ðŸ’³' : o.paymentMethod === 'wallet' ? 'Ù…Ø­ÙØ¸Ø© ðŸ“±' : 'ÙƒØ§Ø´ ðŸ’µ'}</p><p style="text-align:center; margin:2px 0 0 0; color:#000; font-weight:900; font-size:0.7rem;">Ù†ÙˆØ±ØªÙ†Ø§ ÙŠØ§ ÙØ¤Ø´! â¤ï¸ Ù…Ù…Ù„ÙƒØ© Ø§Ù„Ø·ÙˆØ§Ø¬Ù†</p>`;
            document.getElementById('receipt-preview').innerHTML = html;
        };

        window.finalizeTransaction = () => {
            try {
                if (!window.state.tempOrder) return;
                const o = { ...window.state.tempOrder }; o.paid = true; if (o.type === 'salla') o.status = 'completed';

                if (o.type !== 'salla' && document.getElementById('receipt-customer-info').style.display === 'block') {
                    const cName = document.getElementById('receipt-cust-name').value;
                    const cPhone = document.getElementById('receipt-cust-phone').value;
                    if (o.type === 'delivery' && (!cName || !cPhone)) {
                        window.showToast("Ø¨Ø±Ø¬Ø§Ø¡ Ø¥Ø¯Ø®Ø§Ù„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù…ÙŠÙ„ Ù„Ù„Ø¯Ù„ÙŠÙØ±ÙŠ!");
                        return;
                    }
                    o.customerName = cName;
                    o.customerPhone = cPhone;
                }

                if (!Array.isArray(window.state.db.orders)) window.state.db.orders = [];
                const existingIdx = window.state.db.orders.findIndex(x => String(x.id) === String(o.id));
                if (existingIdx !== -1) {
                    window.state.db.orders[existingIdx].paid = true;
                    window.state.db.orders[existingIdx].discount = o.discount;
                    window.state.db.orders[existingIdx].paymentMethod = o.paymentMethod;
                    window.state.db.orders[existingIdx].customerName = o.customerName;
                    window.state.db.orders[existingIdx].customerPhone = o.customerPhone;
                    if (o.type === 'salla') window.state.db.orders[existingIdx].status = 'completed';
                }
                else { o.items.forEach(item => { const m = window.state.db.menu.find(x => x.id === item.id); if (m && !m.unlimited) m.stock -= item.qty; }); window.state.db.orders.unshift(o); }

                document.getElementById('receipt-modal').style.display = 'none';
                window.state.tempOrder = o; window.updateReceiptPreview();
                const printDiv = document.getElementById('print-area'); printDiv.innerHTML = document.getElementById('receipt-preview').innerHTML;

                window.state.cart = []; window.state.tempOrder = null;
                window.save();
                window.showToast("ØªÙ… Ø§Ù„Ø­Ø³Ø§Ø¨ âœ…"); window.playSound('success');
                setTimeout(() => { try { window.print(); } catch (e) { } }, 300);
            } catch (e) { console.error("Finalize Error", e); window.showToast("Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø­Ø³Ø§Ø¨!"); }
        };
        window.closeReceipt = () => { window.state.tempOrder = null; document.getElementById('receipt-modal').style.display = 'none'; };

        window.drillDown = (type) => {
            const title = document.getElementById('drilldown-title'); const content = document.getElementById('drilldown-content'); document.getElementById('drilldown-modal').style.display = 'flex';
            const orders = window.state.db.orders || [];
            if (type === 'exp') { title.textContent = "Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©"; content.innerHTML = `<table class="foush-table"><thead><tr><th>Ø§Ù„Ø¨ÙŠØ§Ù†</th><th>Ø§Ù„ØªÙØ§ØµÙŠÙ„</th><th>Ø§Ù„Ù…Ø¨Ù„Øº</th></tr></thead><tbody>${(window.state.db.exp || []).map(e => `<tr><td>${e.name}</td><td>${e.details || '-'}</td><td>${e.amount} Ø¬</td></tr>`).join('')}</tbody></table>`; }
            else if (type === 'sales') { title.textContent = "Ø³Ø¬Ù„ Ø§Ù„Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø©"; content.innerHTML = orders.filter(o => o.paid).map(o => `<div class="order-card" style="border-right-color:var(--primary);"><h4>#${o.id} - ${o.table}</h4><p>${o.items.map(i => `${i.name} x${i.qty}`).join('ØŒ ')}</p><p style="margin:5px 0; font-size:0.85rem; opacity:0.8;"><i class="fa-regular fa-clock"></i> ${new Date(o.time).toLocaleTimeString('ar-EG')}</p><div style="display:flex; justify-content:space-between; margin-top:5px; align-items:center;"><span style="color:var(--primary); font-weight:900; font-size:1.2rem;">${o.total - (o.discount || 0)} Ø¬</span><span style="font-size:0.8rem; background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:5px; font-weight:900;">${o.paymentMethod === 'visa' ? 'ÙÙŠØ²Ø§ ðŸ’³' : o.paymentMethod === 'wallet' ? 'Ù…Ø­ÙØ¸Ø© ðŸ“±' : 'ÙƒØ§Ø´ ðŸ’µ'}</span></div></div>`).join('') || '<p style="text-align:center;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ø¨ÙŠØ¹Ø§Øª Ø­ØªÙ‰ Ø§Ù„Ø¢Ù†</p>'; }
            else if (type === 'kitchen') { title.textContent = "Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„Ù…Ø·Ø¨Ø® Ø§Ù„Ø¢Ù†"; content.innerHTML = orders.filter(o => o.status === 'preparing').map(o => `<div class="order-card"><h4>#${o.id} - ${o.table}</h4><p>${o.items.map(i => `${i.name} x${i.qty}`).join('ØŒ ')}</p></div>`).join('') || '<p style="text-align:center;">Ø§Ù„Ù…Ø·Ø¨Ø® Ù‡Ø§Ø¯ÙŠ Ø­Ø§Ù„ÙŠØ§Ù‹ ðŸ§Š</p>'; }
            else if (type === 'ready') { title.textContent = "Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø¬Ø§Ù‡Ø²Ø© Ù„Ù„ØªØ³Ù„ÙŠÙ…"; content.innerHTML = orders.filter(o => o.status === 'ready').map(o => `<div class="order-card" style="border-right-color:var(--success);"><h4>#${o.id} - ${o.table}</h4><p>${o.items.map(i => `${i.name} x${i.qty}`).join('ØŒ ')}</p></div>`).join('') || '<p style="text-align:center;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø¬Ø§Ù‡Ø²Ø©</p>'; }
            else if (type === 'canceled') { title.textContent = "Ø§Ù„Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„Ù…Ù„ØºØ§Ø©"; content.innerHTML = orders.filter(o => o.status === 'canceled').map(o => `<div class="order-card" style="border-right-color:var(--danger);"><h4>#${o.id} - ${o.table}</h4><p>${o.items.map(i => `${i.name} x${i.qty}`).join('ØŒ ')}</p><p style="color:var(--danger); font-weight:900;">${o.total} Ø¬ (ØªÙ… Ø§Ù„Ø§Ø³ØªØ±Ø¬Ø§Ø¹)</p></div>`).join('') || '<p style="text-align:center;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ù…Ù„ØºØ§Ø©</p>'; }
            else if (type === 'all_orders') { title.textContent = "Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„ÙŠÙˆÙ…"; content.innerHTML = orders.map(o => `<div class="order-card" style="border-right-color:${o.status==='canceled'?'var(--danger)':(o.paid?'var(--primary)':'#ccc')};"><h4>#${o.id} - ${o.table}</h4><p>${o.items.map(i => `${i.name} x${i.qty}`).join('ØŒ ')}</p><div style="display:flex; justify-content:space-between; margin-top:5px;"><span style="color:var(--primary); font-weight:900;">${o.total - (o.discount || 0)} Ø¬</span><span class="badge ${o.paid?'badge-ready':'badge-preparing'}">${o.paid?'Ù…Ø¯ÙÙˆØ¹':(o.status==='canceled'?'Ù…Ù„ØºÙŠ':'ØºÙŠØ± Ù…Ø¯ÙÙˆØ¹')}</span></div></div>`).join('') || '<p style="text-align:center;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„ÙŠÙˆÙ…</p>'; }
            else if (type === 'active') { title.textContent = "Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø© Ø­Ø§Ù„ÙŠØ§Ù‹"; content.innerHTML = orders.filter(o => o.status !== 'completed' && o.status !== 'canceled').map(o => `<div class="order-card" style="border-right-color:#3b82f6;"><h4>#${o.id} - ${o.table}</h4><p>${o.items.map(i => `${i.name} x${i.qty}`).join('ØŒ ')}</p><div style="display:flex; justify-content:space-between; margin-top:5px;"><span style="color:#3b82f6; font-weight:900;">${o.total} Ø¬</span><span class="badge badge-preparing">${o.status==='preparing'?'Ø¨Ø§Ù„Ù…Ø·Ø¨Ø®':(o.status==='ready'?'Ø¬Ø§Ù‡Ø²':'Ù†Ø´Ø·')}</span></div></div>`).join('') || '<p style="text-align:center;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ù„Ø¨Ø§Øª Ù†Ø´Ø·Ø©</p>'; }
        };

        window.printKitchenOrders = () => {
            const orders = window.state.db.orders || [];
            const prep = orders.filter(o => o.status === 'preparing').sort((a,b)=>a.time-b.time);
            if(prep.length === 0){ window.showToast('Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£ÙˆØ±Ø¯Ø±Ø§Øª ÙÙŠ Ø§Ù„Ù…Ø·Ø¨Ø® Ø­Ø§Ù„ÙŠØ§Ù‹!'); return; }
            let html = `<div style="color:#000; text-align:center; padding-top:10px;"><h2 style="font-family:'Orbitron'; font-size:1.8rem; margin:0;">FOUSH KITCHEN</h2><p style="margin:5px 0; font-weight:bold;">Ø·Ø¨Ø§Ø¹Ø© Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„Ù…Ø·Ø¨Ø® Ø§Ù„Ù†Ø´Ø·Ø©</p><p style="margin:5px 0; font-size:0.8rem;">${new Date().toLocaleString('ar-EG')}</p><hr style="border:1px dashed #000; margin:10px 0;">`;
            prep.forEach(o => {
                html += `<div style="text-align:right; margin-bottom:10px; border-bottom:1px dashed #000; padding-bottom:5px;">
                <h3 style="margin:0; font-size:1.2rem;">#${o.id} - ${o.table}</h3>
                <ul style="list-style:none; padding:0; margin:5px 0; font-size:1rem; font-weight:bold;">
                ${o.items.map(i=>`<li>${i.name} x${i.qty}</li>`).join('')}
                </ul>
                ${o.notes ? `<p style="margin:0; font-weight:bold; font-size:0.9rem; border:1px solid #000; padding:2px; display:inline-block;">Ù…Ù„Ø§Ø­Ø¸Ø©: ${o.notes}</p>` : ''}
                </div>`;
            });
            html += `</div>`;
            document.getElementById('print-area').innerHTML = html;
            setTimeout(() => { try { window.print(); } catch (e) { } }, 300);
        };


        window.switchPage = (p) => { window.state.page = p; sessionStorage.setItem('foush_last_page', p); window.render(); };

        window.render = () => {
            try {
                document.querySelectorAll('.page-container').forEach(v => { v.classList.remove('active'); v.innerHTML = ''; });
                const c = document.getElementById('page-' + window.state.page); if (c) c.classList.add('active'); else return;
                if (window.state.page === 'manager_home') renderManagerHome(c); else if (window.state.page === 'admin_home') renderAdminHome(c); else if (window.state.page === 'shift_ops') renderShiftOps(c); else if (window.state.page === 'pos') renderPOS(c); else if (window.state.page === 'dashboard') renderDashboard(c); else if (window.state.page === 'kitchen') renderKitchen(c); else if (window.state.page === 'inventory') renderInventory(c); else if (window.state.page === 'expenses') renderExpenses(c); else if (window.state.page === 'tables') renderTables(c); else if (window.state.page === 'reports') renderReports(c); else if (window.state.page === 'employees') renderEmployees(c); else if (window.state.page === 'waiter') renderWaiter(c); else if (window.state.page === 'admin_inventory') renderAdminInventory(c);
                renderSidebar();
                const isWorkingRole = (window.state.role === 'cashier' || window.state.role === 'waiter');
                const hasShift = !!window.state.db.shift;
                document.getElementById('shift-modal').style.display = (!hasShift && isWorkingRole) ? 'flex' : 'none';
                if (!hasShift && isWorkingRole) {
                    if (window.state.role === 'waiter') {
                        document.getElementById('shift-modal-text').textContent = "Ù„Ø§ ØªÙˆØ¬Ø¯ ÙˆØ±Ø¯ÙŠØ© Ù†Ø´Ø·Ø© Ø­Ø§Ù„ÙŠØ§Ù‹. ÙŠØ±Ø¬Ù‰ Ø§Ù„Ø·Ù„Ø¨ Ù…Ù† Ø§Ù„ÙƒØ§Ø´ÙŠØ± Ø£Ùˆ Ø§Ù„Ù…Ø¯ÙŠØ± ÙØªØ­ Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ù„Ù„Ø¨Ø¯Ø¡ ÙÙŠ Ø§Ù„Ø¹Ù…Ù„.";
                        document.getElementById('shift-modal-btn').style.display = 'none';
                    } else {
                        document.getElementById('shift-modal-text').textContent = "Ù„Ø§ ØªÙˆØ¬Ø¯ ÙˆØ±Ø¯ÙŠØ© Ù†Ø´Ø·Ø© Ø­Ø§Ù„ÙŠØ§Ù‹. ÙŠØ±Ø¬Ù‰ ÙØªØ­ ÙˆØ±Ø¯ÙŠØ© Ø¬Ø¯ÙŠØ¯Ø© Ù„Ù„Ø¨Ø¯Ø¡ ÙÙŠ Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ ÙˆØªØ´ØºÙŠÙ„ Ø§Ù„Ù†Ø¸Ø§Ù….";
                        document.getElementById('shift-modal-btn').style.display = 'inline-block';
                    }
                }
                document.getElementById('end-shift-btn').style.display = (hasShift && window.state.role === 'cashier') ? 'block' : 'none';
                document.getElementById('timer').style.display = (hasShift && window.state.role !== 'manager') ? 'block' : 'none';
                const isManager = window.state.role === 'manager';
                const clearBtn = document.getElementById('clear-storage-btn');
                if (clearBtn) clearBtn.style.display = isManager ? 'none' : 'block';
            } catch (e) { console.error("Render Error:", e); }
        };

        function renderPOS(c) {
            const total = window.state.cart.reduce((s, i) => s + (i.price * i.qty), 0); const busyOrders = (window.state.db.orders || []).filter(o => o.type === 'salla' && !o.paid && o.status !== 'completed');
            const filteredTables = window.state.db.tables || [];

            window.state.posTab = window.state.posTab || 'items';
            const cartCount = window.state.cart.reduce((sum, item) => sum + item.qty, 0);

            const mainInventory = window.state.db.main_inventory || [];
            const menuInventory = window.state.db.menu || [];
            const lowStockMain = mainInventory.filter(i => i.qty <= (i.minQty || 0)).length;
            const lowStockMenu = menuInventory.filter(m => !m.unlimited && m.stock <= 5).length;

            let alertsHtml = '';
            if (lowStockMain > 0 || lowStockMenu > 0) {
                alertsHtml = `<div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); padding:10px 15px; border-radius:12px; margin-bottom:15px; margin-top:5px; color:#f87171; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <i class="fa-solid fa-triangle-exclamation" style="animation:pulse 2s infinite; font-size:1.2rem;"></i>
                        <div>
                            <div style="font-family:'Cairo'; font-weight:900; font-size:0.95rem;">ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ù†ÙˆØ§Ù‚Øµ Ø§Ù„Ù…Ø®Ø²ÙˆÙ† âš ï¸</div>
                            <div style="font-size:0.8rem; opacity:0.9;">
                                ${lowStockMenu > 0 ? `Ù†ÙˆØ§Ù‚Øµ Ø§Ù„ØªØ´ØºÙŠÙ„ (Ø§Ù„Ù…Ù†ÙŠÙˆ): <b style="color:#fff;">${lowStockMenu}</b> ØµÙ†Ù` : ''} 
                                ${lowStockMain > 0 && lowStockMenu > 0 ? ' | ' : ''}
                                ${lowStockMain > 0 ? `Ù†ÙˆØ§Ù‚Øµ Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ: <b style="color:#fff;">${lowStockMain}</b> Ø®Ø§Ù…Ø©` : ''}
                            </div>
                        </div>
                    </div>
                </div>`;
            }

            const tabHtml = `
        <div class="pos-mobile-tabs">
            <button onclick="window.state.posTab='items'; window.render();" class="pos-tab-btn ${window.state.posTab === 'items' ? 'active' : ''}">Ø§Ù„Ø£ØµÙ†Ø§Ù ðŸ¥˜</button>
            <button onclick="window.state.posTab='cart'; window.render();" class="pos-tab-btn ${window.state.posTab === 'cart' ? 'active' : ''}">
                Ø§Ù„Ø³Ù„Ø© ÙˆØ§Ù„Ø·Ù„Ø¨ ðŸ›’ ${cartCount > 0 ? `<span class="cart-badge-count">${cartCount}</span>` : ''}
            </button>
        </div>`;

            c.innerHTML = `${alertsHtml}${tabHtml}<div class="pos-layout ${window.state.posTab === 'cart' ? 'show-cart' : 'show-items'}"><div class="items-side"><div style="display:flex; gap:8px; margin-bottom:8px; overflow-x:auto;" class="hide-scroll">${['Ø§Ù„ÙƒÙ„', 'Ø·ÙˆØ§Ø¬Ù†', 'Ø£Ø±Ø² ÙˆÙØªØ©', 'Ø´ÙˆØ±Ø¨Ø©', 'Ø³Ù„Ø·Ø§Øª', 'Ù…Ø´Ø±ÙˆØ¨Ø§Øª'].map(cat => `<button onclick="window.state.cat='${cat}'; window.render();" class="btn-luxury" style="width:auto; padding:8px 20px; background:${window.state.cat === cat ? 'var(--primary)' : '#1e293b'}; color:${window.state.cat === cat ? '#000' : '#fff'}">${cat}</button>`).join('')}</div><div class="items-grid hide-scroll">${window.state.db.menu.filter(m => window.state.cat === 'Ø§Ù„ÙƒÙ„' || m.category === window.state.cat).map(m => `<div class="pos-card ${(!m.unlimited && m.stock <= 0) ? 'out-of-stock' : ''} ${(!m.unlimited && m.stock < 10) ? 'low-stock' : ''}" onclick="window.addToCart(${m.id})"><h3>${m.name}</h3><p style="color:var(--primary); font-weight:900;">${m.price} Ø¬</p>${!m.unlimited ? `<small style="opacity:0.7; font-weight:900; font-size:0.7rem;">Ù…ØªØ§Ø­: ${m.stock}</small>` : ''}</div>`).join('')}</div></div><div class="cart-side"><div style="display:flex; gap:5px; margin-bottom:10px;">${['salla', 'takeaway', 'delivery'].map(t => `<button onclick="window.state.type='${t}'; window.render();" class="btn-luxury" style="background:${window.state.type === t ? 'var(--primary)' : '#0f172a'}; color:${window.state.type === t ? '#000' : '#fff'}; font-size:0.8rem;">${t === 'salla' ? 'ØµØ§Ù„Ø©' : t === 'takeaway' ? 'ØªÙŠÙƒ' : 'Ø¯Ù„ÙŠ'}</button>`).join('')}</div>${window.state.type === 'salla' ? '<div style="display:flex; flex-direction:column; gap:10px; margin-bottom:10px;"><div class="table-grid">' + filteredTables.filter(t => (t.source || 'cashier') === 'cashier').map(t => { const busy = busyOrders.find(o => o.table === t.name); return `<div onclick="${busy ? `window.settleOrder('${busy.id}')` : `window.state.selectedTable='${t.name}'; window.render();`}" class="table-btn ${window.state.selectedTable === t.name ? 'active' : ''} ${busy ? (busy.status === 'billing' ? 'billing' : 'busy') : ''}"><span>${t.name}</span><br><small style="font-size:0.6rem;">${busy ? (busy.status === 'billing' ? 'Ø·Ù„Ø¨ Ø­Ø³Ø§Ø¨ðŸ””' : 'Ø­Ø³Ø§Ø¨ðŸ’°') : 'ÙƒØ§Ø´ÙŠØ±ðŸ’°'}</small></div>`; }).join('') + '</div><div style="border-top:1px dashed rgba(255,255,255,0.1); padding-top:10px; opacity:0.8;"><div class="table-grid">' + filteredTables.filter(t => (t.source || 'cashier') === 'waiter').map(t => { const busy = busyOrders.find(o => o.table === t.name); return `<div onclick="${busy ? `window.settleOrder('${busy.id}')` : ''}" class="table-btn ${busy ? (busy.status === 'billing' ? 'billing' : 'busy') : ''}" style="border-color:#64748b; ${!busy ? 'opacity:0.4; cursor:not-allowed;' : ''}"><span>${t.name}</span><br><small style="font-size:0.6rem;">${busy ? (busy.status === 'billing' ? 'Ø·Ù„Ø¨ Ø­Ø³Ø§Ø¨ðŸ””' : 'Ø­Ø³Ø§Ø¨ðŸ’°') : 'ÙˆÙŠØªØ±ðŸ¤µ'}</small></div>`; }).join('') + '</div></div></div>' : ''}<div class="cart-items hide-scroll">${window.state.cart.map((i, idx) => `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:10px; border-radius:12px; margin-bottom:6px; border:1px solid rgba(255,255,255,0.03);"><div><span style="font-size:0.9rem;">${i.name}</span><br><small style="color:var(--primary);">x${i.qty}</small></div><button onclick="window.state.cart.splice(${idx},1); window.render();" style="background:none; border:none; color:var(--danger); cursor:pointer;"><i class="fa-solid fa-trash-can"></i></button></div>`).join('')}</div><input id="pos-notes" placeholder="Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ù„Ù„Ù…Ø·Ø¨Ø® (Ø¨Ø¯ÙˆÙ† Ø¨ØµÙ„ØŒ Ø²ÙŠØ§Ø¯Ø© Ø±Ø²...)" class="input-luxury" style="margin-bottom:8px; font-size:0.9rem;" value="${window.state.posNotes || ''}" onchange="window.state.posNotes=this.value"><div style="border-top:2px solid var(--primary); padding-top:12px; text-align:center;"><h1 style="color:var(--primary); font-size:2.8rem; margin-bottom:10px; font-family:'Orbitron';">${total} Ø¬</h1><button onclick="window.confirmOrder()" class="btn-luxury" style="font-size:1.6rem; padding:18px;">ØªØ£ÙƒÙŠØ¯ âœ…</button></div></div></div>`;
        }

        function renderAdminHome(c) {
            const inventory = window.state.db.main_inventory || [];
            const lowStockCount = inventory.filter(i => i.qty <= (i.minQty || 0)).length;
            const expenses = window.state.db.exp || [];
            const todayStart = new Date(); todayStart.setHours(0,0,0,0);
            const todayExp = expenses.filter(e => e.time >= todayStart.getTime()).reduce((sum, e) => sum + e.amount, 0);

            c.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(0,0,0,0.6)); border: 1px solid rgba(6,182,212,0.2); padding: 25px; border-radius: 20px; color: #fff; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <div style="display:flex; align-items:center; gap:20px;">
                    <div style="font-size:3.5rem; color:#06b6d4; filter: drop-shadow(0 0 10px rgba(6,182,212,0.4));">ðŸ’¼</div>
                    <div>
                        <h2 style="margin:0 0 5px 0; font-family:'Cairo'; font-weight:900; font-size:1.8rem; letter-spacing:1px; background:linear-gradient(90deg, #fff, #06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Ù…Ø±Ø­Ø¨Ø§Ù‹ØŒ Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¹Ø§Ù…Ø© ðŸ’¼</h2>
                        <p style="margin:0; opacity:0.8; font-size:0.95rem;">Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ… Ø§Ù„Ø°ÙƒÙŠØ© Ù„Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…ÙˆØ§Ø±Ø¯ ÙˆÙ…ØªØ§Ø¨Ø¹Ø© Ø³ÙŠØ± Ø§Ù„Ø¹Ù…Ù„</p>
                    </div>
                </div>
                <div style="text-align: left; font-family:'Orbitron';">
                    <div style="font-size: 1.1rem; color: #06b6d4; font-weight: 900; margin-bottom:5px;">FOUSH POS SYSTEM</div>
                    <div style="font-size: 0.85rem; opacity:0.7;">Ø§Ù„Ù†Ø³Ø®Ø© v12.0</div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:15px; margin-bottom:25px;">
                <div onclick="window.switchPage('admin_inventory')" class="stat-card" style="border-right: 4px solid var(--danger); background: rgba(0,0,0,0.2); cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(239,68,68,0.1)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'">
                    <h3>Ù†ÙˆØ§Ù‚Øµ Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ</h3>
                    <p style="color:${lowStockCount > 0 ? 'var(--danger)' : 'var(--success)'};">${lowStockCount > 0 ? lowStockCount + ' Ø®Ø§Ù…Ø© âš ï¸' : 'Ø§Ù„Ù…Ø®Ø²Ù† Ù…Ù…ØªØ§Ø² âœ…'}</p>
                    <div class="stat-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                </div>
                <div onclick="window.switchPage('shift_ops')" class="stat-card" style="border-right: 4px solid #0ea5e9; background: rgba(0,0,0,0.2); cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(14,165,233,0.1)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'">
                    <h3>Ø­Ø§Ù„Ø© Ø§Ù„ÙˆØ±Ø¯ÙŠØ©</h3>
                    <p style="color:#0ea5e9; font-size:1.1rem; margin-top:5px;">${window.state.db.shift ? 'ðŸŸ¢ Ù†Ø´Ø·Ø© | Ù…Ø¨ÙŠØ¹Ø§Øª: ' + ((window.state.db.orders||[]).filter(o=>o.shiftId===window.state.db.shift?.id).reduce((s,o)=>s+(o.total||0),0)) + ' Ø¬' : 'ðŸ’¤ Ù…ØºÙ„Ù‚Ø©'}</p>
                    <div class="stat-icon"><i class="fa-solid fa-satellite-dish"></i></div>
                </div>
                <div onclick="window.switchPage('shift_ops')" class="stat-card" style="border-right: 4px solid var(--primary); background: rgba(0,0,0,0.2); cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(245,158,11,0.1)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'">
                    <h3>Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø© Ø§Ù„Ø¢Ù†</h3>
                    <p style="color:var(--primary); font-size:1.3rem;">${(window.state.db.orders||[]).filter(o=>o.status!=='completed'&&o.status!=='cancelled'&&o.status!=='delivered').length} Ø·Ù„Ø¨ ðŸ”¥</p>
                    <div class="stat-icon"><i class="fa-solid fa-fire"></i></div>
                </div>
            </div>

            <h3 style="margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">Ø§Ù„ÙˆØµÙˆÙ„ Ø§Ù„Ø³Ø±ÙŠØ¹</h3>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
                <div onclick="window.switchPage('admin_inventory')" class="stat-card" style="border-bottom-color:var(--primary); cursor:pointer;">
                    <i class="fa-solid fa-box-open" style="font-size:2rem; color:var(--primary); margin-bottom:10px;"></i>
                    <h2 style="font-size:1.3rem; margin:0;">Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ</h2>
                </div>
                <div onclick="window.switchPage('expenses')" class="stat-card" style="border-bottom-color:#ef4444; cursor:pointer;">
                    <i class="fa-solid fa-money-bill-wave" style="font-size:2rem; color:#ef4444; margin-bottom:10px;"></i>
                    <h2 style="font-size:1.3rem; margin:0;">Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª</h2>
                </div>
                <div onclick="window.switchPage('shift_ops')" class="stat-card" style="border-bottom-color:#0ea5e9; cursor:pointer;">
                    <i class="fa-solid fa-satellite-dish" style="font-size:2rem; color:#0ea5e9; margin-bottom:10px;"></i>
                    <h2 style="font-size:1.3rem; margin:0;">Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ÙˆØ±Ø¯ÙŠØ©</h2>
                </div>
                <div onclick="window.switchPage('employees')" class="stat-card" style="border-bottom-color:var(--success); cursor:pointer;">
                    <i class="fa-solid fa-users" style="font-size:2rem; color:var(--success); margin-bottom:10px;"></i>
                    <h2 style="font-size:1.3rem; margin:0;">Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†</h2>
                </div>
            </div>
            `;
        }

        function renderShiftOps(c) {
            const isActive = !!window.state.db.shift;

            if (!isActive) {
                const history = window.state.db.shifts_history || [];
                if (history.length === 0) {
                    c.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; background:rgba(255,255,255,0.02); padding:12px 18px; border-radius:14px; border:1px solid rgba(255,255,255,0.05);">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <span style="opacity:0.6; font-size:0.9rem;">Ø¹ÙˆØ¯Ø© Ù„Ù„Ø®Ù„Ù</span>
                            <i class="fa-solid fa-chevron-left" style="font-size:0.75rem; opacity:0.4;"></i>
                            <span style="color:#06b6d4; font-weight:900; font-size:0.95rem;">Ù…Ø±ÙƒØ² Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ© ðŸ“¡</span>
                        </div>
                        <button onclick="window.switchPage(window.state.role === 'admin' ? 'admin_home' : 'manager_home')" class="btn-luxury" style="width:auto; padding:6px 16px; font-size:0.85rem; background:rgba(251,191,36,0.1); color:var(--primary); border:1px solid var(--primary);"><i class="fa-solid fa-arrow-right-to-bracket" style="transform:rotate(180deg);"></i> Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ© ðŸ‘‘</button>
                    </div>
                    <div style="text-align:center; padding:50px; background:rgba(0,0,0,0.2); border-radius:20px; border:1px dashed rgba(255,255,255,0.1);">
                        <i class="fa-solid fa-moon" style="font-size:3rem; color:#64748b; margin-bottom:15px;"></i>
                        <h3 style="margin:0; font-family:'Cairo'; font-size:1.5rem;">Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ù…ØºÙ„Ù‚Ø© Ø­Ø§Ù„ÙŠØ§Ù‹ ðŸ’¤</h3>
                        <p style="opacity:0.6; margin-top:5px;">Ù„Ø§ ØªÙˆØ¬Ø¯ ÙˆØ±Ø¯ÙŠØ© Ù†Ø´Ø·Ø© Ù„Ø¹Ø±Ø¶ Ù…Ø¤Ø´Ø±Ø§Øª Ø§Ù„Ø£Ø¯Ø§Ø¡ Ø§Ù„Ø­ÙŠØ©.</p>
                    </div>
                    `;
                    return;
                }

                const last = history[0];
                const startDate = new Date(last.start).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const startTime = new Date(last.start).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
                const endTime = new Date(last.end).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

                c.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; background:rgba(255,255,255,0.02); padding:12px 18px; border-radius:14px; border:1px solid rgba(255,255,255,0.05);">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="opacity:0.6; font-size:0.9rem;">Ø¹ÙˆØ¯Ø© Ù„Ù„Ø®Ù„Ù</span>
                        <i class="fa-solid fa-chevron-left" style="font-size:0.75rem; opacity:0.4;"></i>
                        <span style="color:#06b6d4; font-weight:900; font-size:0.95rem;">Ù…Ø±ÙƒØ² Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ© ðŸ“¡</span>
                    </div>
                    <button onclick="window.switchPage(window.state.role === 'admin' ? 'admin_home' : 'manager_home')" class="btn-luxury" style="width:auto; padding:6px 16px; font-size:0.85rem; background:rgba(251,191,36,0.1); color:var(--primary); border:1px solid var(--primary);"><i class="fa-solid fa-arrow-right-to-bracket" style="transform:rotate(180deg);"></i> Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ© ðŸ‘‘</button>
                </div>

                <div style="background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(0,0,0,0.4)); border:1px solid rgba(239,68,68,0.2); border-radius:18px; padding:20px 24px; margin-bottom:22px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <div style="width:48px; height:48px; border-radius:14px; background:rgba(239,68,68,0.15); display:flex; align-items:center; justify-content:center; font-size:1.6rem; color:#ef4444; border:1px solid rgba(239,68,68,0.3);">
                            <i class="fa-solid fa-moon"></i>
                        </div>
                        <div>
                            <h3 style="margin:0; font-family:'Cairo'; font-weight:900; font-size:1.25rem; color:#fff;">Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ù…ØºÙ„Ù‚Ø© Ø­Ø§Ù„ÙŠØ§Ù‹ ðŸ’¤</h3>
                            <p style="margin:2px 0 0 0; font-size:0.8rem; opacity:0.65;">Ù†Ø¹Ø±Ø¶ Ù„Ùƒ Ø£Ø¯Ù†Ø§Ù‡ Ù…Ù„Ø®Øµ Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø§Ù„Ø³Ø§Ø¨Ù‚Ø© Ù„Ù„Ø±Ø¬ÙˆØ¹ Ø¥Ù„ÙŠÙ‡ Ø³Ø±ÙŠØ¹Ø§Ù‹.</p>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></div>
                        <span style="font-size:0.85rem; font-weight:900; color:#ef4444;">Ù…ØºÙ„Ù‚</span>
                    </div>
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:30px; max-width:600px; margin:0 auto; box-shadow:0 10px 40px rgba(0,0,0,0.2);">
                    <h2 style="text-align:center; font-family:'Cairo'; font-weight:900; margin-top:0; color:var(--primary);"><i class="fa-solid fa-clock-rotate-left"></i> Ù…Ù„Ø®Øµ Ø¢Ø®Ø± ÙˆØ±Ø¯ÙŠØ©</h2>
                    <p style="text-align:center; opacity:0.7; font-size:0.9rem; margin-bottom:25px;">${startDate}<br>Ù…Ù† ${startTime} Ø­ØªÙ‰ ${endTime}</p>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div style="display:flex; justify-content:space-between; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); padding:15px; border-radius:12px;">
                            <span style="font-weight:700;">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª (Ù†Ø¸Ø§Ù… Ø§Ù„ÙƒØ§Ø´ÙŠØ±)</span>
                            <span style="color:var(--success); font-weight:900; font-size:1.1rem;">${last.sales} Ø¬</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); padding:15px; border-radius:12px;">
                            <span style="font-weight:700;">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª (Ù†Ø¸Ø§Ù… Ø§Ù„ÙƒØ§Ø´ÙŠØ±)</span>
                            <span style="color:var(--danger); font-weight:900; font-size:1.1rem;">${last.expenses} Ø¬</span>
                        </div>
                        <hr style="border:1px dashed rgba(255,255,255,0.1); margin:10px 0;">
                        <div style="display:flex; justify-content:space-between; background:rgba(251,191,36,0.15); border:1px solid rgba(251,191,36,0.3); padding:20px; border-radius:12px; font-size:1.3rem;">
                            <span style="font-weight:900;">ØµØ§ÙÙŠ Ø§Ù„ÙƒØ§Ø´ Ø§Ù„Ù…ØªÙˆÙ‚Ø¹ (Ø§Ù„Ø¯Ø±Ø¬)</span>
                            <span style="color:var(--primary); font-weight:900;">${last.net} Ø¬</span>
                        </div>
                        <div style="margin-top:15px; opacity:0.6; font-size:0.85rem; text-align:center;">ØªÙØ§ØµÙŠÙ„ Ø·Ø±Ù‚ Ø§Ù„Ø¯ÙØ¹:</div>
                        <div style="display:flex; justify-content:space-around; background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; font-size:0.95rem; text-align:center;">
                            <div><div style="opacity:0.6; font-size:0.8rem;">ÙƒØ§Ø´ ðŸ’µ</div><div style="font-weight:900; color:#10b981;">${last.cashSales || 0} Ø¬</div></div>
                            <div><div style="opacity:0.6; font-size:0.8rem;">ÙÙŠØ²Ø§ ðŸ’³</div><div style="font-weight:900; color:#3b82f6;">${last.visaSales || 0} Ø¬</div></div>
                            <div><div style="opacity:0.6; font-size:0.8rem;">Ù…Ø­ÙØ¸Ø© ðŸ“±</div><div style="font-weight:900; color:#8b5cf6;">${last.walletSales || 0} Ø¬</div></div>
                        </div>
                    </div>
                </div>
                `;
                return;
            }

            // Active Shift Logic
            const orders = window.state.db.orders || [];
            const activeOrders = orders.filter(o => o.status !== 'canceled');
            const paidOrders = activeOrders.filter(o => o.paid);
            const totalSales = paidOrders.reduce((s, o) => s + o.total - (o.discount || 0), 0);
            const shiftStart = window.state.db.shift ? window.state.db.shift.start : 0;
            const totalExpenses = (window.state.db.exp || []).filter(e => e.isShiftExpense && e.time >= shiftStart).reduce((s, e) => s + e.amount, 0);
            const cashSales = paidOrders.filter(o => !o.paymentMethod || o.paymentMethod === 'cash').reduce((s, o) => s + o.total - (o.discount || 0), 0);
            const cashBalance = cashSales - totalExpenses;
            const totalOrdersCount = paidOrders.length;
            const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;
            const customersServed = paidOrders.length;
            const currentActiveOrders = orders.filter(o => o.status === 'preparing' || o.status === 'ready' || o.status === 'billing' || o.status === 'served').length;
            const busyTables = orders.filter(o => o.type === 'salla' && !o.paid && o.status !== 'completed' && o.status !== 'canceled');
            const activeTables = busyTables.length;
            const attendance = window.state.db.attendance || [];
            const checkedInIds = {};
            attendance.forEach(a => { checkedInIds[a.empId] = a.type; });
            const workingEmployees = Object.keys(checkedInIds).filter(id => checkedInIds[id] === 'in').length;
            const shiftStartTime = window.state.db.shift ? new Date(window.state.db.shift.start).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '--:--';
            const shiftDate = window.state.db.shift ? new Date(window.state.db.shift.start).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Ù„Ø§ ØªÙˆØ¬Ø¯ ÙˆØ±Ø¯ÙŠØ© Ù†Ø´Ø·Ø©';

            // Waste data for current shift
            const shiftWaste = (window.state.db.waste_log || []).filter(w => w.shiftStart === shiftStart);
            const totalWasteItems = shiftWaste.length;

            const kpis = [
                { id: 'so-sales', action: 'sales', label: 'Ø¥ÙŠØ±Ø§Ø¯Ø§Øª Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª Ø§Ù„ÙƒÙ„ÙŠØ©', value: totalSales + ' Ø¬', icon: 'fa-sack-dollar', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', accent: '#34d399' },
                { id: 'so-expenses', action: 'expenses', label: 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ©', value: totalExpenses + ' Ø¬', icon: 'fa-receipt', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', accent: '#f87171' },
                { id: 'so-cash', action: 'cash', label: 'ØµØ§ÙÙŠ Ø§Ù„ÙƒØ§Ø´ (Ø§Ù„Ø¯Ø±Ø¬)', value: cashBalance + ' Ø¬', icon: 'fa-vault', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', accent: '#fcd34d' },
                { id: 'so-orders', action: 'orders', label: 'Ø¹Ø¯Ø¯ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù…Ù†ÙØ°Ø©', value: totalOrdersCount + ' Ø·Ù„Ø¨', icon: 'fa-clipboard-list', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', accent: '#60a5fa' },
                { id: 'so-avg', action: 'avg', label: 'Ù…ØªÙˆØ³Ø· Ù‚ÙŠÙ…Ø© Ø§Ù„Ø·Ù„Ø¨', value: avgOrderValue + ' Ø¬', icon: 'fa-scale-balanced', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', accent: '#a78bfa' },
                { id: 'so-customers', action: 'customers', label: 'Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ø§Ù„Ø°ÙŠÙ† Ø®ÙØ¯Ù…ÙˆØ§', value: customersServed + ' Ø¹Ù…ÙŠÙ„', icon: 'fa-users', color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.25)', accent: '#22d3ee' },
                { id: 'so-active', action: 'active', label: 'Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø© Ø§Ù„Ø¢Ù†', value: currentActiveOrders + ' Ø·Ù„Ø¨', icon: 'fa-spinner', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', accent: '#fbbf24' },
                { id: 'so-tables', action: 'tables', label: 'Ø§Ù„Ø·Ø§ÙˆÙ„Ø§Øª Ø§Ù„Ù…Ø´ØºÙˆÙ„Ø©', value: activeTables + ' / ' + (window.state.db.tables || []).length, icon: 'fa-chair', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.25)', accent: '#38bdf8' },
                { id: 'so-staff', action: 'staff', label: 'Ø§Ù„Ù…ÙˆØ¸ÙÙˆÙ† Ø§Ù„Ø­Ø§Ø¶Ø±ÙˆÙ†', value: workingEmployees + ' Ù…ÙˆØ¸Ù', icon: 'fa-id-badge', color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', accent: '#f472b6' },
                { id: 'so-waste', action: 'waste', label: 'Ù‡Ø§Ø¯Ø± Ø§Ù„ÙˆØ±Ø¯ÙŠØ©', value: totalWasteItems + ' ØµÙ†Ù', icon: 'fa-trash-can', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', accent: '#fb923c' }
            ];

            const cardsHtml = kpis.map(k => `
                <div id="${k.id}" onclick="window.openShiftDrilldown('${k.action}')" style="cursor:pointer; background: ${k.bg}; border: 1px solid ${k.border}; border-radius: 18px; padding: 22px 18px; display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; transition: all 0.3s cubic-bezier(0.4,0,0.2,1);" onmouseover="this.style.transform='translateY(-4px) scale(1.02)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.25)'; this.style.borderColor='${k.color}';" onmouseout="this.style.transform='none'; this.style.boxShadow='none'; this.style.borderColor='${k.border}';">
                    <div style="position:absolute; top:-15px; left:-15px; width:70px; height:70px; background:${k.color}; opacity:0.06; border-radius:50%;"></div>
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <div style="width:42px; height:42px; border-radius:12px; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; font-size:1.2rem; color:${k.color}; border:1px solid ${k.border};">
                            <i class="fa-solid ${k.icon}"></i>
                        </div>
                        <div style="width:8px; height:8px; border-radius:50%; background:${k.color}; animation:pulse 2s infinite; opacity:0.8;"></div>
                    </div>
                    <div>
                        <h3 style="margin:0; font-family:'Cairo'; font-weight:900; font-size:1.65rem; color:#fff; line-height:1.1;">${k.value}</h3>
                        <p style="margin:4px 0 0 0; font-size:0.78rem; opacity:0.65; font-weight:700; line-height:1.3;">${k.label}</p>
                    </div>
                </div>
            `).join('');

            const activeOrdersList = orders.filter(o => o.status === 'preparing' || o.status === 'ready' || o.status === 'billing' || o.status === 'served');
            const attendanceIn = Object.keys(checkedInIds).filter(id => checkedInIds[id] === 'in');
            
            const detailedSectionsHtml = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin-top:30px;">
                <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:18px; padding:20px;">
                    <h4 style="margin-top:0; margin-bottom:15px; color:var(--primary); font-family:'Cairo'; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;"><i class="fa-solid fa-fire"></i> Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø© (${activeOrdersList.length})</h4>
                    <div style="display:flex; flex-direction:column; gap:10px; max-height:250px; overflow-y:auto;" class="hide-scroll">
                        ${activeOrdersList.length > 0 ? activeOrdersList.map(o => `
                            <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:10px; border-right:3px solid ${o.status === 'ready' ? '#10b981' : o.status === 'preparing' ? '#f59e0b' : '#3b82f6'};">
                                <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                                    <strong>${o.table || (o.type==='takeaway'?'ØªÙŠÙƒ Ø§ÙˆØ§ÙŠ':'Ø¯Ù„ÙŠÙØ±ÙŠ')}</strong>
                                    <span style="color:#0ea5e9;">${o.total} Ø¬</span>
                                </div>
                                <div style="font-size:0.8rem; opacity:0.7; margin-top:5px;">${o.items.map(i=>i.name).join('ØŒ ')}</div>
                            </div>
                        `).join('') : '<p style="text-align:center; opacity:0.5; font-size:0.9rem;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ù„Ø¨Ø§Øª Ù†Ø´Ø·Ø© Ø­Ø§Ù„ÙŠØ§Ù‹</p>'}
                    </div>
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:18px; padding:20px;">
                    <h4 style="margin-top:0; margin-bottom:15px; color:#ec4899; font-family:'Cairo'; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;"><i class="fa-solid fa-users"></i> Ø§Ù„Ù…ÙˆØ¸ÙÙˆÙ† Ø¨Ø§Ù„ÙˆØ±Ø¯ÙŠØ© (${workingEmployees})</h4>
                    <div style="display:flex; flex-direction:column; gap:10px; max-height:250px; overflow-y:auto;" class="hide-scroll">
                        ${attendanceIn.length > 0 ? attendanceIn.map(empId => {
                            const emp = (window.state.db.employees || []).find(x => String(x.id) === String(empId));
                            const attRecord = attendance.slice().reverse().find(a => String(a.empId) === String(empId) && a.type === 'in');
                            return `
                            <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
                                <div>
                                    <div style="font-weight:bold;">${emp ? emp.name : 'Ù…Ø¬Ù‡ÙˆÙ„'}</div>
                                    <div style="font-size:0.75rem; opacity:0.6;">${emp ? emp.role : '-'}</div>
                                </div>
                                <div style="font-size:0.75rem; opacity:0.5;">
                                    ${attRecord ? new Date(attRecord.time).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'}) : ''}
                                </div>
                            </div>`;
                        }).join('') : '<p style="text-align:center; opacity:0.5; font-size:0.9rem;">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…ÙˆØ¸ÙÙŠÙ† Ù…Ø³Ø¬Ù„ÙŠÙ† Ø­Ø¶ÙˆØ±</p>'}
                    </div>
                </div>

                <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(249,115,22,0.15); border-radius:18px; padding:20px; grid-column: 1 / -1;">
                    <h4 style="margin-top:0; margin-bottom:15px; color:#f97316; font-family:'Cairo'; border-bottom:1px solid rgba(249,115,22,0.2); padding-bottom:10px;"><i class="fa-solid fa-trash-can"></i> Ù‡Ø§Ø¯Ø± Ø§Ù„ÙˆØ±Ø¯ÙŠØ© (${shiftWaste.length} ØµÙ†Ù)</h4>
                    <div style="display:flex; flex-direction:column; gap:10px; max-height:300px; overflow-y:auto;" class="hide-scroll">
                        ${shiftWaste.length > 0 ? shiftWaste.slice().reverse().map(w => `
                            <div style="background:rgba(0,0,0,0.2); padding:12px 14px; border-radius:12px; border-right:3px solid #f97316; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                                <div style="flex:1; min-width:150px;">
                                    <div style="font-weight:bold; font-size:0.95rem; color:#fff;">${w.itemName}</div>
                                    <div style="font-size:0.75rem; opacity:0.6; margin-top:3px;"><i class="fa-solid fa-layer-group" style="margin-left:4px;"></i>${w.invType === 'menu' ? 'Ù…Ø®Ø²Ù† Ø§Ù„Ø£ØµÙ†Ø§Ù' : 'Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ'}</div>
                                    ${w.reason ? '<div style="font-size:0.75rem; opacity:0.5; margin-top:2px;"><i class="fa-solid fa-comment-dots" style="margin-left:4px;"></i>' + w.reason + '</div>' : ''}
                                </div>
                                <div style="text-align:left; min-width:100px;">
                                    <div style="font-weight:900; color:#f97316; font-size:1.05rem;">${w.qty} ${w.unit}</div>
                                    <div style="font-size:0.7rem; opacity:0.5;">${new Date(w.time).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})} - ${w.by}</div>
                                </div>
                            </div>
                        `).join('') : '<p style="text-align:center; opacity:0.5; font-size:0.9rem;"><i class="fa-solid fa-circle-check" style="color:#10b981; margin-left:5px;"></i>Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù‡Ø§Ø¯Ø± Ù…Ø³Ø¬Ù„ Ø®Ù„Ø§Ù„ Ù‡Ø°Ù‡ Ø§Ù„ÙˆØ±Ø¯ÙŠØ© âœ¨</p>'}
                    </div>
                </div>
            </div>
            `;

            c.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; background:rgba(255,255,255,0.02); padding:12px 18px; border-radius:14px; border:1px solid rgba(255,255,255,0.05);">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="opacity:0.6; font-size:0.9rem;">Ø¹ÙˆØ¯Ø© Ù„Ù„Ø®Ù„Ù</span>
                    <i class="fa-solid fa-chevron-left" style="font-size:0.75rem; opacity:0.4;"></i>
                    <span style="color:#06b6d4; font-weight:900; font-size:0.95rem;">Ù…Ø±ÙƒØ² Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ© ðŸ“¡</span>
                </div>
                <button onclick="window.switchPage(window.state.role === 'admin' ? 'admin_home' : 'manager_home')" class="btn-luxury" style="width:auto; padding:6px 16px; font-size:0.85rem; background:rgba(251,191,36,0.1); color:var(--primary); border:1px solid var(--primary);"><i class="fa-solid fa-arrow-right-to-bracket" style="transform:rotate(180deg);"></i> Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ© ðŸ‘‘</button>
            </div>

            <div style="background: linear-gradient(135deg, rgba(6,182,212,0.12), rgba(0,0,0,0.4)); border:1px solid rgba(6,182,212,0.2); border-radius:18px; padding:20px 24px; margin-bottom:22px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="width:48px; height:48px; border-radius:14px; background:rgba(6,182,212,0.15); display:flex; align-items:center; justify-content:center; font-size:1.6rem; color:#06b6d4; border:1px solid rgba(6,182,212,0.3);">
                        <i class="fa-solid fa-satellite-dish"></i>
                    </div>
                    <div>
                        <h3 style="margin:0; font-family:'Cairo'; font-weight:900; font-size:1.25rem; color:#fff;">Ù…Ø±Ø§Ù‚Ø¨Ø© Ø­ÙŠØ© Ù„Ø£Ø¯Ø§Ø¡ Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©</h3>
                        <p style="margin:2px 0 0 0; font-size:0.8rem; opacity:0.65;">${shiftDate} | ÙˆÙ‚Øª Ø¨Ø¯Ø¡ Ø§Ù„ÙˆØ±Ø¯ÙŠØ©: ${shiftStartTime}</p>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:10px; height:10px; border-radius:50%; background:#10b981; animation:pulse 1.5s infinite;"></div>
                    <span style="font-size:0.85rem; font-weight:900; color:#10b981;">Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ù†Ø´Ø·Ø©</span>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px;" class="shift-ops-grid">
                ${cardsHtml}
            </div>
            
            ${detailedSectionsHtml}
            `;
        }

        function renderManagerHome(c) {
            const orders = window.state.db.orders || [];
            const activeOrders = orders.filter(o => o.status !== 'canceled');
            const sales = activeOrders.filter(o => o.paid).reduce((s, o) => s + o.total - (o.discount || 0), 0);
            const ex = (window.state.db.exp || []).reduce((s, e) => s + e.amount, 0);
            const cashSales = activeOrders.filter(o => o.paid && (!o.paymentMethod || o.paymentMethod === 'cash')).reduce((s, o) => s + o.total - (o.discount || 0), 0);
            const netDrawer = cashSales - ex;

            // Cumulative stats for general information
            const shifts = window.state.db.shifts_history || [];
            const totalSalesLife = shifts.reduce((s, h) => s + (h.sales || 0), 0) + (window.state.db.shift ? sales : 0);

            // Employee status counts
            const activeEmployees = window.state.db.employees || [];
            const attendance = window.state.db.attendance || [];

            // Count who is currently checked in (type: 'in' is last entry per employee)
            const checkedInIds = {};
            attendance.forEach(a => {
                checkedInIds[a.empId] = a.type;
            });
            const onlineStaffCount = Object.keys(checkedInIds).filter(id => checkedInIds[id] === 'in').length;

            // Calculate Inventory Alerts
            const lowMainInv = (window.state.db.main_inventory || []).filter(i => i.qty <= (i.minQty || 0));
            const lowMenuInv = (window.state.db.menu || []).filter(m => m.stock < 10);
            const hasAlerts = lowMainInv.length > 0 || lowMenuInv.length > 0;
            
            let alertsHtml = '';
            if (hasAlerts) {
                alertsHtml = `
                <div style="background:rgba(239, 68, 68, 0.1); border:1px solid var(--danger); border-radius:15px; padding:15px; margin-bottom:20px;">
                    <h4 style="color:var(--danger); margin-top:0; margin-bottom:10px; font-family:'Cairo';"><i class="fa-solid fa-bell" style="animation:pulse-blue 2s infinite; color:var(--danger);"></i> ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø§Ù„Ù†ÙˆØ§Ù‚Øµ Ø¨Ø§Ù„Ù…Ø®Ø§Ø²Ù†</h4>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        ${lowMainInv.length > 0 ? `
                        <div>
                            <strong style="color:var(--primary); font-size:0.9rem;">ðŸ“¦ Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ (Ø§Ù„Ø®Ø§Ù…Ø§Øª):</strong>
                            <ul style="margin:5px 0 0 0; padding-right:20px; font-size:0.85rem; opacity:0.8;">
                                ${lowMainInv.map(i => `<li>${i.name} (Ø§Ù„Ù…ØªØ¨Ù‚ÙŠ: ${i.qty} ${i.unit})</li>`).join('')}
                            </ul>
                        </div>` : ''}
                        ${lowMenuInv.length > 0 ? `
                        <div>
                            <strong style="color:#f43f5e; font-size:0.9rem;">ðŸ” Ù…Ø®Ø²Ù† Ø£ØµÙ†Ø§Ù Ø§Ù„Ø¨ÙŠØ¹:</strong>
                            <ul style="margin:5px 0 0 0; padding-right:20px; font-size:0.85rem; opacity:0.8;">
                                ${lowMenuInv.map(i => `<li>${i.name} (Ø§Ù„Ø±ØµÙŠØ¯: ${i.stock})</li>`).join('')}
                            </ul>
                        </div>` : ''}
                    </div>
                </div>`;
            }

            c.innerHTML = `
        <!-- Custom Welcome Executive Banner -->
        <div style="background: linear-gradient(135deg, rgba(251,191,36,0.15), rgba(0,0,0,0.6)); border: 1px solid rgba(251,191,36,0.2); padding: 25px; border-radius: 20px; color: #fff; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <div style="display:flex; align-items:center; gap:20px;">
                <div style="font-size:3.5rem; color:var(--primary); filter: drop-shadow(0 0 10px rgba(251,191,36,0.4));">ðŸ‘‘</div>
                <div>
                    <h2 style="margin:0 0 5px 0; font-family:'Cairo'; font-weight:900; font-size:1.8rem; letter-spacing:1px; background:linear-gradient(90deg, #fff, var(--primary)); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">Ù…Ø±Ø­Ø¨Ø§Ù‹ Ø¨ÙƒØŒ Ø§Ù„Ù…Ø¯ÙŠØ± ÙØ¤Ø´ ðŸ‘‘</h2>
                    <p style="margin:0; opacity:0.8; font-size:0.95rem;">Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ… Ø§Ù„ØªÙ†ÙÙŠØ°ÙŠØ© Ø§Ù„Ø´Ø§Ù…Ù„Ø© Ù„Ø¥Ø¯Ø§Ø±Ø© Ø¹Ù…Ù„ÙŠØ§Øª ÙˆØ£Ø±Ø¨Ø§Ø­ Ø§Ù„Ù…Ø·Ø¹Ù…</p>
                </div>
            </div>
            <div style="text-align: left; font-family:'Orbitron';">
                <div style="font-size: 1.1rem; color: var(--primary); font-weight: 900; margin-bottom:5px;">FOUSH POS SYSTEM</div>
                <div style="font-size: 0.85rem; opacity:0.7;">Ø§Ù„Ù†Ø³Ø®Ø© v12.0 â€¢ Ø§Ù„Ø­Ø³Ø§Ø¨ Ø§Ù„Ø³Ø­Ø§Ø¨ÙŠ</div>
            </div>
        </div>
        
        ${alertsHtml}

        <!-- Executive Financial Summary Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:15px; margin-bottom:25px;">
            <div class="stat-card" style="border-right: 4px solid var(--success); background: rgba(0,0,0,0.2);">
                <h3>Ø§Ù„Ø¥ÙŠØ±Ø§Ø¯Ø§Øª Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª Ø§Ù„ÙƒÙ„ÙŠØ©</h3>
                <p style="color:var(--success);">${sales} Ø¬</p>
                <div class="stat-icon"><i class="fa-solid fa-sack-dollar"></i></div>
            </div>
            <div class="stat-card" style="border-right: 4px solid var(--danger); background: rgba(0,0,0,0.2);">
                <h3>Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©</h3>
                <p style="color:var(--danger);">${ex} Ø¬</p>
                <div class="stat-icon"><i class="fa-solid fa-money-bill-transfer"></i></div>
            </div>
            <div class="stat-card" style="border-right: 4px solid var(--primary); background: rgba(0,0,0,0.2);">
                <h3>ØµØ§ÙÙŠ Ø§Ù„ÙƒØ§Ø´ (Ø§Ù„Ø¯Ø±Ø¬)</h3>
                <p style="color:var(--primary);">${netDrawer} Ø¬</p>
                <div class="stat-icon"><i class="fa-solid fa-cash-register"></i></div>
            </div>
            <div class="stat-card" style="border-right: 4px solid #3b82f6; background: rgba(0,0,0,0.2);">
                <h3>Ø§Ù„Ù…ÙˆØ¸ÙÙˆÙ† Ø§Ù„Ø­Ø§Ø¶Ø±ÙˆÙ†</h3>
                <p style="color:#3b82f6;">${onlineStaffCount} Ù…ÙˆØ¸Ù</p>
                <div class="stat-icon"><i class="fa-solid fa-user-check"></i></div>
            </div>
        </div>

        <h4 style="margin: 0 0 15px 0; color:var(--primary); font-family:'Cairo'; font-weight:900; font-size:1.1rem;"><i class="fa-solid fa-shapes"></i> Ø¨ÙˆØ§Ø¨Ø§Øª Ø§Ù„Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø¨Ø§Ø´Ø±Ø© Ù„Ù„Ø³ÙŠØ³ØªÙ…</h4>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:15px; margin-bottom:25px;">
            
            <div onclick="window.switchPage('employees')" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 15px; padding: 20px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap:15px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--primary)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255,255,255,0.08)';">
                <div style="width:50px; height:50px; border-radius:12px; background:rgba(59,130,246,0.15); display:flex; align-items:center; justify-content:center; font-size:1.5rem; color:#3b82f6;"><i class="fa-solid fa-users"></i></div>
                <div>
                    <h4 style="margin:0 0 3px 0; font-family:'Cairo'; font-weight:900;">Ø´Ø¤ÙˆÙ† Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ† ðŸ‘¥</h4>
                    <p style="margin:0; opacity:0.6; font-size:0.75rem;">ØªØ¹Ø¯ÙŠÙ„ Ø¨ØµÙ…Ø§Øª Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ§Ù„Ø§Ù†ØµØ±Ø§Ù ÙˆØ¥Ø¶Ø§ÙØ© Ø§Ù„Ø·Ø§Ù‚Ù…</p>
                </div>
            </div>

            <div onclick="window.switchPage('dashboard')" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 15px; padding: 20px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap:15px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--primary)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255,255,255,0.08)';">
                <div style="width:50px; height:50px; border-radius:12px; background:rgba(16,185,129,0.15); display:flex; align-items:center; justify-content:center; font-size:1.5rem; color:var(--success);"><i class="fa-solid fa-chart-line"></i></div>
                <div>
                    <h4 style="margin:0 0 3px 0; font-family:'Cairo'; font-weight:900;">Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ÙˆØ±Ø¯ÙŠØ© ÙˆØ§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª ðŸ“Š</h4>
                    <p style="margin:0; opacity:0.6; font-size:0.75rem;">Ù…Ø±Ø§Ù‚Ø¨Ø© Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª Ø§Ù„Ø­ÙŠØ©ØŒ Ø§Ù„Ø·Ø§ÙˆÙ„Ø§Øª Ø§Ù„Ù…Ø´ØºÙˆÙ„Ø©ØŒ ÙˆØ§Ù„Ù†ÙˆØ§Ù‚Øµ</p>
                </div>
            </div>

            <div onclick="window.switchPage('shift_ops')" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 15px; padding: 20px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap:15px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--primary)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255,255,255,0.08)';">
                <div style="width:50px; height:50px; border-radius:12px; background:rgba(14,165,233,0.15); display:flex; align-items:center; justify-content:center; font-size:1.5rem; color:#0ea5e9;"><i class="fa-solid fa-satellite-dish"></i></div>
                <div>
                    <h4 style="margin:0 0 3px 0; font-family:'Cairo'; font-weight:900;">Ù…Ø±ÙƒØ² Ø¹Ù…Ù„ÙŠØ§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ© ðŸ“¡</h4>
                    <p style="margin:0; opacity:0.6; font-size:0.75rem;">Ù…Ø±Ø§Ù‚Ø¨Ø© Ø­ÙŠØ© Ù„ÙƒÙ„ Ù…Ø¤Ø´Ø±Ø§Øª Ø§Ù„Ø£Ø¯Ø§Ø¡ Ø§Ù„ØªØ´ØºÙŠÙ„ÙŠ Ù„Ù„ÙˆØ±Ø¯ÙŠØ©</p>
                </div>
            </div>

            <div onclick="window.switchPage('inventory')" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 15px; padding: 20px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap:15px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='var(--primary)';" onmouseout="this.style.transform='none'; this.style.borderColor='rgba(255,255,255,0.08)';">
                <div style="width:50px; height:50px; border-radius:12px; background:rgba(244,63,94,0.15); display:flex; align-items:center; justify-content:center; font-size:1.5rem; color:#f43f5e;"><i class="fa-solid fa-burger"></i></div>
                <div>
                    <h4 style="margin:0 0 3px 0; font-family:'Cairo'; font-weight:900;">Ù…Ø®Ø²Ù† Ø£ØµÙ†Ø§Ù Ø§Ù„Ø¨ÙŠØ¹ ðŸ”</h4>
                    <p style="margin:0; opacity:0.6; font-size:0.75rem;">ØªØ¹Ø¯ÙŠÙ„ ÙˆØªØ­Ø¯ÙŠØ« Ø£Ø±ØµØ¯Ø© Ø§Ù„Ø£ØµÙ†Ø§Ù Ø§Ù„Ø¬Ø§Ù‡Ø²Ø© Ù„Ù„Ø¨ÙŠØ¹</p>
                </div>
            </div>

        </div>`;
        }

        function renderDashboard(c) {
            const orders = window.state.db.orders || [];
            const activeOrders = orders.filter(o => o.status !== 'canceled');
            const sales = activeOrders.filter(o => o.paid).reduce((s, o) => s + o.total - (o.discount || 0), 0);
            const totalOrdersToday = orders.length;
            const activeOrdersCount = orders.filter(o => o.status !== 'completed' && o.status !== 'canceled').length;

            const busyOrders = orders.filter(o => o.type === 'salla' && !o.paid && o.status !== 'completed' && o.status !== 'canceled');
            const occupiedTablesCount = busyOrders.length;
            const totalTablesCount = (window.state.db.tables || []).length;

            // Top Selling items calculation
            const itemSales = {};
            orders.filter(o => o.status !== 'canceled').forEach(o => {
                (o.items || []).forEach(i => {
                    itemSales[i.name] = (itemSales[i.name] || 0) + i.qty;
                });
            });
            const topSelling = Object.keys(itemSales)
                .map(name => ({ name, qty: itemSales[name] }))
                .sort((a, b) => b.qty - a.qty)
                .slice(0, 5);

            // Currently Working Staff
            const activeEmployees = window.state.db.employees || [];
            const attendance = window.state.db.attendance || [];
            const checkedInIds = {};
            attendance.forEach(a => {
                checkedInIds[a.empId] = a.type;
            });
            const workingStaff = activeEmployees.filter(e => checkedInIds[e.id] === 'in');

            // Alerts Calculation
            const now = Date.now();
            const delayedOrders = orders.filter(o => o.status === 'preparing' && (now - o.time) > 15 * 60 * 1000);
            const prepOrders = orders.filter(o => o.status === 'preparing').sort((a,b)=>a.time-b.time);
            const activeSallaOrders = orders.filter(o => o.type === 'salla' && o.status !== 'completed' && o.status !== 'canceled');
            const lowStockItems = (window.state.db.menu || []).filter(m => !m.unlimited && m.stock < 10);

            const systemNotifications = [];
            if (!window.state.db.shift) {
                systemNotifications.push({ text: "Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ù…ØºÙ„Ù‚Ø© Ø­Ø§Ù„ÙŠØ§Ù‹. ÙŠØ±Ø¬Ù‰ ÙØªØ­ Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ù„Ø¨Ø¯Ø¡ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ù…Ø¹Ø§Ù…Ù„Ø§Øª.", type: "danger", icon: "circle-xmark" });
            } else {
                systemNotifications.push({ text: "Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ© Ù†Ø´Ø·Ø© ÙˆØªØ¹Ù…Ù„ Ø¨Ø´ÙƒÙ„ Ù…Ù…ØªØ§Ø² ÙˆÙ…Ø²Ø§Ù…Ù†Ø© Ø³Ø­Ø§Ø¨ÙŠØ© Ù…ØªØµÙ„Ø©.", type: "success", icon: "circle-check" });
            }
            const billingOrders = orders.filter(o => o.status === 'billing' && !o.paid);
            if (billingOrders.length > 0) {
                systemNotifications.push({ text: `ÙŠÙˆØ¬Ø¯ Ø¹Ø¯Ø¯ ${billingOrders.length} Ø·Ø§ÙˆÙ„Ø© ØªØ·Ù„Ø¨ Ø­Ø³Ø§Ø¨ Ø­Ø§Ù„ÙŠØ§Ù‹!`, type: "warning", icon: "bell" });
            }

            // Channels distribution
            const sallaOrdersCount = orders.filter(o => o.type === 'salla').length;
            const takeawayOrdersCount = orders.filter(o => o.type === 'takeaway').length;
            const deliveryOrdersCount = orders.filter(o => o.type === 'delivery').length;
            const totalTypedOrders = sallaOrdersCount + takeawayOrdersCount + deliveryOrdersCount || 1;

            const sallaPct = Math.round((sallaOrdersCount / totalTypedOrders) * 100);
            const takeawayPct = Math.round((takeawayOrdersCount / totalTypedOrders) * 100);
            const deliveryPct = Math.round((deliveryOrdersCount / totalTypedOrders) * 100);

            const backBar = window.state.role === 'manager' ? `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; background:rgba(255,255,255,0.02); padding:10px 15px; border-radius:12px; border:1px solid rgba(255,255,255,0.05);">
            <div style="display:flex; align-items:center; gap:8px;">
                <span style="opacity:0.6; font-size:0.9rem;">Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…</span>
                <i class="fa-solid fa-chevron-left" style="font-size:0.8rem; opacity:0.5;"></i>
                <span style="color:var(--primary); font-weight:900; font-size:0.9rem;">Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ÙˆØ±Ø¯ÙŠØ© ÙˆØ§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª ðŸ“Š</span>
            </div>
            <button onclick="window.switchPage('manager_home')" class="btn-luxury" style="width:auto; padding:5px 15px; font-size:0.85rem; background:rgba(251,191,36,0.1); color:var(--primary); border:1px solid var(--primary);"><i class="fa-solid fa-arrow-right-to-bracket" style="transform:rotate(180deg);"></i> Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ© ðŸ‘‘</button>
        </div>` : '';

            c.innerHTML = `
        ${backBar}

        <div style="margin-bottom:20px; display:flex; justify-content:flex-end;">
            <button onclick="window.printKitchenOrders()" class="btn-luxury" style="width:auto; padding:10px 20px; font-size:1rem; font-weight:900; background:rgba(251,191,36,0.15); color:var(--primary); border:1px solid var(--primary);"><i class="fa-solid fa-print"></i> Ø·Ø¨Ø§Ø¹Ø© Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„Ù…Ø·Ø¨Ø® Ø§Ù„Ù†Ø´Ø·Ø© ðŸ–¨ï¸</button>
        </div>

        <!-- 4-Stat Overview Row -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:15px; margin-bottom:25px;">
            <div onclick="window.drillDown('sales')" class="stat-card" style="border-color:var(--success); background:rgba(16,185,129,0.04); padding:20px; text-align:center; cursor:pointer;">
                <i class="fa-solid fa-money-bill-trend-up" style="font-size:1.8rem; color:var(--success); margin-bottom:10px;"></i>
                <h2 style="font-size:2rem; font-family:'Cairo'; font-weight:900; margin:0 0 5px 0;">${sales} Ø¬</h2>
                <p style="font-size:0.85rem; opacity:0.8; margin:0;">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ù…Ø¨ÙŠØ¹Ø§Øª Ø§Ù„ÙŠÙˆÙ…</p>
            </div>
            <div onclick="window.drillDown('all_orders')" class="stat-card" style="border-color:var(--primary); background:rgba(251,191,36,0.04); padding:20px; text-align:center; cursor:pointer;">
                <i class="fa-solid fa-receipt" style="font-size:1.8rem; color:var(--primary); margin-bottom:10px;"></i>
                <h2 style="font-size:2rem; font-family:'Cairo'; font-weight:900; margin:0 0 5px 0;">${totalOrdersToday} Ø·Ù„Ø¨</h2>
                <p style="font-size:0.85rem; opacity:0.8; margin:0;">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„ÙŠÙˆÙ…</p>
            </div>
            <div onclick="window.drillDown('active')" class="stat-card" style="border-color:#3b82f6; background:rgba(59,130,246,0.04); padding:20px; text-align:center; cursor:pointer;">
                <i class="fa-solid fa-bell-concierge" style="font-size:1.8rem; color:#3b82f6; margin-bottom:10px;"></i>
                <h2 style="font-size:2rem; font-family:'Cairo'; font-weight:900; margin:0 0 5px 0;">${activeOrdersCount} Ø·Ù„Ø¨</h2>
                <p style="font-size:0.85rem; opacity:0.8; margin:0;">Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø© Ø­Ø§Ù„ÙŠØ§Ù‹</p>
            </div>
            <div onclick="window.switchPage('tables')" class="stat-card" style="border-color:#0ea5e9; background:rgba(14,165,233,0.04); padding:20px; text-align:center; cursor:pointer;">
                <i class="fa-solid fa-chair" style="font-size:1.8rem; color:#0ea5e9; margin-bottom:10px;"></i>
                <h2 style="font-size:2rem; font-family:'Cairo'; font-weight:900; margin:0 0 5px 0;">${occupiedTablesCount} / ${totalTablesCount}</h2>
                <p style="font-size:0.85rem; opacity:0.8; margin:0;">Ø§Ù„Ø·Ø§ÙˆÙ„Ø§Øª Ø§Ù„Ù…Ø´ØºÙˆÙ„Ø© Ø¨Ø§Ù„ØµØ§Ù„Ø©</p>
            </div>
        </div>

        <!-- Kitchen Monitor Tracker -->
        <div class="cart-side" style="padding:15px; border-color:#f59e0b; background:rgba(0,0,0,0.15); margin-bottom:25px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                <h4 style="color:#f59e0b; font-weight:900; font-size:1.1rem; margin:0;"><i class="fa-solid fa-fire-burner"></i> Ù…ØªØ§Ø¨Ø¹Ø© Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„Ù…Ø·Ø¨Ø® Ø§Ù„Ø­ÙŠØ© ðŸ”¥</h4>
            </div>
            <div style="display:flex; gap:15px; overflow-x:auto; padding-bottom:10px;" class="hide-scroll">
                ${prepOrders.map(o => {
                    const elapsed = Math.floor((Date.now() - o.time) / 60000);
                    const isLate = elapsed >= 15;
                    return `<div class="order-card" style="min-width:250px; border-right-color:${isLate?'var(--danger)':'#f59e0b'};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <h4 style="margin:0; font-family:'Orbitron'; font-size:1.1rem;">#${o.id} - ${o.table}</h4>
                            <span style="font-size:0.8rem; background:${isLate?'var(--danger)':'rgba(255,255,255,0.1)'}; color:${isLate?'#fff':'var(--text)'}; padding:2px 8px; border-radius:5px;"><i class="fa-regular fa-clock"></i> <span class="timer-text" data-start="${o.time}">${elapsed}:00</span></span>
                        </div>
                        <ul style="list-style:none; padding:0; margin:0; font-size:0.9rem;">
                            ${o.items.map(i=>`<li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>${i.name}</span><span style="font-weight:bold; color:var(--primary);">x${i.qty}</span></li>`).join('')}
                        </ul>
                        ${o.notes ? `<p style="margin-top:8px; font-size:0.8rem; color:#f59e0b; background:rgba(245,158,11,0.1); padding:4px; border-radius:4px;">${o.notes}</p>` : ''}
                    </div>`;
                }).join('') || '<p style="text-align:center; opacity:0.5; width:100%;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ù†Ø´Ø·Ø© Ø¨Ø§Ù„Ù…Ø·Ø¨Ø® Ø­Ø§Ù„ÙŠØ§Ù‹</p>'}
            </div>
        </div>

        <!-- Salla Details Tracker -->
        <div class="cart-side" style="padding:15px; border-color:#a855f7; background:rgba(0,0,0,0.15); margin-bottom:25px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                <h4 style="color:#a855f7; font-weight:900; font-size:1.1rem; margin:0;"><i class="fa-solid fa-bell-concierge"></i> ØªÙØ§ØµÙŠÙ„ Ø·Ø§ÙˆÙ„Ø§Øª Ø§Ù„ØµØ§Ù„Ø© Ø§Ù„Ø­ÙŠØ© ðŸ½ï¸</h4>
            </div>
            <div style="display:flex; gap:15px; overflow-x:auto; padding-bottom:10px;" class="hide-scroll">
                ${activeSallaOrders.map(o => {
                    const statusColor = o.status === 'preparing' ? '#f59e0b' : o.status === 'ready' ? 'var(--success)' : o.status === 'served' ? 'var(--primary)' : o.status === 'billing' ? 'var(--danger)' : '#fff';
                    const statusText = o.status === 'preparing' ? 'Ø¬Ø§Ø±ÙŠ Ø§Ù„ØªØ¬Ù‡ÙŠØ²' : o.status === 'ready' ? 'Ø¬Ø§Ù‡Ø² Ù„Ù„Ø§Ø³ØªÙ„Ø§Ù…' : o.status === 'served' ? 'ÙŠØ£ÙƒÙ„ Ø§Ù„Ø¢Ù†' : o.status === 'billing' ? 'Ø·Ù„Ø¨ Ø§Ù„Ø­Ø³Ø§Ø¨' : o.status;
                    return `<div class="order-card" style="min-width:250px; border-right-color:${statusColor};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <h4 style="margin:0; font-family:'Orbitron'; font-size:1.1rem; color:${statusColor};">${o.table} <small style="opacity:0.6; color:#fff;">#${o.id}</small></h4>
                            <span style="font-size:0.75rem; background:rgba(0,0,0,0.4); border:1px solid ${statusColor}; color:${statusColor}; padding:2px 8px; border-radius:5px;">${statusText}</span>
                        </div>
                        <ul style="list-style:none; padding:0; margin:0; font-size:0.9rem; margin-bottom:10px;">
                            ${o.items.map(i=>`<li style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>${i.name}</span><span style="font-weight:bold; color:var(--primary);">x${i.qty}</span></li>`).join('')}
                        </ul>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed rgba(255,255,255,0.1); padding-top:8px;">
                            <span style="font-size:0.8rem; opacity:0.7;"><i class="fa-solid fa-user"></i> ${o.waiter || 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯'}</span>
                            <span style="font-weight:900; color:var(--primary);">${o.total} Ø¬</span>
                        </div>
                    </div>`;
                }).join('') || '<p style="text-align:center; opacity:0.5; width:100%;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ø§ÙˆÙ„Ø§Øª Ù…Ø´ØºÙˆÙ„Ø© Ø¨Ø§Ù„ØµØ§Ù„Ø© Ø­Ø§Ù„ÙŠØ§Ù‹</p>'}
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1.4fr 1fr; gap:20px; margin-bottom:25px;" class="dashboard-columns">
            
            <!-- Column 1: Analytics & Alert Feeds -->
            <div style="display:flex; flex-direction:column; gap:20px;">
                
                <!-- Quick Alerts & Notifications -->
                <div class="cart-side" style="padding:15px; border-color:var(--danger); background:rgba(0,0,0,0.15);">
                    <h4 style="color:var(--danger); margin-bottom:15px; font-weight:900; font-size:1rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;"><i class="fa-solid fa-triangle-exclamation"></i> Ù‚Ø³Ù… Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø§Ù„Ø³Ø±ÙŠØ¹Ø© Ù„Ù„Ù…Ø·Ø¹Ù…</h4>
                    
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        
                        <!-- Delayed Orders Alerts -->
                        ${delayedOrders.length > 0 ? `
                        <div style="display:flex; align-items:center; gap:12px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); padding:10px 15px; border-radius:10px; color:#f87171;">
                            <i class="fa-solid fa-clock-rotate-left" style="font-size:1.2rem; animation:pulse-red 1.5s infinite;"></i>
                            <div style="flex:1;">
                                <h5 style="margin:0 0 2px 0; font-family:'Cairo'; font-weight:900;">Ø·Ù„Ø¨Ø§Øª Ù…ØªØ£Ø®Ø±Ø© Ø¨Ø§Ù„Ù…Ø·Ø¨Ø® âš ï¸</h5>
                                <p style="margin:0; font-size:0.8rem; opacity:0.9;">ÙŠÙˆØ¬Ø¯ Ø¹Ø¯Ø¯ ${delayedOrders.length} Ø·Ù„Ø¨ ØªØ¬Ø§ÙˆØ² Ù…Ø¯Ø© Ø§Ù„ØªØ¬Ù‡ÙŠØ² (15 Ø¯Ù‚ÙŠÙ‚Ø©). ÙŠØ±Ø¬Ù‰ Ù…Ø±Ø§Ø¬Ø¹Ø© Ø§Ù„Ø´ÙŠÙ.</p>
                            </div>
                        </div>
                        ` : ''}

                        <!-- Low Stock Warnings -->
                        ${lowStockItems.length > 0 ? `
                        <div style="display:flex; align-items:center; gap:12px; background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.2); padding:10px 15px; border-radius:10px; color:#fbbf24;">
                            <i class="fa-solid fa-box-open" style="font-size:1.2rem;"></i>
                            <div style="flex:1;">
                                <h5 style="margin:0 0 2px 0; font-family:'Cairo'; font-weight:900;">Ù†Ù‚Øµ ÙÙŠ Ø±ØµÙŠØ¯ Ø§Ù„Ù†ÙˆØ§Ù‚Øµ ÙˆØ§Ù„Ù…Ø®Ø²ÙˆÙ† ðŸ“¦</h5>
                                <p style="margin:0; font-size:0.8rem; opacity:0.9;">Ø£ØµÙ†Ø§Ù Ø§Ù‚ØªØ±Ø¨Øª Ù…Ù† Ø§Ù„Ù†ÙØ§Ø¯: ${lowStockItems.slice(0, 3).map(m => `${m.name} (${m.stock})`).join('ØŒ ')} ${lowStockItems.length > 3 ? '...' : ''}</p>
                            </div>
                        </div>
                        ` : ''}

                        <!-- System Notifications -->
                        ${systemNotifications.map(n => `
                        <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:10px 15px; border-radius:10px;">
                            <i class="fa-solid fa-${n.icon}" style="font-size:1.2rem; color:${n.type === 'danger' ? 'var(--danger)' : n.type === 'warning' ? 'var(--primary)' : 'var(--success)'};"></i>
                            <div style="flex:1;">
                                <h5 style="margin:0 0 2px 0; font-family:'Cairo'; font-weight:900; color:${n.type === 'danger' ? 'var(--danger)' : n.type === 'warning' ? 'var(--primary)' : 'var(--success)'};">${n.type === 'danger' ? 'ØªØ­Ø°ÙŠØ± Ø¥Ø¯Ø§Ø±ÙŠ Ù‡Ø§Ù…' : n.type === 'warning' ? 'ØªÙ†Ø¨ÙŠÙ‡ Ù…Ø§Ù„ÙŠ' : 'Ø­Ø§Ù„Ø© Ø§Ù„Ù†Ø¸Ø§Ù…'}</h5>
                                <p style="margin:0; font-size:0.8rem; opacity:0.8;">${n.text}</p>
                            </div>
                        </div>
                        `).join('')}

                        ${delayedOrders.length === 0 && lowStockItems.length === 0 && systemNotifications.length === 1 ? `
                        <p style="text-align:center; opacity:0.6; font-size:0.9rem; margin:10px 0;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£ÙŠ ØªØ­Ø°ÙŠØ±Ø§Øª Ø£Ùˆ Ù†ÙˆØ§Ù‚Øµ Ø­Ø§Ù„ÙŠØ§Ù‹ØŒ Ø§Ù„Ø¹Ù…Ù„ÙŠØ§Øª ØªØ³ÙŠØ± Ø¨Ø´ÙƒÙ„ Ù…Ø«Ø§Ù„ÙŠ! âœ¨</p>
                        ` : ''}

                    </div>
                </div>

                <!-- Live Charts & Analytics -->
                <div class="cart-side" style="padding:15px; border-color:var(--primary); background:rgba(0,0,0,0.15);">
                    <h4 style="color:var(--primary); margin-bottom:15px; font-weight:900; font-size:1rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;"><i class="fa-solid fa-chart-simple"></i> Ù…Ø¤Ø´Ø±Ø§Øª Ø£Ø¯Ø§Ø¡ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª ÙˆØ§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ø­ÙŠØ©</h4>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:20px;" class="dashboard-columns">
                        
                        <!-- Order type distribution progress segmented bar -->
                        <div>
                            <h5 style="margin:0 0 12px 0; font-family:'Cairo'; font-weight:900; font-size:0.85rem; opacity:0.8;">Ù†Ø³Ø¨Ø© ØªÙˆØ²ÙŠØ¹ Ù‚Ù†ÙˆØ§Øª Ø§Ù„Ø£ÙˆØ±Ø¯Ø±Ø§Øª</h5>
                            <div style="display:flex; height:24px; border-radius:12px; overflow:hidden; background:#0f172a; margin-bottom:15px;">
                                ${sallaOrdersCount > 0 ? `<div style="width:${sallaPct}%; background:#a855f7; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.7rem; font-weight:900;" title="ØµØ§Ù„Ø©">${sallaPct}%</div>` : ''}
                                ${takeawayOrdersCount > 0 ? `<div style="width:${takeawayPct}%; background:var(--primary); display:flex; align-items:center; justify-content:center; color:#000; font-size:0.7rem; font-weight:900;" title="ØªÙŠÙƒ Ø§ÙˆØ§ÙŠ">${takeawayPct}%</div>` : ''}
                                ${deliveryOrdersCount > 0 ? `<div style="width:${deliveryPct}%; background:#0ea5e9; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.7rem; font-weight:900;" title="Ø¯Ù„ÙŠÙØ±ÙŠ">${deliveryPct}%</div>` : ''}
                            </div>
                            <div style="display:flex; flex-direction:column; gap:8px; font-size:0.8rem;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span><i class="fa-solid fa-circle" style="color:#a855f7; font-size:0.6rem;"></i> ØµØ§Ù„Ø© (Ø§Ù„Ù…Ø·Ø¹Ù… Ø¯Ø§Ø®Ù„ÙŠ):</span>
                                    <span style="font-weight:900;">${sallaOrdersCount} Ø·Ù„Ø¨ (${sallaPct}%)</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span><i class="fa-solid fa-circle" style="color:var(--primary); font-size:0.6rem;"></i> ØªÙŠÙƒ Ø§ÙˆØ§ÙŠ (Ø³ÙØ±ÙŠ):</span>
                                    <span style="font-weight:900;">${takeawayOrdersCount} Ø·Ù„Ø¨ (${takeawayPct}%)</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <span><i class="fa-solid fa-circle" style="color:#0ea5e9; font-size:0.6rem;"></i> Ø¯Ù„ÙŠÙØ±ÙŠ (ØªÙˆØµÙŠÙ„):</span>
                                    <span style="font-weight:900;">${deliveryOrdersCount} Ø·Ù„Ø¨ (${deliveryPct}%)</span>
                                </div>
                            </div>
                        </div>

                        <!-- Hourly trend (Beautiful visual columns layout) -->
                        <div style="display:flex; flex-direction:column; justify-content:space-between;">
                            <h5 style="margin:0 0 10px 0; font-family:'Cairo'; font-weight:900; font-size:0.85rem; opacity:0.8;">Ù…Ø¹Ø¯Ù„ Ø§Ù„Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø¹Ù„Ù‰ Ù…Ø¯Ø§Ø± Ø§Ù„ÙŠÙˆÙ… (Ø§Ù„Ù‚Ù…Ø©)</h5>
                            <div style="display:flex; align-items:flex-end; justify-content:space-between; height:100px; padding-bottom:5px; border-bottom:1px solid rgba(255,255,255,0.1); margin-bottom:8px;">
                                <div style="display:flex; flex-direction:column; align-items:center; width:14%;">
                                    <div style="height:35px; background:linear-gradient(to top, rgba(251,191,36,0.3), var(--primary)); width:100%; border-radius:4px 4px 0 0;" title="35%"></div>
                                    <span style="font-size:0.55rem; margin-top:4px; opacity:0.6;">09:00 Øµ</span>
                                </div>
                                <div style="display:flex; flex-direction:column; align-items:center; width:14%;">
                                    <div style="height:65px; background:linear-gradient(to top, rgba(251,191,36,0.3), var(--primary)); width:100%; border-radius:4px 4px 0 0;" title="65%"></div>
                                    <span style="font-size:0.55rem; margin-top:4px; opacity:0.6;">12:00 Ù…</span>
                                </div>
                                <div style="display:flex; flex-direction:column; align-items:center; width:14%;">
                                    <div style="height:85px; background:linear-gradient(to top, rgba(251,191,36,0.3), var(--primary)); width:100%; border-radius:4px 4px 0 0;" title="85%"></div>
                                    <span style="font-size:0.55rem; margin-top:4px; opacity:0.6;">03:00 Ù…</span>
                                </div>
                                <div style="display:flex; flex-direction:column; align-items:center; width:14%;">
                                    <div style="height:100px; background:linear-gradient(to top, rgba(251,191,36,0.3), var(--primary)); width:100%; border-radius:4px 4px 0 0;" title="100%"></div>
                                    <span style="font-size:0.55rem; margin-top:4px; opacity:0.6;">06:00 Ù…</span>
                                </div>
                                <div style="display:flex; flex-direction:column; align-items:center; width:14%;">
                                    <div style="height:80px; background:linear-gradient(to top, rgba(251,191,36,0.3), var(--primary)); width:100%; border-radius:4px 4px 0 0;" title="80%"></div>
                                    <span style="font-size:0.55rem; margin-top:4px; opacity:0.6;">09:00 Ù…</span>
                                </div>
                                <div style="display:flex; flex-direction:column; align-items:center; width:14%;">
                                    <div style="height:45px; background:linear-gradient(to top, rgba(251,191,36,0.3), var(--primary)); width:100%; border-radius:4px 4px 0 0;" title="45%"></div>
                                    <span style="font-size:0.55rem; margin-top:4px; opacity:0.6;">12:00 Øµ</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <!-- Column 2: Topselling and Currently Active Staff -->
            <div style="display:flex; flex-direction:column; gap:20px;">
                
                <!-- Top Selling Items List -->
                <div class="cart-side" style="padding:15px; border-color:var(--success); background:rgba(0,0,0,0.15);">
                    <h4 style="color:var(--success); margin-bottom:15px; font-weight:900; font-size:1rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;"><i class="fa-solid fa-award"></i> Ø§Ù„Ø£ØµÙ†Ø§Ù Ø§Ù„Ø£ÙƒØ«Ø± Ù…Ø¨ÙŠØ¹Ø§Ù‹ Ø§Ù„ÙŠÙˆÙ… ðŸ¥˜</h4>
                    
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${topSelling.map((item, index) => {
                // Find the category for appropriate emoji or color
                const menuItem = (window.state.db.menu || []).find(m => m.name === item.name);
                const category = menuItem ? menuItem.category : '';
                const badgeColor = index === 0 ? 'var(--primary)' : index === 1 ? '#cbd5e1' : index === 2 ? '#b45309' : 'rgba(255,255,255,0.6)';
                return `
                            <div style="display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02); padding:10px 15px; border-radius:12px; border:1px solid rgba(255,255,255,0.03);">
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <span style="width:24px; height:24px; border-radius:50%; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; font-weight:900; color:${badgeColor}; font-size:0.9rem;">${index + 1}</span>
                                    <div>
                                        <span style="font-weight:900; font-size:0.9rem;">${item.name}</span>
                                        <br>
                                        <small style="opacity:0.5; font-size:0.75rem;">${category}</small>
                                    </div>
                                </div>
                                <span style="font-family:'Orbitron'; font-weight:900; color:var(--success); font-size:1.1rem;">x${item.qty}</span>
                            </div>`;
            }).join('') || '<p style="text-align:center; opacity:0.5; font-size:0.9rem;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ø¨ÙŠØ¹Ø§Øª Ù…Ø³Ø¬Ù„Ø© Ù„Ù„ØªØ­Ù„ÙŠÙ„</p>'}
                    </div>
                </div>

                <!-- Currently Working Staff Live Grid -->
                <div class="cart-side" style="padding:15px; border-color:#3b82f6; background:rgba(0,0,0,0.15); overflow-y:auto; max-height:280px;">
                    <h4 style="color:#3b82f6; margin-bottom:15px; font-weight:900; font-size:1rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;"><i class="fa-solid fa-circle-dot" style="color:#3b82f6; animation:pulse-blue 1.5s infinite;"></i> Ø§Ù„Ù…ÙˆØ¸ÙÙˆÙ† Ø§Ù„Ø¹Ø§Ù…Ù„ÙˆÙ† Ø¨Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©</h4>
                    
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${workingStaff.map(e => `
                        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:8px 12px; border-radius:10px; border:1px solid rgba(255,255,255,0.03);">
                            <div>
                                <span style="font-weight:900; font-size:0.9rem;">${e.name}</span>
                                <br>
                                <small style="opacity:0.6; font-size:0.75rem;">${e.role === 'waiter' ? 'ÙˆÙŠØªØ±ðŸ¤µ' : e.role === 'cashier' ? 'ÙƒØ§Ø´ÙŠØ±ðŸ’°' : e.role === 'kitchen' ? 'Ø·Ø¨Ø§Ø®ðŸ”¥' : 'Ù…Ø¯ÙŠØ±ðŸ‘‘'}</small>
                            </div>
                            <span class="badge badge-ready" style="font-size:0.75rem; background:rgba(16,185,129,0.15); color:var(--success);">Ø¨ØµÙ…Ø© Ø­Ø¶ÙˆØ± ðŸŸ¢</span>
                        </div>
                        `).join('') || '<p style="text-align:center; opacity:0.5; font-size:0.9rem;">Ù„Ù… ÙŠØªÙ… ØªØ³Ø¬ÙŠÙ„ Ø­Ø¶ÙˆØ± Ø£ÙŠ Ù…ÙˆØ¸Ù Ø§Ù„ÙŠÙˆÙ…</p>'}
                    </div>
                </div>

            </div>

        </div>`;
        }

        window.openKitchenWithdrawalModal = () => {
            const select = document.getElementById('kw-item');
            if (select) {
                const inventory = window.state.db.main_inventory || [];
                select.innerHTML = '<option value="">-- Ø§Ø®ØªØ± Ø§Ù„Ø®Ø§Ù…Ø© --</option>' + inventory.map(i => `<option value="${i.id}">${i.name} (Ø§Ù„Ù…ØªØ§Ø­: ${i.qty} ${i.unit})</option>`).join('');
            }
            document.getElementById('kw-qty').value = '';
            document.getElementById('kitchen-withdrawal-modal').style.display = 'flex';
        };

        window.saveKitchenWithdrawal = () => {
            const select = document.getElementById('kw-item');
            const qtyInput = document.getElementById('kw-qty');
            if (!select.value) {
                window.showToast("âš ï¸ Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø®Ø§Ù…Ø© Ø§Ù„Ù…Ø³Ø­ÙˆØ¨Ø©");
                return;
            }
            const qty = parseFloat(qtyInput.value);
            if (!qty || qty <= 0) {
                window.showToast("âš ï¸ Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø¥Ø¯Ø®Ø§Ù„ ÙƒÙ…ÙŠØ© ØµØ­ÙŠØ­Ø©");
                return;
            }

            const item = window.state.db.main_inventory.find(i => i.id === select.value);
            if (item) {
                if (qty > item.qty) {
                    window.showToast("âš ï¸ Ø§Ù„ÙƒÙ…ÙŠØ© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø© ØºÙŠØ± Ù…ØªÙˆÙØ±Ø© ÙÙŠ Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ");
                    return;
                }
                item.qty -= qty;
                
                // Track this as a withdrawal (you can also log it to a specific withdrawals table if you like)
                if (!window.state.db.withdrawals) window.state.db.withdrawals = [];
                window.state.db.withdrawals.push({
                    id: Date.now().toString(),
                    itemId: item.id,
                    itemName: item.name,
                    qty: qty,
                    unit: item.unit,
                    time: Date.now(),
                    shiftStart: window.state.db.shift ? window.state.db.shift.start : null,
                    by: window.state.empName || window.state.role
                });

                window.save();
                window.render();
                document.getElementById('kitchen-withdrawal-modal').style.display = 'none';
                window.playSound('success');
                window.showToast(`ØªÙ… Ø³Ø­Ø¨ ${qty} ${item.unit} Ù…Ù† ${item.name} Ø¨Ù†Ø¬Ø§Ø­ âœ…`);
            }
        };

        window.openWasteModal = (id, type) => {
            const list = type === 'menu' ? window.state.db.menu : window.state.db.main_inventory;
            const item = (list || []).find(i => String(i.id) === String(id));
            if (!item) return;

            document.getElementById('waste-item-id').value = id;
            document.getElementById('waste-inv-type').value = type;
            document.getElementById('waste-item-name').innerText = `ØªØ³Ø¬ÙŠÙ„ Ù‡Ø§Ø¯Ø± Ù„Ù„ØµÙ†Ù: ${item.name} (${type === 'menu' ? 'Ù…Ø®Ø²Ù† Ø£ØµÙ†Ø§Ù' : 'Ù…Ø®Ø²Ù† Ø±Ø¦ÙŠØ³ÙŠ'})`;
            document.getElementById('waste-qty').value = '';
            document.getElementById('waste-reason').value = '';

            document.getElementById('waste-modal').style.display = 'flex';
        };

        window.saveWaste = () => {
            const id = document.getElementById('waste-item-id').value;
            const type = document.getElementById('waste-inv-type').value;
            const qty = parseFloat(document.getElementById('waste-qty').value);
            const reason = document.getElementById('waste-reason').value || 'ØºÙŠØ± Ù…Ø­Ø¯Ø¯';

            if (!qty || qty <= 0) {
                window.showToast("âš ï¸ Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø¥Ø¯Ø®Ø§Ù„ ÙƒÙ…ÙŠØ© ØµØ­ÙŠØ­Ø© Ù„Ù„Ù‡Ø§Ø¯Ø±");
                return;
            }

            const list = type === 'menu' ? window.state.db.menu : window.state.db.main_inventory;
            const item = list.find(i => String(i.id) === String(id));

            if (item) {
                const currentStock = type === 'menu' ? item.stock : item.qty;
                if (qty > currentStock) {
                    window.showToast("âš ï¸ ÙƒÙ…ÙŠØ© Ø§Ù„Ù‡Ø§Ø¯Ø± Ø£ÙƒØ¨Ø± Ù…Ù† Ø§Ù„Ø±ØµÙŠØ¯ Ø§Ù„Ù…ØªØ§Ø­!");
                    return;
                }

                // Deduct
                if (type === 'menu') {
                    item.stock -= qty;
                } else {
                    item.qty -= qty;
                }

                // Log waste
                if (!window.state.db.waste_log) window.state.db.waste_log = [];
                window.state.db.waste_log.push({
                    id: Date.now().toString(),
                    itemId: item.id,
                    itemName: item.name,
                    invType: type,
                    qty: qty,
                    unit: type === 'menu' ? 'Ù‚Ø·Ø¹Ø©/Ø·Ù„Ø¨' : item.unit,
                    reason: reason,
                    time: Date.now(),
                    shiftStart: window.state.db.shift ? window.state.db.shift.start : null,
                    by: window.state.empName || window.state.role
                });

                window.save();
                window.render();
                document.getElementById('waste-modal').style.display = 'none';
                window.playSound('success');
                window.showToast(`ØªÙ… ØªØ³Ø¬ÙŠÙ„ ${qty} ÙƒÙ€ Ù‡Ø§Ø¯Ø± Ù…Ù† ${item.name} âœ…`);
            }
        };

        function renderKitchen(c) {
            const orders = window.state.db.orders || [];
            const prep = orders.filter(o => o.status === 'preparing').sort((a, b) => a.time - b.time); // Oldest at the top
            const ready = orders.filter(o => o.status === 'ready');
            const readySalla = ready.filter(o => o.type === 'salla');
            const readyExternal = ready.filter(o => o.type !== 'salla');

            // Aggregate items
            const agg = {};
            prep.forEach(o => o.items.forEach(i => { agg[i.name] = (agg[i.name] || 0) + i.qty; }));
            const aggHtml = Object.keys(agg).map(k => `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);"><span style="font-size:1rem; font-weight:900;">${k}</span><span style="color:var(--primary); font-size:1.1rem; font-weight:900;">x${agg[k]}</span></div>`).join('');

            c.innerHTML = `
        <div style="margin-bottom:15px; display:flex; justify-content:center; gap:10px;">
            <button onclick="window.printKitchenOrders()" class="btn-luxury" style="width:auto; padding:10px 20px; font-size:1rem; font-weight:900; background:rgba(251,191,36,0.15); color:var(--primary); border:1px solid var(--primary); margin:0;"><i class="fa-solid fa-print"></i> Ø·Ø¨Ø§Ø¹Ø© Ø£ÙˆØ±Ø¯Ø±Ø§Øª Ø§Ù„Ù…Ø·Ø¨Ø® Ø§Ù„Ù†Ø´Ø·Ø© ðŸ–¨ï¸</button>
            <button onclick="window.openKitchenWithdrawalModal()" class="btn-luxury" style="width:auto; padding:10px 20px; font-size:1rem; font-weight:900; background:rgba(16,185,129,0.15); color:var(--success); border:1px solid var(--success); margin:0;"><i class="fa-solid fa-hand-holding-box"></i> Ø³Ø­Ø¨ Ø®Ø§Ù…Ø§Øª Ù„Ù„Ù…Ø·Ø¨Ø® ðŸ“¦</button>
        </div>
        <div class="kitchen-layout-grid">
            <div class="cart-side hide-scroll" style="overflow-y:auto; border-color:var(--primary); background:rgba(0,0,0,0.3); padding:10px;">
                <h3 style="color:var(--primary); text-align:center; margin-bottom:15px; font-family:'Orbitron';">Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù…Ø¬Ù…Ø¹Ø© ðŸ“Š</h3>
                ${aggHtml || '<p style="text-align:center; opacity:0.5;">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø·Ù„Ø¨Ø§Øª</p>'}
            </div>
            
            <div class="cart-side hide-scroll" style="overflow-y:auto; border-color:var(--danger); padding:10px;">
                <h3 style="color:var(--danger); text-align:center; margin-bottom:15px; font-family:'Orbitron';">ØªØ­Øª Ø§Ù„ØªØ¬Ù‡ÙŠØ² ðŸ”¥ (${prep.length})</h3>
                <div style="display:flex; flex-direction:column; gap:10px;">${prep.map(o => `<div class="order-card" style="width:100%; border:2px solid var(--danger); box-shadow:0 0 10px rgba(239,68,68,0.3); padding:8px;"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"><div class="table-badge" style="background:var(--danger); color:#fff; font-weight:900; font-size:1rem; border-radius:5px; padding:3px 8px;">${o.table}</div><div class="order-timer-premium" style="font-size:1.1rem; background:rgba(0,0,0,0.4); padding:3px 8px; border-radius:8px;"><div class="timer-dot" style="background:var(--danger); width:6px; height:6px;"></div><span class="timer-text" data-start="${o.time}">00:00</span></div></div><div style="display:flex; justify-content:space-between; margin-bottom:6px; opacity:0.6; font-size:0.7rem;"><span>#${o.id}</span><span>${o.type === 'takeaway' ? 'ØªÙŠÙƒ Ø§ÙˆØ§ÙŠ' : o.type === 'delivery' ? 'Ø¯Ù„ÙŠÙØ±ÙŠ' : 'ØµØ§Ù„Ø©'}</span></div>${o.notes ? `<div style="background:rgba(251,191,36,0.15); border:1px dashed var(--primary); border-radius:5px; padding:5px; margin:5px 0; text-align:center; font-weight:900; font-size:0.9rem; color:var(--primary);"><i class="fa-solid fa-triangle-exclamation"></i> ${o.notes}</div>` : ''}<div style="flex:1; margin:6px 0;">${o.items.map(i => `<div onclick="this.style.textDecoration=this.style.textDecoration==='line-through'?'none':'line-through'; this.style.opacity=this.style.opacity==='0.4'?'1':'0.4';" style="font-size:1rem; font-weight:900; border-bottom:1px dashed rgba(255,255,255,0.05); padding:4px 0; cursor:pointer; transition:0.3s; user-select:none;">${i.name} <span style="color:var(--danger); float:left;">x${i.qty}</span></div>`).join('')}</div><button onclick="window.kitchenAction('${o.id}','ready')" class="btn-luxury" style="height:40px; font-size:1.1rem; background:var(--success); color:#fff; border:none; padding:0; width:100%; margin-top:5px;">Ø¥Ø±Ø³Ø§Ù„ Ù„Ù„Ø§Ø³ØªÙ„Ø§Ù… ðŸ“¤</button></div>`).join('')}</div>
            </div>
            
            <div class="cart-side hide-scroll" style="overflow-y:auto; border-color:var(--success); padding:10px;">
                <h3 style="color:var(--success); text-align:center; margin-bottom:15px; font-family:'Orbitron'; font-size:1.1rem;">Ø¬Ø§Ù‡Ø² (ØµØ§Ù„Ø©) ðŸ½ï¸ (${readySalla.length})</h3>
                <div style="display:flex; flex-direction:column; gap:10px;">${readySalla.map(o => `<div class="order-card" style="width:100%; border:2px solid var(--success); box-shadow:0 0 10px rgba(16,185,129,0.3); opacity:0.9; padding:8px;"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"><div style="background:var(--success); color:#fff; font-weight:900; font-size:0.9rem; border-radius:5px; padding:2px 6px;">${o.table}</div><div class="order-timer-premium" style="font-size:0.9rem; background:rgba(0,0,0,0.4); padding:2px 6px; border-radius:8px;"><div class="timer-dot" style="background:var(--success);"></div><span class="timer-text" data-start="${o.time}">00:00</span></div></div><div style="flex:1; margin:6px 0;">${o.items.map(i => `<div style="font-size:0.9rem; font-weight:900; opacity:0.8; border-bottom:1px dashed rgba(255,255,255,0.05); padding:3px 0;">${i.name} <span style="color:var(--success); float:left;">x${i.qty}</span></div>`).join('')}</div><div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;"><button onclick="window.kitchenAction('${o.id}','preparing')" class="btn-luxury" style="background:transparent; border:1px solid var(--danger); color:var(--danger); padding:3px 6px; font-size:0.75rem; width:auto;">Ø¥Ø±Ø¬Ø§Ø¹ â†©ï¸</button><button onclick="window.kitchenAction('${o.id}','served')" class="btn-luxury" style="background:var(--success); color:#fff; padding:4px 10px; font-size:0.9rem; width:auto; border:none;">ØªÙ… Ø§Ù„ØªØ³Ù„ÙŠÙ… Ù„Ù„ÙˆÙŠØªØ± ðŸš€</button></div></div>`).join('')}</div>
            </div>

            <div class="cart-side hide-scroll" style="overflow-y:auto; border-color:#0ea5e9; padding:10px;">
                <h3 style="color:#0ea5e9; text-align:center; margin-bottom:15px; font-family:'Orbitron'; font-size:1.1rem;">Ø¬Ø§Ù‡Ø² (Ø®Ø§Ø±Ø¬ÙŠ) ðŸ“¦ (${readyExternal.length})</h3>
                <div style="display:flex; flex-direction:column; gap:10px;">${readyExternal.map(o => `<div class="order-card" style="width:100%; border:2px solid #0ea5e9; box-shadow:0 0 10px rgba(14,165,233,0.3); opacity:0.9; padding:8px;"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"><div style="background:#0ea5e9; color:#fff; font-weight:900; font-size:0.9rem; border-radius:5px; padding:2px 6px;">${o.type === 'takeaway' ? 'ØªÙŠÙƒ Ø§ÙˆØ§ÙŠ' : 'Ø¯Ù„ÙŠÙØ±ÙŠ'}</div><div class="order-timer-premium" style="font-size:0.9rem; background:rgba(0,0,0,0.4); padding:2px 6px; border-radius:8px;"><div class="timer-dot" style="background:#0ea5e9;"></div><span class="timer-text" data-start="${o.time}">00:00</span></div></div><div style="flex:1; margin:6px 0;">${o.items.map(i => `<div style="font-size:0.9rem; font-weight:900; opacity:0.8; border-bottom:1px dashed rgba(255,255,255,0.05); padding:3px 0;">${i.name} <span style="color:#0ea5e9; float:left;">x${i.qty}</span></div>`).join('')}</div><div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;"><button onclick="window.kitchenAction('${o.id}','preparing')" class="btn-luxury" style="background:transparent; border:1px solid var(--danger); color:var(--danger); padding:3px 6px; font-size:0.75rem; width:auto;">Ø¥Ø±Ø¬Ø§Ø¹ â†©ï¸</button><button onclick="window.kitchenAction('${o.id}','completed')" class="btn-luxury" style="background:var(--success); color:#fff; padding:4px 10px; font-size:0.9rem; width:auto; border:none;">ØªÙ… Ø§Ù„ØªØ³Ù„ÙŠÙ… ðŸš€</button></div></div>`).join('')}</div>
            </div>
        </div>`;
        }
        function renderInventory(c) {
            const isMgmt = (window.state.role === 'admin' || window.state.role === 'manager');
            const title = isMgmt ? 'Ù…Ø®Ø²Ù† Ø£ØµÙ†Ø§Ù Ø§Ù„Ø¨ÙŠØ¹ ðŸ”' : 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ø®Ø²Ù† ðŸ“¦';
            c.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <h3>${title}</h3>
                    <button onclick="document.getElementById('inventory-modal').style.display='flex'" class="btn-luxury" style="width:auto; padding:6px 16px; font-size:0.85rem; background:var(--success); border:none; color:#fff;">+ ØµÙ†Ù Ø¬Ø¯ÙŠØ¯</button>
                </div>
                ${isMgmt ? `<button onclick="window.switchPage(window.state.role === 'admin' ? 'admin_home' : 'manager_home')" class="btn-luxury" style="width:auto; padding:6px 16px; font-size:0.85rem; margin:0;"><i class="fa-solid fa-arrow-right-to-bracket" style="transform:rotate(180deg);"></i> Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</button>` : ''}
            </div>
            <div style="display:flex; gap:8px; margin-bottom:15px; overflow-x:auto;" class="hide-scroll">
                ${['Ø§Ù„ÙƒÙ„', 'Ø·ÙˆØ§Ø¬Ù†', 'Ø£Ø±Ø² ÙˆÙØªØ©', 'Ø´ÙˆØ±Ø¨Ø©', 'Ø³Ù„Ø·Ø§Øª', 'Ù…Ø´Ø±ÙˆØ¨Ø§Øª'].map(cat => `<button onclick="window.state.invCat='${cat}'; window.render();" class="btn-luxury" style="width:auto; padding:8px 20px; margin:0; background:${window.state.invCat === cat ? 'var(--primary)' : '#1e293b'}; color:${window.state.invCat === cat ? '#000' : '#fff'}">${cat}</button>`).join('')}
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:10px;">
                ${window.state.db.menu.filter(m => window.state.invCat === 'Ø§Ù„ÙƒÙ„' || m.category === window.state.invCat).map(m => `
                <div class="inv-card">
                    <h4>${m.name}</h4>
                    <p style="opacity:0.6; font-size:0.8rem;">${m.category}</p>
                    <div style="display:flex; justify-content:space-between; margin:8px 0;">
                        <span style="color:var(--primary); font-weight:900;">${m.price} Ø¬</span>
                        <span style="font-weight:900; color:${m.stock < 10 ? 'var(--danger)' : '#fff'}">Ø§Ù„Ø±ØµÙŠØ¯: ${m.stock}</span>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <button onclick="window.openStockUpdate('${m.id}')" class="btn-luxury" style="padding:6px; font-size:0.8rem;">ØªØ­Ø¯ÙŠØ«</button>
                        <button onclick="window.deleteItem(${m.id})" class="btn-luxury danger" style="padding:6px; font-size:0.8rem;">Ø­Ø°Ù</button>
                    </div>
                    <button onclick="window.openWasteModal('${m.id}', 'menu')" class="btn-luxury" style="width:100%; margin-top:8px; padding:6px; font-size:0.8rem; background:rgba(239, 68, 68, 0.15); color:var(--danger); border:1px solid var(--danger);">ØªØ³Ø¬ÙŠÙ„ Ù‡Ø§Ø¯Ø± ðŸ—‘ï¸</button>
                </div>`).join('')}
            </div>`;
        }
        function renderAdminInventory(c) {
            const inventory = window.state.db.main_inventory || [];
            c.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <h3>Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ (Ø§Ù„Ø®Ø§Ù…Ø§Øª) ðŸ“¦</h3>
                    ${(window.state.role === 'admin' || window.state.role === 'manager') ? `<button onclick="window.openAdminInventoryAdd()" class="btn-luxury" style="width:auto; padding:6px 16px; font-size:0.85rem; background:var(--success); border:none; color:#fff;">+ Ø¥Ø¶Ø§ÙØ© Ø®Ø§Ù…Ø© Ø¬Ø¯ÙŠØ¯Ø©</button>` : ''}
                </div>
                <button onclick="window.switchPage(window.state.role === 'admin' ? 'admin_home' : 'manager_home')" class="btn-luxury" style="width:auto; padding:6px 16px; font-size:0.85rem;"><i class="fa-solid fa-arrow-right-to-bracket" style="transform:rotate(180deg);"></i> Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:10px;">
                ${inventory.map(i => `
                <div class="inv-card" style="border-color:${i.qty <= (i.minQty || 0) ? 'var(--danger)' : 'var(--primary)'}">
                    <h4>${i.name}</h4>
                    <p style="opacity:0.6; font-size:0.8rem;">Ø§Ù„ÙˆØ­Ø¯Ø©: ${i.unit}</p>
                    <div style="display:flex; justify-content:space-between; margin:8px 0;">
                        <span style="color:var(--primary); font-weight:900;">${i.qty} ${i.unit}</span>
                    </div>
                    ${(window.state.role === 'admin' || window.state.role === 'manager') ? `
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                        <button onclick="window.openAdminInventoryEdit('${i.id}')" class="btn-luxury" style="padding:6px; font-size:0.8rem;">ØªØ¹Ø¯ÙŠÙ„</button>
                        <button onclick="window.deleteAdminInventoryItem('${i.id}')" class="btn-luxury danger" style="padding:6px; font-size:0.8rem;">Ø­Ø°Ù</button>
                    </div>
                    <button onclick="window.openWasteModal('${i.id}', 'main')" class="btn-luxury" style="width:100%; margin-top:8px; padding:6px; font-size:0.8rem; background:rgba(239, 68, 68, 0.15); color:var(--danger); border:1px solid var(--danger);">ØªØ³Ø¬ÙŠÙ„ Ù‡Ø§Ø¯Ø± ðŸ—‘ï¸</button>
                    ` : '<p style="font-size:0.8rem; text-align:center; opacity:0.5;">Ù„Ù„Ù‚Ø±Ø§Ø¡Ø© ÙÙ‚Ø·</p>'}
                </div>`).join('')}
            </div>`;
        }

        function renderExpenses(c) {
            const isMgmt = (window.state.role === 'admin' || window.state.role === 'manager');
            const invOptions = (window.state.db.main_inventory || []).map(i => `<option value="${i.name}">${i.name} (${i.unit})</option>`).join('');
            const shiftStart = window.state.db.shift ? window.state.db.shift.start : 0;
            
            const displayedExpenses = isMgmt 
                ? (window.state.db.exp || []) 
                : (window.state.db.exp || []).filter(e => e.time >= shiftStart && e.isShiftExpense);

            const totalTodayVal = displayedExpenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
            const freqOptions = (window.state.db.frequent_expenses || []).map(fe => `<option value="${fe.id}">${fe.name} ${fe.details ? `(${fe.details})` : ''}</option>`).join('');

            c.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3>Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª ðŸ’¸</h3>
                <div style="display:flex; gap:10px; align-items:center;">
                    <div style="background:rgba(255,255,255,0.05); padding:6px 15px; border-radius:10px; font-weight:900; border:1px solid rgba(255,255,255,0.1); font-size:0.9rem;">
                        ${isMgmt ? 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„ÙƒÙ„ÙŠØ©' : 'Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ©'}: <span style="color:var(--primary);">${totalTodayVal} Ø¬.Ù…</span>
                    </div>
                    <button onclick="window.switchPage(window.state.role === 'admin' ? 'admin_home' : (window.state.role === 'manager' ? 'manager_home' : 'pos'))" class="btn-luxury" style="width:auto; padding:6px 16px; font-size:0.85rem; margin:0;"><i class="fa-solid fa-arrow-right-to-bracket" style="transform:rotate(180deg);"></i> ${isMgmt ? 'Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ©' : 'Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„ÙƒØ§Ø´ÙŠØ±'}</button>
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 380px 1fr; gap:15px; height:calc(100% - 50px);">
                <div class="cart-side" style="background: linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8)); border: 1px solid rgba(255,255,255,0.1); display:flex; flex-direction:column; gap:0; overflow-y:auto; max-height:100%; padding:0;">
                    
                    <!-- Step 1: Category Selection -->
                    <div style="padding:18px 18px 12px 18px;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
                            <div style="width:28px; height:28px; border-radius:50%; background:var(--primary); color:#000; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.85rem; flex-shrink:0;">1</div>
                            <span style="font-weight:700; font-size:0.95rem;">Ø§Ø®ØªØ± Ù†ÙˆØ¹ Ø§Ù„Ù…ØµØ±ÙˆÙ</span>
                        </div>
                        ${!isMgmt ? `
                        <input type="hidden" id="ex-type" value="general">
                        <div style="display:grid; grid-template-columns:1fr; gap:8px;">
                            <div style="padding:12px 15px; background:rgba(251,191,36,0.15); border:2px solid var(--primary); border-radius:12px; text-align:center; cursor:default;">
                                <i class="fa-solid fa-money-bill-wave" style="font-size:1.3rem; color:var(--primary); display:block; margin-bottom:5px;"></i>
                                <span style="font-size:0.85rem; font-weight:700; color:var(--primary);">Ù…ØµØ±ÙˆÙØ§Øª ÙˆØ±Ø¯ÙŠØ©</span>
                            </div>
                        </div>` : `
                        <input type="hidden" id="ex-type" value="general">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                            <div onclick="document.getElementById('ex-type').value='general'; window._selectExpCat(this);" class="exp-cat-card active-cat" style="padding:10px 8px; background:rgba(255,255,255,0.04); border:2px solid rgba(255,255,255,0.08); border-radius:12px; text-align:center; cursor:pointer; transition:all 0.25s ease;">
                                <i class="fa-solid fa-money-bill-wave" style="font-size:1.2rem; color:var(--primary); display:block; margin-bottom:4px;"></i>
                                <span style="font-size:0.8rem; font-weight:700;">Ù…ØµØ±ÙˆÙ Ø¹Ø§Ù…</span>
                            </div>
                            <div onclick="document.getElementById('ex-type').value='inventory'; window._selectExpCat(this);" class="exp-cat-card" style="padding:10px 8px; background:rgba(255,255,255,0.04); border:2px solid rgba(255,255,255,0.08); border-radius:12px; text-align:center; cursor:pointer; transition:all 0.25s ease;">
                                <i class="fa-solid fa-boxes-stacked" style="font-size:1.2rem; color:#10b981; display:block; margin-bottom:4px;"></i>
                                <span style="font-size:0.8rem; font-weight:700;">Ø´Ø±Ø§Ø¡ Ø®Ø§Ù…Ø§Øª</span>
                            </div>
                            <div onclick="document.getElementById('ex-type').value='salaries'; window._selectExpCat(this);" class="exp-cat-card" style="padding:10px 8px; background:rgba(255,255,255,0.04); border:2px solid rgba(255,255,255,0.08); border-radius:12px; text-align:center; cursor:pointer; transition:all 0.25s ease;">
                                <i class="fa-solid fa-users" style="font-size:1.2rem; color:#a78bfa; display:block; margin-bottom:4px;"></i>
                                <span style="font-size:0.8rem; font-weight:700;">Ù…Ø±ØªØ¨Ø§Øª</span>
                            </div>
                            <div onclick="document.getElementById('ex-type').value='emergency'; window._selectExpCat(this);" class="exp-cat-card" style="padding:10px 8px; background:rgba(255,255,255,0.04); border:2px solid rgba(255,255,255,0.08); border-radius:12px; text-align:center; cursor:pointer; transition:all 0.25s ease;">
                                <i class="fa-solid fa-triangle-exclamation" style="font-size:1.2rem; color:#ef4444; display:block; margin-bottom:4px;"></i>
                                <span style="font-size:0.8rem; font-weight:700;">Ø·ÙˆØ§Ø±Ø¦</span>
                            </div>
                        </div>`}
                    </div>

                    <!-- Inventory Sub-form (hidden by default) -->
                    <div id="ex-inv-container" style="display:none; padding:12px 18px; margin:0 18px 5px 18px; background:rgba(16,185,129,0.06); border:1px solid rgba(16,185,129,0.2); border-radius:12px; transition:all 0.3s ease;">
                        <label style="font-size:0.85rem; opacity:0.8; margin-bottom:8px; display:block; color:#10b981; font-weight:700;"><i class="fa-solid fa-box"></i> ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ø®Ø§Ù…Ø©</label>
                        <select id="ex-inv-item" class="input-luxury" style="background:rgba(0,0,0,0.5); margin-bottom:8px;" onchange="const el = document.getElementById('ex-new-inv'); if(this.value==='new') { el.style.display='flex'; el.style.animation='fadeIn 0.3s ease'; } else { el.style.display='none'; }">
                            <option value="">-- Ø§Ø®ØªØ± Ø®Ø§Ù…Ø© --</option>
                            ${invOptions}
                            <option value="new">âž• ØªØ³Ø¬ÙŠÙ„ Ø®Ø§Ù…Ø© Ø¬Ø¯ÙŠØ¯Ø©...</option>
                        </select>
                        <div id="ex-new-inv" style="display:none; flex-direction:column; gap:8px; margin-bottom:8px; padding-bottom:8px; border-bottom:1px dashed rgba(255,255,255,0.15);">
                            <input id="ex-new-name" placeholder="Ø§Ø³Ù… Ø§Ù„Ø®Ø§Ù…Ø© (Ù…Ø«Ø§Ù„: Ù„Ø­Ù… Ø¨Ù„Ø¯ÙŠ)" class="input-luxury" style="background:rgba(0,0,0,0.3); margin:0;">
                            <input id="ex-new-unit" placeholder="Ø§Ù„ÙˆØ­Ø¯Ø© (ÙƒØ¬Ù…ØŒ Ù„ØªØ±ØŒ ÙƒØ±ØªÙˆÙ†Ø©)" class="input-luxury" style="background:rgba(0,0,0,0.3); margin:0;">
                        </div>
                        <input id="ex-inv-qty" type="number" placeholder="Ø§Ù„ÙƒÙ…ÙŠØ© Ø§Ù„Ù…Ø´ØªØ±Ø§Ø©" class="input-luxury" style="background:rgba(0,0,0,0.5); margin:0;">
                    </div>

                    <div style="height:1px; background:rgba(255,255,255,0.06); margin:2px 18px;"></div>

                    <!-- Step 2: Details -->
                    <div style="padding:12px 18px;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
                            <div style="width:28px; height:28px; border-radius:50%; background:var(--primary); color:#000; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.85rem; flex-shrink:0;">2</div>
                            <span style="font-weight:700; font-size:0.95rem;">Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª</span>
                            <div style="flex:1;"></div>
                            <button onclick="window.openFrequentExpensesModal()" class="btn-luxury" style="width:auto; padding:3px 10px; font-size:0.7rem; background:rgba(255,255,255,0.05); color:var(--primary); border:1px solid rgba(251,191,36,0.15); margin:0;"><i class="fa-solid fa-list-check"></i> Ø§Ù„Ù…Ø³Ø¬Ù„Ø§Øª</button>
                        </div>

                        ${(window.state.db.frequent_expenses || []).length > 0 ? `
                        <select id="ex-frequent-select" class="input-luxury" style="background:rgba(251,191,36,0.06); border:1px solid rgba(251,191,36,0.2); margin:0 0 10px 0; font-size:0.85rem; padding:9px 12px; color:var(--primary);" onchange="window.selectFrequentExpense(this.value)">
                            <option value="">âš¡ Ø§Ø®ØªÙŠØ§Ø± Ø³Ø±ÙŠØ¹ Ù…Ù† Ø§Ù„Ù…Ø³Ø¬Ù„Ø§Øª...</option>
                            ${freqOptions}
                        </select>` : `<select id="ex-frequent-select" style="display:none;"><option value=""></option></select>`}

                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <input id="ex-name" placeholder="Ø§Ù„Ø¬Ù‡Ø© / Ø§Ù„Ù…Ø³ØªÙ„Ù… (Ù…Ø«Ø§Ù„: Ù…Ø­Ù…Ø¯ Ø§Ù„Ø®Ø¶Ø§Ø±)" class="input-luxury" style="background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.08); margin:0; padding:10px 14px; font-size:0.9rem;">
                            <input id="ex-details" placeholder="ÙˆØµÙ Ø£Ùˆ Ù…Ù„Ø§Ø­Ø¸Ø§Øª (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)" class="input-luxury" style="background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.08); margin:0; padding:10px 14px; font-size:0.9rem;">
                        </div>
                        <div style="margin-top:6px;">
                            <button onclick="window.saveCurrentAsFrequent()" style="background:none; border:none; color:rgba(251,191,36,0.6); font-size:0.75rem; cursor:pointer; font-family:'Cairo'; padding:3px 0; transition:color 0.2s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='rgba(251,191,36,0.6)'">
                                <i class="fa-solid fa-thumbtack"></i> Ø­ÙØ¸ ÙƒÙ€ Ù…ØµØ±ÙˆÙ Ù…Ø³Ø¬Ù„
                            </button>
                        </div>
                    </div>

                    <div style="height:1px; background:rgba(255,255,255,0.06); margin:0 18px;"></div>

                    <!-- Step 3: Amount & Save -->
                    <div style="padding:12px 18px 18px 18px;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
                            <div style="width:28px; height:28px; border-radius:50%; background:var(--danger); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:0.85rem; flex-shrink:0;">3</div>
                            <span style="font-weight:700; font-size:0.95rem; color:var(--danger);">Ø§Ù„Ù…Ø¨Ù„Øº ÙˆØ§Ù„ØªØ£ÙƒÙŠØ¯</span>
                        </div>
                        <input id="ex-amount" type="number" placeholder="Ø£Ø¯Ø®Ù„ Ø§Ù„Ù…Ø¨Ù„Øº Ø¨Ø§Ù„Ø¬Ù†ÙŠÙ‡..." class="input-luxury" style="font-size:1.4rem; font-weight:900; background:rgba(239, 68, 68, 0.08); border:2px solid rgba(239, 68, 68, 0.25); color:#fff; margin:0 0 12px 0; padding:14px; text-align:center; letter-spacing:1px;">
                        <button onclick="window.saveExpense()" class="btn-luxury" style="padding:14px; font-size:1.05rem; background:linear-gradient(135deg, var(--primary), #f59e0b); color:#000; border:none; font-weight:900; box-shadow:0 4px 20px rgba(251,191,36,0.3); margin:0; letter-spacing:0.5px;">
                            <i class="fa-solid fa-check-circle"></i> ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ù…ØµØ±ÙˆÙ
                        </button>
                    </div>

                </div>
                <div class="cart-side" style="overflow-y:auto; background:rgba(15,23,42,0.6); display:flex; flex-direction:column; gap:10px; max-height:100%;">
                    <!-- Advanced Filters Panel -->
                    ${isMgmt ? `
                    <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:15px; border:1px solid rgba(255,255,255,0.08); display:flex; flex-direction:column; gap:10px;">
                        <div style="font-size:0.9rem; color:var(--primary); font-weight:900;"><i class="fa-solid fa-filter"></i> ØªØµÙÙŠØ© ÙˆØ¨Ø­Ø« ÙÙŠ Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª</div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; align-items:end;">
                            <div style="display:flex; flex-direction:column; gap:5px;">
                                <label style="font-size:0.75rem; opacity:0.7;"><i class="fa-solid fa-tag" style="margin-left:4px;"></i>ÙØ¦Ø© Ø§Ù„Ù…ØµØ±ÙˆÙ</label>
                                <select id="filter-exp-type" onchange="window.filterExpensesList()" class="input-luxury" style="margin:0; font-size:0.85rem; padding:8px 12px; background:rgba(0,0,0,0.5);">
                                    <option value="all">ÙƒÙ„ Ø§Ù„ÙØ¦Ø§Øª</option>
                                    <option value="general">ðŸ’µ Ù…ØµØ±ÙˆÙ Ø¹Ø§Ù…</option>
                                    <option value="inventory">ðŸ“¦ Ø®Ø§Ù…Ø§Øª Ù…Ø®Ø²Ù†</option>
                                    <option value="salaries">ðŸ‘¥ Ù…Ø±ØªØ¨Ø§Øª</option>
                                    <option value="emergency">âš ï¸ Ø·ÙˆØ§Ø±Ø¦</option>
                                </select>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:5px;">
                                <label style="font-size:0.75rem; opacity:0.7;"><i class="fa-solid fa-calendar" style="margin-left:4px;"></i>Ø§Ù„Ø´Ù‡Ø±</label>
                                <select id="filter-exp-month" onchange="window.filterExpensesList()" class="input-luxury" style="margin:0; font-size:0.85rem; padding:8px 12px; background:rgba(0,0,0,0.5);">
                                    <option value="all">ÙƒÙ„ Ø§Ù„Ø´Ù‡ÙˆØ±</option>
                                    <option value="0">ÙŠÙ†Ø§ÙŠØ±</option>
                                    <option value="1">ÙØ¨Ø±Ø§ÙŠØ±</option>
                                    <option value="2">Ù…Ø§Ø±Ø³</option>
                                    <option value="3">Ø£Ø¨Ø±ÙŠÙ„</option>
                                    <option value="4">Ù…Ø§ÙŠÙˆ</option>
                                    <option value="5">ÙŠÙˆÙ†ÙŠÙˆ</option>
                                    <option value="6">ÙŠÙˆÙ„ÙŠÙˆ</option>
                                    <option value="7">Ø£ØºØ³Ø·Ø³</option>
                                    <option value="8">Ø³Ø¨ØªÙ…Ø¨Ø±</option>
                                    <option value="9">Ø£ÙƒØªÙˆØ¨Ø±</option>
                                    <option value="10">Ù†ÙˆÙÙ…Ø¨Ø±</option>
                                    <option value="11">Ø¯ÙŠØ³Ù…Ø¨Ø±</option>
                                </select>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:5px;">
                                <label style="font-size:0.75rem; opacity:0.7;"><i class="fa-solid fa-calendar-days" style="margin-left:4px;"></i>Ø§Ù„Ø³Ù†Ø©</label>
                                <select id="filter-exp-year" onchange="window.filterExpensesList()" class="input-luxury" style="margin:0; font-size:0.85rem; padding:8px 12px; background:rgba(0,0,0,0.5);">
                                    <option value="all">ÙƒÙ„ Ø§Ù„Ø³Ù†ÙˆØ§Øª</option>
                                    ${(function(){ const cy = new Date().getFullYear(); let opts=''; for(let y=cy; y>=2024; y--) opts += '<option value="'+y+'">'+y+'</option>'; return opts; })()}
                                </select>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr 120px; gap:10px; align-items:end; margin-top:8px;">
                            <div style="display:flex; flex-direction:column; gap:5px;">
                                <label style="font-size:0.75rem; opacity:0.7;"><i class="fa-solid fa-calendar-day" style="margin-left:4px;"></i>Ø§Ù„ÙŠÙˆÙ… (Ø§Ø®ØªÙŠØ§Ø±ÙŠ)</label>
                                <select id="filter-exp-day" onchange="window.filterExpensesList()" class="input-luxury" style="margin:0; font-size:0.85rem; padding:8px 12px; background:rgba(0,0,0,0.5);">
                                    <option value="all">ÙƒÙ„ Ø§Ù„Ø£ÙŠØ§Ù…</option>
                                    ${(function(){ let opts=''; for(let d=1; d<=31; d++) opts += '<option value="'+d+'">'+d+'</option>'; return opts; })()}
                                </select>
                            </div>
                            <div></div>
                            <div style="display:flex; gap:5px;">
                                <button onclick="window.resetExpensesFilter()" class="btn-luxury danger" style="flex:1; margin:0; padding:10px; font-size:0.85rem; font-family:'Cairo'; display:flex; align-items:center; justify-content:center; gap:5px; height:42px;"><i class="fa-solid fa-rotate-left"></i> Ù…Ø³Ø­ Ø§Ù„ÙÙ„Ø§ØªØ±</button>
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:5px;">
                            <label style="font-size:0.75rem; opacity:0.7;">Ø¨Ø­Ø« Ù†ØµÙŠ Ø¨Ø§Ù„Ø§Ø³Ù… Ø£Ùˆ Ø§Ù„ÙˆØµÙ</label>
                            <input type="text" id="filter-exp-search" oninput="window.filterExpensesList()" placeholder="Ø§ÙƒØªØ¨ Ù„Ù„Ø¨Ø­Ø« Ø¨Ø§Ù„Ø§Ø³Ù… Ø£Ùˆ Ø§Ù„ØªÙØ§ØµÙŠÙ„..." class="input-luxury" style="margin:0; font-size:0.85rem; padding:8px 12px; background:rgba(0,0,0,0.5);">
                        </div>
                    </div>` : `
                    <div style="background:rgba(251,191,36,0.1); padding:15px; border-radius:15px; border:1px solid rgba(251,191,36,0.2); text-align:center;">
                        <h4 style="color:var(--primary); margin:0 0 5px 0;"><i class="fa-solid fa-clock"></i> Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©</h4>
                        <p style="margin:0; font-size:0.85rem; opacity:0.8;">Ø§Ù„Ø¬Ø¯ÙˆÙ„ Ø£Ø¯Ù†Ø§Ù‡ ÙŠØ¹Ø±Ø¶ Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„ØªÙŠ ØªÙ… ØªØ³Ø¬ÙŠÙ„Ù‡Ø§ ÙÙŠ ÙˆØ±Ø¯ÙŠØªÙƒ Ø§Ù„Ø­Ø§Ù„ÙŠØ© ÙÙ‚Ø·.</p>
                    </div>`}


                    <!-- History Table -->
                    <div style="flex:1; overflow-y:auto;">
                        <table class="foush-table">
                            <thead><tr><th>Ø§Ù„ØªØ§Ø±ÙŠØ®</th><th>Ø§Ù„ØªØµÙ†ÙŠÙ</th><th>Ø§Ù„ØªÙØ§ØµÙŠÙ„</th><th>Ø§Ù„Ù…Ø¨Ù„Øº</th></tr></thead>
                            <tbody id="expenses-table-body">
                                ${displayedExpenses.map(e => `<tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                                    <td>${new Date(e.time).toLocaleDateString('ar-EG')}<br><small style="opacity:0.6">${new Date(e.time).toLocaleTimeString('ar-EG')}</small></td>
                                    <td>
                                        ${e.type === 'inventory' ? '<span class="badge" style="background:var(--success);">Ø®Ø§Ù…Ø§Øª Ù…Ø®Ø²Ù†</span><br><small>' + e.invItem + '</small>' : 
                                          (e.type === 'salaries' ? '<span class="badge" style="background:var(--primary);">Ù…Ø±ØªØ¨Ø§Øª</span>' :
                                          (e.type === 'emergency' ? '<span class="badge" style="background:var(--danger);">Ø·ÙˆØ§Ø±Ø¦</span>' :
                                          '<span class="badge" style="background:rgba(255,255,255,0.2);">Ù…ØµØ±ÙˆÙ Ø¹Ø§Ù…</span>'))}
                                        ${e.name ? '<br><small style="opacity:0.8; color:var(--primary);"><i class="fa-solid fa-user"></i> ' + e.name + '</small>' : ''}
                                    </td>
                                    <td>${e.details || '-'}${e.type==='inventory' ? `<br><small style="color:var(--success);">Ø§Ù„ÙƒÙ…ÙŠØ©: ${e.qty}</small>` : ''}</td>
                                    <td style="color:var(--danger); font-weight:bold; font-size:1.1rem;">${e.amount} Ø¬</td>
                                </tr>`).join('') || '<tr><td colspan="4" style="padding:3rem; text-align:center; opacity:0.3;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…ØµØ±ÙˆÙØ§Øª Ù…Ø³Ø¬Ù„Ø©</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;
        }
        function renderTables(c) { c.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;"><h3>Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø·Ø§ÙˆÙ„Ø§Øª ðŸ—ºï¸</h3><div style="display:flex; gap:8px;"><input id="new-tab-name" placeholder="Ø§Ø³Ù… Ø§Ù„Ø·Ø§ÙˆÙ„Ø©" class="input-luxury" style="width:150px; margin-bottom:0; padding:8px;"><select id="new-tab-source" class="input-luxury" style="width:auto; margin-bottom:0; padding:8px;"><option value="cashier">ÙƒØ§Ø´ÙŠØ±ðŸ’°</option><option value="waiter">ÙˆÙŠØªØ±ðŸ¤µ</option></select><button onclick="window.addTable()" class="btn-luxury" style="width:auto; padding:8px 20px;">Ø¥Ø¶Ø§ÙØ©</button></div></div><div style="display:flex; flex-wrap:wrap; gap:12px;">${(window.state.db.tables || []).map(t => `<div class="order-card" style="width:160px; text-align:center; padding:15px;"><i class="fa-solid fa-chair" style="font-size:1.5rem; color:var(--primary); margin-bottom:10px;"></i><h4>${t.name}</h4><p style="font-size:0.75rem; opacity:0.6;">${t.source === 'waiter' ? 'ÙˆÙŠØªØ±ðŸ¤µ' : 'ÙƒØ§Ø´ÙŠØ±ðŸ’°'}</p><div style="display:flex; gap:5px; margin-top:10px;"><button onclick="window.openTableEdit(${t.id})" class="btn-luxury" style="padding:5px; font-size:0.7rem;"><i class="fa-solid fa-pen"></i></button><button onclick="window.deleteTable(${t.id})" class="btn-luxury danger" style="padding:5px; font-size:0.7rem;"><i class="fa-solid fa-trash"></i></button></div></div>`).join('')}</div>`; }
        window.exportShiftsToCSV = () => {
            const history = window.state.db.shifts_history || [];
            if (history.length === 0) {
                window.showToast("âš ï¸ Ù„Ø§ ØªÙˆØ¬Ø¯ ÙˆØ±Ø¯ÙŠØ§Øª Ø³Ø§Ø¨Ù‚Ø© Ù„ØªØµØ¯ÙŠØ±Ù‡Ø§!");
                return;
            }
            let csvContent = "\ufeff"; // UTF-8 BOM for Arabic support in Excel
            csvContent += "ÙØªØ­ Ø§Ù„ÙˆØ±Ø¯ÙŠØ©,Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„ÙˆØ±Ø¯ÙŠØ©,Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª,Ù…Ø¨ÙŠØ¹Ø§Øª ÙƒØ§Ø´,Ù…Ø¨ÙŠØ¹Ø§Øª ÙÙŠØ²Ø§,Ù…Ø¨ÙŠØ¹Ø§Øª Ù…Ø­ÙØ¸Ø©,Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª,ØµØ§ÙÙŠ Ø§Ù„Ø¯Ø±Ø¬\n";
            history.forEach(h => {
                const start = new Date(h.start).toLocaleString('ar-EG').replace(/,/g, ' ');
                const end = new Date(h.end).toLocaleString('ar-EG').replace(/,/g, ' ');
                csvContent += `"${start}","${end}",${h.sales},${h.cashSales || 0},${h.visaSales || 0},${h.walletSales || 0},${h.expenses},${h.net}\n`;
            });
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `ØªÙ‚Ø§Ø±ÙŠØ±_ÙˆØ±Ø¯ÙŠØ§Øª_Ø·ÙˆØ§Ø¬Ù†_ÙØ¤Ø´_${new Date().toLocaleDateString('ar-EG')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.showToast("ðŸ“Š ØªÙ… ØªØµØ¯ÙŠØ± Ø§Ù„ØªÙ‚Ø±ÙŠØ± ÙƒÙ…Ù„Ù CSV Ø¨Ù†Ø¬Ø§Ø­!");
        };

        function renderReports(c) {
            const history = window.state.db.shifts_history || [];
            const totalSales = history.reduce((s, h) => s + (h.sales || 0), 0);
            const totalExp = history.reduce((s, h) => s + (h.expenses || 0), 0);
            const totalNet = history.reduce((s, h) => s + (h.net || 0), 0);

            const totalCash = history.reduce((s, h) => s + (h.cashSales || 0), 0);
            const totalVisa = history.reduce((s, h) => s + (h.visaSales || 0), 0);
            const totalWallet = history.reduce((s, h) => s + (h.walletSales || 0), 0);

            const totalCount = history.length;

            // CSS bar chart percentages
            const cashPct = totalSales > 0 ? Math.round((totalCash / totalSales) * 100) : 0;
            const visaPct = totalSales > 0 ? Math.round((totalVisa / totalSales) * 100) : 0;
            const walletPct = totalSales > 0 ? Math.round((totalWallet / totalSales) * 100) : 0;

            c.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
            <h3 style="margin:0; font-family:'Cairo'; font-weight:900;">Ø³Ø¬Ù„ Ø§Ù„ÙˆØ±Ø¯ÙŠØ© ÙˆØ§Ù„ØªÙ‚Ø§Ø±ÙŠØ± ðŸ“‹</h3>
            <button onclick="window.exportShiftsToCSV()" class="btn-luxury" style="width:auto; padding:8px 20px; font-weight:900;"><i class="fa-solid fa-file-excel"></i> ØªØµØ¯ÙŠØ± Ù…Ù„Ù Excel (CSV)</button>
        </div>
        
        <!-- Premium Lifetime Stats Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:20px;">
            <div class="stat-card" style="border-color:var(--success); background:rgba(16,185,129,0.05); text-align:center; padding:15px;">
                <h2 style="font-family:'Cairo'; font-weight:900; font-size:1.8rem; margin:0 0 5px 0;">${totalSales} Ø¬</h2>
                <p style="font-size:0.8rem; opacity:0.8; margin:0;">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠØ©</p>
            </div>
            <div class="stat-card" style="border-color:var(--danger); background:rgba(239,68,68,0.05); text-align:center; padding:15px;">
                <h2 style="font-family:'Cairo'; font-weight:900; font-size:1.8rem; margin:0 0 5px 0;">${totalExp} Ø¬</h2>
                <p style="font-size:0.8rem; opacity:0.8; margin:0;">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠØ©</p>
            </div>
            <div class="stat-card" style="border-color:var(--primary); background:rgba(251,191,36,0.08); text-align:center; padding:15px;">
                <h2 style="font-family:'Cairo'; font-weight:900; font-size:1.8rem; color:var(--primary); margin:0 0 5px 0;">${totalNet} Ø¬</h2>
                <p style="font-size:0.8rem; font-weight:900; color:var(--primary); margin:0;">ØµØ§ÙÙŠ Ø§Ù„Ø£Ø±Ø¨Ø§Ø­ Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠØ©</p>
            </div>
            <div class="stat-card" style="border-color:#3b82f6; background:rgba(59,130,246,0.05); text-align:center; padding:15px;">
                <h2 style="font-family:'Cairo'; font-weight:900; font-size:1.8rem; margin:0 0 5px 0;">${totalCount}</h2>
                <p style="font-size:0.8rem; opacity:0.8; margin:0;">Ø¹Ø¯Ø¯ Ø§Ù„ÙˆØ±Ø¯ÙŠØ§Øª Ø§Ù„Ù…ØºÙ„Ù‚Ø©</p>
            </div>
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-bottom:20px;" class="dashboard-columns">
            <!-- Payment Methods Distribution Chart -->
            <div class="cart-side" style="padding:15px; border-color:var(--primary); background:rgba(0,0,0,0.2);">
                <h4 style="color:var(--primary); margin-bottom:15px; font-weight:900; font-size:1rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;"><i class="fa-solid fa-chart-pie"></i> ØªØ­Ù„ÙŠÙ„ Ø·Ø±Ù‚ Ø§Ù„Ø¯ÙØ¹ Ø§Ù„ØªØ§Ø±ÙŠØ®ÙŠØ©</h4>
                <div style="display:flex; flex-direction:column; gap:15px;">
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.85rem;">
                            <span>ÙƒØ§Ø´ ðŸ’µ (${totalCash} Ø¬)</span>
                            <span style="font-weight:900; color:#34d399;">${cashPct}%</span>
                        </div>
                        <div style="height:10px; background:#1e293b; border-radius:5px; overflow:hidden;">
                            <div style="width:${cashPct}%; height:100%; background:linear-gradient(90deg, #10b981, #34d399); border-radius:5px;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.85rem;">
                            <span>ÙÙŠØ²Ø§ ðŸ’³ (${totalVisa} Ø¬)</span>
                            <span style="font-weight:900; color:#60a5fa;">${visaPct}%</span>
                        </div>
                        <div style="height:10px; background:#1e293b; border-radius:5px; overflow:hidden;">
                            <div style="width:${visaPct}%; height:100%; background:linear-gradient(90deg, #3b82f6, #60a5fa); border-radius:5px;"></div>
                        </div>
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.85rem;">
                            <span>Ù…Ø­ÙØ¸Ø© Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ© ðŸ“± (${totalWallet} Ø¬)</span>
                            <span style="font-weight:900; color:var(--primary);">${walletPct}%</span>
                        </div>
                        <div style="height:10px; background:#1e293b; border-radius:5px; overflow:hidden;">
                            <div style="width:${walletPct}%; height:100%; background:linear-gradient(90deg, var(--primary), #fbbf24); border-radius:5px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Summary -->
            <div class="cart-side" style="padding:15px; border-color:var(--success); background:rgba(0,0,0,0.2);">
                <h4 style="color:var(--success); margin-bottom:15px; font-weight:900; font-size:1rem; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;"><i class="fa-solid fa-circle-info"></i> Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø£Ø¯Ø§Ø¡ ÙˆØ§Ù„Ù…Ø¤Ø´Ø±Ø§Øª</h4>
                <p style="font-size:0.95rem; line-height:1.8; opacity:0.9; margin:0; text-align:right;">
                    Ù„Ù‚Ø¯ Ù‚Ù…Øª Ø¨Ø¥Ø¯Ø§Ø±Ø© ÙˆØªÙˆØ«ÙŠÙ‚ **${totalCount}** ÙˆØ±Ø¯ÙŠØ© Ø¹Ù…Ù„ Ø¨Ù†Ø¬Ø§Ø­.
                    <br><br>
                    - Ù…ØªÙˆØ³Ø· Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª Ù„ÙƒÙ„ ÙˆØ±Ø¯ÙŠØ©: <strong style="color:var(--success);">${totalCount > 0 ? Math.round(totalSales / totalCount) : 0} Ø¬</strong>.
                    <br>
                    - Ù…ØªÙˆØ³Ø· Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª Ù„ÙƒÙ„ ÙˆØ±Ø¯ÙŠØ©: <strong style="color:var(--danger);">${totalCount > 0 ? Math.round(totalExp / totalCount) : 0} Ø¬</strong>.
                    <br>
                    - Ù†Ø³Ø¨Ø© Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠØ© Ù…Ù† Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª: <strong style="color:var(--primary);">${totalSales > 0 ? Math.round((totalExp / totalSales) * 100) : 0}%</strong>.
                </p>
            </div>
        </div>
        
        <!-- Shifts History Table -->
        <div style="overflow-y:auto;" class="cart-side">
            <h4 style="margin-bottom:15px; font-weight:900; color:var(--primary);"><i class="fa-solid fa-clock-rotate-left"></i> Ø³Ø¬Ù„ ØªÙØ§ØµÙŠÙ„ Ø§Ù„ÙˆØ±Ø¯ÙŠØ§Øª Ø§Ù„Ù…ØºÙ„Ù‚Ø©</h4>
            <table class="foush-table">
                <thead>
                    <tr>
                        <th>ÙØªØ­ Ø§Ù„ÙˆØ±Ø¯ÙŠØ©</th>
                        <th>Ø¥ØºÙ„Ø§Ù‚ Ø§Ù„ÙˆØ±Ø¯ÙŠØ©</th>
                        <th>Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª</th>
                        <th>Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª</th>
                        <th>ØµØ§ÙÙŠ Ø£Ø±Ø¨Ø§Ø­ Ø§Ù„ÙˆØ±Ø¯ÙŠØ©</th>
                    </tr>
                </thead>
                <tbody>
                    ${history.slice().reverse().map(h => `
                    <tr>
                        <td>${new Date(h.start).toLocaleString('ar-EG')}</td>
                        <td>${new Date(h.end).toLocaleString('ar-EG')}</td>
                        <td style="color:var(--success); font-weight:900; font-size:0.95rem;">
                            ${h.sales} Ø¬
                            <br>
                            <small style="font-size:0.75rem; color:#94a3b8; font-weight:700;">(ÙƒØ§Ø´:${h.cashSales || 0} / ÙÙŠØ²Ø§:${h.visaSales || 0} / Ù…Ø­ÙØ¸Ø©:${h.walletSales || 0})</small>
                        </td>
                        <td style="color:var(--danger); font-weight:900; font-size:0.95rem;">${h.expenses} Ø¬</td>
                        <td style="background:rgba(251,191,36,0.15); color:var(--primary); font-weight:900; font-size:1.1rem; border-radius:5px;">${h.net} Ø¬</td>
                    </tr>`).join('') || `<tr><td colspan="5" style="text-align:center; opacity:0.5; padding:20px; font-size:1rem;">Ù„Ø§ ØªÙˆØ¬Ø¯ ÙˆØ±Ø¯ÙŠØ§Øª Ù…ØºÙ„Ù‚Ø© Ù…Ø³Ø¬Ù„Ø© Ø­ØªÙ‰ Ø§Ù„Ø¢Ù†</td></tr>`}
                </tbody>
            </table>
        </div>`;
        }

        function renderSidebar() {
            const c = document.getElementById('menu-links'); if (!c) return;
            const mobNav = document.getElementById('mobile-nav');
            const l = {
                waiter: [{ id: 'waiter', label: 'Ø§Ù„Ø·Ø§ÙˆÙ„Ø§Øª', icon: 'bell-concierge' }],
                kitchen: [{ id: 'kitchen', label: 'Ø§Ù„Ù…Ø·Ø¨Ø®', icon: 'fire-burner' }],
                cashier: [{ id: 'pos', label: 'Ø§Ù„ÙƒØ§Ø´ÙŠØ±', icon: 'cash-register' }, { id: 'kitchen', label: 'Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø©', icon: 'desktop' }, { id: 'inventory', label: 'Ø§Ù„Ù…Ø®Ø²Ù†', icon: 'box' }, { id: 'expenses', label: 'Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª', icon: 'money-bill' }, { id: 'tables', label: 'Ø§Ù„Ø·Ø§ÙˆÙ„Ø§Øª', icon: 'chair' }],
                manager: [
                    { id: 'manager_home', label: 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©', icon: 'crown' },
                    { id: 'inventory', label: 'Ù…Ø®Ø²Ù† Ø£ØµÙ†Ø§Ù Ø§Ù„Ø¨ÙŠØ¹', icon: 'burger' },
                    { id: 'admin_inventory', label: 'Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ', icon: 'box-open' },
                    { id: 'expenses', label: 'Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª', icon: 'money-bill' },
                    { id: 'dashboard', label: 'Ø§Ù„ØªØ­Ù„ÙŠÙ„Ø§Øª', icon: 'chart-line' },
                    { id: 'shift_ops', label: 'Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø­ÙŠØ©', icon: 'satellite-dish' },
                    { id: 'employees', label: 'Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†', icon: 'users' }
                ],
                admin: [
                    { id: 'admin_home', label: 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©', icon: 'user-tie' },
                    { id: 'inventory', label: 'Ù…Ø®Ø²Ù† Ø£ØµÙ†Ø§Ù Ø§Ù„Ø¨ÙŠØ¹', icon: 'burger' },
                    { id: 'admin_inventory', label: 'Ø§Ù„Ù…Ø®Ø²Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ', icon: 'box-open' },
                    { id: 'expenses', label: 'Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª', icon: 'money-bill' },
                    { id: 'shift_ops', label: 'Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ÙˆØ±Ø¯ÙŠØ©', icon: 'satellite-dish' },
                    { id: 'employees', label: 'Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†', icon: 'users' }
                ]
            };
            const links = l[window.state.role] || [];
            c.innerHTML = links.map(x => `<button onclick="window.switchPage('${x.id}')" class="sidebar-link ${window.state.page === x.id ? 'active' : ''}"><i class="fa-solid fa-${x.icon}"></i><span class="sidebar-label">${x.label}</span></button>`).join('');

            if (mobNav) {
                if (links.length > 5) {
                    const visibleLinks = links.slice(0, 4);
                    mobNav.innerHTML = visibleLinks.map(x => `<button onclick="window.switchPage('${x.id}')" class="mobile-nav-btn ${window.state.page === x.id ? 'active' : ''}"><i class="fa-solid fa-${x.icon}"></i><span>${x.label}</span></button>`).join('') +
                        `<button onclick="window.showMobileMenu()" class="mobile-nav-btn"><i class="fa-solid fa-ellipsis"></i><span>Ø§Ù„Ù…Ø²ÙŠØ¯</span></button>`;
                } else {
                    mobNav.innerHTML = links.map(x => `<button onclick="window.switchPage('${x.id}')" class="mobile-nav-btn ${window.state.page === x.id ? 'active' : ''}"><i class="fa-solid fa-${x.icon}"></i><span>${x.label}</span></button>`).join('');
                }
            }
        }

        function renderEmployees(c) {
            c.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3>Ø´Ø¤ÙˆÙ† Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ† ðŸ‘¥</h3>
                <button onclick="window.switchPage(window.state.role === 'admin' ? 'admin_home' : 'manager_home')" class="btn-luxury" style="width:auto; padding:6px 16px; font-size:0.85rem;"><i class="fa-solid fa-arrow-right-to-bracket" style="transform:rotate(180deg);"></i> Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</button>
            </div>
            <div style="display:grid; grid-template-columns: 350px 1fr; gap:15px; height:calc(100% - 50px);">
            <div class="cart-side" style="overflow-y:auto;">
                <h4 style="margin-bottom:15px; color:var(--primary);"><i class="fa-solid fa-user-plus"></i> Ø¥Ø¶Ø§ÙØ© Ù…ÙˆØ¸Ù Ø¬Ø¯ÙŠØ¯</h4>
                <input id="emp-name" placeholder="Ø§Ø³Ù… Ø§Ù„Ù…ÙˆØ¸Ù" class="input-luxury">
                <select id="emp-role" class="input-luxury">
                    <option value="waiter">ÙˆÙŠØªØ±ðŸ¤µ</option>
                    <option value="cashier">ÙƒØ§Ø´ÙŠØ±ðŸ’°</option>
                    <option value="kitchen">Ø·Ø¨Ø§Ø®ðŸ”¥</option>
                    <option value="manager">Ù…Ø¯ÙŠØ±ðŸ‘‘</option>
                </select>
                <input id="emp-pin" type="password" placeholder="ÙƒÙˆØ¯ Ø§Ù„Ø¨ØµÙ…Ø© Ø§Ù„Ø³Ø±ÙŠ (Ù…Ø«Ø§Ù„: 1234)" class="input-luxury">
                <button onclick="window.addEmployee()" class="btn-luxury" style="padding:15px; margin-bottom:20px;">Ø­ÙØ¸ Ø§Ù„Ù…ÙˆØ¸Ù âœ…</button>
                <hr style="border:1px dashed rgba(255,255,255,0.1); margin:15px 0;">
                <h4 style="margin-bottom:10px;">Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…ÙˆØ¸ÙÙŠÙ†</h4>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${(window.state.db.employees || []).map(e => `<div class="order-card" style="padding:10px; display:flex; justify-content:space-between; align-items:center;">
                        <div><h5 style="margin:0; font-size:1.1rem;">${e.name}</h5><small style="opacity:0.7;">${e.role} | PIN: ${e.pin}</small></div>
                        <button onclick="window.deleteEmployee(${e.id})" class="btn-luxury danger" style="width:auto; padding:5px 10px; font-size:0.8rem;"><i class="fa-solid fa-trash"></i></button>
                    </div>`).join('')}
                </div>
            </div>
            <div class="cart-side" style="overflow-y:auto;">
                <h4 style="margin-bottom:15px; color:var(--primary);"><i class="fa-solid fa-list-check"></i> Ø³Ø¬Ù„ Ø§Ù„Ø­Ø¶ÙˆØ± ÙˆØ§Ù„Ø§Ù†ØµØ±Ø§Ù</h4>
                <table class="foush-table">
                    <thead><tr><th>Ø§Ù„Ù…ÙˆØ¸Ù</th><th>Ø§Ù„ÙˆØ¸ÙŠÙØ©</th><th>Ù†ÙˆØ¹ Ø§Ù„Ø­Ø±ÙƒØ©</th><th>Ø§Ù„ØªØ§Ø±ÙŠØ® ÙˆØ§Ù„ÙˆÙ‚Øª</th></tr></thead>
                    <tbody>${(window.state.db.attendance || []).slice().reverse().map(a => {
                const emp = (window.state.db.employees || []).find(x => x.id === a.empId);
                return `<tr><td>${emp ? emp.name : 'Ù…Ø¬Ù‡ÙˆÙ„'}</td><td>${emp ? emp.role : '-'}</td><td><span class="badge badge-${a.type === 'in' ? 'ready' : 'preparing'}">${a.type === 'in' ? 'Ø­Ø¶ÙˆØ± âœ…' : 'Ø§Ù†ØµØ±Ø§Ù ðŸšª'}</span></td><td>${new Date(a.time).toLocaleString('ar-EG')}</td></tr>`;
            }).join('')}</tbody>
                </table>
            </div>
        </div>`;
        }

        function renderWaiter(c) {
            if (!window.state.waiterStage) window.state.waiterStage = 'tables';

            let headerHtml = '';
            if (window.state.waiterStage === 'tables' || window.state.waiterStage === 'tracking') {
                headerHtml = `<div style="display:flex; justify-content:center; gap:10px; margin-bottom:15px;">
                <button onclick="window.state.waiterStage='tables'; window.render();" class="btn-luxury" style="width:auto; padding:10px 20px; background:${window.state.waiterStage === 'tables' ? 'var(--primary)' : '#1e293b'}; color:${window.state.waiterStage === 'tables' ? '#000' : '#fff'}">Ø·Ø§ÙˆÙ„Ø§ØªÙŠ ðŸª‘</button>
                <button onclick="window.state.waiterStage='tracking'; window.render();" class="btn-luxury" style="width:auto; padding:10px 20px; background:${window.state.waiterStage === 'tracking' ? 'var(--primary)' : '#1e293b'}; color:${window.state.waiterStage === 'tracking' ? '#000' : '#fff'}">Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ù…Ø·Ø¨Ø® ðŸ“‹</button>
            </div>`;
            }

            let contentHtml = '';
            if (window.state.waiterStage === 'tables') {
                const tables = (window.state.db.tables || []).filter(t => (t.source || 'cashier') === 'waiter');
                const busyOrders = (window.state.db.orders || []).filter(o => o.type === 'salla' && !o.paid && o.status !== 'completed');

                contentHtml = `<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:15px; padding:10px;">${tables.map(t => {
                    const busy = busyOrders.find(o => o.table === t.name);
                    const statusColor = busy ? (busy.status === 'ready' ? 'var(--success)' : busy.status === 'billing' ? '#a855f7' : 'var(--danger)') : 'var(--primary)';
                    const statusText = busy ? (busy.status === 'ready' ? 'Ø¬Ø§Ù‡Ø² âœ…' : busy.status === 'billing' ? 'Ø§Ù„Ø­Ø³Ø§Ø¨ ðŸ’°' : busy.status === 'served' ? 'ØªÙ… Ø§Ù„ØªÙ‚Ø¯ÙŠÙ…' : 'ØªØ­Ø¶ÙŠØ± ðŸ”¥') : 'Ù…ØªØ§Ø­Ø©';
                    return `<div onclick="${busy ? `window.state.waiterViewOrder='${busy.id}'; window.state.waiterStage='view'; window.render();` : `window.state.waiterTable='${t.name}'; window.state.waiterStage='menu'; window.state.waiterCart=[]; window.state.waiterNotes=''; window.render();`}" class="table-btn ${busy ? 'busy' : ''} ${busy && busy.status === 'billing' ? 'billing' : ''}" style="width:130px; height:130px; font-size:1.5rem; display:flex; flex-direction:column; justify-content:center; align-items:center; border-color:${statusColor}; ${busy && (busy.status === 'ready' || busy.status === 'billing') ? `background:${busy.status === 'ready' ? 'rgba(16,185,129,0.15)' : 'rgba(168,85,247,0.15)'};` : ''}"><span>${t.name}</span><small style="font-size:0.8rem; margin-top:5px; color:${statusColor}; font-weight:900;">${statusText}</small>${busy ? `<small style="font-size:0.7rem; opacity:0.7; margin-top:2px;">${busy.total} Ø¬</small>` : ''}</div>`;
                }).join('')}</div>`;
            } else if (window.state.waiterStage === 'tracking') {
                const myOrders = (window.state.db.orders || []).filter(o => o.source === 'waiter' && o.type === 'salla' && o.status !== 'completed' && !o.paid);
                const ready = myOrders.filter(o => o.status === 'ready');
                const prep = myOrders.filter(o => o.status === 'preparing');
                contentHtml = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; padding:10px; height:calc(100vh - 150px);">
                <div class="cart-side" style="border-color:var(--success); overflow-y:auto;">
                    <h3 style="text-align:center; color:var(--success); margin-bottom:10px; font-family:'Orbitron';">Ø¬Ø§Ù‡Ø² Ù„Ù„Ø§Ø³ØªÙ„Ø§Ù… âœ… (${ready.length})</h3>
                    <div style="display:flex; flex-direction:column; gap:10px;">${ready.map(o => `<div class="order-card" style="border-color:var(--success); padding:10px;"><div style="display:flex; justify-content:space-between; align-items:center;"><h4>${o.table}</h4><span class="badge badge-ready">Ø¬Ø§Ù‡Ø²</span></div><div style="margin:8px 0; opacity:0.9; font-size:0.9rem;">${o.items.map(i => `${i.name} x${i.qty}`).join('<br>')}</div><button onclick="window.waiterServeOrder('${o.id}')" class="btn-luxury" style="background:var(--success); color:#fff; width:100%; padding:10px; margin-top:5px; font-size:1.1rem; border:none;">ØªÙ… Ø§Ù„ØªÙ‚Ø¯ÙŠÙ… Ù„Ù„Ø¹Ù…ÙŠÙ„ ðŸ½ï¸</button></div>`).join('') || '<p style="text-align:center; opacity:0.5;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ù„Ø¨Ø§Øª Ø¬Ø§Ù‡Ø²Ø©</p>'}</div>
                </div>
                <div class="cart-side" style="border-color:var(--danger); overflow-y:auto;">
                    <h3 style="text-align:center; color:var(--danger); margin-bottom:10px; font-family:'Orbitron';">ØªØ­Øª Ø§Ù„ØªØ¬Ù‡ÙŠØ² ðŸ”¥ (${prep.length})</h3>
                    <div style="display:flex; flex-direction:column; gap:10px;">${prep.map(o => `<div class="order-card" style="border-color:var(--danger); padding:10px;"><div style="display:flex; justify-content:space-between; align-items:center;"><h4>${o.table}</h4><span class="badge badge-preparing">ØªØ­Ø¶ÙŠØ±</span></div><div style="margin:8px 0; opacity:0.9; font-size:0.9rem;">${o.items.map(i => `${i.name} x${i.qty}`).join('<br>')}</div><div style="text-align:center; margin-top:5px; font-size:0.8rem; color:var(--danger); background:rgba(239,68,68,0.1); padding:5px; border-radius:5px;">ÙÙŠ Ø§Ù†ØªØ¸Ø§Ø± Ø§Ù„Ø´ÙŠÙ â³</div></div>`).join('') || '<p style="text-align:center; opacity:0.5;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ù„Ø¨Ø§Øª ÙÙŠ Ø§Ù„Ù…Ø·Ø¨Ø®</p>'}</div>
                </div>
            </div>`;
            } else if (window.state.waiterStage === 'view') {
                const o = (window.state.db.orders || []).find(x => String(x.id) === String(window.state.waiterViewOrder));
                if (!o) { window.state.waiterStage = 'tables'; window.render(); return; }
                contentHtml = `<div style="max-width:500px; margin:0 auto; padding:10px;">
                <button onclick="window.state.waiterStage='tables'; window.render();" class="btn-luxury danger" style="width:auto; padding:8px 15px; margin-bottom:15px;">ðŸ”™ Ø±Ø¬ÙˆØ¹ Ù„Ù„Ø·Ø§ÙˆÙ„Ø§Øª</button>
                <div class="cart-side">
                    <h3 style="text-align:center; color:var(--primary); margin-bottom:10px;">${o.table} - Ø·Ù„Ø¨ #${o.id}</h3>
                    <div style="text-align:center; margin-bottom:15px;"><span class="badge badge-${o.status === 'ready' ? 'ready' : o.status === 'billing' ? 'ready' : o.status === 'served' ? 'ready' : 'preparing'}" style="font-size:1.2rem; padding:8px 20px; background:${o.status === 'billing' ? '#a855f7' : ''}">${o.status === 'ready' ? 'Ø¬Ø§Ù‡Ø² Ù„Ù„Ø§Ø³ØªÙ„Ø§Ù… âœ…' : o.status === 'billing' ? 'ØªÙ… Ø·Ù„Ø¨ Ø§Ù„Ø­Ø³Ø§Ø¨ ðŸ’°' : o.status === 'served' ? 'ØªÙ… Ø§Ù„ØªÙ‚Ø¯ÙŠÙ… Ù„Ù„Ø¹Ù…ÙŠÙ„ ðŸ½ï¸' : 'ØªØ­Øª Ø§Ù„ØªØ¬Ù‡ÙŠØ² ðŸ”¥'}</span></div>
                    ${o.notes ? `<div style="background:rgba(251,191,36,0.1); border:1px solid var(--primary); border-radius:12px; padding:10px; margin-bottom:10px; text-align:center;"><i class="fa-solid fa-note-sticky"></i> ${o.notes}</div>` : ''}
                    <div style="flex:1;">${o.items.map(i => `<div style="display:flex; justify-content:space-between; padding:10px; background:rgba(0,0,0,0.2); border-radius:12px; margin-bottom:6px;"><span style="font-size:1.1rem; font-weight:900;">${i.name}</span><span style="color:var(--primary); font-weight:900;">x${i.qty}</span></div>`).join('')}</div>
                    <div style="border-top:2px solid var(--primary); padding-top:12px; text-align:center; margin-top:10px;">
                        <h2 style="color:var(--primary); font-family:'Orbitron'; margin-bottom:15px;">${o.total} Ø¬</h2>
                        ${o.status !== 'completed' ? `<div style="display:flex; gap:10px;"><button onclick="window.waiterRequestBill('${o.id}')" class="btn-luxury" style="background:#a855f7; color:#fff; border:none; flex:1; font-size:1.1rem; padding:12px;">Ø·Ù„Ø¨ Ø­Ø³Ø§Ø¨ Ù„Ù„ÙƒØ§Ø´ÙŠØ± ðŸ””</button><button onclick="window.settleOrder('${o.id}')" class="btn-luxury" style="background:var(--success); color:#fff; border:none; flex:1; font-size:1.1rem; padding:12px;">Ø¯ÙØ¹ ÙˆØ­Ø³Ø§Ø¨ ðŸ’°</button></div>` : ''}
                    </div>
                </div>
            </div>`;
            } else if (window.state.waiterStage === 'menu') {
                if (!window.state.waiterCat) window.state.waiterCat = 'Ø§Ù„ÙƒÙ„';
                const total = (window.state.waiterCart || []).reduce((s, i) => s + (i.price * i.qty), 0);
                contentHtml = `<div class="pos-layout"><div class="items-side">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <button onclick="window.state.waiterStage='tables'; window.render();" class="btn-luxury danger" style="width:auto; padding:8px 15px;">ðŸ”™ Ø±Ø¬ÙˆØ¹</button>
                    <h3 style="color:var(--primary);">Ø·Ø§ÙˆÙ„Ø©: ${window.state.waiterTable}</h3>
                </div>
                <div style="display:flex; gap:8px; margin-bottom:8px; overflow-x:auto;" class="hide-scroll">${['Ø§Ù„ÙƒÙ„', 'Ø·ÙˆØ§Ø¬Ù†', 'Ø£Ø±Ø² ÙˆÙØªØ©', 'Ø´ÙˆØ±Ø¨Ø©', 'Ø³Ù„Ø·Ø§Øª', 'Ù…Ø´Ø±ÙˆØ¨Ø§Øª'].map(cat => `<button onclick="window.state.waiterCat='${cat}'; window.render();" class="btn-luxury" style="width:auto; padding:8px 20px; background:${window.state.waiterCat === cat ? 'var(--primary)' : '#1e293b'}; color:${window.state.waiterCat === cat ? '#000' : '#fff'}">${cat}</button>`).join('')}</div>
                <div class="items-grid hide-scroll">${window.state.db.menu.filter(m => window.state.waiterCat === 'Ø§Ù„ÙƒÙ„' || m.category === window.state.waiterCat).map(m => `<div class="pos-card ${(!m.unlimited && m.stock <= 0) ? 'out-of-stock' : ''}" onclick="window.waiterAddToCart(${m.id})"><h3>${m.name}</h3><p style="color:var(--primary); font-weight:900;">${m.price} Ø¬</p></div>`).join('')}</div>
            </div>
            <div class="cart-side">
                <h3 style="text-align:center; margin-bottom:10px; color:var(--primary);">Ø§Ù„Ø£ÙˆØ±Ø¯Ø±</h3>
                <div class="cart-items hide-scroll" style="flex:1;">${(window.state.waiterCart || []).map((i, idx) => `<div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:10px; border-radius:12px; margin-bottom:6px; border:1px solid rgba(255,255,255,0.03);"><div><span style="font-size:1rem;">${i.name}</span><br><small style="color:var(--primary); font-size:0.9rem;">${i.price * i.qty} Ø¬</small></div><div style="display:flex; align-items:center; gap:8px;"><button onclick="window.waiterQty(${idx},-1)" style="background:var(--danger); color:#fff; border:none; border-radius:8px; width:30px; height:30px; cursor:pointer; font-size:1rem; font-weight:900;">-</button><span style="font-size:1.1rem; font-weight:900; min-width:25px; text-align:center;">${i.qty}</span><button onclick="window.waiterQty(${idx},1)" style="background:var(--success); color:#fff; border:none; border-radius:8px; width:30px; height:30px; cursor:pointer; font-size:1rem; font-weight:900;">+</button></div></div>`).join('')}</div>
                <input id="waiter-notes" placeholder="Ù…Ù„Ø§Ø­Ø¸Ø§Øª Ù„Ù„Ù…Ø·Ø¨Ø® (Ø¨Ø¯ÙˆÙ† Ø¨ØµÙ„ØŒ Ø²ÙŠØ§Ø¯Ø© Ø±Ø²...)" class="input-luxury" style="margin-bottom:8px; font-size:0.9rem;" value="${window.state.waiterNotes || ''}" onchange="window.state.waiterNotes=this.value">
                <div style="border-top:2px solid var(--primary); padding-top:12px; text-align:center;">
                    <h1 style="color:var(--primary); font-size:2.2rem; margin-bottom:10px; font-family:'Orbitron';">${total} Ø¬</h1>
                    <button onclick="window.waiterConfirmOrder()" class="btn-luxury" style="font-size:1.6rem; padding:18px; width:100%;">Ø¥Ø±Ø³Ø§Ù„ Ù„Ù„Ù…Ø·Ø¨Ø® ðŸš€</button>
                </div>
            </div></div>`;
            }
            c.innerHTML = headerHtml + contentHtml;
        }

        window.waiterAddToCart = (id) => {
            const m = window.state.db.menu.find(x => x.id === id); if (!m) return;
            const inCartCount = (window.state.waiterCart || []).filter(x => x.id === id).reduce((s, x) => s + x.qty, 0);
            if (!m.unlimited && m.stock <= inCartCount) { window.showToast("Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø±ØµÙŠØ¯ ÙƒØ§ÙÙŠ!"); return; }
            const inCart = (window.state.waiterCart || []).find(x => x.id === id); if (inCart) inCart.qty++; else { if (!window.state.waiterCart) window.state.waiterCart = []; window.state.waiterCart.push({ ...m, qty: 1 }); }
            window.render();
        };

        window.waiterQty = (idx, delta) => {
            if (!window.state.waiterCart || !window.state.waiterCart[idx]) return;
            window.state.waiterCart[idx].qty += delta;
            if (window.state.waiterCart[idx].qty <= 0) window.state.waiterCart.splice(idx, 1);
            window.render();
        };

        window.waiterConfirmOrder = () => {
            if (!window.state.waiterCart || window.state.waiterCart.length === 0) return;
            if (!window.state.db.shift) { window.showToast("ÙŠØ±Ø¬Ù‰ ÙØªØ­ ÙˆØ±Ø¯ÙŠØ© Ø£ÙˆÙ„Ø§Ù‹!"); return; }
            const notes = document.getElementById('waiter-notes') ? document.getElementById('waiter-notes').value : '';

            const o = { id: (window.state.db.orders || []).length + 1, items: [...window.state.waiterCart], total: window.state.waiterCart.reduce((s, i) => s + (i.price * i.qty), 0), type: 'salla', table: window.state.waiterTable, status: 'preparing', time: Date.now(), source: 'waiter', paid: false, notes: notes };
            o.items.forEach(item => { const m = window.state.db.menu.find(x => x.id === item.id); if (m && !m.unlimited) m.stock -= item.qty; });
            if (!Array.isArray(window.state.db.orders)) window.state.db.orders = [];
            window.state.db.orders.unshift(o);

            window.state.waiterCart = []; window.state.waiterStage = 'tables'; window.state.waiterTable = null; window.state.waiterNotes = '';
            window.save();
            window.showToast("ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨ Ù„Ù„Ù…Ø·Ø¨Ø® Ø¨Ù†Ø¬Ø§Ø­! âœ…"); window.playSound('success');
        };

        window.addEmployee = () => { const n = document.getElementById('emp-name').value; const r = document.getElementById('emp-role').value; const p = document.getElementById('emp-pin').value; if (n && p) { window.state.db.employees.push({ id: Date.now(), name: n, role: r, pin: p }); window.save(); window.render(); window.showToast("ØªÙ… Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ù…ÙˆØ¸Ù âœ…"); } };
        window.deleteEmployee = (id) => { if (confirm('Ø­Ø°Ù Ø§Ù„Ù…ÙˆØ¸Ù Ù†Ù‡Ø§Ø¦ÙŠØ§Ù‹ØŸ')) { window.state.db.employees = window.state.db.employees.filter(e => e.id !== id); window.save(); window.render(); window.showToast("ØªÙ… Ø§Ù„Ø­Ø°Ù"); } };

        window.registerAttendance = () => {
            const pin = document.getElementById('att-pin').value; const msg = document.getElementById('att-msg');
            if (!pin) return;
            const emp = (window.state.db.employees || []).find(e => e.pin === pin);
            if (!emp) { msg.textContent = "Ø§Ù„ÙƒÙˆØ¯ ØºÙŠØ± ØµØ­ÙŠØ­!"; window.playSound('error'); return; }

            if (!window.state.db.shift) {
                msg.style.color = 'var(--danger)';
                msg.textContent = "ÙŠØ±Ø¬Ù‰ ÙØªØ­ ÙˆØ±Ø¯ÙŠØ© Ø£ÙˆÙ„Ø§Ù‹ Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø­Ø¶ÙˆØ±!";
                window.playSound('error');
                return;
            }

            const att = window.state.db.attendance || [];
            const lastRec = att.slice().reverse().find(a => a.empId === emp.id);
            const type = (lastRec && lastRec.type === 'in') ? 'out' : 'in';

            if (type === 'in') {
                const shiftStart = window.state.db.shift.start;
                const hasCheckedInThisShift = att.find(a => a.empId === emp.id && a.type === 'in' && a.time >= shiftStart);
                if (hasCheckedInThisShift) {
                    msg.style.color = 'var(--danger)';
                    msg.textContent = "Ù„Ù‚Ø¯ Ù‚Ù…Øª Ø¨ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø­Ø¶ÙˆØ± Ù…Ø³Ø¨Ù‚Ø§Ù‹ ÙÙŠ Ù‡Ø°Ù‡ Ø§Ù„ÙˆØ±Ø¯ÙŠØ©!";
                    window.playSound('error');
                    setTimeout(() => {
                        document.getElementById('att-pin').value = '';
                        msg.textContent = '';
                        document.getElementById('attendance-modal').style.display = 'none';
                    }, 1500);
                    return;
                }
            }

            att.push({ empId: emp.id, type: type, time: Date.now() });
            window.state.db.attendance = att; window.save();

            msg.style.color = type === 'in' ? 'var(--success)' : 'var(--primary)';
            msg.textContent = `ØªÙ… ØªØ³Ø¬ÙŠÙ„ ${type === 'in' ? 'Ø§Ù„Ø­Ø¶ÙˆØ±' : 'Ø§Ù„Ø§Ù†ØµØ±Ø§Ù'}: ${emp.name} âœ…`;
            window.playSound('success');

            setTimeout(() => {
                document.getElementById('att-pin').value = '';
                msg.textContent = '';
                document.getElementById('attendance-modal').style.display = 'none';
            }, 1500);
        };

        window.kitchenAction = (id, next) => { const o = window.state.db.orders.find(x => String(x.id) === String(id)); if (o) { o.status = next; window.save(); if (next === 'ready') { window.showToast(`Ø·Ù„Ø¨ #${id} Ø¬Ø§Ù‡Ø² Ù„Ù„ØªØ³Ù„ÙŠÙ…! ðŸ“¤`); window.playSound('success'); } } };
        window.settleOrder = (id) => { const o = window.state.db.orders.find(x => String(x.id) === String(id)); if (o) { window.state.tempOrder = { ...o }; window.showReceiptPreview(window.state.tempOrder); } };
        window.completeOrder = (id) => { const o = window.state.db.orders.find(x => String(x.id) === String(id)); if (o) { o.status = 'completed'; window.save(); window.showToast("ØªÙ… ØªØ³Ù„ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨ âœ…"); } };
        window.cancelOrder = (id) => { if (confirm('Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø·Ù„Ø¨ØŸ')) { const o = window.state.db.orders.find(x => String(x.id) === String(id)); if (o) { o.status = 'canceled'; window.save(); window.showToast("ØªÙ… Ø¥Ù„ØºØ§Ø¡ Ø§Ù„Ø·Ù„Ø¨ âŒ"); } } };
        window.waiterServeOrder = (id) => { const o = window.state.db.orders.find(x => String(x.id) === String(id)); if (o) { o.status = 'served'; window.save(); window.showToast("ØªÙ… ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨ Ù„Ù„Ø¹Ù…ÙŠÙ„ ðŸ½ï¸"); window.playSound('success'); } };
        window.waiterRequestBill = (id) => { const o = window.state.db.orders.find(x => String(x.id) === String(id)); if (o) { o.status = 'billing'; window.save(); window.showToast("ØªÙ… Ø¥Ø±Ø³Ø§Ù„ Ø·Ù„Ø¨ Ø§Ù„Ø­Ø³Ø§Ø¨ Ù„Ù„ÙƒØ§Ø´ÙŠØ± ðŸ’°ðŸ””"); window.playSound('bell'); } };
        window.saveExpense = () => {
            const n = document.getElementById('ex-name').value.trim();
            const d = document.getElementById('ex-details').value.trim();
            const a = document.getElementById('ex-amount').value;
            const typeElem = document.getElementById('ex-type');
            const type = typeElem ? typeElem.value : 'general';
            
            const isMgmt = (window.state.role === 'admin' || window.state.role === 'manager');
            if (!isMgmt && !window.state.db.shift) {
                window.showToast("âš ï¸ ÙŠØ¬Ø¨ Ø¨Ø¯Ø¡ Ø§Ù„ÙˆØ±Ø¯ÙŠØ© Ø£ÙˆÙ„Ø§Ù‹ Ù„ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª!");
                return;
            }

            let invItemName = '';
            let invQty = 0;
            
            if (type === 'inventory') {
                const itemSelect = document.getElementById('ex-inv-item').value;
                invQty = Number(document.getElementById('ex-inv-qty').value);
                
                if (!itemSelect || !invQty) {
                    window.showToast("âš ï¸ ÙŠØ±Ø¬Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø®Ø§Ù…Ø© ÙˆØ§Ù„ÙƒÙ…ÙŠØ© Ø§Ù„Ù…Ø´ØªØ±Ø§Ø©!");
                    return;
                }
                
                if (itemSelect === 'new') {
                    const newName = document.getElementById('ex-new-name').value.trim();
                    const newUnit = document.getElementById('ex-new-unit').value.trim();
                    if (!newName || !newUnit) {
                        window.showToast("âš ï¸ ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ø³Ù… Ø§Ù„Ø®Ø§Ù…Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø© ÙˆÙˆØ­Ø¯ØªÙ‡Ø§!");
                        return;
                    }
                    invItemName = newName;
                    if (!window.state.db.main_inventory) window.state.db.main_inventory = [];
                    window.state.db.main_inventory.push({ id: Date.now().toString(), name: newName, unit: newUnit, qty: invQty, minQty: 0 });
                } else {
                    invItemName = itemSelect;
                    const existing = window.state.db.main_inventory.find(i => i.name === invItemName);
                    if (existing) {
                        existing.qty += invQty;
                    }
                }
            }
            
            if (a) {
                if (!window.state.db.exp) window.state.db.exp = [];
                window.state.db.exp.unshift({
                    type: type,
                    invItem: invItemName,
                    qty: invQty,
                    name: n || (type === 'inventory' ? 'Ø´Ø±Ø§Ø¡ Ø®Ø§Ù…Ø§Øª' : 'Ù…ØµØ±ÙˆÙ Ø¹Ø§Ù…'),
                    details: d,
                    amount: Number(a),
                    time: Date.now(),
                    isShiftExpense: !isMgmt
                });
                window.save();
                window.render();
                window.playSound('success');
                window.showToast("ØªÙ… Ø­ÙØ¸ Ø§Ù„Ù…ØµØ±ÙˆÙ ÙˆØªØ­Ø¯ÙŠØ« Ø§Ù„Ù…Ø®Ø²Ù† âœ…");
            } else {
                window.showToast("âš ï¸ ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ù„Ù…Ø¨Ù„Øº!");
            }
        };

        window._selectExpCat = (el) => {
            document.querySelectorAll('.exp-cat-card').forEach(card => {
                card.classList.remove('active-cat');
                card.style.border = '2px solid rgba(255,255,255,0.08)';
                card.style.background = 'rgba(255,255,255,0.04)';
            });
            el.classList.add('active-cat');
            el.style.border = '2px solid var(--primary)';
            el.style.background = 'rgba(251,191,36,0.12)';
            const type = document.getElementById('ex-type').value;
            const invContainer = document.getElementById('ex-inv-container');
            if (invContainer) {
                invContainer.style.display = type === 'inventory' ? 'block' : 'none';
            }
        };

        window.selectFrequentExpense = (id) => {
            if (!id) {
                document.getElementById('ex-name').value = '';
                document.getElementById('ex-details').value = '';
                return;
            }
            const fe = (window.state.db.frequent_expenses || []).find(x => x.id === id);
            if (fe) {
                document.getElementById('ex-name').value = fe.name || '';
                document.getElementById('ex-details').value = fe.details || '';
                
                const amtInput = document.getElementById('ex-amount');
                if (amtInput) {
                    amtInput.focus();
                    amtInput.style.transition = 'all 0.3s ease';
                    amtInput.style.boxShadow = '0 0 15px var(--danger)';
                    setTimeout(() => {
                        amtInput.style.boxShadow = '';
                    }, 1000);
                }
            }
        };

        window.saveCurrentAsFrequent = () => {
            const name = document.getElementById('ex-name').value.trim();
            const details = document.getElementById('ex-details').value.trim();
            if (!name) {
                window.showToast("âš ï¸ ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ø³Ù… Ø§Ù„Ù…ØµØ±ÙˆÙ / Ø§Ù„Ù…Ø³ØªÙ„Ù… Ù„Ø­ÙØ¸Ù‡!");
                return;
            }
            if (!window.state.db.frequent_expenses) window.state.db.frequent_expenses = [];
            const exists = window.state.db.frequent_expenses.some(fe => fe.name.toLowerCase() === name.toLowerCase());
            if (exists) {
                window.showToast("âš ï¸ Ù‡Ø°Ø§ Ø§Ù„Ù…ØµØ±ÙˆÙ Ù…Ø³Ø¬Ù„ Ø¨Ø§Ù„ÙØ¹Ù„!");
                return;
            }
            const newItem = { id: Date.now().toString(), name, details };
            window.state.db.frequent_expenses.push(newItem);
            window.save();
            window.showToast("ØªÙ… Ø§Ù„Ø­ÙØ¸ ÙÙŠ Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª Ø§Ù„Ù…Ø³Ø¬Ù„Ø© ðŸ“Œ");
            window.render();
            setTimeout(() => {
                const sel = document.getElementById('ex-frequent-select');
                if (sel) {
                    sel.value = newItem.id;
                }
            }, 100);
        };

        window.openFrequentExpensesModal = () => {
            const container = document.getElementById('frequent-expenses-list-container');
            const list = window.state.db.frequent_expenses || [];
            if (list.length === 0) {
                container.innerHTML = '<p style="text-align:center; opacity:0.5; padding:20px; font-size:0.9rem;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…ØµØ±ÙˆÙØ§Øª Ù…Ø³Ø¬Ù„Ø© Ø­Ø§Ù„ÙŠØ§Ù‹</p>';
            } else {
                container.innerHTML = list.map(fe => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); border-radius:8px; margin-bottom:5px;">
                        <div style="text-align:right;">
                            <strong style="color:var(--primary); font-size:0.95rem;">${fe.name}</strong>
                            ${fe.details ? `<br><small style="opacity:0.6; font-size:0.8rem;">${fe.details}</small>` : ''}
                        </div>
                        <button onclick="window.deleteFrequentExpense('${fe.id}')" class="btn-luxury danger" style="width:auto; padding:6px 12px; font-size:0.8rem; margin:0;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `).join('');
            }
            document.getElementById('frequent-expenses-modal').style.display = 'flex';
        };

        window.addFrequentExpenseFromModal = () => {
            const name = document.getElementById('new-freq-name').value.trim();
            const details = document.getElementById('new-freq-details').value.trim();
            if (!name) {
                window.showToast("âš ï¸ ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ø³Ù… Ø§Ù„Ù…ØµØ±ÙˆÙ!");
                return;
            }
            if (!window.state.db.frequent_expenses) window.state.db.frequent_expenses = [];
            const exists = window.state.db.frequent_expenses.some(fe => fe.name.toLowerCase() === name.toLowerCase());
            if (exists) {
                window.showToast("âš ï¸ Ø§Ø³Ù… Ø§Ù„Ù…ØµØ±ÙˆÙ Ù…Ø³Ø¬Ù„ Ù…Ø³Ø¨Ù‚Ø§Ù‹!");
                return;
            }
            window.state.db.frequent_expenses.push({ id: Date.now().toString(), name, details });
            window.save();
            window.render();
            document.getElementById('new-freq-name').value = '';
            document.getElementById('new-freq-details').value = '';
            window.openFrequentExpensesModal();
            window.showToast("ØªÙ… Ø§Ù„Ø­ÙØ¸ Ø¨Ù†Ø¬Ø§Ø­ âœ…");
        };

        window.deleteFrequentExpense = (id) => {
            if (confirm("Ù‡Ù„ ØªØ±ÙŠØ¯ Ø­Ø°Ù Ù‡Ø°Ø§ Ø§Ù„Ù…ØµØ±ÙˆÙ Ø§Ù„Ù…Ø³Ø¬Ù„ØŸ")) {
                window.state.db.frequent_expenses = (window.state.db.frequent_expenses || []).filter(x => x.id !== id);
                window.save();
                window.render();
                window.openFrequentExpensesModal();
                window.showToast("ØªÙ… Ø§Ù„Ø­ÙØ¸ Ø¨Ù†Ø¬Ø§Ø­ âœ…");
            }
        };

        window.filterExpensesList = () => {
            const typeFilter = document.getElementById('filter-exp-type').value;
            const monthFilter = document.getElementById('filter-exp-month').value;
            const yearFilter = document.getElementById('filter-exp-year').value;
            const dayFilter = document.getElementById('filter-exp-day').value;
            const searchQuery = document.getElementById('filter-exp-search').value.toLowerCase().trim();
            const isMgmt = (window.state.role === 'admin' || window.state.role === 'manager');
            const shiftStart = window.state.db.shift ? window.state.db.shift.start : 0;

            const baseList = isMgmt 
                ? (window.state.db.exp || []) 
                : (window.state.db.exp || []).filter(e => e.time >= shiftStart && e.isShiftExpense);

            const filtered = baseList.filter(e => {
                if (typeFilter !== 'all' && e.type !== typeFilter) return false;

                const expDate = new Date(e.time);
                if (monthFilter !== 'all' && expDate.getMonth().toString() !== monthFilter) return false;
                if (yearFilter !== 'all' && expDate.getFullYear().toString() !== yearFilter) return false;
                if (dayFilter !== 'all' && expDate.getDate().toString() !== dayFilter) return false;

                if (searchQuery) {
                    const nameMatch = (e.name || '').toLowerCase().includes(searchQuery);
                    const detailsMatch = (e.details || '').toLowerCase().includes(searchQuery);
                    const invItemMatch = (e.invItem || '').toLowerCase().includes(searchQuery);
                    if (!nameMatch && !detailsMatch && !invItemMatch) return false;
                }

                return true;
            });

            const tbody = document.getElementById('expenses-table-body');
            if (tbody) {
                tbody.innerHTML = filtered.map(e => `
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                        <td>${new Date(e.time).toLocaleDateString('ar-EG')}<br><small style="opacity:0.6">${new Date(e.time).toLocaleTimeString('ar-EG')}</small></td>
                        <td>
                            ${e.type === 'inventory' ? '<span class="badge" style="background:var(--success);">Ø®Ø§Ù…Ø§Øª Ù…Ø®Ø²Ù†</span><br><small>' + e.invItem + '</small>' : 
                              (e.type === 'salaries' ? '<span class="badge" style="background:var(--primary);">Ù…Ø±ØªØ¨Ø§Øª</span>' :
                              (e.type === 'emergency' ? '<span class="badge" style="background:var(--danger);">Ø·ÙˆØ§Ø±Ø¦</span>' :
                              '<span class="badge" style="background:rgba(255,255,255,0.2);">Ù…ØµØ±ÙˆÙ Ø¹Ø§Ù…</span>'))}
                            ${e.name ? '<br><small style="opacity:0.8; color:var(--primary);"><i class="fa-solid fa-user"></i> ' + e.name + '</small>' : ''}
                        </td>
                        <td>${e.details || '-'}${e.type==='inventory' ? `<br><small style="color:var(--success);">Ø§Ù„ÙƒÙ…ÙŠØ©: ${e.qty}</small>` : ''}</td>
                        <td style="color:var(--danger); font-weight:bold; font-size:1.1rem;">${e.amount} Ø¬</td>
                    </tr>
                `).join('') || '<tr><td colspan="4" style="padding:3rem; text-align:center; opacity:0.3;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…ØµØ±ÙˆÙØ§Øª ØªØ·Ø§Ø¨Ù‚ Ø§Ù„ØªØµÙÙŠØ©</td></tr>';
            }
        };

        window.resetExpensesFilter = () => {
            document.getElementById('filter-exp-type').value = 'all';
            document.getElementById('filter-exp-month').value = 'all';
            document.getElementById('filter-exp-year').value = 'all';
            document.getElementById('filter-exp-day').value = 'all';
            document.getElementById('filter-exp-search').value = '';
            window.filterExpensesList();
        };

        window.deleteAdminInventoryItem = (id) => {
            if (confirm('Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ù…Ù† Ø­Ø°Ù Ù‡Ø°Ù‡ Ø§Ù„Ø®Ø§Ù…Ø©ØŸ')) {
                window.state.db.main_inventory = window.state.db.main_inventory.filter(i => i.id !== id);
                window.save();
                window.render();
            }
        };

        window.openAdminInventoryEdit = (id) => {
            const item = window.state.db.main_inventory.find(i => i.id === id);
            if (item) {
                document.getElementById('admin-inv-edit-id').value = item.id;
                document.getElementById('admin-inv-edit-name').value = item.name || '';
                document.getElementById('admin-inv-edit-unit').value = item.unit || '';
                document.getElementById('admin-inv-edit-qty').value = item.qty || 0;
                document.getElementById('admin-inv-edit-min').value = item.minQty || 0;
                document.getElementById('admin-inventory-edit-modal').style.display = 'flex';
            }
        };

        window.finalizeAdminInventoryEdit = () => {
            const id = document.getElementById('admin-inv-edit-id').value;
            const item = window.state.db.main_inventory.find(i => i.id === id);
            if (item) {
                const name = document.getElementById('admin-inv-edit-name').value;
                const unit = document.getElementById('admin-inv-edit-unit').value;
                const qty = document.getElementById('admin-inv-edit-qty').value;
                const minQty = document.getElementById('admin-inv-edit-min').value;
                
                if (!name || !unit) {
                    window.showToast("ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ø³Ù… Ø§Ù„Ø®Ø§Ù…Ø© ÙˆÙˆØ­Ø¯Ø© Ø§Ù„Ù‚ÙŠØ§Ø³! âš ï¸");
                    return;
                }
                
                item.name = name;
                item.unit = unit;
                item.qty = Number(qty);
                item.minQty = Number(minQty);
                window.save();
                window.render();
                document.getElementById('admin-inventory-edit-modal').style.display = 'none';
                window.playSound('assets/success.mp3');
                window.showToast("ØªÙ… ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø®Ø§Ù…Ø© Ø¨Ù†Ø¬Ø§Ø­! âœ…");
            }
        };

        window.openAdminInventoryAdd = () => {
            document.getElementById('admin-inv-new-name').value = '';
            document.getElementById('admin-inv-new-unit').value = '';
            document.getElementById('admin-inv-new-qty').value = '';
            document.getElementById('admin-inv-new-min').value = '';
            document.getElementById('admin-inventory-add-modal').style.display = 'flex';
        };

        window.finalizeAdminInventoryAdd = () => {
            const name = document.getElementById('admin-inv-new-name').value;
            const unit = document.getElementById('admin-inv-new-unit').value;
            const qty = document.getElementById('admin-inv-new-qty').value;
            const minQty = document.getElementById('admin-inv-new-min').value;
            
            if (!name || !unit) {
                window.showToast("ÙŠØ±Ø¬Ù‰ Ø¥Ø¯Ø®Ø§Ù„ Ø§Ø³Ù… Ø§Ù„Ø®Ø§Ù…Ø© ÙˆÙˆØ­Ø¯Ø© Ø§Ù„Ù‚ÙŠØ§Ø³! âš ï¸");
                return;
            }
            if (!window.state.db.main_inventory) window.state.db.main_inventory = [];
            window.state.db.main_inventory.push({
                id: Date.now().toString(),
                name: name,
                unit: unit,
                qty: Number(qty) || 0,
                minQty: Number(minQty) || 0
            });
            window.save();
            document.getElementById('admin-inventory-add-modal').style.display = 'none';
            window.render();
            window.playSound('success');
            window.showToast("ØªÙ…Øª Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ø®Ø§Ù…Ø© Ø¨Ù†Ø¬Ø§Ø­ âœ…");
        };

        window.openShiftDrilldown = (action) => {
            const title = document.getElementById('drilldown-title');
            const content = document.getElementById('drilldown-content');
            const orders = window.state.db.orders || [];
            
            if (action === 'orders') {
                title.innerHTML = '<i class="fa-solid fa-receipt"></i> Ø¬Ù…ÙŠØ¹ Ø·Ù„Ø¨Ø§Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ©';
                content.innerHTML = orders.filter(o => o.status !== 'canceled').map(o => `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between;"><div><strong>#${o.id} - ${o.table || (o.type==='takeaway'?'ØªÙŠÙƒ Ø§ÙˆØ§ÙŠ':'Ø¯Ù„ÙŠÙØ±ÙŠ')}</strong><br><span style="font-size:0.8rem; opacity:0.7">${new Date(o.time).toLocaleTimeString('ar-EG')}</span></div><strong style="color:var(--primary);">${o.total} Ø¬</strong></div>`).join('') || '<p style="text-align:center;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ù„Ø¨Ø§Øª</p>';
            }
            else if (action === 'staff') {
                title.innerHTML = '<i class="fa-solid fa-users"></i> Ù…ÙˆØ¸ÙÙŠ Ø§Ù„ÙˆØ±Ø¯ÙŠØ©';
                const attendance = window.state.db.attendance || [];
                const checkedInIds = {};
                attendance.forEach(a => { checkedInIds[a.empId] = a.type; });
                const attendanceIn = Object.keys(checkedInIds).filter(id => checkedInIds[id] === 'in');
                content.innerHTML = attendanceIn.map(empId => {
                    const emp = (window.state.db.employees || []).find(x => String(x.id) === String(empId));
                    return `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;"><div><strong>${emp ? emp.name : 'Ù…Ø¬Ù‡ÙˆÙ„'}</strong><br><span style="font-size:0.8rem; opacity:0.7">${emp ? emp.role : '-'}</span></div><span class="badge badge-ready">Ù…ØªÙˆØ§Ø¬Ø¯ ðŸŸ¢</span></div>`;
                }).join('') || '<p style="text-align:center;">Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ù…ÙˆØ¸ÙÙŠÙ† Ù…Ø³Ø¬Ù„ÙŠÙ† Ø­Ø¶ÙˆØ±</p>';
            }
            else if (action === 'expenses') {
                title.innerHTML = '<i class="fa-solid fa-money-bill-wave"></i> ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª';
                const ex = window.state.db.exp || [];
                content.innerHTML = ex.map(e => `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between;"><div><strong>${e.type === 'inventory' ? 'Ø®Ø§Ù…Ø§Øª: ' + e.invItem : 'Ù…ØµØ±ÙˆÙ Ø¹Ø§Ù…'}</strong><br><span style="font-size:0.8rem; opacity:0.7">${e.details || '-'}</span></div><strong style="color:var(--danger);">${e.amount} Ø¬</strong></div>`).join('') || '<p style="text-align:center;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…ØµØ±ÙˆÙØ§Øª Ù…Ø³Ø¬Ù„Ø©</p>';
            }
            else if (action === 'tables') {
                title.innerHTML = '<i class="fa-solid fa-chair"></i> Ø­Ø§Ù„Ø© Ø§Ù„Ø·Ø§ÙˆÙ„Ø§Øª';
                const tables = window.state.db.tables || [];
                const busyOrders = orders.filter(o => o.type === 'salla' && !o.paid && o.status !== 'completed');
                content.innerHTML = tables.map(t => {
                    const busy = busyOrders.find(o => o.table === t.name);
                    return `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;"><strong>Ø·Ø§ÙˆÙ„Ø© ${t.name}</strong> ${busy ? `<span class="badge badge-preparing" style="background:var(--danger)">Ù…Ø´ØºÙˆÙ„Ø© ðŸ”´ (${busy.total} Ø¬)</span>` : '<span class="badge badge-ready" style="background:var(--success)">Ù…ØªØ§Ø­Ø© ðŸŸ¢</span>'}</div>`;
                }).join('') || '<p style="text-align:center;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ø§ÙˆÙ„Ø§Øª Ù…Ø¶Ø§ÙØ©</p>';
            }
            else if (action === 'active') {
                title.innerHTML = '<i class="fa-solid fa-fire"></i> Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø© Ø­Ø§Ù„ÙŠØ§Ù‹';
                const active = orders.filter(o => o.status === 'preparing' || o.status === 'ready' || o.status === 'billing' || o.status === 'served');
                content.innerHTML = active.map(o => `<div style="background:rgba(255,255,255,0.05); border-right:3px solid ${o.status==='ready'?'#10b981':o.status==='preparing'?'#f59e0b':'#3b82f6'}; padding:10px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between;"><div><strong>#${o.id} - ${o.table || (o.type==='takeaway'?'ØªÙŠÙƒ Ø§ÙˆØ§ÙŠ':'Ø¯Ù„ÙŠÙØ±ÙŠ')}</strong><br><span style="font-size:0.8rem; opacity:0.7">${o.items.map(i=>i.name).join('ØŒ ')}</span></div><strong style="color:var(--primary);">${o.total} Ø¬</strong></div>`).join('') || '<p style="text-align:center;">Ù„Ø§ ØªÙˆØ¬Ø¯ Ø·Ù„Ø¨Ø§Øª Ù†Ø´Ø·Ø©</p>';
            }
            else if (action === 'sales' || action === 'cash' || action === 'avg' || action === 'customers') {
                title.innerHTML = '<i class="fa-solid fa-chart-pie"></i> Ù…Ù„Ø®Øµ Ø§Ù„Ù…Ø§Ù„ÙŠ Ù„Ù„Ø¥ÙŠØ±Ø§Ø¯Ø§Øª';
                const paidOrders = orders.filter(o => o.paid);
                const cashSales = paidOrders.filter(o => !o.paymentMethod || o.paymentMethod === 'cash').reduce((s, o) => s + o.total - (o.discount || 0), 0);
                const visaSales = paidOrders.filter(o => o.paymentMethod === 'visa').reduce((s, o) => s + o.total - (o.discount || 0), 0);
                const walletSales = paidOrders.filter(o => o.paymentMethod === 'wallet').reduce((s, o) => s + o.total - (o.discount || 0), 0);
                
                content.innerHTML = `
                <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:12px; margin-bottom:10px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                        <span>Ø¯ÙØ¹ ÙƒØ§Ø´ ðŸ’µ</span>
                        <strong style="color:#10b981;">${cashSales} Ø¬</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:8px;">
                        <span>Ø¯ÙØ¹ ÙÙŠØ²Ø§ ðŸ’³</span>
                        <strong style="color:#3b82f6;">${visaSales} Ø¬</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Ø¯ÙØ¹ Ù…Ø­ÙØ¸Ø© ðŸ“±</span>
                        <strong style="color:#8b5cf6;">${walletSales} Ø¬</strong>
                    </div>
                </div>
                <p style="text-align:center; opacity:0.6; font-size:0.8rem; margin:0;">ØªÙØ§ØµÙŠÙ„ ÙƒÙ„ Ø·Ù„Ø¨ ÙˆÙ‚ÙŠÙ…ØªÙ‡ ØªØ¬Ø¯Ù‡Ø§ ÙÙŠ Ù‚Ø³Ù… "Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„Ù…Ù†ÙØ°Ø©" ðŸ“‹</p>
                `;
            }
            else {
                title.innerHTML = '<i class="fa-solid fa-circle-info"></i> Ø§Ù„ØªÙØ§ØµÙŠÙ„';
                content.innerHTML = '<p style="text-align:center; opacity:0.7; padding:20px;">Ø§Ù„Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„ØªÙØµÙŠÙ„ÙŠØ© Ù…Ø¹Ø±ÙˆØ¶Ø© Ø¨Ø§Ù„Ø£Ø¹Ù„Ù‰ ÙÙŠ Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠØ§Øª Ø£Ùˆ Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¨ÙŠØ§Ù†Ø§Øª Ù…Ø³Ø¬Ù„Ø©.</p>';
            }
            
            document.getElementById('drilldown-modal').style.display = 'flex';
        };
        window.addTable = () => { const n = document.getElementById('new-tab-name').value; const src = document.getElementById('new-tab-source').value; if (n) { window.state.db.tables.push({ id: Date.now(), name: n, source: src }); window.save(); document.getElementById('new-tab-name').value = ''; window.showToast("ØªÙ… Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ø·Ø§ÙˆÙ„Ø© âœ…"); } };
        window.deleteTable = (id) => { if (confirm('Ø­Ø°Ù Ø§Ù„Ø·Ø§ÙˆÙ„Ø©ØŸ')) { window.state.db.tables = window.state.db.tables.filter(t => t.id !== id); window.save(); } };
        window.openTableEdit = (id) => { window.state.editingTableId = id; const t = window.state.db.tables.find(x => x.id === id); document.getElementById('edit-tab-name').value = t.name; document.getElementById('edit-tab-source').value = t.source; document.getElementById('table-edit-modal').style.display = 'flex'; };
        window.finalizeTableEdit = () => { const t = window.state.db.tables.find(x => x.id === window.state.editingTableId); if (t) { t.name = document.getElementById('edit-tab-name').value; t.source = document.getElementById('edit-tab-source').value; window.save(); document.getElementById('table-edit-modal').style.display = 'none'; } };
        window.saveNewItem = () => { const n = document.getElementById('inv-name').value; const p = document.getElementById('inv-price').value; const c = document.getElementById('inv-cat-select').value; const s = document.getElementById('inv-stock-input').value; if (n && p) { window.state.db.menu.push({ id: Date.now(), name: n, price: Number(p), category: c, stock: Number(s), unlimited: false }); window.save(); document.getElementById('inventory-modal').style.display = 'none'; } };
        window.deleteItem = (id) => { if (confirm('Ø­Ø°Ù Ø§Ù„ØµÙ†ÙØŸ')) { window.state.db.menu = window.state.db.menu.filter(m => m.id !== id); window.save(); } };
        window.openStockUpdate = (id) => { const m = window.state.db.menu.find(x => x.id == id); if (m) { window.state.selectedItemId = id; document.getElementById('stock-item-name-input').value = m.name; document.getElementById('stock-item-price-input').value = m.price; document.getElementById('stock-new-val').value = ''; document.getElementById('stock-update-modal').style.display = 'flex'; } };
        window.finalizeStockUpdate = () => { const m = window.state.db.menu.find(x => x.id == window.state.selectedItemId); if (m) { m.name = document.getElementById('stock-item-name-input').value; m.price = Number(document.getElementById('stock-item-price-input').value); const addVal = Number(document.getElementById('stock-new-val').value || 0); m.stock += addVal; window.save(); document.getElementById('stock-update-modal').style.display = 'none'; window.showToast("ØªÙ… ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„ØµÙ†Ù Ø¨Ù†Ø¬Ø§Ø­ âœ…"); } };

        window.showShiftSummary = () => {
            const orders = window.state.db.orders || []; const activeOrders = orders.filter(o => o.status !== 'canceled');
            const sales = activeOrders.filter(o => o.paid).reduce((s, o) => s + o.total - (o.discount || 0), 0);
            const cashSales = activeOrders.filter(o => o.paid && (!o.paymentMethod || o.paymentMethod === 'cash')).reduce((s, o) => s + o.total - (o.discount || 0), 0);
            const visaSales = activeOrders.filter(o => o.paid && o.paymentMethod === 'visa').reduce((s, o) => s + o.total - (o.discount || 0), 0);
            const walletSales = activeOrders.filter(o => o.paid && o.paymentMethod === 'wallet').reduce((s, o) => s + o.total - (o.discount || 0), 0);
            const shiftStart = window.state.db.shift ? window.state.db.shift.start : 0;
            const ex = (window.state.db.exp || []).filter(e => e.isShiftExpense && e.time >= shiftStart).reduce((s, e) => s + e.amount, 0);
            const shiftWaste = (window.state.db.waste_log || []).filter(w => w.shiftStart === shiftStart);
            const wasteHtml = shiftWaste.length > 0 ? `<hr style="border:1px dashed #ccc; margin:5px 0;"><div style="display:flex; justify-content:space-between; font-size:1.1rem;"><span>ðŸ—‘ï¸ Ù‡Ø§Ø¯Ø± Ø§Ù„Ø´ÙŠÙØª:</span><span style="color:#f97316;">${shiftWaste.length} ØµÙ†Ù</span></div><div style="font-size:0.8rem; opacity:0.7; padding-right:15px; display:flex; flex-direction:column; gap:3px; margin-top:5px;">${shiftWaste.map(w => '<div style="display:flex; justify-content:space-between;"><span>' + w.itemName + '</span><span>' + w.qty + ' ' + w.unit + '</span></div>').join('')}</div>` : '';
            const html = `<div style="display:flex; flex-direction:column; gap:10px; font-weight:700;"><div style="display:flex; justify-content:space-between; font-size:1.1rem;"><span>Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª:</span><span style="color:var(--success);">${sales} Ø¬</span></div><div style="display:flex; justify-content:space-between; font-size:0.9rem; opacity:0.8; padding-right:15px;"><span>ÙƒØ§Ø´:</span><span>${cashSales} Ø¬</span></div><div style="display:flex; justify-content:space-between; font-size:0.9rem; opacity:0.8; padding-right:15px;"><span>ÙÙŠØ²Ø§:</span><span>${visaSales} Ø¬</span></div><div style="display:flex; justify-content:space-between; font-size:0.9rem; opacity:0.8; padding-right:15px;"><span>Ù…Ø­ÙØ¸Ø©:</span><span>${walletSales} Ø¬</span></div><hr style="border:1px dashed #ccc; margin:5px 0;"><div style="display:flex; justify-content:space-between; font-size:1.1rem;"><span>Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…ØµØ±ÙˆÙØ§Øª:</span><span style="color:var(--danger);">${ex} Ø¬</span></div>${wasteHtml}<hr style="border:1px dashed #ccc; margin:5px 0;"><div style="display:flex; justify-content:space-between; font-size:1.6rem; background:#f1f5f9; padding:10px; border-radius:10px;"><span>ØµØ§ÙÙŠ Ø§Ù„Ø¯Ø±Ø¬ (ÙƒØ§Ø´):</span><span style="color:var(--panel);">${cashSales - ex} Ø¬</span></div><p style="font-size:0.8rem; opacity:0.6; text-align:center; margin-top:5px;">Ø¨Ø¯Ø£Øª Ø§Ù„ÙˆØ±Ø¯ÙŠØ© ÙÙŠ: ${new Date(window.state.db.shift.start).toLocaleString('ar-EG')}</p></div>`;
            document.getElementById('shift-summary-content').innerHTML = html; document.getElementById('shift-summary-modal').style.display = 'flex';
        };
        window.confirmEndShift = () => { const orders = window.state.db.orders || []; const activeOrders = orders.filter(o => o.status !== 'canceled'); const sales = activeOrders.filter(o => o.paid).reduce((s, o) => s + o.total - (o.discount || 0), 0); const cashSales = activeOrders.filter(o => o.paid && (!o.paymentMethod || o.paymentMethod === 'cash')).reduce((s, o) => s + o.total - (o.discount || 0), 0); const visaSales = activeOrders.filter(o => o.paid && o.paymentMethod === 'visa').reduce((s, o) => s + o.total - (o.discount || 0), 0); const walletSales = activeOrders.filter(o => o.paid && o.paymentMethod === 'wallet').reduce((s, o) => s + o.total - (o.discount || 0), 0); const shiftStart = window.state.db.shift ? window.state.db.shift.start : 0; const ex = (window.state.db.exp || []).filter(e => e.isShiftExpense && e.time >= shiftStart).reduce((s, e) => s + e.amount, 0); const shiftWaste = (window.state.db.waste_log || []).filter(w => w.shiftStart === shiftStart); window.state.db.shifts_history.unshift({ start: window.state.db.shift.start, end: Date.now(), sales, cashSales, visaSales, walletSales, expenses: ex, net: cashSales - ex, wasteCount: shiftWaste.length, wasteDetails: shiftWaste.map(w => ({ name: w.itemName, qty: w.qty, unit: w.unit, reason: w.reason || '' })) }); window.state.db.shift = null; window.state.db.orders = []; window.save(); sessionStorage.removeItem('foush_role'); location.reload(); };

        window.boot = () => {
            if (!window.state.role) {
                document.getElementById('role-screen').style.display = 'flex';
                document.getElementById('app').style.display = 'none';
                return;
            }
            document.getElementById('role-screen').style.display = 'none';
            document.getElementById('app').style.display = 'grid';
            window.render();

            // PWA install banner prompt trigger after successful authentication
            if (typeof deferredPrompt !== 'undefined' && deferredPrompt) {
                setTimeout(() => {
                    const banner = document.getElementById('pwa-install-banner');
                    if (banner) banner.style.display = 'flex';
                }, 1000);
            }
            // iOS Safari PWA prompt trigger
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
            if (isIOS && !isStandalone) {
                const hasSeenPrompt = localStorage.getItem('foush_ios_prompt_seen');
                if (!hasSeenPrompt) {
                    setTimeout(() => {
                        const iosModal = document.getElementById('ios-pwa-modal');
                        if (iosModal) iosModal.style.display = 'flex';
                        localStorage.setItem('foush_ios_prompt_seen', 'true');
                    }, 2000);
                }
            }
        };
        window.boot();
        let lastOrdersData = [];
        if (database) {
            database.ref('foush').on('value', (s) => {
                const data = s.val(); if (data) {
                    const newOrders = data.orders || [];
                    if (window.state.role === 'kitchen') {
                        const newPrep = newOrders.filter(o => o.status === 'preparing');
                        const oldPrep = lastOrdersData.filter(o => o.status === 'preparing');
                        if (newPrep.length > oldPrep.length) window.playSound('kitchen-alert');
                    } else if (window.state.role === 'cashier' || window.state.role === 'manager') {
                        const newReady = newOrders.filter(o => o.status === 'ready');
                        const oldReady = lastOrdersData.filter(o => o.status === 'ready');
                        if (newReady.length > oldReady.length) window.playSound('bell');
                        // Billing alert: when waiter requests bill
                        const newBilling = newOrders.filter(o => o.status === 'billing');
                        const oldBilling = lastOrdersData.filter(o => o.status === 'billing');
                        if (newBilling.length > oldBilling.length) {
                            window.playSound('bell'); window.playSound('bell');
                            window.showToast('ðŸ’° Ø§Ù„ÙˆÙŠØªØ± Ø·Ù„Ø¨ Ø§Ù„Ø­Ø³Ø§Ø¨! ØªØ­Ù‚Ù‚ Ù…Ù† Ø§Ù„Ø·Ø§ÙˆÙ„Ø©');
                        }
                    } else if (window.state.role === 'waiter') {
                        const newReady = newOrders.filter(o => o.status === 'ready' && o.source === 'waiter');
                        const oldReady = lastOrdersData.filter(o => o.status === 'ready' && o.source === 'waiter');
                        if (newReady.length > oldReady.length) { window.playSound('bell'); window.showToast('âœ… Ø·Ù„Ø¨Ùƒ Ø¬Ø§Ù‡Ø² ÙÙŠ Ø§Ù„Ù…Ø·Ø¨Ø®! Ø§Ø·Ù„Ø¹ ÙˆÙ‚Ø¯Ù…Ù‡'); }
                    }
                    lastOrdersData = newOrders;
                    window.state.db = data || {};
                    if (!window.state.db.employees) window.state.db.employees = [];
                    if (!window.state.db.attendance) window.state.db.attendance = [];
                    if (!window.state.db.menu) window.state.db.menu = [];
                    if (!window.state.db.orders) window.state.db.orders = [];
                    if (!window.state.db.exp) window.state.db.exp = [];
                    if (!window.state.db.tables) window.state.db.tables = [];
                    if (!window.state.db.shifts_history) window.state.db.shifts_history = [];
                    if (!window.state.db.stock_history) window.state.db.stock_history = [];
                    if (!window.state.db.main_inventory) window.state.db.main_inventory = [];
                    // Update billing badge in header
                    const billingOrders = newOrders.filter(o => o.status === 'billing' && !o.paid);
                    const badge = document.getElementById('billing-badge');
                    const bCount = document.getElementById('billing-count');
                    if (badge && bCount) {
                        if (billingOrders.length > 0 && window.state.role === 'cashier') {
                            bCount.textContent = billingOrders.length;
                            badge.style.display = 'block';
                        } else { badge.style.display = 'none'; }
                    }
                    window.render();
                }
            });
        }
        setInterval(() => {
            document.getElementById('clock').textContent = new Date().toLocaleTimeString('ar-EG');
            if (window.state.db.shift) {
                const d = Date.now() - window.state.db.shift.start;
                const h = Math.floor(d / 3600000);
                const m = Math.floor((d % 3600000) / 60000);
                const s = Math.floor((d % 60000) / 1000);
                document.getElementById('shift-clock').textContent = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }
            document.querySelectorAll('.timer-text').forEach(el => {
                const start = parseInt(el.dataset.start);
                const diff = Date.now() - start;
                const m = Math.floor(diff / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
                if (window.state.page === 'kitchen') {
                    const card = el.closest('.order-card');
                    if (card && card.style.borderColor !== 'var(--success)') {
                        const badge = card.querySelector('.table-badge');
                        if (m >= 15) {
                            if (badge) { badge.style.background = 'var(--danger)'; badge.style.animation = 'pulse-red 1.5s infinite'; }
                            el.previousElementSibling.style.background = 'var(--danger)';
                        } else if (m >= 10) {
                            if (badge) { badge.style.background = '#f59e0b'; badge.style.animation = 'none'; }
                            el.previousElementSibling.style.background = '#f59e0b';
                        }
                    }
                }
            });

            // Late Order Alert System for Cashier
            if (window.state.role === 'cashier' || window.state.role === 'manager') {
                const orders = window.state.db.orders || [];
                const now = Date.now();
                let needsSave = false;
                orders.forEach(o => {
                    if (o.status === 'preparing') {
                        const diff = now - o.time;
                        const m = Math.floor(diff / 60000);
                        if (m >= 15 && !o.cashierAlerted) {
                            o.cashierAlerted = true;
                            needsSave = true;
                            const tInfo = o.type === 'salla' ? `ØµØ§Ù„Ø©: Ø·Ø§ÙˆÙ„Ø© ${o.table}` : o.type === 'takeaway' ? 'ØªÙŠÙƒ Ø§ÙˆØ§ÙŠ Ø³ÙØ±ÙŠ' : 'Ø¯Ù„ÙŠÙØ±ÙŠ ØªÙˆØµÙŠÙ„';
                            window.showToast(`ðŸš¨ ØªÙ†Ø¨ÙŠÙ‡ Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø©: Ø£ÙˆØ±Ø¯Ø± #${o.id} (${tInfo}) ØªØ®Ø·Ù‰ 15 Ø¯Ù‚ÙŠÙ‚Ø© ÙÙŠ Ø§Ù„Ù…Ø·Ø¨Ø®!`);
                            try { window.playSound('error'); } catch (e) { }
                        }
                    }
                });
                if (needsSave) window.save();
            }
        }, 1000);
    
