const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please add a customer or company name'],
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    requirement: {
      type: String,
      required: [true, 'Please add a short summary of requirements'],
      trim: true,
    },
    estimatedValue: {
      type: Number,
      min: [0, 'Estimated deal value cannot be negative'],
      default: 0,
    },
    stage: {
      type: String,
      required: true,
      enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
      default: 'New',
    },
    priority: {
      type: String,
      required: true,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    nextFollowUpDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    activityHistory: [
      {
        note: {
          type: String,
          required: [true, 'Please add an activity message'],
          trim: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Opportunity', OpportunitySchema);
