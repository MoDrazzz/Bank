# The Bank

The Bank is the most complex React Application I have ever created yet. I develop it in my free time, learning how to solve problems and work with logic-advanced project.

## Challenge

- Build a bank application with simple UI
- Create basic mock of authentication
- Allow users to transfer money between their accounts

But... that was only a starting point. After finishing it I decided to keep developing it.

## Outcome - List of features

- User / Admin authentication
- User dashboard with informations like balance and account number
  - Operations history:
    - Filtering by title
    - Opening modal on operation click
  - Transfers:
    - Title and amount of a transfer
    - Money is transferred via receiver's account number
  - Cards:
    - All user's cards displayed
    - Card requesting (verified by an admin)
- Admin dashboard
  - Operations history [TBA]
    - All users operations listed
    - Advanced filtering
    - Opening modal on operation click
    - Canceling operation
  - Allowing / Denying card requests
  - Adding new user
    - All data generated automatically

## How does it work?

I have decided to use [json-server][json-server] to simplify database as much as possible. In future development, I plan to migrate it to an external service.
Everything you need is in `db.json` file. It keeps all the users, transfers, and cards data. Don't miss admin dashboard! Credentials are also kept in the same file, but to login as an administrator you have to check `admin` route (http://localhost:5173/admin).

### Assumptions

**Card Requesting**
User calls to the bank and asks for request verification. Admin can confirm his request.

### Local version - Database initialization

```sh
npx json-server --watch db.json
```

You have now working database at http://localhost:3000!

### Local version - Installation

```sh
npm i
npm run dev
```

You can now open the project at http://localhost:5173!

## License

GNU GENERAL PUBLIC LICENSE

[json-server]: https://www.npmjs.com/package/json-server
