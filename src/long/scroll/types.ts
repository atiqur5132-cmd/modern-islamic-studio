// Props of the "Long" composition: a faceless YouTube video built on one finished
// voiceover file. Every time here is in seconds on that voiceover (the output timeline).
export type LongWord = {
  text: string;
  start: number;
  end: number;
  emphasis: boolean;
  line: number; // 1-based line of script.txt
  index: number; // word number inside its line, from 0
};

export type LongLine = {n: number; start: number; end: number};

export type LongProps = {
  audio: string; // under public/footage
  durationSeconds: number;
  lines: LongLine[];
  words: LongWord[];
  captions: LongWord[][];
};

// A scene asks for frames relative to its own start.
export type Cues = {
  line: (n: number, offsetSeconds?: number) => number;
  lineEnd: (n: number) => number;
  word: (n: number, index: number) => number;
};
