import { Database, Repository } from '@nocobase/database';
import { MockServer, createMockServer } from '@nocobase/test';

describe('actions', () => {
  let app: MockServer;
  let db: Database;
  let repo: Repository;
  let agent: any;

  beforeAll(async () => {
    app = await createMockServer({
      plugins: ['acl', 'users', 'data-source-manager'],
    });
    db = app.db;
    repo = db.getRepository('users');
    agent = app.agent();
  });

  afterAll(async () => {
    await app.destroy();
  });

  it('should list users exclude role', async () => {
    const res = await agent.resource('users').listExcludeRole({
      roleName: ['admin'],
    });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it('should list users exclude role with filter', async () => {
    let res = await agent.resource('users').listExcludeRole({
      roleName: ['test'],
    });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);

    res = await agent.resource('users').listExcludeRole({
      roleName: ['test'],
      filter: {
        id: 1,
      },
    });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);

    res = await agent.resource('users').listExcludeRole({
      roleName: ['test'],
      filter: {
        id: 2,
      },
    });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });
});
