const { seed } = require('../../scripts/seedDb');
const service = require('./contracts');

describe('Contracts', () => {
  beforeAll(async () => {
    await seed();
  });

  describe('when getContractById is called', () => {
    it('should receive a contract if a contract has been found', async () => {
      const contractId = 1;
      const userId = 1;

      const result = await service.getContractById(contractId, userId);

      expect(result.id).toBe(1);
      expect(result.terms).toBe('bla bla bla');
      expect(result.status).toBe('terminated');
    });

    it('should throw an error if a contract has not been found', async () => {
      try {
        const contractId = 1234;
        const userId = 1;

        await service.getContractById(contractId, userId);
      } catch (err) {
        expect(err.message).toBe('Contract Not Found');
        expect(err.statusCode).toBe(404);
      }
    });
  });

  describe('when getUserContracts is called', () => {
    it('should receive contracts if a user with contracts has been found', async () => {
      const userId = 3;

      const result = await service.getUserContracts(userId);

      expect(result.length).toBe(2);
      expect(result[0].terms).toBe('bla bla bla');
      expect(result[0].status).toBe('new');
    });
  });

  describe('when getUserContracts is called', () => {
    it('should throw an error if a user with contracts has not been found', async () => {
      try {
        const userId = 1;

        await service.getUserContracts(userId);
      } catch (err) {
        expect(err.message).toBe('Contracts Not Found');
        expect(err.statusCode).toBe(404);
      }
    });
  });
});
