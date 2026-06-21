const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');

const timestamp = Date.now();
const emailA = `jest_opp_a_${timestamp}@test.com`;
const emailB = `jest_opp_b_${timestamp}@test.com`;

let tokenA, tokenB;
let userAId, userBId;
let opportunityId;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  // Create two users
  const userA = await User.create({
    name: 'Jest Opp User A',
    email: emailA,
    password: 'password123',
  });
  userAId = userA._id;

  const userB = await User.create({
    name: 'Jest Opp User B',
    email: emailB,
    password: 'password123',
  });
  userBId = userB._id;

  // Log both in to acquire tokens
  const loginA = await request(app)
    .post('/api/auth/login')
    .send({ email: emailA, password: 'password123' });
  tokenA = loginA.body.token;

  const loginB = await request(app)
    .post('/api/auth/login')
    .send({ email: emailB, password: 'password123' });
  tokenB = loginB.body.token;
});

afterAll(async () => {
  // Clean up users and opportunities
  await Opportunity.deleteMany({ owner: { $in: [userAId, userBId] } });
  await User.deleteMany({ email: { $in: [emailA, emailB] } });
  await mongoose.connection.close();
});

describe('Opportunity API Endpoint Tests', () => {
  it('should prevent opportunity creation for unauthenticated requests', async () => {
    const res = await request(app)
      .post('/api/opportunities')
      .send({
        customerName: 'Acme Corp',
        requirement: 'Vite app migration',
      });

    expect(res.statusCode).toEqual(401);
  });

  it('should create a new opportunity for authenticated user A', async () => {
    const res = await request(app)
      .post('/api/opportunities')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        customerName: 'Acme Corp',
        requirement: 'Vite app migration',
        estimatedValue: 4000,
        priority: 'High',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.customerName).toEqual('Acme Corp');
    expect(res.body.owner._id.toString()).toEqual(userAId.toString());
    opportunityId = res.body._id;
  });

  it('should allow user B to view the shared opportunities pipeline', async () => {
    const res = await request(app)
      .get('/api/opportunities')
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should prevent User B from updating User A\'s opportunity', async () => {
    const res = await request(app)
      .put(`/api/opportunities/${opportunityId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        stage: 'Qualified',
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toMatch(/ownership required/i);
  });

  it('should allow User A to update their own opportunity', async () => {
    const res = await request(app)
      .put(`/api/opportunities/${opportunityId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        stage: 'Proposal Sent',
        notes: 'Sent PDF invoice draft.',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.stage).toEqual('Proposal Sent');
    expect(res.body.notes).toEqual('Sent PDF invoice draft.');
  });

  it('should prevent User B from deleting User A\'s opportunity', async () => {
    const res = await request(app)
      .delete(`/api/opportunities/${opportunityId}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toMatch(/ownership required/i);
  });

  it('should allow User A to delete their own opportunity', async () => {
    const res = await request(app)
      .delete(`/api/opportunities/${opportunityId}`)
      .set('Authorization', `Bearer ${tokenA}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toMatch(/removed/i);
  });
});
