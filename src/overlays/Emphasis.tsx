import {CSSProperties} from "react";
import {GOLD} from "../theme";

// Words between *stars* are emphasised.
export const parseEmphasis = (text: string) => {
  let emphasis = false;
  return text.split(" ").map((token) => {
    emphasis = emphasis || token.startsWith("*");
    const word = {text: token.replaceAll("*", ""), emphasis};
    if (token.replace(/[,.?!:;]+$/, "").endsWith("*")) {
      emphasis = false;
    }
    return word;
  });
};

export const EmphasisText = ({text, style}: {text: string; style?: CSSProperties}) => (
  <>
    {parseEmphasis(text).map((word, index) => (
      <span
        key={`${index}-${word.text}`}
        style={{...style, color: word.emphasis ? GOLD : style?.color}}
      >
        {word.text}{" "}
      </span>
    ))}
  </>
);
