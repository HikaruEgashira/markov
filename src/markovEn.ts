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
      .flatMap(word => [...word.split(' '), '.']);
    return words;
  }
}
