import kuromoji from 'kuromoji';
import { tokenizer as kuromojiTokenizer } from './tokenizer';

type Dictionary = {
  [w1: string]: {
    [w2: string]: {
      [w3: string]: number;
    };
  };
};

export class MarkovChain {
  text: string;
  dictionary: Dictionary;

  constructor(text: string) {
    this.text = text;
    this.dictionary = {};
  }

  /**
   * 文章を生成する
   * @param sentence number of sentence
   */
  async generate(sentence: number) {
    const tokenizer = await kuromojiTokenizer();
    const items = tokenizer.tokenize(this.text);
    this.dictionary = this.makeDic(items);
    return this.makeSentence(sentence);
  }

  private makeDic(items: kuromoji.IpadicFeatures[]): Dictionary {
    let tmp = ['@'];
    let dic: Dictionary = {};
    items
      .map(item => item.surface_form.replace(/\s*/, ''))
      .forEach(word => {
        if (word === '' || word === 'EOS') return;
        tmp.push(word);
        if (tmp.length < 3) return;
        if (tmp.length > 3) tmp.splice(0, 1);

        const w1 = tmp[0];
        const w2 = tmp[1];
        const w3 = tmp[2];
        if (dic[w1] === undefined) dic[w1] = {};
        if (dic[w1][w2] === undefined) dic[w1][w2] = {};
        if (dic[w1][w2][w3] === undefined) dic[w1][w2][w3] = 0;
        dic[w1][w2][w3]++;

        if (word === '。') {
          tmp = ['@'];
          return;
        }
      });

    return dic;
  }

  private makeSentence(sentence: number) {
    const dic = this.dictionary;
    const ret = [];

    for (let i = 0; i < sentence; i++) {
      const top = dic['@'];
      let w1 = this.choiceWord(top);
      let w2 = this.choiceWord(top[w1]);
      ret.push(w1);
      ret.push(w2);
      for (;;) {
        let w3 = this.choiceWord(dic[w1][w2]);
        ret.push(w3);
        if (w3 === '。') break;
        w1 = w2;
        w2 = w3;
      }
    }

    return ret.join('');
  }

  /**
   * `obj`のランダムなkeyのvalueを返す
   * @param obj 何かしらのオブジェクト
   * @example ```
   * const obj = { w1: "hello", w2: "world" }
   * expect(choiceWord(obj)).toBe(w1 OR w2)
   * ```
   */
  private choiceWord(obj: object) {
    const keys = Object.keys(obj);
    const index = this.rnd(keys.length);
    return keys[index];
  }

  private rnd(num: number) {
    return Math.floor(Math.random() * num);
  }
}
