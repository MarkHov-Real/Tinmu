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

### Day 3 (April 12)

- ✅ Wrote first real test for POST /users using TDD
- ✅ Prisma connected to PostgreSQL (via Docker)
- ✅ Implemented only enough code to pass the test
- 💡 Learned:
  - How to write integration tests with Supertest + Prisma
  - How Prisma makes DB interaction easy and type-safe
  - The TDD cycle: Red → Green → Refactor
