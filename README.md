# Welcome to Lima Ticketing

## What is it

Lima ticketing system is a gamified AI powered ticketing system. Differently from other ticketing systems like ZenDesk, it is very fast, it leverages on the use of keyboard shortcuts and AI text generation.

Its value is in simplicity and speed.

What does it mean simplicity and speed in the world of ticketing systems?
Here is an example:

- Lima receives a query from a user
- you press Enter to select the query
- you press Tab to generate an answer with the AI model (previously trained)
- you press Enter to send
- Lima labels it and archives it

Three key strokes to read a query, generate an answer, review it, respond and archive.
This is quick!

## Development

Lima ticketing is developed on Remix + Vite + Tailwind + Shadcn and deployed with SST.DEV.

Run the Vite dev server:

```shellscript
bun run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.
