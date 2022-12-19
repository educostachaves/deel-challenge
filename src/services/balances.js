const { Contract, Job, Profile, sequelize } = require('../model');
const ErrorHandler = require('../middleware/errorHandler');

async function getUnpaidJobs(ClientId) {
  return Job.sum('price', {
    where: {
      paid: false,
    },
    include: [{
      model: Contract,
      required: true,
      attributes: [],
      where: {
        status: 'in_progress',
        ClientId,
      }},
    ],
  });
}

async function insertCash(clientId, amount) {
  const result = await sequelize.transaction(async (transaction) => {
    const client = await Profile.findByPk(clientId, { transaction });

    if (!client || client.type !== 'client') {
      throw new ErrorHandler('Client not found', 404);
    }

    const unpaidSum = await getUnpaidJobs(clientId);
    const deposit = Number(unpaidSum) * 0.25;

    if (amount > deposit) {
      throw new ErrorHandler('Deposit exceeds threshold', 404);
    }

    client.balance = parseFloat((client.balance + amount).toFixed(2));
    await client.save({ transaction });

    return client;
  });

  return result;
}

module.exports = {
  insertCash,
};
