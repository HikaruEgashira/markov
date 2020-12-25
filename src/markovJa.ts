import { tokenizer as kuromojiTokenizer } from './tokenizer';
import { MarkovChainEntity } from './markovEntity';

export class MarkovChainJa extends MarkovChainEntity {
  constructor(text: string) {
    super(text);
    this.endWord = '。';
    this.gapWords = '';
  }

  async tokenize() {
    const tokenizer = await kuromojiTokenizer();
    const words = tokenizer
      .tokenize(this.text)
      .map(word => word.surface_form.replace(/\s*/, ''));
    return words;
  }
}
