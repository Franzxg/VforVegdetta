import { flagIngredients, getVeganStatus } from '../src/utils/veganVerdict';

describe('getVeganStatus', () => {
  it('mappa i tag di Open Food Facts nel verdetto', () => {
    expect(getVeganStatus(['en:palm-oil-free', 'en:vegan'])).toBe('vegan');
    expect(getVeganStatus(['en:non-vegan', 'en:vegetarian'])).toBe('non_vegan');
    expect(getVeganStatus(['en:maybe-vegan'])).toBe('maybe');
    expect(getVeganStatus(['en:vegan-status-unknown'])).toBe('unknown');
    expect(getVeganStatus(undefined)).toBe('unknown');
    expect(getVeganStatus([])).toBe('unknown');
  });

  it('con tag contraddittori sceglie il verdetto più prudente', () => {
    expect(getVeganStatus(['en:vegan', 'en:non-vegan'])).toBe('non_vegan');
    expect(getVeganStatus(['en:vegan', 'en:maybe-vegan'])).toBe('maybe');
  });
});

describe('flagIngredients', () => {
  // Estratto reale della risposta OFF per 3017620422003
  const ingredients = [
    { id: 'en:sugar', text: 'Sucre', vegan: 'maybe' },
    {
      id: 'en:skimmed-milk-powder',
      text: 'LAIT écrémé en poudre',
      vegan: 'no',
    },
    { id: 'en:whey-powder', text: 'LACTOSERUM en poudre', vegan: 'no' },
    {
      id: 'en:e322',
      text: 'lécithines',
      vegan: 'maybe',
      ingredients: [
        { id: 'en:soya-lecithin', text: 'lécithines de SOJA', vegan: 'yes' },
      ],
    },
  ];

  it('usa ingredients_analysis per evidenziare le cause del verdetto', () => {
    const result = flagIngredients(ingredients, {
      'en:non-vegan': ['en:skimmed-milk-powder', 'en:whey-powder'],
      'en:palm-oil': ['en:palm-oil'],
    });
    expect(result.map(i => [i.id, i.flag])).toEqual([
      ['en:sugar', 'none'],
      ['en:skimmed-milk-powder', 'non_vegan'],
      ['en:whey-powder', 'non_vegan'],
      ['en:e322', 'none'],
    ]);
  });

  it('marca il genitore se il sotto-ingrediente è segnalato', () => {
    const result = flagIngredients(
      [
        {
          id: 'en:flavouring',
          text: 'aroma',
          ingredients: [{ id: 'en:honey', text: 'miele' }],
        },
      ],
      { 'en:non-vegan': ['en:honey'] },
    );
    expect(result[0].flag).toBe('non_vegan');
  });

  it('senza ingredients_analysis ricade sul campo vegan', () => {
    const result = flagIngredients(ingredients, undefined);
    expect(result.map(i => i.flag)).toEqual([
      'maybe',
      'non_vegan',
      'non_vegan',
      'maybe',
    ]);
  });

  it('gestisce ingredienti assenti', () => {
    expect(flagIngredients(undefined, undefined)).toEqual([]);
  });
});
