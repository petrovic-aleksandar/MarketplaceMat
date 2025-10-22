import { MonetaryPipe } from './monetary-pipe';

describe('MonetaryPipe', () => {
  it('create an instance', () => {
    const pipe = new MonetaryPipe();
    expect(pipe).toBeTruthy();
  });
});
