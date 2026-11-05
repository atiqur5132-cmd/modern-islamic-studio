# Do samundar aur unke beech ka parda: script notes

Status: **draft, creator ne abhi confirm nahi kiya.** Final render se pehle neeche ki checklist poori karni hai.

Target length: ~55-60 s (lagbhag 140 words). Lamba lage to line 7 ka aakhri sentence ("Viral video wala paani bhi.") hata sakte hain.

## Line by line: claim tag aur screen

| Line | Kya bola ja raha hai | Full-screen tag | Screen idea |
|---|---|---|---|
| 1 | Hook: viral "do samundar" video | — | Do rang ke paani milne ka shot (licensed / Commons) |
| 2-3 | 55:19-20 ka tarjuma | Quranic context | Ayah card 55:19, 55:20 (Arabic, fetch_ayah.py se) |
| 4 | 25:53: meetha aur khaara | Quranic context | Ayah card 25:53 |
| 5-6 | Estuary aur halocline | Established science | Simple animation: halka meetha paani upar, khaara neeche, beech mein boundary |
| 7 | Paani dheere dheere milta hai | Established science | Boundary dheere dheere blur hoti hui |
| 8 | Barzakh ke alag tafsiri matlab | Interpretation | Text card: "Interpretation, proof nahi" |
| 9 | Closing | — | Creator to camera |

## Translation aur interpretation alag

- Script ki lines 3-4 sirf tarjuma hain: *maraja* = chhod diya / bahaya, *yaltaqiyan* = aapas mein milte hain, *barzakh* = parda / rukawat, *la yabghiyan* = had paar nahi karte; 25:53: *'adhbun furat* = meetha, *milhun ujaj* = khaara, *hijran mahjura* = ek roki hui aad.
- Barzakh ko halocline samajhna **interpretation** hai, Quran ka bataya hua science nahi. Script yahi kehti hai.

## Scholarly differences (verify karna hai)

Classical mufassireen ne barzakh ke ek se zyada matlab bataye hain, jaise:
- dono paani ke beech zameen ka hissa;
- Allah ki qudrat se bani ek na dikhne wali rukawat.

Ye views Tafsir Ibn Kathir (55:19-20 aur 25:53) mein khud padh kar confirm karo, aur jo views script mein nahi hain unhe description mein likh do.

## Science points (sources lagane hain)

- Estuary mein meetha paani halka (kam density) hone se khaare paani ke upar behta hai; salinity tezi se badalne wali layer ko halocline kehte hain. Source: NOAA ki estuaries / ocean layers wali pages.
- Ye layers permanent wall nahi hain: tides, hawa aur turbulence se paani dheere dheere mix hota hai.
- Viral Gulf of Alaska photo: glacier se aaya mitti bhara paani samundar ke paani se mil raha hai; boundary dikhti hai lekin paani aage chal kar mix ho jaata hai. Kisi oceanographer ya science publication ka explanation dhoondh kar credits mein lagao.

## Final render se pehle checklist

- [ ] Laptop par `scripts/fetch_ayah.py 55:19`, `55:20`, `25:53` chalao (cloud session se network block tha, isliye text abhi project mein nahi hai).
- [ ] Tarjuma kisi standard Urdu/Hindi tarjume se milao.
- [ ] Tafsir Ibn Kathir mein barzakh ke views confirm karo.
- [ ] NOAA aur Alaska photo ke sources `credits.txt` mein daalo.
- [ ] Creator script confirm kare, phir recording.
