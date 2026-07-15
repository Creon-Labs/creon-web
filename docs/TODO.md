# Frontend TODO

Dokumen ini mencatat pekerjaan frontend yang masih perlu diselesaikan setelah
mencocokkan implementasi saat ini dengan
[`FRONTEND-FLOWS.md`](./FRONTEND-FLOWS.md). Checklist ini berfokus pada gap
integrasi dan perilaku pengguna, bukan hanya keberadaan file API atau komponen.

## Ringkasan Status Flow

| Flow                    | Status frontend        | Ringkasan                                                                                                             |
| ----------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1. Register / Login     | Sebagian besar selesai | Challenge, signature, register, login, dan logout sudah ada; handling expiry dan response 204 perlu dirapikan.        |
| 2. KYC                  | Sebagian besar selesai | Submit, status alert, resubmit, dan aksi admin tersedia; polling dan error khusus masih kurang.                       |
| 3. Proposal             | Sebagian besar selesai | Create, edit, media, submit, dan review admin tersedia; statistik, polling, serta validasi frontend perlu dilengkapi. |
| 4. Auto-deploy Campaign | Belum terintegrasi     | API campaign tersedia, tetapi model `deployStatus`, polling deploy, dan UI status campaign belum ada.                 |
| 5. Investasi            | Selesai                 | Discover, detail, relay invest, pre-flight USDC, invalidasi portofolio, dan riwayat transaksi tersedia.                |
| 6. Deposit Profit       | Sebagian selesai       | Relay dan riwayat distribusi tersedia; polling `PENDING` ke `COMPLETED` belum ada.                                    |
| 7. Klaim Dividen        | Selesai                | API relay, tombol claim bergated, dan hasil klaim pada entitlement investor tersedia.                                  |
| 8. Milestone & Voting   | Sebagian selesai       | Submit proof dan tampilan tally entrepreneur tersedia; voting investor dan polling release belum ada.                 |
| 9. Cancel & Refund      | Sebagian besar selesai | Cancel admin dan relay claim refund tersedia; readiness gate, polling, dan copy nominal perlu diperbaiki.             |
| 10. Faucet USDC         | Belum ada              | Belum ada API module maupun UI trustline/claim.                                                                       |

## Prioritas 0 — Memperbaiki Kontrak Data dan Routing

Pekerjaan di bagian ini sebaiknya dikerjakan lebih dulu karena flow lain
bergantung pada ID, status, dan bentuk response yang benar.

- [x] **Pisahkan penggunaan `proposalId` dan `campaignId`.**
      Saat ini kartu proposal membuka `/entrepreneur/:proposalId/...`, tetapi route
      tersebut menamai parameternya `campaignId` dan beberapa halaman mengirim ID
      itu ke endpoint campaign, holdings, milestone, dan distribution. Setelah
      proposal disetujui, gunakan `campaignId` yang dibuat backend untuk endpoint
      `/campaigns/:id/*`, dan tetap gunakan `proposalId` hanya untuk endpoint
      `/proposals/:id`.

- [x] **Perbaiki redirect route entrepreneur dinamis.**
      `/entrepreneur/[campaignId]` saat ini mengarah ke literal
      `/entrepreneur/campaignId/overview`. Redirect harus menyisipkan param route
      yang sebenarnya.

- [x] **Sinkronkan tipe `Campaign` dengan response backend terbaru.**
      Tambahkan setidaknya `deployStatus` beserta seluruh nilainya (`PENDING`,
      `DEPLOYING_TOKEN`, `DEPLOYING_CAMPAIGN`, `WIRING`, `LIVE`, `FAILED`). Pastikan
      field status, unlock, project token, media, dan data bisnis yang dibutuhkan
      halaman discover juga sesuai OpenAPI.

- [x] **Sinkronkan tipe `Proposal` dengan statistik pendanaan.**
      `GET /proposals` dan `GET /proposals/:id` sekarang menyediakan
      `investorCount` dan `raisedAmount`. UI saat ini masih memasukkan angka `0`
      secara hard-coded ke kartu proposal.

- [x] **Konsisten membuka response envelope `{ statusCode, message, data }`.**
      Audit semua API function. Contoh yang masih menganggap payload mentah adalah
      campaign holdings dan submit milestone. Jika envelope tidak dibuka, komponen
      akan menerima object response, bukan data domain yang diharapkan.

- [x] **Tangani response `204 No Content` di API client.**
      `fetchApi` selalu memanggil `response.json()`, sedangkan logout sengaja
      mengembalikan body kosong. Perbaiki di API client agar logout tidak perlu
      menangkap `SyntaxError` sebagai jalur sukses.

- [x] **Perkaya `ApiError` dengan response backend.**
      Simpan `statusCode`, `error`, dan `data` dari envelope error supaya UI dapat
      bercabang berdasarkan status/data, bukan mencocokkan teks `message`.

## Flow 1 — Register / Login

- [x] **Tambahkan retry challenge ketika challenge expired atau sudah dipakai.**
      Challenge hanya berlaku lima menit dan satu kali pakai. Untuk error `401`,
      tampilkan pesan yang jelas dan mulai ulang flow dari `/auth/challenge`.

- [x] **Pastikan kegagalan challenge tidak ditelan di API function.**
      `createAuthNonce` saat ini mengubah semua error menjadi `undefined`, sehingga
      caller kehilangan status HTTP dan alasan kegagalan yang sebenarnya.

- [ ] **Uji integrasi signature SEP-53 pada semua wallet yang didukung.**
      Verifikasi hasil `signMessage` benar-benar berupa base64 signature SEP-53
      untuk Freighter, xBull, dan wallet target lain, bukan raw message signature
      dengan format berbeda.

- [x] **Rapikan cache auth setelah login, register, dan logout.**
      Cache `auth/me` sebaiknya di-set atau di-invalidate secara eksplisit agar role
      guard dan header tidak sesaat menampilkan state session lama.

## Flow 2 — Submit dan Approval KYC

- [x] **Aktifkan polling KYC ketika status `PENDING`.**
      Gunakan `refetchInterval` sekitar 10–30 detik hanya selama status masih
      `PENDING`, lalu hentikan polling setelah `APPROVED`, `REJECTED`, atau
      `REVOKED`.

- [x] **Berikan pesan khusus untuk NIK duplikat (`409`).**
      Jangan hanya menampilkan error generik. Copy yang disarankan:
      “NIK ini sudah digunakan untuk memverifikasi akun lain.”

- [x] **Pastikan guard aksi konsisten dengan status KYC.**
      Tombol create proposal, invest, vote, claim dividend, dan claim refund harus
      dinonaktifkan atau dialihkan ke KYC sebelum request dikirim. Status
      `REJECTED` dan `REVOKED` tetap menyediakan jalur resubmit dengan copy yang
      berbeda.

- [x] **Tangani masa sinkronisasi whitelist setelah KYC approved.**
      Karena `whitelistStatus` belum diekspos oleh `/kyc/me`, kegagalan investasi
      pertama setelah approval perlu menampilkan pesan retry/backoff, bukan error
      sistem yang menyesatkan.

## Flow 3 — Funding Proposal

- [x] **Jadikan total milestone sebagai validasi form, bukan hanya informasi.**
      UI sudah menghitung total milestone, tetapi schema belum menolak submit ketika
      jumlahnya tidak persis sama dengan `requestedAmount`. Gunakan perhitungan
      decimal yang aman dan hindari floating-point untuk nominal tujuh desimal.

- [x] **Validasi ukuran dan MIME file di schema frontend.**
      Jumlah file sudah dibatasi, tetapi schema perlu benar-benar menolak gambar
      non-JPEG/PNG/WebP, dokumen non-PDF, atau file di atas 5 MB sebelum upload.

- [x] **Perhitungkan media yang sudah tersimpan ketika menambah file.**
      Pada edit proposal, batas lima gambar dan tiga PDF harus dihitung dari media
      existing ditambah file baru, bukan hanya file yang baru dipilih.

- [x] **Tampilkan statistik aktual proposal.**
      Gunakan `investorCount` dan `raisedAmount` dari API, termasuk nilai nol sebelum
      proposal mempunyai campaign. Hapus placeholder `endAt="Null"` jika field itu
      memang tidak tersedia pada proposal.

- [x] **Polling status proposal setelah `SUBMITTED`.**
      Pantau perpindahan `SUBMITTED` → `UNDER_REVIEW` → `APPROVED`/`REJECTED`, atau
      sediakan refresh yang jelas. Form harus tetap read-only untuk semua status
      selain `DRAFT`.

- [x] **Tampilkan hasil rejection dengan alasan yang dapat ditindaklanjuti.**
      Jika response proposal menyediakan rejection reason, tampilkan pada card atau
      detail dan jelaskan apakah entrepreneur perlu membuat proposal baru.

## Flow 4 — Auto-deploy Campaign

- [x] **Bangun state UI untuk proses deploy campaign.**
      Setelah proposal approved, polling `GET /campaigns/:id` dan tampilkan progres
      `PENDING` → `DEPLOYING_TOKEN` → `DEPLOYING_CAMPAIGN` → `WIRING` → `LIVE`,
      termasuk state `FAILED` dan aksi retry/refresh yang sesuai.

- [x] **Gate semua aksi campaign dengan status yang benar.**
      Tombol Invest hanya aktif jika `deployStatus === "LIVE"` dan
      `status === "ACTIVE"`. Keberadaan `contractAddress` saja tidak cukup.

- [x] **Tampilkan status lock dan unlock.**
      Gunakan `lockEndAt` dan `unlockStatus` untuk menjelaskan kapan saham masih
      terkunci dan kapan sudah dapat ditransfer P2P. Jangan membangun secondary
      market atau transfer UI sebagai bagian flow investasi saat ini.

- [x] **Render media campaign dari `media[]`.**
      Halaman publik/detail perlu menampilkan galeri gambar dan tautan PDF yang
      dilink dari proposal saat approval.

## Flow 5 — Investor Investasi

- [x] **Implementasikan halaman discover campaign.**
      Ganti placeholder `/investor/discovers` dengan data `GET /campaigns`, loading,
      error, empty state, thumbnail, target/raised amount, status, dan tautan ke
      detail campaign.

- [x] **Implementasikan halaman detail campaign.**
      Ganti placeholder `/investor/discovers/[campaignId]` dengan detail bisnis,
      media, progress pendanaan, lock period, milestone, deploy status, dan form
      investasi.

- [x] **Pasang `useInvest` pada form investasi.**
      Gunakan amount string maksimal tujuh desimal dan tampilkan tahapan
      `PREPARING`, `SIGNING`, serta `SUBMITTING`. Jangan mengubah XDR dari backend
      sebelum ditandatangani wallet.

- [x] **Tambahkan pre-flight guidance USDC.**
      Jelaskan bahwa wallet membutuhkan trustline USDC dan saldo yang cukup.
      Tangani kegagalan balance, trustline, campaign belum LIVE, dan whitelist yang
      belum tersinkron dengan pesan berbeda.

- [x] **Refresh portfolio setelah investasi sukses.**
      Invalidate query campaign, `investments/mine`, dan `holdings/mine` setelah
      submit menghasilkan investment `CONFIRMED`.

- [x] **Lengkapi halaman riwayat investasi.**
      `/investor/investments` masih placeholder meskipun API dan tabel ringkas pada
      overview sudah tersedia. Buat tampilan penuh dengan status dan tx hash.

## Flow 6 — Entrepreneur Deposit Profit

- [x] **Polling distribusi yang masih `PENDING`.**
      Setelah deposit berhasil, refresh otomatis `GET
/campaigns/:campaignId/distributions` sampai distribusi menjadi `COMPLETED`
      atau `FAILED`. Jangan memberi kesan dividen sudah siap diklaim saat masih
      `PENDING`.

- [x] **Tampilkan field hasil snapshot secara kondisional.**
      `totalShares`, `rewardPerShare`, dan `merkleRoot` belum tersedia selama
      pemrosesan. Gunakan loading/placeholder yang eksplisit, bukan angka nol yang
      bisa disalahartikan.

- [x] **Tambahkan penanganan trustline dan saldo USDC entrepreneur.**
      Deposit profit dapat gagal jika trustline atau saldo tidak mencukupi; tampilkan
      panduan yang dapat ditindaklanjuti.

## Flow 7 — Investor Klaim Dividen

- [x] **Buat API prepare dan submit claim dividend.**
      Implementasikan `POST /distributions/:distributionId/claim/prepare` dan
      `POST /distributions/:distributionId/claim` melalui API wrapper.

- [x] **Buat hook relay claim dividend.**
      Susun prepare → sign exact XDR → submit seperti flow refund, lengkap dengan
      state proses, error, dan invalidasi query setelah sukses.

- [x] **Tambahkan tombol Claim pada entitlement investor.**
      Tombol hanya boleh aktif ketika claim berstatus `PENDING` dan nested
      distribution berstatus `COMPLETED`. Distribution `PENDING` harus tampil
      sebagai “sedang diproses”, bukan dapat diklaim.

- [x] **Perjelas hasil klaim.**
      Setelah sukses, tampilkan status `CLAIMED`, tx hash, tanggal claim, dan
      informasi bahwa USDC langsung masuk wallet tanpa langkah withdraw lain.

## Flow 8 — Milestone dan Voting Investor

- [ ] **Gunakan response envelope pada submit proof milestone.**
      Endpoint submit mengembalikan data dalam `ApiResponse`; unwrap `data` sebelum
      melakukan invalidasi berdasarkan `milestone.id` dan `campaignId`.

- [ ] **Gate submit milestone berdasarkan status campaign dan urutan.**
      Hanya milestone berikutnya yang berstatus `PENDING` pada campaign yang sudah
      mencapai target yang dapat disubmit. Jelaskan error previous milestone belum
      released, campaign belum penuh, dan campaign cancelled.

- [ ] **Implementasikan API dan mutation voting.**
      Tambahkan `POST /milestones/:milestoneId/vote` dengan pilihan `APPROVE` atau
      `REJECT`, termasuk kemampuan mengubah vote sebelum `votingEndsAt`.

- [ ] **Bangun UI voting untuk investor.**
      Tampilkan proof, waktu tersisa, bobot saham, pilihan vote, vote pengguna,
      tally, quorum, approval threshold, dan status campaign. Investor tanpa saham
      mendapat penjelasan 403 yang sesuai.

- [ ] **Tampilkan mekanisme quorum extension/default-approve.**
      Jelaskan bahwa voting dapat diperpanjang satu kali dan akan default-approve
      bila quorum tetap tidak tercapai, agar perilaku sistem tidak mengejutkan user.

- [ ] **Polling status milestone hingga terminal.**
      Selama `VOTING`, `APPROVED`, atau `RELEASING`, refresh detail sampai
      `RELEASED`, `REJECTED`, atau `FAILED`.

- [ ] **Alihkan campaign cancelled dari voting ke refund.**
      Jika campaign berubah menjadi `CANCELLED`, nonaktifkan submit/vote dan arahkan
      investor ke status refund.

## Flow 9 — Cancel Campaign dan Refund

- [ ] **Pastikan admin membatalkan berdasarkan campaign ID.**
      Daftar admin saat ini berangkat dari proposal item. Pastikan ID yang dikirim
      ke `/admin/campaigns/:id/cancel` adalah campaign ID, bukan proposal ID.

- [ ] **Polling status refund setelah cancel.**
      Gunakan `GET /campaigns/:campaignId/refund` sampai `COMPLETED` atau `FAILED`
      untuk menampilkan progres proses cancel on-chain dan pembuatan Merkle tree.

- [ ] **Gate tombol Claim Refund dengan nested refund status.**
      Claim hanya aktif jika `claim.status === "PENDING"` dan
      `claim.refund.status === "COMPLETED"`. Saat refund masih `PENDING`, tampilkan
      “refund sedang diproses”.

- [ ] **Perbaiki satuan refund menjadi USDC.**
      UI saat ini menampilkan entitlement sebagai XLM, padahal flow backend
      mengembalikan sisa dana dalam USDC.

- [ ] **Jelaskan bahwa refund bukan selalu pengembalian penuh.**
      Copy UI harus menyebut nominal dihitung pro-rata dari sisa dana campaign
      setelah pencairan milestone, bukan selalu sebesar investasi awal.

- [ ] **Refresh data setelah claim refund sukses.**
      Invalidate `refunds/mine`, campaign refund, holdings, dan ringkasan dashboard
      agar tombol serta total refund langsung berubah ke state terbaru.

- [ ] **Tampilkan tx hash dan status claim.**
      Sediakan feedback setelah submit `201`, tanpa mengasumsikan bahwa semua
      endpoint sukses selalu mengembalikan HTTP 200.

## Flow 10 — Faucet USDC Test

- [ ] **Buat module API faucet.**
      Tambahkan API function untuk trustline prepare, trustline submit, dan claim
      USDC. Endpoint ini public dan tidak memerlukan status login/KYC.

- [ ] **Bangun UI faucet publik.**
      Sediakan flow connect wallet → cek/fund XLM testnet → prepare trustline → sign
      → submit → claim USDC, dengan tahap proses yang mudah dipahami juri.

- [ ] **Tangani wallet yang sudah mempunyai trustline.**
      Error `409` pada trustline prepare berarti pengguna dapat langsung melanjutkan
      ke claim, bukan kegagalan fatal.

- [ ] **Tampilkan cooldown dan error akun belum aktif.**
      Berikan instruksi Friendbot ketika akun belum ada on-chain dan tampilkan waktu
      tunggu ketika wallet masih berada dalam cooldown claim.

- [ ] **Jangan meminta signature pada langkah claim USDC.**
      Hanya transaksi `changeTrust` yang ditandatangani user; payment claim
      ditandatangani issuer/platform.

## Konsistensi UI dan Domain

- [ ] **Standarkan seluruh label aset menjadi USDC.**
      Beberapa komponen dashboard, holdings, milestone, dan refund masih memakai
      `USDT` atau `XLM`. Gunakan asset code dari API jika tersedia dan fallback
      `USDC` hanya bila diperlukan.

- [ ] **Selesaikan halaman overview dan settings yang masih placeholder.**
      Ini mencakup overview admin, overview campaign entrepreneur, dan settings
      investor. Tentukan requirement minimal atau hapus sementara item navigasinya
      agar user tidak diarahkan ke halaman kosong.

- [ ] **Konsisten memakai komponen feedback shadcn.**
      Gunakan `Alert` untuk error/callout, `Empty` untuk data kosong, `Skeleton`
      untuk loading, `Badge` untuk status, dan `sonner` untuk feedback aksi.
      Seluruh dialog tetap harus mempunyai title yang dapat diakses.

- [ ] **Buat helper status dan polling bersama.**
      Centralize interval, terminal state, badge, dan copy untuk deploy,
      distribution, milestone, refund, serta KYC agar setiap halaman tidak membuat
      interpretasi status yang berbeda.

## Verifikasi dan Quality Gate

- [ ] **Tambahkan test untuk API wrapper dan relay flow.**
      Prioritaskan response envelope, `204 No Content`, error 400/401/403/409,
      prepare-sign-submit, idempotent retry, dan invalidasi query.

- [ ] **Tambahkan integration test untuk role dan KYC guard.**
      Uji entrepreneur/investor/admin, session expired, KYC pending/rejected/revoked,
      serta akses resource milik user lain.

- [ ] **Tambahkan E2E untuk happy path utama.**
      Minimal mencakup register, KYC, proposal, admin approval, deploy polling,
      invest, deposit/claim dividend, milestone voting, cancel/refund, dan faucet.

- [ ] **Jalankan quality gate sebelum menutup TODO.**
      Jalankan `pnpm lint`, `pnpm typecheck`, dan `pnpm build`, lalu uji dengan
      backend testnet aktif dan setidaknya satu wallet investor serta entrepreneur.
