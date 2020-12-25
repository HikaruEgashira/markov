type Dictionary = {
  [w1: string]: {
    [w2: string]: {
      [w3: string]: number;
    };
  };
};

export abstract class MarkovChainEntity {
  text: string;
  endWord!: string;
  gapWords!: string;
  private tokenizedText?: string[];
  private dictionary?: Dictionary;

  constructor(text: string) {
    this.text = text;
  }

  /**
   * 文章を生成する
   * @param sentence number of sentence
   */
  public async generate(sentence: number) {
    if (this.tokenizedText === undefined) {
      this.tokenizedText = await this.tokenize();
    }
    if (this.dictionary === undefined) {
      this.dictionary = this.makeDic();
    }
    return this.makeSentence(sentence);
  }

  /**
   * 辞書の生成
   */
  abstract tokenize(): Promise<string[]>;

  private makeDic(): Dictionary {
    let tmp = ['@'];
    let dic: Dictionary = {};

    if (this.tokenizedText === undefined) {
      throw new Error('not tokenized');
    }

    this.tokenizedText.forEach(word => {
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

      if (word === this.endWord) {
        tmp = ['@'];
        return;
      }
    });

    return dic;
  }

  private makeSentence(sentence: number) {
    if (this.tokenizedText === undefined) {
      throw new Error('not tokenized');
    }
    if (this.dictionary === undefined) {
      throw new Error('not dictionaried');
    }

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
        if (w3 === this.endWord) break;
        w1 = w2;
        w2 = w3;
      }
    }

    return ret.join(this.gapWords);
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
    if (obj === undefined) {
      return this.endWord;
    }

    const keys = Object.keys(obj);
    const index = this.rnd(keys.length);
    return keys[index];
  }

  private rnd(num: number) {
    return Math.floor(Math.random() * num);
  }
}
