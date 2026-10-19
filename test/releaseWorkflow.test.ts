import fs from 'fs';

const workflow = fs.readFileSync(
  __dirname + '/../.github/workflows/release.yml',
  'utf8'
);
const script = fs.readFileSync(
  __dirname + '/../.github/workflows/release.sh',
  'utf8'
);

describe('automatic release', () => {
  it('no longer depends on deprecated actions', () => {
    expect(workflow).not.toMatch(/actions\/cache@v[12]\b/);
    expect(workflow).not.toMatch(/actions\/setup-node@v[1-3]\b/);
    expect(workflow).not.toMatch(/actions\/checkout@v[1-3]\b/);
  });

  it('asks for the permission required to create release tags', () => {
    expect(workflow).toMatch(/^permissions:\s*$/m);
    expect(workflow).toMatch(/^\s+contents:\s*write\s*$/m);
  });

  it('serializes release runs', () => {
    expect(workflow).toMatch(/^concurrency:\s*$/m);
  });

  it('reuses an existing tag before creating it', () => {
    expect(script).toMatch(/git\/ref\/tags\/\$\{TAG\}/);
    expect(script).toMatch(/already exists/);
  });
});
