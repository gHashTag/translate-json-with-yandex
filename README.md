## How use it?

In order to perform the translation, you need to do a few simple steps:

- First of all, install the dependencies:

```
yarn
```

or

```
npm install
```

- To make a translation, you need to get a Yandex API key. This can be done [here](https://console.cloud.yandex.ru/), according to [this guide](https://cloud.yandex.ru/docs/translate/operations/translate)

- In the input folder, you need to place files of the `json` format that you need to translate, then change the paths `pathsToJSON` and `namesOutputJSON` according to the name

- Finally you can translate your files:

```
node translate fr,et,nl <YOUR_FOLDER_ID> <YOUR_YANDEX_API_KEY>
```
