const { seed } = require('../../scripts/seedDb');
const service = require('./balances');

describe('Balances', () => {
  beforeAll(async () => {
    await seed();
  });

  describe('when insertCash is called', () => {
    it('should receive an amount and it is more then deposit value', async () => {
      try {
        const clientId = 1;
        const amount = 123.12;
        await service.insertCash(clientId, amount);
      } catch (err) {
        expect(err.message).toBe('Deposit exceeds threshold');
        expect(err.statusCode).toBe(404);
      }
    });

    it('should throw an error if the client does not exist', async () => {
      try {
        const clientId = 6;
        const amount = 10;
        await service.insertCash(clientId, amount);
      } catch (err) {
        expect(err.message).toBe('Client not found');
        expect(err.statusCode).toBe(404);
      }
    });

    it('should receive an amount and persist', async () => {
      const clientId = 2;
      const amount = 10;
      const result = await service.insertCash(clientId, amount);

      console.log(result);

      expect(result.id).toBe(2);
      expect(result.firstName).toBe('Mr');
      expect(result.lastName).toBe('Robot');
      expect(result.profession).toBe('Hacker');
    });
  });
});
