const fs = require("fs");
const _ = require("lodash");
const path = require("path");

const pathsToJSON = ["input/example.json", "input/example2.json"];

const namesOutputJSON = ["example", "example2"];

if (process.argv.length >= 3) {
  //Args
  const destinationCodes = process.argv[2].split(",");
  const folderId = process.argv[3];
  const apiKey = process.argv[4];

  function iterLeaves(value, keyChain, accumulator, languageKey) {
    accumulator = accumulator || {};
    keyChain = keyChain || [];
    if (_.isObject(value)) {
      return _.chain(value)
        .reduce((handlers, v, k) => {
          return handlers.concat(
            iterLeaves(v, keyChain.concat(k), accumulator, languageKey)
          );
        }, [])
        .flattenDeep()
        .value();
    } else {
      return function () {
        console.log(
          _.template("Translating <%= value %> to <%= languageKey %>")({
            value,
            languageKey,
          })
        );

        let prom;

        prom = fetch(
          "https://translate.api.cloud.yandex.net/translate/v2/translate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Api-Key ${apiKey}`,
            },
            body: JSON.stringify({
              folderId,
              texts: value,
              targetLanguageCode: languageKey,
            }),
          }
        ).then((a) => a.json());

        return prom
          .then((text) => {
            console.log("🚀 - text", text);
            //Sets the value in the accumulator
            _.set(accumulator, keyChain, text.translations[0].text);

            //This needs to be returned to it's eventually written to json
            return accumulator;
          })
          .catch((err) => console.warn(err));
      };
    }
  }
  pathsToJSON.forEach(async (inputFile, id) => {
    await Promise.all(
      _.reduce(
        destinationCodes,
        (sum, languageKey) => {
          const folder = `output/${languageKey}`;
          const fileName = folder + "/" + namesOutputJSON[id] + ".json";

          const dirPath = path.join(process.cwd(), folder);

          if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, {
              recursive: true,
              force: true,
            });
          }

          fs.mkdirSync(dirPath);
          //Starts with the top level strings
          return sum.concat(
            _.reduce(
              iterLeaves(
                JSON.parse(fs.readFileSync(path.resolve(inputFile), "utf-8")),
                undefined,
                undefined,
                languageKey
              ),
              (promiseChain, fn) => {
                return promiseChain.then(fn);
              },
              Promise.resolve()
            )
              .then((payload) => {
                fs.writeFileSync(fileName, JSON.stringify(payload, null, 4));
              })
              .then(() => {
                console.log(
                  "Successfully translated all nodes, file output at " +
                    fileName
                );
              })
          );
        },
        []
      )
    );
  });
} else {
  console.error(
    "You must provide an input json file and a comma-separated list of destination language codes."
  );
}
