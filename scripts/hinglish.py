"""Compare Hinglish (Roman Hindi) with Devanagari by how the words sound.

Captions are written in Hinglish, but Whisper writes Hindi in Devanagari, so both
sides are turned into the same rough Latin spelling before they are compared.
"""
import difflib
import re
import unicodedata

CONSONANTS = {
    "क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "n", "च": "ch", "छ": "chh", "ज": "j",
    "झ": "jh", "ञ": "n", "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n", "त": "t",
    "थ": "th", "द": "d", "ध": "dh", "न": "n", "प": "p", "फ": "ph", "ब": "b", "भ": "bh",
    "म": "m", "य": "y", "र": "r", "ल": "l", "व": "v", "श": "sh", "ष": "sh", "स": "s", "ह": "h",
}
NUKTA_FORMS = {"क": "q", "ख": "kh", "ग": "gh", "ज": "z", "फ": "f", "ड": "r", "ढ": "rh"}
VOWELS = {
    "अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ऋ": "ri", "ए": "e",
    "ऐ": "ai", "ओ": "o", "औ": "au", "ऑ": "o",
}
MATRAS = {
    "ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "ृ": "ri",
    "े": "e", "ै": "ai", "ो": "o", "ौ": "au", "ॉ": "o",
}
NASALS = {"ँ": "n", "ं": "n"}
VIRAMA, NUKTA, VISARGA = "्", "़", "ः"
DEVANAGARI_DIGITS = {chr(0x0966 + d): str(d) for d in range(10)}

# Spellings that sound the same in Hinglish, folded together.
SOUND_ALIKE = (("chh", "c"), ("ch", "c"), ("sh", "s"), ("ph", "f"), ("kh", "k"), ("gh", "g"),
               ("jh", "j"), ("th", "t"), ("dh", "d"), ("bh", "b"), ("q", "k"), ("z", "j"),
               ("w", "v"), ("x", "ks"))


def to_latin(text):
    """Rough Latin spelling of Devanagari. Latin text passes through unchanged."""
    chars = unicodedata.normalize("NFD", text)
    out = []
    i = 0
    while i < len(chars):
        char = chars[i]
        if char in CONSONANTS:
            sound = CONSONANTS[char]
            if i + 1 < len(chars) and chars[i + 1] == NUKTA:
                sound = NUKTA_FORMS.get(char, sound)
                i += 1
            following = chars[i + 1] if i + 1 < len(chars) else ""
            if following in MATRAS:
                sound += MATRAS[following]
                i += 1
            elif following == VIRAMA:
                i += 1
            elif following in CONSONANTS or following in NASALS:
                sound += "a"  # Hindi drops the vowel only at the end of a word
            out.append(sound)
        elif char in VOWELS:
            out.append(VOWELS[char])
        elif char in NASALS:
            out.append(NASALS[char])
        elif char == VISARGA:
            out.append("h")
        elif char in DEVANAGARI_DIGITS:
            out.append(DEVANAGARI_DIGITS[char])
        elif char.isascii():
            out.append(char)
        i += 1
    return "".join(out)


def sound_forms(text):
    """(with vowels, consonants only) after folding sound-alike spellings."""
    spelled = re.sub(r"[^a-z0-9]", "", to_latin(text).lower())
    for written, sound in SOUND_ALIKE:
        spelled = spelled.replace(written, sound)
    with_vowels = re.sub(r"(.)\1+", r"\1", spelled)
    consonants = re.sub(r"(.)\1+", r"\1", re.sub(r"[aeiou]", "", with_vowels))
    return with_vowels, consonants


def similarity(a, b):
    """0 to 1: how alike two words sound, in either script."""
    a_vowels, a_consonants = sound_forms(a)
    b_vowels, b_consonants = sound_forms(b)
    vowels = difflib.SequenceMatcher(None, a_vowels, b_vowels).ratio()
    if not a_consonants or not b_consonants:
        return vowels
    consonants = difflib.SequenceMatcher(None, a_consonants, b_consonants).ratio()
    return 0.6 * consonants + 0.4 * vowels
