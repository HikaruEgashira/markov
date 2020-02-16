import tokenizer from '../src/util/tokenizer';

describe('blah', () => {
  it('works', async () => {
    const form = (await tokenizer())
      .tokenize('すもももももももものうち')
      .map(t => t.surface_form);
    expect(form).toEqual(['すもも', 'も', 'もも', 'も', 'もも', 'の', 'うち']);
  });
});
