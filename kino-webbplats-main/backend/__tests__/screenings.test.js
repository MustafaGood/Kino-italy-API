const { filterScreeningsWithinDays } = require('../server');

describe('filterScreeningsWithinDays', () => {
  const today = new Date();
  const day = 24 * 60 * 60 * 1000;

  it('returnerar max 10 visningar även om fler finns inom X antal dagar', () => {
    const mockScreenings = [];
    const days = 5;
    for (let i = 0; i < 15; i++) {
      mockScreenings.push({
        attributes: {
          start_time: new Date(today.getTime() + (i % days) * day).toISOString(),
          movie: { data: { attributes: { title: `Film ${i + 1}` } } }
        }
      });
    }
    const result = filterScreeningsWithinDays(mockScreenings, );
    expect(result.length).toBe(10);
  });

  it('returnerar visningar i kronologisk ordning', () => {
    const mockScreenings = [
      {
        attributes: {
          start_time: new Date(today.getTime() + day * 3).toISOString(),
          movie: { data: { attributes: { title: 'Dag 4' } } }
        }
      },
      {
        attributes: {
          start_time: new Date(today.getTime()).toISOString(),
          movie: { data: { attributes: { title: 'Dag 1' } } }
        }
      }
    ];
    const days = 5;
    const result = filterScreeningsWithinDays(mockScreenings, days);
    const dates = result.map(s => new Date(s.attributes.start_time));
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i] <= dates[i + 1]).toBe(true);
    }
  });

  it('ignorerar visningar som börjar efter 5 dagar', () => {
    const mockScreenings = [
      {
        attributes: {
          start_time: new Date(today.getTime() + day * 6).toISOString(),
          movie: { data: { attributes: { title: 'För sen' } } }
        }
      }
    ];
    const days = 5;
    const result = filterScreeningsWithinDays(mockScreenings, 5);
    expect(result.length).toBe(0);
  });

  it('hanterar en tom lista av visningar', () => {
    const result = filterScreeningsWithinDays([], 0);
    expect(result.length).toBe(0);
  });
});
