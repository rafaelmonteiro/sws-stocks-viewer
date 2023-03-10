# Introduction

SWS application to display companies/stock information.

The API will be running on http://localhost:3000. For the UI, you can simply open `frontend/index.html` in your favourite
browser: `open frontend/index.html`.

## Live Deployment

[Vercel](https://vercel.com) was used to host both frontend and backend apps. They are available in the following URLs:

**Frontend deployment:** https://sws-stocks-viewer.vercel.app

**Backend deployment:** https://sws-stocks-viewer-api.vercel.app

## Backend

Note: integration tests were created to validate the features are working as expected.

### Technology stack

- NestJS
- Jest
- Supertest
- Dependency Injection
- TypeORM

### Local installation

```bash
$ cd backend
$ npm install
```

### Running the app

```bash
# start
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Setup Backend through Docker (optional)

```bash
$ cd backend
$ docker-compose up -d
$ open http://localhost:3000/companies
```

## Frontend

### Technology stack

- VueJS
