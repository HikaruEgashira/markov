import { MarkovChainJa } from '../src';
import fs from 'fs';

describe('blah', () => {
  it('works', async () => {
    const text = fs.readFileSync(__dirname + '/ja.txt', 'utf8');
    const markov = new MarkovChainJa(text);
    expect(markov.text).toBe(text);
    const res = await markov.generate(10);

    console.log(res);

    expect(res.split('。').length - 1).toBe(10);
  });
});
