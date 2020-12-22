import { tokenizer } from '../src';

describe('形態素解析', () => {
  it('works', async () => {
    const t = await tokenizer();
    const res = t.tokenize('すもももももももものうち').map(t => t.surface_form);
    expect(res).toEqual(['すもも', 'も', 'もも', 'も', 'もも', 'の', 'うち']);
  });
});
