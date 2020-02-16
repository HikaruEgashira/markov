import { MarkovChain } from '../src';
import fs from 'fs';

describe('blah', () => {
  it('works', async () => {
    const markov = new MarkovChain(
      fs.readFileSync(__dirname + '/sample.txt', 'utf8')
    );
    const res = await markov.parse(5);
    console.log(res);
    expect(res.split('').length).toBeGreaterThan(10);
  });
});
