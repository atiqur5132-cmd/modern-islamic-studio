import {AYAHS} from "../../data/quran";

// Every piece of Arabic on screen is cut from the verified Ayah text, never typed.

// Harakat, superscript alif and the small Quranic signs (waqf marks, small letters).
const MARKS = /[ً-ٰٟۖ-ۭ]/g;
const WAQF_ONLY = /^[ۖ-ۭ]+$/;
const TANWEEN_KASR = "ٍ";

export const verifiedAyah = (key: string) => {
  const ayah = AYAHS[key];
  if (!ayah) {
    throw new Error(`Ayah ${key} is missing. Run scripts/fetch_ayah.py ${key}`);
  }
  return ayah;
};

// The Ayah's last `count` words, as written in the mushaf (waqf signs skipped).
export const lastWords = (key: string, count: number) =>
  verifiedAyah(key)
    .textUthmani.split(" ")
    .filter((word) => !WAQF_ONLY.test(word))
    .slice(-count);

export const withoutMarks = (text: string) => text.replace(MARKS, "");

// The creator's decision for the bare-letter graphics: the mushaf's final dotless
// ya (U+0649) is shown as the dotted ya (U+064A) once the vowel marks are gone.
export const modernYa = (text: string) => text.replace(/ى/g, "ي");

// "kullun fi falakin": the three words that read the same both ways.
export const palindromeWords = (key: string) => lastWords(key, 4).slice(0, 3);

// Its letters in reading order (first = rightmost on screen). Stops the render if
// they are not seven letters reading the same both ways.
export const palindromeLetters = (key: string) => {
  const letters = [...modernYa(withoutMarks(palindromeWords(key).join("")))];
  if (letters.length !== 7 || letters.join("") !== [...letters].reverse().join("")) {
    throw new Error(`Expected a 7-letter palindrome in ${key}, got ${letters.join(" ")}`);
  }
  return letters;
};

// The word falak as a dictionary word: the third word without its case ending.
export const falakWord = (key: string) => palindromeWords(key)[2].replace(TANWEEN_KASR, "");
