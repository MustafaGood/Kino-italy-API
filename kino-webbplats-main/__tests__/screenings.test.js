const { filterScreeningsWithin5Days } = require('../server');

describe('filterScreeningsWithin5Days', () => {
  const today = new Date();
  const day = 24 * 60 * 60 * 1000; 

  it('returnerar max 10 visningar även om fler finns inom 5 dagar', () => {
    const mockScreenings = [];
    for (let i = 0; i < 15; i++) {
      mockScreenings.push({
        attributes: {
          start_time: new Date(today.getTime() + (i % 5) * day).toISOString(),
          movie: { data: { attributes: { title: `Film ${i + 1}` } } }
        }
      });
    }
    const result = filterScreeningsWithin5Days(mockScreenings);
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
    const result = filterScreeningsWithin5Days(mockScreenings);
    const dates = result.map(s => new Date(s.attributes.start_time));
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i] <= dates[i + 1]).toBe(true);
    }
  });

  it('hanterar visningar som börjar exakt 5 dagar framåt', () => {
    const mockScreenings = [
      {
        attributes: {
          start_time: new Date(today.getTime() + day * 5).toISOString(),
          movie: { data: { attributes: { title: 'Film dag 5' } } }
        }
      }
    ];
    const result = filterScreeningsWithin5Days(mockScreenings);
    expect(result.length).toBe(1);
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
    const result = filterScreeningsWithin5Days(mockScreenings);
    expect(result.length).toBe(0);
  });

  it('returnerar en tom array om inga visningar finns inom 5 dagar', () => {
    const mockScreenings = [
      {
        attributes: {
          start_time: new Date(today.getTime() + day * 10).toISOString(),
          movie: { data: { attributes: { title: 'För sent igen' } } }
        }
      }
    ];
    const result = filterScreeningsWithin5Days(mockScreenings);
    expect(result.length).toBe(0);
  });

  it('hanterar en tom lista av visningar', () => {
    const result = filterScreeningsWithin5Days([]);
    expect(result.length).toBe(0);
  });

  it('returnerar korrekt antal visningar om färre än 10 finns inom 5 dagar', () => {
    const mockScreenings = [];

    for (let i = 0; i < 5; i++) {
      const startTime = new Date();
      startTime.setDate(startTime.getDate() + i);
      startTime.setHours(23, 59, 0, 0); 

      mockScreenings.push({
        attributes: {
          start_time: startTime.toISOString(),
          movie: {
            data: {
              attributes: {
                title: `Film dag ${i + 1}`,
              },
            },
          },
        },
      });
    }

    const result = filterScreeningsWithin5Days(mockScreenings);
    expect(result.length).toBe(5);
  });
});
