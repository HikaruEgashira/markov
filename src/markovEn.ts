import { MarkovChainEntity } from './markovEntity';

export class MarkovChainEn extends MarkovChainEntity {
  constructor(text: string) {
    super(text);
    this.endWord = '.';
    this.gapWords = ' ';
  }

  async tokenize() {
    const words = this.text
      .split('. ')
      .reduce<string[]>((acc, word) => acc.concat(word.split(' '), '.'), []);
    return words;
  }
}
