import kuromoji from 'kuromoji';
import { tokenizer } from './tokenizer';

type dictionary = any;

export class MarkovChain {
  text: string;
  output: string;
  dictionary: dictionary;

  constructor(text: string) {
    this.text = text;
    this.output = '';
    this.dictionary = {};
  }

  async parse(sentence: number) {
    const items = (await tokenizer).tokenize(this.text);
    this.dictionary = this.makeDic(items);
    this.output = this.makeSentence(sentence);
    return this.output;
  }

  private makeDic(items: kuromoji.IpadicFeatures[]) {
    let tmp = ['@'];
    let dic: any = {};
    items
      .map(item => item.surface_form.replace(/\s*/, ''))
      .forEach(word => {
        if (word === '' || word === 'EOS') return;
        tmp.push(word);
        if (tmp.length < 3) return;
        if (tmp.length > 3) tmp.splice(0, 1);

        let w1 = tmp[0];
        let w2 = tmp[1];
        let w3 = tmp[2];
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
    for (var i = 0; i < sentence; i++) {
      const top = dic['@'];
      if (!top) continue;
      let w1 = this.choiceWord(top);
      let w2 = this.choiceWord(top[w1]);
      ret.push(w1);
      ret.push(w2);
      for (;;) {
        if (!dic[w1]) {
          break;
        }
        let w3 = this.choiceWord(dic[w1][w2]);
        ret.push(w3);
        if (w3 === '。') break;
        w1 = w2;
        w2 = w3;
      }
    }
    return ret.join('');
  }

  private choiceWord(obj: object) {
    var ks = this.objKeys(obj);
    var i = this.rnd(ks.length);
    return ks[i];
  }
  private objKeys(obj: object) {
    var r = [];
    for (var i in obj) {
      r.push(i);
    }
    return r;
  }
  private rnd(num: number) {
    return Math.floor(Math.random() * num);
  }
}
