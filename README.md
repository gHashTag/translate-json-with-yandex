## Usage with an API Key

node translate-json fixtures/translate-json/en.json fr,et,nl YOUR_GOOGLE_API_KEY

## Usage without an API Key

node translate-json fixtures/translate-json/en.json fr,et,nl

This free version will let you batch-translate a file until you start beeing rejected by Google's servers. As this script has caching enabled, it's possible to translate files incrementally. New requests will become available in 2 hours aproximately.
