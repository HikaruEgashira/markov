import { tokenizer } from '../src';

describe('形態素解析', () => {
  it('works', async () => {
    const res = (await tokenizer)
      .tokenize('すもももももももものうち')
      .map(t => t.surface_form);
    expect(res).toEqual(['すもも', 'も', 'もも', 'も', 'もも', 'の', 'うち']);
  });
});
