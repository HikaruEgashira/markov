import kuromoji, { Tokenizer, IpadicFeatures } from 'kuromoji';

export default async () => {
  const builder = kuromoji.builder({
    dicPath: 'node_modules/kuromoji/dict',
  });

  const tokenizer = await new Promise<Tokenizer<IpadicFeatures>>(done => {
    builder.build((_err, tokenizer) => {
      done(tokenizer);
    });
  });

  return tokenizer;
};
