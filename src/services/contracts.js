const { Op } = require('sequelize');
const { Contract } = require('../model');
const ErrorHandler = require('../middleware/errorHandler');

async function getContractById(id, userId) {
  const result = await Contract.findOne({
    where: {
      id,
      [Op.or]: [{ ClientId: userId }, { ContractorId: userId }],
    },
  });

  if(!result) {
    throw new ErrorHandler('Contract Not Found', 404);
  }

  return result;
}

async function getUserContracts(userId) {
  const result = await Contract.findAll({
    where: {
      [Op.or]: [{ ClientId: userId }, { ContractorId: userId }],
      status: { [Op.ne]: 'terminated' },
    },
  });

  if(result.length === 0) {
    throw new ErrorHandler('Contracts Not Found', 404);
  }

  return result;
}

module.exports = {
  getUserContracts,
  getContractById,
};
