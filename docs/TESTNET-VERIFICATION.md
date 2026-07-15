# Testnet Verification

Dokumen ini adalah runbook untuk dua quality gate terakhir di `TODO.md`. Driver
`scripts/e2e/testnet-happy-path.mjs` menjalankan Flow 1–10 melalui HTTP API yang
sama dengan frontend, tanpa membaca Prisma atau mengubah database secara langsung.

## Cakupan otomatis

Satu run membuat wallet entrepreneur dan investor testnet yang baru, lalu:

1. mendanai keduanya dengan Friendbot;
2. membuka trustline dan klaim USDC melalui faucet publik;
3. register dengan signature SEP-53 dan login admin;
4. submit serta approve KYC;
5. membuat, submit, dan approve proposal;
6. polling deployment sampai Campaign `LIVE/ACTIVE`;
7. melakukan relay invest dan menunggu holding terindeks;
8. deposit profit, polling distribusi, lalu claim dividen;
9. submit bukti milestone, vote, dan polling sampai `RELEASED`;
10. membuat Campaign kedua, invest parsial, cancel, polling refund, lalu claim.

Wallet entrepreneur dan investor hanya hidup di memori proses. Secret key tidak
ditulis ke disk atau dicetak. Output akhir hanya berisi public key, entity ID, dan
transaction hash yang aman disimpan sebagai bukti verifikasi.

## Prasyarat backend

- Backend, Postgres, Valkey, dan object storage aktif.
- Migration dan seed sudah dijalankan.
- Backend menggunakan konfigurasi serta artifact Stellar testnet yang cocok dengan
  `creon-backend/contracts/deployments/testnet.json`.
- `E2E_ADMIN_SECRET` adalah secret untuk wallet yang memang memiliki role `ADMIN`
  pada database backend tersebut.
- Untuk run yang tidak menunggu tujuh hari, mulai backend khusus E2E dengan voting
  window singkat. Reconcile voting backend berjalan tiap 60 detik, jadi timeout
  driver tetap harus lebih panjang dari itu.

Contoh PowerShell untuk backend lokal:

```powershell
docker compose up -d
pnpm prisma:migrate
pnpm db:seed
$env:MILESTONE_VOTING_WINDOW_SECONDS = "5"
pnpm start:dev
```

Jangan gunakan override voting singkat pada environment demo/production.

## Menjalankan driver

Dari `creon-web`:

```powershell
$env:E2E_BASE_API_URL = "http://127.0.0.1:3000"
$env:E2E_ADMIN_SECRET = "S..."
$env:E2E_CONFIRM_TESTNET_MUTATIONS = "yes"
$env:E2E_TIMEOUT_MS = "600000"
pnpm test:e2e:testnet
```

`E2E_CONFIRM_TESTNET_MUTATIONS=yes` wajib dan driver menolak network passphrase
selain Stellar testnet. Run ini membuat data backend serta transaksi testnet baru.

Helper yang dipakai driver (SEP-53 digest/signature, exact-XDR signing, cookie
session, response envelope/error, dan polling) diuji tanpa network melalui:

```powershell
pnpm test:e2e
```

## Preflight Stellar CLI

CLI tidak dibutuhkan oleh driver karena signer menggunakan Stellar SDK, tetapi
berguna untuk memastikan instalasi dan membaca interface contract yang tercatat:

```powershell
stellar --version
stellar network ls
stellar contract invoke --network testnet --id CDDYCTY4BP7RMNDT5SQQMOHS6FZ5MKVPB4LIVON6MONBD2L6GWCJZ2YF -- --help
```

Perintah terakhir hanya menampilkan interface dinamis contract. Jangan menjalankan
fungsi mutasi contract memakai platform identity saat melakukan preflight frontend.

## Verifikasi wallet nyata (manual)

Driver membuktikan signature kriptografis dan seluruh integrasi backend/on-chain,
tetapi tidak membuktikan UX atau format return setiap extension wallet. Lakukan satu
pass manual minimal dengan wallet entrepreneur dan investor pada Freighter, lalu
ulang bagian signature pada xBull/wallet target lain:

- connect dan pastikan network testnet;
- register/login dan pastikan signature pesan diterima sebagai base64 SEP-53;
- selesaikan faucet trustline (wallet menandatangani `changeTrust`);
- lakukan masing-masing satu relay entrepreneur dan investor;
- pastikan wallet menerima XDR persis dari backend dan frontend meneruskan
  `signedTxXdr` tanpa modifikasi;
- simpan nama/version wallet, public address, transaction hash, waktu, dan hasil.

Secret phrase, private key, cookie JWT, atau signed challenge tidak boleh dimasukkan
ke laporan.
