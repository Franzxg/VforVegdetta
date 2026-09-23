import { isValidEmail } from '../src/utils/validation';

describe('isValidEmail', () => {
  it('accetta indirizzi ben formati', () => {
    expect(isValidEmail('mario@example.com')).toBe(true);
    expect(isValidEmail(' giulia.bianchi@mail.it ')).toBe(true);
  });

  it('rifiuta indirizzi malformati', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('mario')).toBe(false);
    expect(isValidEmail('mario@example')).toBe(false);
    expect(isValidEmail('mario rossi@example.com')).toBe(false);
  });
});
