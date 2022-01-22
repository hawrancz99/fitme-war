# FITME: Backend

## Requirements

- Node.js v14 (or later)
- Yarn (`npm install --global yarn`)

## Setup ENV Variables

```
cp ./.env ./.env.local
```

All things you need to launch the app:

JWT_SECRET={JWT_SECRET}
DB_HOST={DB_HOST}
DB_NAME={DB_NAME}
DB_USER={DB_USER}
DB_PASSWORD={DB_PASSWORD}
DB_PORT={DB_PORT}
MAIL_FROM={MAIL_FROM}
MAIL_PASSWORD={MAIL_PASSWORD}
REACT_APP_GOOGLE_MAPS_API_KEY={GOOGLE_API_KEY}

## Install Dependencies

```bash
yarn install
```

## `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

## Run Production

```bash
yarn start
```

## Build Production

```bash
yarn build
```

### Build Production and Watch for Changes

```bash
yarn build:watch
```
