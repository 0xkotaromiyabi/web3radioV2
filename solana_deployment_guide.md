# Solana Anchor Deployment Guide (Devnet)

Panduan ini menjelaskan cara mem-build dan men-deploy smart contract Solana (`sol_tip_lottery`) yang berbasis Anchor framework ke jaringan Solana **Devnet**.

## Persiapan Awal

Pastikan Anda sudah berada di dalam environment Ubuntu (WSL) dan sudah memiliki Rust, Solana CLI, serta Anchor ter-install.

1. **Buka terminal dan masuk ke folder program:**

   ```bash
   cd ~/web3radioV2/sol_tip_lottery
   ```

2. **Cek koneksi Solana CLI:**
   Pastikan Anda menggunakan jaringan `devnet`.

   ```bash
   solana config set --url devnet
   ```

3. **Siapkan Wallet Deployer (Admin/Treasury):**
   Jika Anda belum memiliki wallet Solana CLI, buat satu wallet baru:

   ```bash
   solana-keygen new -o ~/.config/solana/id.json
   ```

   *Simpan seed phrase yang ditampilkan agar tidak hilang.*

4. **Airdrop SOL Devnet untuk biaya deploy:**
   Deployment membutuhkan sekitar ~3-5 SOL di devnet.

   ```bash
   solana airdrop 5
   # Jika gagal karena rate limit, gunakan Faucet web: https://faucet.solana.com/
   ```

## Proses Build dan Sinkronisasi Program ID

Setiap kali Anda men-deploy program baru, Solana akan membuatkan satu `Program ID` yang unik. Kita perlu memastikan source code kita menggunakan `Program ID` yang tepat.

1. **Build Program (Tahap 1):**

   ```bash
   anchor build
   ```

   Proses ini akan meng-compile *Skeleton Contract* dan membuat pasangan key untuk program di folder `target/deploy/sol_tip_lottery-keypair.json`.

2. **Dapatkan Program ID yang baru:**

   ```bash
   solana address -k target/deploy/sol_tip_lottery-keypair.json
   ```

   *Copy output address tersebut (misal: `9TW3BWML4rh6NZSBsnEmTVzaCBTDva6H4LvxjTUa3eT6`).*

3. **Update Program ID di Code Anda:**
   Ganti ID lama dengan Program ID yang baru Anda dapatkan di dua tempat berikut:

   - Di `Anchor.toml`:

     ```toml
     [programs.localnet]
     sol_tip_lottery = "PROGRAM_ID_ANDA_DISINI"
     ```

   - Di `programs/sol_tip_lottery/src/lib.rs` (baris ke-6):

     ```rust
     declare_id!("PROGRAM_ID_ANDA_DISINI");
     ```

   - Di Frontend `src/idl/sol_tip_lottery.ts` (baris terakhir):

     ```typescript
     export const PROGRAM_ID = "PROGRAM_ID_ANDA_DISINI";
     ```

4. **Build Ulang Program (Tahap 2):**
   Karena source code berubah (ID diupdate), Anda wajib melakukan build sekali lagi.

   ```bash
   anchor build
   ```

## Deploy ke Devnet

1. **Lakukan Deployment:**
   Jalankan command deploy, pastikan flag `--provider.cluster` mengarah ke devnet.

   ```bash
   anchor deploy --provider.cluster devnet
   ```

   Tunggu hingga proses selesai. Jika berhasil, terminal akan memunculkan tulisan `Deploy success` beserta *Program ID*.

2. **Verifikasi Deployment:**
   Anda dapat mengecek apakah program berhasil diunggah ke Devnet menggunakan Solana Explorer:
   - Buka browser dan kunjungi `https://explorer.solana.com/?cluster=devnet`
   - Masukkan `Program ID` Anda di bilah pencarian.
   Jika status program adalah *Executable*, deployment berhasil!

## Menjalankan Script Inisialisasi (Initialize)

Setelah program di-deploy, Anda harus memanggil instruksi `initialize` agar `GlobalState` dan `EpochState` mulai berjalan, sebelum user bisa menekan tombol **"Tip Now"**.

Berikut adalah contoh skrip Typescript pendek (*taruh di folder script/init.ts*) untuk menjalankan instruksi `initialize`:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolTipLottery } from "../target/types/sol_tip_lottery";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolTipLottery as Program<SolTipLottery>;

  // Karena Global dan Epoch account bukan PDA di skeleton saat ini, 
  // kita harus membuat Keypair baru untuk mereka
  const globalStateKeypair = anchor.web3.Keypair.generate();
  const epochStateKeypair = anchor.web3.Keypair.generate();

  // PDA Vault untuk Treasury dan Prize (opsional bisa Keypair biasa di skeleton ini)
  const treasuryKeypair = anchor.web3.Keypair.generate(); 
  const prizeVaultKeypair = anchor.web3.Keypair.generate();

  console.log("Initializing Program...");
  
  const tx = await program.methods
    .initialize()
    .accounts({
      global: globalStateKeypair.publicKey,
      epoch: epochStateKeypair.publicKey,
      authority: provider.wallet.publicKey,
      treasury: treasuryKeypair.publicKey,
      prizeVault: prizeVaultKeypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([globalStateKeypair, epochStateKeypair])
    .rpc();

  console.log("Initialize TX Signature:", tx);
  console.log("Global State Address:", globalStateKeypair.publicKey.toBase58());
  console.log("Epoch State Address:", epochStateKeypair.publicKey.toBase58());
  console.log("Treasury Address:", treasuryKeypair.publicKey.toBase58());
  console.log("Prize Vault Address:", prizeVaultKeypair.publicKey.toBase58());
}

main();
```

Jalankan script test ini menggunakan:

```bash
npx ts-node script/init.ts
```

> **CATATAN PENTING**: Alamat `Global State`, `Epoch State`, `Treasury`, dan `Prize Vault` yang dihasilkan dari script *Initialize* di atas **wajib disimpan** karena Anda harus meletakkannya kembali ke frontend `PLY.tsx` Anda agar AppKit dapat berinteraksi dengan state yang benar!
