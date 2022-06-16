# TicketSysPlus
This project allows you to access your development team's Azure Devops Boards in a user-friendly way through React and Express.js.

## Prerequisites

* npm version >=7.0.0
* node version >=16.0.0

## Installation

### Configure the .env files for both projects

Before you try running the project, make sure you have .env files set up for both the `frontend` and `backend` projects.

`backend`'s .env file:
* `MASTER_ADMIN_EMAIL` - the email that will never lose admin privileges.
* `MONGODB_PORT` - the port to the MongoDB instance. It is assumed that the database is hosted on the same machine as the backend.

`frontend`'s .env file:
* `REACT_APP_BACKEND_URL` - the url to wherever the backend is hosted.
* `REACT_APP_DEVOPS_ORGANIZATION_URL` - the url to the azure devops organization
* `REACT_APP_CLIENT_ID` - the Application Client ID taken from the registered application through the [Azure Portal](https://go.microsoft.com/fwlink/?linkid=2083908)
* `REACT_APP_REDIRECT_URI` - the Redirect URI taken from the registered application through the [Azure Portal](https://go.microsoft.com/fwlink/?linkid=2083908)

## Quick Start

```sh
$ npm install
$ npm start
```

`npm install` - Installs packages for both `frontend` and `backend` directories
`npm start` - Runs both applications in development mode
