const fs = require("fs");
const path = "src/app/svg-definitions/";

const fileHtml = new Promise((resolve, reject) => {
  fs.readFile(
    path + "svg-definitions.component.html",
    "utf8",
    function (err, svgDefinitions) {
      if (err) {
        reject(err);
      }
      const svgsTransformed = svgDefinitions
        .substring(0, svgDefinitions.lastIndexOf("</defs>"))
        .substring(svgDefinitions.indexOf("<symbol"))
        .trim()
        .replace(/symbol/g, "use")
        .replace(/id="/g, 'xlink:href="#');

      let svgSymbols = svgsTransformed.split("</use>");
      svgSymbols.forEach((symbol, index, symbols) => {
        if (symbol === "") {
          symbols.splice(index, 1);
          return;
        }
        const symbolName = symbol.split('href="')[1].split('"')[0];
        symbols[index] = `<div class="svg-wrap">
                          <svg>${symbol}</use></svg>
                          <span>${symbolName}</span>
                      </div>`;
      });
      svgSymbols = svgSymbols.join("");

      const svgData = `<div class="message">You can update this list running <code>npm run svg:preview</code> in the root folder</div>
                    ${svgDefinitions}
                    ${svgSymbols}`;

      resolve(svgData);
    }
  );
});

Promise.all([fileHtml]).then(
  ([html]) => {
    const result = `${html}`;
    fs.writeFile(path + "svg-preview.html", result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  },
  (error) => {
    console.log(error);
  }
);
