import { MarkovChain } from '../src';
import fs from 'fs';

describe('blah', () => {
  it('works', async () => {
    const text = fs.readFileSync(__dirname + '/sample.txt', 'utf8');
    const markov = new MarkovChain(text);
    expect(markov.text).toBe(text);
    const res = await markov.generate(10);

    console.log(res);

    expect(markov.dictionary['@']).toMatchObject({});
    expect(res.split('。').length - 1).toBe(10);
  });
});
