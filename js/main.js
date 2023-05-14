"use strict";

// O'zgaruvchilar e'lon qilindi
let uploadWrapper = document.querySelector(".upload-wrapper");
let previewImg = uploadWrapper.querySelector("img");
let fileInput = uploadWrapper.querySelector("input");
let widthInput = document.querySelector("#width-input");
let heightInput = document.querySelector("#height-input");
let ratioInput = document.querySelector("#ratio-input");
let sizeInput = document.querySelector("#size-input");
let downloadButton = document.querySelector(".download-button");
let refreshButton = document.querySelector("#refresh-button");
let ogImageRatio;

let loadFile = (e) => {
  // Foydalanuvchi tanlagan birinchi faylni olish
  let file = e.target.files[0];
  // Agar foydalanuvchi biror faylni tanlamagan bo'lsa, qaytish
  if (!file) {
    return;
  }
  // Rasm manbasini oldindan ko'rish uchun tanlangan fayl url manzilini o'tkazish
  previewImg.src = URL.createObjectURL(file);
  // Rasm yuklangandan keyin
  previewImg.addEventListener("load", () => {
    widthInput.value = previewImg.naturalWidth;
    heightInput.value = previewImg.naturalHeight;
    ogImageRatio = previewImg.naturalWidth / previewImg.naturalHeight;
    document.querySelector(".wrapper").classList.add("active");
  });
};

widthInput.addEventListener("keyup", () => {
  // Nisbatni tasdiqlash holatiga ko'ra balandlikni aniqlash
  let height = ratioInput.checked
    ? widthInput.value / ogImageRatio
    : heightInput.value;
  heightInput.value = Math.floor(height);
});

heightInput.addEventListener("keyup", () => {
  // Nisbatni tasdiqlash holatiga ko'ra kenglikni aniqlash
  let width = ratioInput.checked
    ? heightInput.value * ogImageRatio
    : widthInput.value;
  widthInput.value = Math.floor(width);
});

let resizeAndDownload = () => {
  let canvas = document.createElement("canvas");
  let a = document.createElement("a");
  let ctx = canvas.getContext("2d");
  // Agar "Hajmni kamaytirish" belgilansa sifati 0.7(70%)ga kamaytiriladi, aks holda sifati 1.0(100%) holatida qoladi"
  let imageSize = sizeInput.checked ? 0.7 : 1.0;
  // Kirish qiymatlari bo'yicha canvas kengligini sozlash
  canvas.width = widthInput.value;
  // Kirish qiymatlari bo'yicha canvas balandligini sozlash
  canvas.height = heightInput.value;
  // Foydalanuvchi tanlagan rasmni canvasga chizish
  ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
  // Canvas ma'lumotlarining URL manzilini <a> elementining href qiymati sifatida o'tkazish
  a.href = canvas.toDataURL("image/jpeg", imageSize);
  // Joriy vaqtni yuklab olish qiymati sifatida o'tkazish
  a.download = new Date().getTime();
  // Faylni yuklab olish uchun <a> elementini bosish
  a.click();
};

downloadButton.addEventListener("click", resizeAndDownload);
fileInput.addEventListener("change", loadFile);
// uploadWrapper "click" bo'lganda fileInput ham "click" bo'lishi funksiyasi
uploadWrapper.addEventListener("click", () => {
  fileInput.click();
});

refreshButton.addEventListener("click", () => {
  location.reload();
});
