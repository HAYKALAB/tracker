/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()
let transaction = [];
let editId = null;
function userId() {
  return +new Date();
}

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM
const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");
/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

function render(data = transaction) {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  for (let card of data) {
    const divParent = document.createElement("div");
    const h3 = document.createElement("h3");
    const amount = document.createElement("p");
    const date = document.createElement("p");
    const type = document.createElement("p");
    const edit = document.createElement("button");

    const divChild = document.createElement("div");
    const typeButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    divParent.setAttribute("data-testid", "transactionItem");
    h3.setAttribute("data-testid", "transactionItemTitle");
    amount.setAttribute("data-testid", "transactionItemAmount");
    date.setAttribute("data-testid", "transactionItemDate");
    type.setAttribute("data-testid", "transactionItemType");
    typeButton.setAttribute("data-testid", "transactionItemEditTypeButton");
    deleteButton.setAttribute("data-testid", "transactionItemDeleteButton");

    h3.textContent = card.title;
    amount.textContent = `nominal: Rp.${card.amount}`;
    date.textContent = `Tanggal: ${card.date}`;
    type.textContent = card.type === "income" ? "income" : "expense";
    typeButton.textContent = "ubah tipe";
    deleteButton.textContent = "hapus";
    edit.textContent = "edit";
    edit.classList.add("tracker-transaction-item__btn");

    deleteButton.addEventListener("click", function () {
      transaction = transaction.filter((item) => item.id !== card.id);

      menambahStorage();
      document.dispatchEvent(new Event("transaction:updated"));
    });
    divChild.append(typeButton);
    divChild.append(deleteButton);

    divParent.append(h3);
    divParent.append(amount);
    divParent.append(date);
    divParent.append(type);
    divParent.append(divChild);
    divChild.append(edit);

    edit.addEventListener("click", function () {
      document.getElementById("transactionFormTitleInput").value = card.title;

      document.getElementById("transactionFormAmountInput").value = card.amount;

      document.getElementById("transactionFormDateInput").value = card.date;

      document.getElementById("transactionFormTypeSelect").value = card.type;

      editId = card.id;
    });

    typeButton.addEventListener("click", function () {
      card.type = card.type === "income" ? "expense" : "income";

      menambahStorage();
      document.dispatchEvent(new Event("transaction:updated"));
    });

    if (card.type === "income") {
      incomeList.append(divParent);
    } else {
      expenseList.append(divParent);
    }
  }
}

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

document
  .getElementById("transactionForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const titleInput = document.getElementById(
      "transactionFormTitleInput",
    ).value;

    const amountInput = document.getElementById(
      "transactionFormAmountInput",
    ).value;

    const dateInput = document.getElementById("transactionFormDateInput").value;

    const typeSelect = document.getElementById(
      "transactionFormTypeSelect",
    ).value;

    if (titleInput.length === 0) {
      alert("title wajib diisi");
      return;
    }

    if (amountInput < 1) {
      alert("nominal kurang");
      return;
    }

    // =========================
    // MODE EDIT
    // =========================
    if (editId !== null) {
      const cari = transaction.find((item) => item.id === editId);

      cari.title = titleInput;
      cari.amount = Number(amountInput);
      cari.date = dateInput;
      cari.type = typeSelect;

      editId = null;
    } else {
      // =========================
      // MODE TAMBAH
      // =========================
      const newTransaction = {
        id: userId(),
        title: titleInput,
        amount: Number(amountInput),
        date: dateInput,
        type: typeSelect,
      };

      transaction.push(newTransaction);
    }

    menambahStorage();
    document.dispatchEvent(new Event("transaction:updated"));

    // reset form
    document.getElementById("transactionForm").reset();
  });

function updateDashboard() {
  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  for (let item of transaction) {
    if (item.type === "income") {
      totalPemasukan += item.amount;
    } else {
      totalPengeluaran += item.amount;
    }
  }

  let saldo = totalPemasukan - totalPengeluaran;

  const balance = document.querySelector(".tracker-summary__balance-amount");

  const income = document.querySelector(
    ".tracker-summary__stat-amount--income",
  );

  const expense = document.querySelector(
    ".tracker-summary__stat-amount--expense",
  );

  balance.textContent = `Rp ${saldo}`;
  income.textContent = `Rp ${totalPemasukan}`;
  expense.textContent = `Rp ${totalPengeluaran}`;
}
/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */

/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

function menambahStorage() {
  localStorage.setItem("transactions", JSON.stringify(transaction));
}

function memuatStorage() {
  const data = localStorage.getItem("transactions");

  if (data !== null) {
    transaction = JSON.parse(data);
  }
}

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */

document.addEventListener("transaction:updated", function () {
  render();
  updateDashboard();
});

memuatStorage();
document.dispatchEvent(new Event("transaction:updated"));

document
  .getElementById("searchTransactionFormTitleInput")
  .addEventListener("input", function (e) {
    const keyword = e.target.value.toLowerCase();

    const hasilFilter = transaction.filter((item) =>
      item.title.toLowerCase().includes(keyword),
    );

    render(hasilFilter);
  });

document
  .getElementById("searchTransactionForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
  });

/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */
