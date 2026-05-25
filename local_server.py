#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
╔══════════════════════════════════════════════════════════════╗
║  🍳 FOUSH POS - Local Server v1.0                          ║
║  Lightweight local network server for real-time POS sync    ║
║  Zero external dependencies - Python 3.7+ only             ║
╚══════════════════════════════════════════════════════════════╝

How it works:
  1. This server runs on the main cashier's PC
  2. All devices (kitchen, waiter, cashier) connect via local WiFi
  3. Data is saved locally in local_db.json (instant, no internet needed)
  4. Background thread syncs to Firebase when internet is available
  5. If internet goes down, everything still works locally

Usage:
  python local_server.py              # Start on default port 8000
  python local_server.py --port 9000  # Start on custom port
"""

import http.server
import json
import os
import socket
import socketserver
import sys
import threading
import time
import urllib.request
import urllib.error
import argparse
import hashlib
import io
from datetime import datetime

# Fix Windows console encoding to support Arabic/emoji output
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# ─── Configuration ────────────────────────────────────────────────────────────

DEFAULT_PORT = 8000
DB_FILE = 'local_db.json'
FIREBASE_URL = 'https://tawajen-foush-default-rtdb.firebaseio.com/foush.json'
SYNC_INTERVAL = 5  # seconds between Firebase sync attempts
STATIC_DIR = os.path.dirname(os.path.abspath(__file__))

# ─── Global State ─────────────────────────────────────────────────────────────

db_lock = threading.Lock()
db_version = 0
db_hash = ''
last_synced_version = 0
sync_status = 'idle'  # idle, syncing, synced, error
last_sync_time = None
last_sync_error = None
server_start_time = None
connected_clients = set()  # Track unique IPs


def get_local_ip():
    """Get the local IP address of this machine on the LAN."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(2)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        # Fallback: try to find a non-localhost IP
        try:
            hostname = socket.gethostname()
            ips = socket.getaddrinfo(hostname, None, socket.AF_INET)
            for ip_info in ips:
                ip = ip_info[4][0]
                if not ip.startswith('127.'):
                    return ip
        except Exception:
            pass
        return '127.0.0.1'


def load_db():
    """Load database from local JSON file."""
    try:
        if os.path.exists(DB_FILE):
            with open(DB_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        log(f'⚠️  Error loading {DB_FILE}: {e}')
    return {}


def save_db(data):
    """Save database to local JSON file and increment version."""
    global db_version, db_hash
    with db_lock:
        # Write to temp file first, then rename (atomic write)
        temp_file = DB_FILE + '.tmp'
        try:
            json_str = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
            with open(temp_file, 'w', encoding='utf-8') as f:
                f.write(json_str)
            # Atomic rename (Windows: need to remove target first)
            if os.path.exists(DB_FILE):
                os.replace(temp_file, DB_FILE)
            else:
                os.rename(temp_file, DB_FILE)
            db_version += 1
            db_hash = hashlib.md5(json_str.encode()).hexdigest()[:12]
        except IOError as e:
            log(f'❌ Error saving database: {e}')
            if os.path.exists(temp_file):
                os.remove(temp_file)


def log(msg):
    """Print a timestamped log message."""
    timestamp = datetime.now().strftime('%H:%M:%S')
    print(f'[{timestamp}] {msg}')


# ─── Firebase Background Sync ────────────────────────────────────────────────

def sync_to_firebase():
    """Background thread: periodically sync local DB to Firebase."""
    global last_synced_version, sync_status, last_sync_time, last_sync_error

    time.sleep(3)  # Initial delay to let server start

    while True:
        try:
            time.sleep(SYNC_INTERVAL)

            if db_version <= last_synced_version:
                continue  # Nothing new to sync

            sync_status = 'syncing'
            data = load_db()

            if not data:
                continue

            json_bytes = json.dumps(data, ensure_ascii=False).encode('utf-8')
            req = urllib.request.Request(
                FIREBASE_URL,
                data=json_bytes,
                headers={'Content-Type': 'application/json'},
                method='PUT'
            )

            urllib.request.urlopen(req, timeout=15)
            last_synced_version = db_version
            sync_status = 'synced'
            last_sync_time = datetime.now().strftime('%H:%M:%S')
            last_sync_error = None
            log(f'☁️  Firebase sync OK (v{db_version})')

        except urllib.error.URLError as e:
            sync_status = 'error'
            last_sync_error = str(e.reason) if hasattr(e, 'reason') else str(e)
            log(f'⚠️  Firebase sync failed (no internet?): {last_sync_error}')

        except Exception as e:
            sync_status = 'error'
            last_sync_error = str(e)
            log(f'⚠️  Firebase sync error: {e}')


def download_from_firebase():
    """Download current data from Firebase (used on first startup)."""
    try:
        log('📥 Downloading data from Firebase...')
        req = urllib.request.Request(FIREBASE_URL, method='GET')
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode('utf-8'))
            if data and isinstance(data, dict):
                log(f'✅ Downloaded {len(data)} keys from Firebase')
                return data
            else:
                log('⚠️  Firebase database is empty')
                return None
    except urllib.error.URLError:
        log('⚠️  Cannot reach Firebase (no internet)')
        return None
    except Exception as e:
        log(f'⚠️  Firebase download error: {e}')
        return None


# ─── HTTP Request Handler ────────────────────────────────────────────────────

class POSHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler: serves static files + REST API for POS data."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def do_GET(self):
        """Handle GET requests."""
        client_ip = self.client_address[0]
        connected_clients.add(client_ip)

        if self.path == '/api/version':
            # Lightweight version check for polling
            self.send_json({'v': db_version, 'h': db_hash})

        elif self.path == '/api/db':
            # Full database download
            data = load_db()
            self.send_json(data)

        elif self.path == '/api/status':
            # Server status information
            uptime = ''
            if server_start_time:
                delta = datetime.now() - server_start_time
                hours, remainder = divmod(int(delta.total_seconds()), 3600)
                minutes, secs = divmod(remainder, 60)
                uptime = f'{hours}h {minutes}m {secs}s'

            self.send_json({
                'version': db_version,
                'hash': db_hash,
                'syncStatus': sync_status,
                'lastSyncTime': last_sync_time,
                'lastSyncError': last_sync_error,
                'synced': last_synced_version == db_version,
                'uptime': uptime,
                'clients': len(connected_clients),
                'dbFile': DB_FILE,
                'dbSize': os.path.getsize(DB_FILE) if os.path.exists(DB_FILE) else 0
            })

        elif self.path == '/api/ping':
            # Simple health check
            self.send_json({'ok': True, 'ts': int(time.time() * 1000)})

        else:
            # Serve static files (index.html, css, js, images, etc.)
            super().do_GET()

    def do_POST(self):
        """Handle POST requests."""
        if self.path == '/api/db':
            # Full database save
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                data = json.loads(body.decode('utf-8'))
                save_db(data)
                log(f'💾 DB saved (v{db_version}) from {self.client_address[0]}')
                self.send_json({'ok': True, 'v': db_version, 'h': db_hash})
            except json.JSONDecodeError as e:
                self.send_json({'ok': False, 'error': f'Invalid JSON: {e}'}, status=400)
            except Exception as e:
                self.send_json({'ok': False, 'error': str(e)}, status=500)

        elif self.path == '/api/partial':
            # Partial database update (merge specific keys)
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                updates = json.loads(body.decode('utf-8'))
                with db_lock:
                    data = load_db()
                    for key, value in updates.items():
                        data[key] = value
                save_db(data)
                log(f'💾 DB partial update ({list(updates.keys())}) v{db_version} from {self.client_address[0]}')
                self.send_json({'ok': True, 'v': db_version, 'h': db_hash})
            except json.JSONDecodeError as e:
                self.send_json({'ok': False, 'error': f'Invalid JSON: {e}'}, status=400)
            except Exception as e:
                self.send_json({'ok': False, 'error': str(e)}, status=500)

        elif self.path == '/api/force-sync':
            # Force immediate Firebase sync
            try:
                data = load_db()
                if data:
                    json_bytes = json.dumps(data, ensure_ascii=False).encode('utf-8')
                    req = urllib.request.Request(
                        FIREBASE_URL,
                        data=json_bytes,
                        headers={'Content-Type': 'application/json'},
                        method='PUT'
                    )
                    urllib.request.urlopen(req, timeout=15)
                    global last_synced_version, last_sync_time, last_sync_error
                    last_synced_version = db_version
                    last_sync_time = datetime.now().strftime('%H:%M:%S')
                    last_sync_error = None
                    log(f'☁️  Force sync to Firebase OK (v{db_version})')
                    self.send_json({'ok': True, 'message': 'Synced to Firebase'})
                else:
                    self.send_json({'ok': False, 'error': 'No data to sync'})
            except Exception as e:
                self.send_json({'ok': False, 'error': str(e)}, status=500)

        else:
            self.send_error(404, 'Not Found')

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def send_json(self, data, status=200):
        """Send a JSON response with proper headers."""
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-cache, no-store')
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def _send_cors_headers(self):
        """Add CORS headers to allow cross-origin requests from any device."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def log_message(self, format, *args):
        """Custom logging: only show API requests, suppress static file noise."""
        request_line = args[0] if args else ''
        if '/api/' in str(request_line):
            # Only log API calls
            pass  # Already logged in handler methods
        elif '200' not in str(args[1] if len(args) > 1 else ''):
            # Log non-200 responses for debugging
            try:
                log(f'📄 {request_line} → {args[1]}')
            except Exception:
                pass

    def end_headers(self):
        """Add security headers."""
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()


# ─── Threaded HTTP Server ────────────────────────────────────────────────────

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    """HTTP server that handles each request in a new thread."""
    daemon_threads = True
    allow_reuse_address = True

    def server_bind(self):
        """Allow port reuse and bind to all interfaces."""
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        super().server_bind()


# ─── Main Entry Point ────────────────────────────────────────────────────────

def main():
    global server_start_time, db_version, db_hash

    # Parse command line arguments
    parser = argparse.ArgumentParser(description='FOUSH POS Local Server')
    parser.add_argument('--port', type=int, default=DEFAULT_PORT, help=f'Port to run on (default: {DEFAULT_PORT})')
    parser.add_argument('--no-sync', action='store_true', help='Disable Firebase background sync')
    parser.add_argument('--reset', action='store_true', help='Download fresh data from Firebase')
    args = parser.parse_args()

    port = args.port
    local_ip = get_local_ip()

    print()
    print('=' * 65)
    print('  [FOUSH POS] Local Server v1.0')
    print('  نظام نقاط البيع المحلي - فوش')
    print('=' * 65)
    print()

    # ─── Database Initialization ─────────────────────────────────────────

    if args.reset or not os.path.exists(DB_FILE):
        # Download from Firebase
        firebase_data = download_from_firebase()
        if firebase_data:
            save_db(firebase_data)
            log(f'✅ Database initialized from Firebase ({len(firebase_data)} keys)')
        elif os.path.exists(DB_FILE):
            log(f'📦 Using existing local database: {DB_FILE}')
            data = load_db()
            if data:
                db_version = 1
                json_str = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
                db_hash = hashlib.md5(json_str.encode()).hexdigest()[:12]
        else:
            save_db({})
            log('📦 Created empty local database')
    else:
        data = load_db()
        if data:
            db_version = 1
            json_str = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
            db_hash = hashlib.md5(json_str.encode()).hexdigest()[:12]
            db_size = os.path.getsize(DB_FILE)
            log(f'📦 Loaded local database: {DB_FILE} ({db_size:,} bytes, {len(data)} keys)')
        else:
            log('⚠️  Local database is empty, downloading from Firebase...')
            firebase_data = download_from_firebase()
            if firebase_data:
                save_db(firebase_data)
            else:
                save_db({})
                log('📦 Starting with empty database')

    # ─── Start Firebase Sync Thread ──────────────────────────────────────

    if not args.no_sync:
        sync_thread = threading.Thread(target=sync_to_firebase, daemon=True, name='FirebaseSync')
        sync_thread.start()
        log('☁️  Firebase background sync enabled (every 5s)')
    else:
        log('⚠️  Firebase sync disabled (--no-sync)')

    # ─── Start HTTP Server ───────────────────────────────────────────────

    try:
        server = ThreadedHTTPServer(('0.0.0.0', port), POSHandler)
    except OSError as e:
        if 'Address already in use' in str(e) or '10048' in str(e):
            log(f'❌ Port {port} is already in use! Try: python local_server.py --port {port + 1}')
            sys.exit(1)
        raise

    server_start_time = datetime.now()

    print()
    print('-' * 65)
    print('  [OK] Server is running!')
    print()
    print(f'  >> This PC (Cashier):  http://localhost:{port}')
    print(f'  >> Kitchen / Waiter:   http://{local_ip}:{port}')
    print(f'  >> Manager (remote):   Uses Firebase directly')
    print()
    print('  API Endpoints:')
    print('    GET  /api/version    - Check data version (polling)')
    print('    GET  /api/db         - Download full database')
    print('    POST /api/db         - Save full database')
    print('    POST /api/partial    - Save specific keys only')
    print('    GET  /api/status     - Server status & sync info')
    print('    GET  /api/ping       - Health check')
    print('    POST /api/force-sync - Force Firebase sync now')
    print()
    print('  Press Ctrl+C to stop the server')
    print('-' * 65)
    print()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print()
        log('🛑 Server stopped.')
        server.server_close()
        sys.exit(0)


if __name__ == '__main__':
    main()
