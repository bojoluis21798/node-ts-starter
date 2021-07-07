import app from '../../app';
import supertest from 'supertest';
import { expect } from 'chai';
import shortid from 'shortid';
import mongoose from 'mongoose';

let firstUserIdtest = '';
const firstUserBody = {
  email: `marcos.henrique+${shortid.generate()}@toptal.com`,
  password: 'Sup3rSecret!23'
};

let accessToken = '';

describe('users and auth endpoints', () => {
  let request: supertest.SuperAgentTest;

  before(() => {
    request = supertest.agent(app);
  });

  it('should allow a POST to /users', async () => {
    const res = await request.post('/users').send(firstUserBody);

    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.a('string');
    firstUserIdtest = res.body.id;
  });

  it('should allow a POST to /auth', async () => {
    const res = await request.post('/auth').send(firstUserBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.accessToken).to.be.a('string');
    accessToken = res.body.accessToken;
  });

  it('should allow a GET from /users/:userId with an access token', async () => {
    const res = await request
      .get(`/users/${firstUserIdtest}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();

    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body._id).to.be.a('string');
    expect(res.body._id).to.equal(firstUserIdtest);
    expect(res.body.email).to.equal(firstUserBody.email);
  });

  describe('with a valid access token', () => {
    it('should allow a GET from /users', async () => {
      const res = await request
        .get('/users')
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();

      expect(res.status).to.equal(403);
    });
  });

  after((done) => {
    app.close(() => {
      mongoose.connection.close(done);
    });
  });
});
