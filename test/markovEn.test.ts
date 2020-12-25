import { MarkovChainEn } from '../src';
import fs from 'fs';

describe('blah', () => {
  it('works', async () => {
    const text = fs.readFileSync(__dirname + '/en.txt', 'utf8');
    const markov = new MarkovChainEn(text);
    expect(markov.text).toBe(text);
    const res = await markov.generate(10);

    console.log(res);

    expect(res.split(' . ').length).toBe(10);
  });
});
