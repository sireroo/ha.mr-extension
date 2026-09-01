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
const hamrIcon = document.querySelector("#hamricon");
const linkIcon = document.querySelector("#linkicon");

const swapButton = document.querySelector("#swpbtn");

let hamrMode = true;

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
  swapButton.style.animation = "none";

  const url = tabs[0].url;

  const ASCIILink = `http://ha.mr#${compress(url, outputAlphabetASCII)}`;
  const emojiLink = `http://ha.mr#${compress(url, outputAlphabetEmoji)}`;

  const qrURL = `HTTP://HA.MR/${compress(url, outputAlphabetQR)}`;
  let qr = qrGen(qrMode.alphaNumeric(qrURL), {
    minVersion: 1,
    maxVersion: 40,
    minCorrectionLevel: qrCorrect.M,
    maxCorrectionLevel: qrCorrect.H,
  });
  let qrDataURL = qr.toDataURL({
    type: "image/png",
    on: [0x00, 0x00, 0x00, 0xff], // black
    off: [0xff, 0xff, 0xff, 0xff], // white
    pad: 2,
    scale: 8,
  });
  qrCode.src = qrDataURL;
  qrCode.title = qrURL;
  saveLink.href = qrDataURL;

  let copyLink = ASCIILink;

  linkButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyLink);
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

  swapButton.addEventListener("click", () => {
    hamrMode = !hamrMode;
    flash(swapButton);
    if (hamrMode) {
      emojiButton.classList.remove("hidden");
      linkButton.title = "Copy ha.mr link";
      swapButton.title = "Switch to normal link mode";
      hamrIcon.classList.add("hidden");
      linkIcon.classList.remove("hidden");

      qr = qrGen(qrMode.alphaNumeric(qrURL), {
        minVersion: 1,
        maxVersion: 40,
        minCorrectionLevel: qrCorrect.M,
        maxCorrectionLevel: qrCorrect.H,
      });
      qrDataURL = qr.toDataURL({
        type: "image/png",
        on: [0x00, 0x00, 0x00, 0xff], // black
        off: [0xff, 0xff, 0xff, 0xff], // white
        pad: 2,
        scale: 8,
      });
      qrCode.src = qrDataURL;
      qrCode.title = qrURL;
      saveLink.download = "hamr-qrcode.png";
      saveLink.href = qrDataURL;

      copyLink = ASCIILink;
    } else {
      emojiButton.classList.add("hidden");
      linkButton.title = "Copy link";
      swapButton.title = "Switch to ha.mr mode";
      hamrIcon.classList.remove("hidden");
      linkIcon.classList.add("hidden");

      qr = qrGen(qrMode.iso8859_1(url), {
        minVersion: 1,
        maxVersion: 40,
        minCorrectionLevel: qrCorrect.M,
        maxCorrectionLevel: qrCorrect.H,
      });
      qrDataURL = qr.toDataURL({
        type: "image/png",
        on: [0x00, 0x00, 0x00, 0xff], // black
        off: [0xff, 0xff, 0xff, 0xff], // white
        pad: 2,
        scale: 8,
      });
      qrCode.src = qrDataURL;
      qrCode.title = url;
      saveLink.download = "qrcode.png";
      saveLink.href = qrDataURL;

      copyLink = url;
    }
  });
}

(() => {
  browser.tabs.query({ currentWindow: true, active: true }, update);
})();
