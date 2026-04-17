# Homeserver Deploy Guide (diopratama.site)

Guide ini untuk deploy Next.js app ke homeserver sendiri (tanpa platform hosting pihak ketiga), menggunakan:
- Node.js + npm
- systemd untuk auto-start
- Nginx sebagai reverse proxy
- Let's Encrypt (Certbot) untuk HTTPS

## 1) Prasyarat

Di homeserver (Ubuntu/Debian), install:

```bash
sudo apt update
sudo apt install -y git curl nginx certbot python3-certbot-nginx
```

Install Node.js LTS (20 atau lebih baru):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 2) Setup Cloudflare Tunnel (aman, tanpa port forward)

**Di Cloudflare dashboard:**
1. Pastikan domain `diopratama.site` sudah pakai nameserver Cloudflare.
2. Buka **Networks > Tunnels**, klik "Create a tunnel".
3. Pilih nama (e.g., `porto-diopratama`), ikuti instruksi install cloudflared di server.
4. Di routing, arahkan CNAME:
   - Hostname: `diopratama.site` → `localhost:3000` (http)
   - Hostname: `www.diopratama.site` → `localhost:3000` (opsional)
5. Cloudflare akan handle SSL otomatis (HTTPS gratis).

Keuntungan:
- Tidak perlu buka port di router/firewall.
- Enkripsi end-to-end Cloudflare.
- DDos protection + caching gratis.

## 3) Clone Project di Homeserver

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www

git clone <URL_REPO_KAMU> porto-diopratama
cd porto-diopratama/webapp

npm ci
npm run build
```

## 3.5) Pasang Service Systemd (App Auto-Start)

Di repo ada template: `deploy/porto-diopratama.service`.

Copy ke systemd:

```bash
sudo cp deploy/porto-diopratama.service /etc/systemd/system/porto-diopratama.service
```

Jika user server bukan `www-data`, edit file:

```bash
sudo nano /etc/systemd/system/porto-diopratama.service
# Ganti "User=www-data" sesuai user kamu
```

Aktifkan + jalankan:

```bash
sudo systemctl daemon-reload
sudo systemctl enable porto-diopratama
sudo systemctl start porto-diopratama
sudo systemctl status porto-diopratama --no-pager
```

Tes lokal:

```bash
curl -I http://127.0.0.1:3000
```

## 4) Install dan Setup Cloudflared (Cloudflare Tunnel Client)

Download + install cloudflared di homeserver:

```bash
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
cloudflared --version
```

Login ke Cloudflare akun kamu:

```bash
cloudflared tunnel login
```

Ikuti link & authorize device. Ini akan download certificate ke `~/.cloudflared/`.

Buat tunnel:

```bash
cloudflared tunnel create porto-diopratama
```

Catat tunnel ID (ada di output).

## 5) Konfigurasi Tunnel Config File

Buat file config di `~/.cloudflared/config.yml`:

```bash
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: porto-diopratama
credentials-file: /home/$(whoami)/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: diopratama.site
    service: http://localhost:3000
  - hostname: www.diopratama.site
    service: http://localhost:3000
  - service: http_status:404
EOF
```

Ganti `<TUNNEL_ID>` dengan ID dari step sebelumnya.

Test run:

```bash
cloudflared tunnel run porto-diopratama
```

Jika berhasil, akan muncul pesan "Ready to receive traffic". Tekan Ctrl+C untuk stop.

## 6) Install Cloudflared sebagai Service Systemd

```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
sudo systemctl status cloudflared
```

Tes akses aplikasi melalui `https://diopratama.site` dari browser mana saja. Cloudflare handle SSL otomatis.

## 7) Deploy Update Berikutnya

Template script ada: `deploy/deploy.sh`.

Di homeserver:

```bash
cd /var/www/porto-diopratama/webapp
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

Script akan:
1. Pull code terbaru dari GitHub
2. Install dependencies (`npm ci`)
3. Build production
4. Restart service systemd (app otomatis reload)

## 8) Troubleshooting Cepat

**App tidak berjalan:**

```bash
sudo journalctl -u porto-diopratama -f
```

**Cloudflare Tunnel tidak connect:**

```bash
sudo journalctl -u cloudflared -f
```

**Test lokal port 3000:**

```bash
curl -I http://localhost:3000
```

**Cek Tunnel status:**

```bash
cloudflared tunnel info porto-diopratama
```

Jika ada error permission, jalankan ulang:
```bash
npm ci && npm run build
sudo systemctl restart porto-diopratama
```

## 9) Rekomendasi Keamanan (Tunnel + Firewall)

Dengan Cloudflare Tunnel, tidak perlu buka port 80/443 ke publik. Lebih aman:

```bash
# Aktifkan UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow out 443  # Cloudflared butuh HTTPS keluar
sudo ufw enable
```

**SSH hardening:**
- Gunakan SSH key, nonaktifkan login password.
- Ganti default port SSH (optional, tapi tambah aman).
- Update sistem berkala:

```bash
sudo apt update && sudo apt upgrade -y
```

**Monitoring:**
- Cek Cloudflare dashboard untuk traffic logs.
- DDoS protection sudah otomatis dari Cloudflare.
- Pastikan certbot/SSL renewal tidak tertinggal (Cloudflare handle SSL, tapi jika menggunakan Let's Encrypt lokal juga bisa).

---

## Notes

**File yang sudah tidak perlu (jika pakai Cloudflare Tunnel):**
- `deploy/nginx.diopratama.site.conf` — Reverse proxy sudah di-handle Cloudflare Tunnel.

(File ini disimpan di repo untuk reference, jika suatu saat ingin local reverse proxy/caching.)
