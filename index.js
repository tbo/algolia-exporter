#!/usr/bin/env node
const fs = require('fs');
const algoliasearch = require('algoliasearch');
const handleError = err => err && console.error(err.message || err);
const argv = require('yargs')
      .usage('Usage: $0 [options] <api-key> <index>')
      .demand(2)
      .help('h')
      .alias('o', 'output')
      .alias('h', 'help')
      .describe('o', 'Write output to file instead of stdout')
      .string('o')
      .argv;

const [apiKey, indexName] = argv._;
const filename = argv.f;
const client = algoliasearch('EFOUNBQIFQ', apiKey);
const index = client.initIndex(indexName);
const browser = index.browseAll();
let hits = [];

browser.on('result', content => hits = hits.concat(content.hits));

browser.on('end', () => {
  const output = JSON.stringify(hits);
  if (filename) {
    fs.writeFile(filename, output, handleError)
  } else {
    process.stdout.write(output);
  }
});

browser.on('error', handleError);
