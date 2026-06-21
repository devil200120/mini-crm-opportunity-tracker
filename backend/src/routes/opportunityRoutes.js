const express = require('express');
const router = express.Router();
const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  addOpportunityActivity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOpportunity)
  .get(protect, getOpportunities);

router.route('/:id')
  .get(protect, getOpportunityById)
  .put(protect, updateOpportunity)
  .delete(protect, deleteOpportunity);

router.route('/:id/activities')
  .post(protect, addOpportunityActivity);

module.exports = router;
