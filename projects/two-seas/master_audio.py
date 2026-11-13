"""Clean the creator's voice and lay the nasheed under it, very quietly.

Usage: .venv\Scripts\python projects/two-seas/master_audio.py

Voice comes from the raw take (Raw footages/lv_0_20261113153441.mp4, not the already
loudness-normalised prepared file), so it is processed once:
  high-pass 80 Hz (rumble) -> light FFT denoise (room noise sat ~23 dB under the speech)
  -> -3 dB at 250 Hz (boxy low-mids) -> +4.5 dB at 3.5 kHz and +2 dB shelf above 9 kHz
  (the phone mic left 3-6 kHz ~20 dB under the mids) -> de-esser -> 2.5:1 compressor.
Music: the creator's nasheed (Pixabay), from 0 s, ducked by the voice to about 21 dB under it,
fading out over the last 2 s.
The mix replaces the audio of public/footage/two-seas.mp4 (one kept segment, so source
time is output time and the music never jumps at a cut). finalize.py sets -14 LUFS later.
Writes work/two-seas.voice.wav, work/two-seas.mix.wav and work/two-seas.mix.m4a (to listen).
"""
import pathlib
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
RAW = ROOT / "Raw footages" / "lv_0_20261113153441.mp4"
MUSIC = ROOT / "Raw footages" / "sufisama99-nasheed-islamic-background-133345.mp3"
FOOTAGE = ROOT / "public" / "footage" / "two-seas.mp4"
WORK = ROOT / "work"
DURATION = 76.28
MUSIC_GAIN_DB = -5  # nasheed -22.4 LUFS; after ducking it sits ~21 dB under the voice

VOICE_CHAIN = ",".join([
    "highpass=f=80:poles=2",
    "afftdn=nr=6:nf=-50:tn=1",
    "equalizer=f=250:t=o:w=1.2:g=-3",
    "equalizer=f=3500:t=o:w=1.4:g=4.5",
    "highshelf=f=9000:g=2",
    "deesser=i=0.4:m=0.5:f=0.5",
    "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=140:makeup=2",
    "aresample=48000",
])


def run(*args):
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *args], check=True)


def main():
    voice = WORK / "two-seas.voice.wav"
    mix = WORK / "two-seas.mix.wav"
    run("-i", str(RAW), "-vn", "-ac", "1", "-af", VOICE_CHAIN, "-c:a", "pcm_s24le", str(voice))
    run("-i", str(voice), "-i", str(MUSIC), "-filter_complex",
        f"[0:a]asplit=2[v][key];"
        f"[1:a]atrim=0:{DURATION},asetpts=PTS-STARTPTS,aresample=48000,volume={MUSIC_GAIN_DB}dB,"
        f"afade=t=out:st={DURATION - 2}:d=2[m];"
        f"[m][key]sidechaincompress=threshold=0.03:ratio=2.5:attack=30:release=450:makeup=1[md];"
        f"[v]pan=stereo|c0=c0|c1=c0[vs];"
        f"[vs][md]amix=inputs=2:normalize=0,"
        f"loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[out]",
        "-map", "[out]", "-t", str(DURATION), "-c:a", "pcm_s24le", str(mix))
    run("-i", str(mix), "-c:a", "aac", "-b:a", "192k", str(WORK / "two-seas.mix.m4a"))
    voiceonly = FOOTAGE.with_name("two-seas.voiceonly.mp4")
    if not voiceonly.exists():
        shutil.copy(FOOTAGE, voiceonly)
    tmp = FOOTAGE.with_name("two-seas.tmp.mp4")
    run("-i", str(voiceonly), "-i", str(mix), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", str(tmp))
    tmp.replace(FOOTAGE)
    print(f"Wrote {voice.name}, {mix.name}; replaced the audio of {FOOTAGE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
