const { createReadStream, createWriteStream } = require("fs");
const { Transform } = require("stream");

const inputFile = "input.txt";
const outputFile = "output.txt";
const delimiterRegex = /[\s,]+/;

class SplitWordsStream extends Transform {
  constructor(options) {
    super(options);
    this.buffer = "";
  }

  _transform(chunk, encoding, callback) {
    for (const char of chunk.toString()) {
      if (delimiterRegex.test(char)) {
        if (this.buffer.length > 0) {
          this.push(this.buffer);
          this.buffer = "";
        }
      } else {
        this.buffer += char;
      }
    }
    callback();
  }

  _flush(callback) {
    if (this.buffer.length > 0) {
      this.push(this.buffer);
    }
    callback();
  }
}

class WordCountStream extends Transform {
  constructor(options) {
    super(options);
    this.wordCountMap = new Map();
  }

  _transform(chunk, encoding, callback) {
    const words = chunk
      .toString()
      .trim()
      .split(/[\s,]+/);
    for (const word of words) {
      if (word) {
        this.wordCountMap.set(word, (this.wordCountMap.get(word) || 0) + 1);
      }
    }
    callback();
  }

  _flush(callback) {
    const sortedWords = Array.from(this.wordCountMap.keys()).sort();
    const wordCounts = sortedWords.map((word) => this.wordCountMap.get(word));
    this.push(JSON.stringify(wordCounts));
    callback();
  }
}

const inputStream = createReadStream(inputFile);
const splitWordsStream = new SplitWordsStream();
const wordCountStream = new WordCountStream();
const outputStream = createWriteStream(outputFile);

inputStream
  .pipe(splitWordsStream)
  .pipe(wordCountStream)
  .pipe(outputStream)
  .on("finish", () => console.log(`Result written to ${outputFile}`));
