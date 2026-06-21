const Opportunity = require('../models/Opportunity');

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private
const createOpportunity = async (req, res, next) => {
  try {
    const {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    } = req.body;

    if (!customerName || !requirement) {
      res.status(400);
      throw new Error('Please include at least customerName and requirement');
    }

    const opportunity = await Opportunity.create({
      owner: req.user._id, // Enforced from JWT, do not accept from req.body
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue: estimatedValue || 0,
      stage: stage || 'New',
      priority: priority || 'Medium',
      nextFollowUpDate,
      notes,
    });

    // Populate owner info for returning
    const populatedOpportunity = await Opportunity.findById(opportunity._id).populate(
      'owner',
      'name email'
    );

    res.status(201).json(populatedOpportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all opportunities in the pipeline
// @route   GET /api/opportunities
// @access  Private
const getOpportunities = async (req, res, next) => {
  try {
    const query = {};

    // Apply Search Filter (Company or Requirement)
    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { customerName: searchRegex },
        { requirement: searchRegex }
      ];
    }

    // Apply Stage Filter
    if (req.query.stage && req.query.stage !== 'All') {
      query.stage = req.query.stage;
    }

    // Apply Priority Filter
    if (req.query.priority && req.query.priority !== 'All') {
      query.priority = req.query.priority;
    }

    const populateQuery = [
      { path: 'owner', select: 'name email' },
      { path: 'activityHistory.createdBy', select: 'name email' }
    ];

    // Determine Sort Options
    let sortOptions = { createdAt: -1 };
    if (req.query.sortBy) {
      if (req.query.sortBy === 'value-desc') {
        sortOptions = { estimatedValue: -1 };
      } else if (req.query.sortBy === 'value-asc') {
        sortOptions = { estimatedValue: 1 };
      } else if (req.query.sortBy === 'followup-date') {
        sortOptions = { nextFollowUpDate: 1 };
      } else if (req.query.sortBy === 'priority-high') {
        // Mongoose doesn't support easy weight sorting of string enums directly without aggregate.
        // We will default to newest, and let list handle weight if needed, or simply sort by priority field.
        sortOptions = { priority: 1, createdAt: -1 }; // alphabetical High, Low, Medium
      }
    }

    // If page or limit are explicitly query params, paginate the response
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;

      const total = await Opportunity.countDocuments(query);
      const opportunities = await Opportunity.find(query)
        .populate(populateQuery)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      return res.json({
        opportunities,
        page,
        pages: Math.ceil(total / limit),
        total
      });
    }

    // Shared pipeline: return all opportunities if no paging requested (e.g. Kanban board)
    const opportunities = await Opportunity.find(query)
      .populate(populateQuery)
      .sort(sortOptions);

    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

// @desc    Get opportunity by ID
// @route   GET /api/opportunities/:id
// @access  Private
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      'owner',
      'name email'
    );

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }

    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an opportunity (Owner only)
// @route   PUT /api/opportunities/:id
// @access  Private
const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }

    // Check ownership validation in backend
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this opportunity: ownership required');
    }

    const {
      customerName,
      contactName,
      contactEmail,
      contactPhone,
      requirement,
      estimatedValue,
      stage,
      priority,
      nextFollowUpDate,
      notes,
    } = req.body;

    // Update editable fields
    if (customerName !== undefined) opportunity.customerName = customerName;
    if (contactName !== undefined) opportunity.contactName = contactName;
    if (contactEmail !== undefined) opportunity.contactEmail = contactEmail;
    if (contactPhone !== undefined) opportunity.contactPhone = contactPhone;
    if (requirement !== undefined) opportunity.requirement = requirement;
    if (estimatedValue !== undefined) opportunity.estimatedValue = estimatedValue;
    if (stage !== undefined) opportunity.stage = stage;
    if (priority !== undefined) opportunity.priority = priority;
    if (nextFollowUpDate !== undefined) opportunity.nextFollowUpDate = nextFollowUpDate;
    if (notes !== undefined) opportunity.notes = notes;

    const updatedOpportunity = await opportunity.save();

    const populatedOpportunity = await Opportunity.findById(
      updatedOpportunity._id
    ).populate('owner', 'name email');

    res.json(populatedOpportunity);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an opportunity (Owner only)
// @route   DELETE /api/opportunities/:id
// @access  Private
const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }

    // Check ownership validation in backend
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this opportunity: ownership required');
    }

    await Opportunity.deleteOne({ _id: req.params.id });

    res.json({ message: 'Opportunity removed successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Add activity note to opportunity
// @route   POST /api/opportunities/:id/activities
// @access  Private
const addOpportunityActivity = async (req, res, next) => {
  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      res.status(400);
      throw new Error('Please include an activity message');
    }

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      res.status(404);
      throw new Error('Opportunity not found');
    }

    // Check ownership validation in backend
    if (opportunity.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to add activity notes: ownership required');
    }

    opportunity.activityHistory.push({
      note: note.trim(),
      createdBy: req.user._id,
    });

    const updatedOpportunity = await opportunity.save();

    const populatedOpportunity = await Opportunity.findById(
      updatedOpportunity._id
    )
      .populate('owner', 'name email')
      .populate('activityHistory.createdBy', 'name email');

    res.json(populatedOpportunity);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  addOpportunityActivity,
};
