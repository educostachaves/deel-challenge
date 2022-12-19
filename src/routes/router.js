const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { getProfile } = require('../middleware/getProfile');
const { getUserContracts, getContractById } = require('../services/contracts');
const { getUnpaidJobs, payJob } = require('../services/jobs');
const { insertCash } = require('../services/balances');
const { getBestClients, getBestProfession } = require('../services/admin');

const router = new Router();

router.get('/contracts/:id', getProfile, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.profile.id;
  const result = await getContractById(id, userId);
  res.json(result);
}));

router.get('/contracts', getProfile, asyncHandler(async (req, res) => {
  const userId = req.profile.id;
  const result = await getUserContracts(userId);
  res.json(result);
}));

router.get('/jobs/unpaid', getProfile, asyncHandler(async (req, res) => {
  const userId = req.profile.id;
  const result = await getUnpaidJobs(userId);
  res.json(result);
}));

router.post('/jobs/:id/pay', getProfile, asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const clientId = req.profile.id;
  const result = await payJob(jobId, clientId);
  res.json(result);
}));

router.post('/balances/deposit/:userId', asyncHandler(async (req, res) => {
  const clientId = req.params.userId;
  const { amount } = req.body;
  const result = await insertCash(clientId, amount);
  res.json(result);
}));

router.get('/admin/best-profession', asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  const result = await getBestProfession(start, end);
  res.json(result);
}));

router.get('/admin/best-clients', asyncHandler(async (req, res) => {
  const { start, end, limit } = req.query;
  const bestClients = await getBestClients(start, end, limit);
  res.json(bestClients);
}));

module.exports = router;
