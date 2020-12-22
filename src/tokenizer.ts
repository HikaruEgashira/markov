import kuromoji, { Tokenizer, IpadicFeatures } from 'kuromoji';

const builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict',
});

export const tokenizer = async () =>
  await new Promise<Tokenizer<IpadicFeatures>>(done => {
    builder.build((_err, tokenizer) => {
      done(tokenizer);
    });
  });
