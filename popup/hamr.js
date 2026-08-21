import { compress, decompress } from "./compress";
import {
  outputAlphabetASCII,
  outputAlphabetQR,
  outputAlphabetEmoji,
} from "./alphabet";

function getPage() {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    return tabs[0].url;
  });
}

const urlElement = document.querySelector("#current-url");
const compressedElement = document.querySelector("#compressed-url");

(() => {

let url = getPage();
let compressedPayLoad = compress(url, outputAlphabetASCII);

urlElement.textContent = url;
urlElement.href = url;
compressedElement.textContent = `http://ha.mr#${compressedPayLoad}`;
compressedElement.href = `http://ha.mr#${compressedPayLoad}`;

})();
