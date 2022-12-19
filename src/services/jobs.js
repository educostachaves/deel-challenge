const { Op } = require('sequelize');
const { Contract, Job, Profile, sequelize } = require('../model');
const ErrorHandler = require('../middleware/errorHandler');

async function getUnpaidJobs(userId) {
  return Job.findAll({
    where: { paid: false },
    include: [{
      model: Contract,
      required: true,
      attributes: [],
      where: {
        [Op.or]: [{ ClientId: userId }, { ContractorId: userId }],
        status: 'in_progress',
      },
    }],
  });
}

async function payJob(jobId, clientId) {
  return await sequelize.transaction(async (transaction) => {
    const jobUpdated = await Job.findOne({
      where: { id: jobId },
      include: [
        {
          model: Contract,
          required: true,
          attributes: ['ContractorId'],
          where: {
            ClientId: clientId,
          },
        },
      ]},
      { transaction },
    );

    if (!jobUpdated) {
      throw new ErrorHandler('Job not found', 404);
    }

    if (jobUpdated.paid) {
      throw new ErrorHandler('Job already paid', 404);
    }

    const contractId = jobUpdated.Contract.ContractorId;
    const [client, contractor] = await Promise.all([
      Profile.findByPk(clientId, { transaction }),
      Profile.findByPk(contractId, { transaction }),
    ]);

    if (client.balance < jobUpdated.price) {
      throw new ErrorHandler('No funds for this transaction', 404)
    }

    client.balance = client.balance - jobUpdated.price;
    contractor.balance = contractor.balance + jobUpdated.price;
    jobUpdated.paid = true;
    jobUpdated.paymentDate = new Date().toISOString();

    await Promise.all([
      client.save({ transaction }),
      contractor.save({ transaction }),
      jobUpdated.save({ transaction }),
    ]);

    return jobUpdated;
  });
}

module.exports = {
  getUnpaidJobs,
  payJob,
};
