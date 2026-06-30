// ============================================
// Firebase Configuration - طواجن فوش
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyCLUuixSAwBVGAIRqTbwC_QzwS-wknOEuc",
    authDomain: "tawajen-foush.firebaseapp.com",
    databaseURL: "https://tawajen-foush-default-rtdb.firebaseio.com",
    projectId: "tawajen-foush",
    storageBucket: "tawajen-foush.firebasestorage.app",
    messagingSenderId: "821143454397",
    appId: "1:821143454397:web:fab79978563ad46a1f2dd4",
    measurementId: "G-V04VKH29XW"
};

// ============================================
// Cloud Database Layer - Real-time Sync
// ============================================
let database = null;

const CloudDB = {
    isConfigured() {
        return typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY";
    },

    async set(collection, data) {
        localStorage.setItem('foush_' + collection, JSON.stringify(data));
        if (this.isConfigured() && database) {
            try {
                await database.ref('foush/' + collection).set(data);
            } catch (e) {
                console.warn('Firebase write failed:', e);
            }
        }
    },

    async get(collection, fallback) {
        if (this.isConfigured() && database) {
            try {
                const snap = await database.ref('foush/' + collection).once('value');
                const val = snap.val();
                if (val !== null) {
                    localStorage.setItem('foush_' + collection, JSON.stringify(val));
                    return val;
                }
            } catch (e) {
                console.warn('Firebase read failed:', e);
            }
        }
        try {
            return JSON.parse(localStorage.getItem('foush_' + collection)) || fallback;
        } catch {
            return fallback;
        }
    },

    onLive(collection, callback) {
        if (this.isConfigured() && database) {
            database.ref('foush/' + collection).on('value', (snap) => {
                const val = snap.val();
                if (val !== null) {
                    localStorage.setItem('foush_' + collection, JSON.stringify(val));
                    callback(val);
                }
            });
        }
    },

    offLive(collection) {
        if (this.isConfigured() && database) {
            database.ref('foush/' + collection).off();
        }
    },
    
    isReady: false
};

// Initialize Firebase with Safety
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        console.log('Firebase initialized successfully');
        
        // Track connection status
        database.ref('.info/connected').on('value', (snap) => {
            CloudDB.isReady = snap.val() === true;
            if (typeof syncToCloud === 'function') syncToCloud();
        });
    } else {
        console.warn('Firebase SDK not found - running in local mode');
    }
} catch (e) {
    console.error('Firebase Init Error:', e);
}
