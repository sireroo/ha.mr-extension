import { compress, decompress } from "../hamr/compress.js";
import {
  outputAlphabetASCII,
  outputAlphabetQR,
  outputAlphabetEmoji,
} from "../hamr/alphabet.js";
import {
  generate as qrGen,
  mode as qrMode,
  correction as qrCorrect,
} from "../lean-qr/lean-qr.js";

const qrCode = document.querySelector("#qrcode");
const linkButton = document.querySelector("#urlbtn");
const emojiButton = document.querySelector("#emjbtn");
const qrButton = document.querySelector("#qrbtn");
const saveLink = document.querySelector("#svelink");
const saveButton = document.querySelector("#svebtn");

function flash(element) {
  element.style.animation = "none";
  element.offsetHeight;
  element.style.animation = null;
}

function update(tabs) {
  linkButton.style.animation = "none";
  emojiButton.style.animation = "none";
  qrButton.style.animation = "none";
  saveButton.style.animation = "none";

  const url = tabs[0].url;
  const ASCIILink = `http://ha.mr#${compress(url, outputAlphabetASCII)}`;
  const emojiLink = `http://ha.mr#${compress(url, outputAlphabetEmoji)}`;

  const qrURL = `HTTP://HA.MR/${compress(url, outputAlphabetQR)}`;
  const qr = qrGen(qrMode.alphaNumeric(qrURL), {
    minVersion: 1,
    maxVersion: 40,
    minCorrectionLevel: qrCorrect.M,
    maxCorrectionLevel: qrCorrect.H,
  });
  const qrDataURL = qr.toDataURL({
    type: "image/png",
    on: [0x00, 0x00, 0x00, 0xff], // black
    off: [0xff, 0xff, 0xff, 0xff], // white
    pad: 2,
    scale: 8,
  });
  qrCode.src = qrDataURL;
  qrCode.title = qrURL;
  saveLink.href = qrDataURL;

  linkButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ASCIILink);
      console.log("Link copied!");
      flash(linkButton);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });

  emojiButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emojiLink);
      console.log("Link copied!");
      flash(emojiButton);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });

  qrButton.addEventListener("click", async () => {
    try {
      const qrBlob = await fetch(qrDataURL).then(response => {return response.blob()});
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": qrBlob,
        }),
      ]);
      console.log("Image copied!");
      flash(qrButton);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });

  saveButton.addEventListener("click", async () => {
    flash(saveButton);
  });
}

(() => {
  browser.tabs.query({ currentWindow: true, active: true }, update);
})();
