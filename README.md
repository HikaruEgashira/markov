# 日本語対応マルコフ連鎖ライブラリ

```typescript
const text = fs.readFileSync(__dirname + '/sample.txt', 'utf8');
const markov = new MarkovChain(text);
expect(markov.text).toBe(text);
const res = await markov.generate(10);
console.log(res); // 生成された文章が出力されます。
```
