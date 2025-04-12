## Week 1

### Day 2 (April 11)

- ✅ Initialized backend with `npm init`
- ✅ Installed key libraries: `express`, `jest`, `supertest`, `nodemon`
- ✅ Set up folder structure (`src/index.js`, `app.test.js`)
- ✅ Wrote my first test (TDD style) for a `/ping` route
- ❌ Haven’t written the actual route yet — following TDD
- 💡 Learned about:
  - Why we write tests first in TDD
  - `supertest` simulates HTTP requests in tests
  - `jest` auto detects test files and runs them
- 📎 Resources:
  - [Jest Docs](https://jestjs.io/docs/getting-started)
  - [Supertest Docs](https://github.com/visionmedia/supertest)

### Day 2 (continued)

- ✅ Implemented `/ping` route in `index.js`
- ✅ Ran tests again and test passed
- 💡 Learned:
  - In TDD, tests fail first by design, then you add just enough code to pass
  - The test file used its own instance of `express()` for now — next step is to separate the app from the server

### Day 3 (April 11)

- ✅ Wrote first real test for POST /users using TDD
- ✅ Prisma connected to PostgreSQL (via Docker)
- ✅ Implemented only enough code to pass the test
- 💡 Learned:
  - How to write integration tests with Supertest + Prisma
  - How Prisma makes DB interaction easy and type-safe
  - The TDD cycle: Red → Green → Refactor

### Day 4 (April 11)

- ✅ Wrote and passed test for `GET /users`
- ✅ Implemented the route using Prisma's `findMany()`
- 💡 Learned:
  - How to test lists of objects using `toMatchObject()`
  - How Prisma queries multiple records from PostgreSQL
  - How to grow routes incrementally while keeping tests tight

### Day 5 (April 12)

- ✅ Added `GET /users/:id` route + tests
- ✅ Handled 404 logic with `findUnique()`
- 💡 Learned:
  - How to use Prisma’s `findUnique()` for single record lookup
  - How to test error handling with status codes and messages
  - Returning early with `if (!user)` is a clean way to fail fast
