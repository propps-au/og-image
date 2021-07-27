import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(
  `${__dirname}/../_fonts/PublicSans-Regular.ttf`
).toString("base64");
const bold = readFileSync(
  `${__dirname}/../_fonts/PublicSans-Bold.ttf`
).toString("base64");
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);

function getCss(theme: string, fontSize: string) {
  let background = "white";
  let foreground = "black";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "black";
    foreground = "white";
    radial = "dimgray";
  }
  return `
    @font-face {
        font-family: 'Public Sans';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/tff;charset=utf-8;base64,${rglr}) format("tff");
    }

    @font-face {
        font-family: 'Public Sans';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/tff;charset=utf-8;base64,${bold}) format("tff");
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .flex-center {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
        padding: 0px 24px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Public Sans', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
    }
    
    .circular--portrait {
        position: relative;
        width: 300px;
        height: 300px;
        overflow: hidden;
        border-radius: 50%;
        border: 6px solid #000;
      }
      
    .circular--portrait img {
        width: 100%;
        height: auto;
    }

    .heading p {
        font-size: 1em !important;
        max-width: 40ch;
        text-align: center;
    }
    .heading h1 {
        text-align: center;
        margin-bottom: 32px;
    }

    .heading h1 span {
        display: block;
        font-size: 20px !important;
        font-weight: normal;
        margin-top: 4px;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="spacer">
            ${
              images.length > 0
                ? `<div class="flex-center">
        
                ${images
                  .map(
                    (img, i) =>
                      getPlusSign(i) + getImage(img, widths[i], heights[i])
                  )
                  .join("")}
    
                </div>
                `
                : ""
            }
         
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "300") {
  return `<div class="flex-center circular--portrait"><img
                class="logo"
                alt="Generated Image"
                src="${sanitizeHtml(src)}"
                width="${sanitizeHtml(width)}"
                height="${sanitizeHtml(height)}"
            />           
        </div>`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
