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

//const compressedElement = document.querySelector("#compressed-url");
const qrCode = document.querySelector("#qrcode");

function update(tabs) {
  const url = tabs[0].url;
  //const compressedPayLoad = compress(url, outputAlphabetASCII);

  //compressedElement.textContent = `http://ha.mr#${compressedPayLoad}`;
  //compressedElement.href = `http://ha.mr#${compressedPayLoad}`;

  const qrURL = `HTTP://HA.MR/${compress(url, outputAlphabetQR)}`;
  const qr = qrGen(
    qrMode.alphaNumeric(qrURL),
    {
      minVersion: 1,
      maxVersion: 40,
      minCorrectionLevel: qrCorrect.M,
      maxCorrectionLevel: qrCorrect.H
    });
  qr.toCanvas(qrCode,
    {
      on:  [0x00, 0x00, 0x00, 0xFF], // black
      off: [0xFF, 0xFF, 0xFF, 0xFF], // white
      pad: 2,
    }
  );
  qrCode.title = qrURL;

}

(() => {
  browser.tabs.query({ currentWindow: true, active: true }, update);
})();
