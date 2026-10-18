import { MarkovChainEn } from '../src';
import fs from 'fs';

describe('blah', () => {
  it('tokenizes sentences', async () => {
    const markov = new MarkovChainEn('I like cats. I like dogs');
    const res = await markov.tokenize();

    expect(res).toEqual(['I', 'like', 'cats', '.', 'I', 'like', 'dogs', '.']);
  });

  it('works', async () => {
    const text = fs.readFileSync(__dirname + '/en.txt', 'utf8');
    const markov = new MarkovChainEn(text);
    expect(markov.text).toBe(text);
    const res = await markov.generate(10);

    console.log(res);

    expect(res.split(' . ').length).toBe(10);
  });
});
