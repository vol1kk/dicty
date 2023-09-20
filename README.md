# Dictionary App
A highly customizable dictionary app. Deployed on [Vercel](https://dicty-vol1kk.vercel.app/), yet keep in mind Vercel works pretty slowly

## Tech Stack
- [T3 Stack](https://create.t3.gg/)
  - [Next.js](https://nextjs.org)
  - [NextAuth.js](https://next-auth.js.org)
  - [Tailwind CSS](https://tailwindcss.com)
  - [Prisma](https://prisma.io)
  - [tRPC](https://trpc.io)

- [Formik](https://formik.org/)
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)

## Deployment
If you don't need `Authentication` and okay with storing words in `Local Storage`, then you should skip whole `Create Discord Application` step

- Rename `.env.example` to `.env`
- `pnpm install`
  - Install [pnpm](https://pnpm.io/installation#using-npm), if it's not installed
- [Create Discord Application](https://discord.com/developers/applications) & go to `OAuth2` tab
  - Add `http://localhost:3000/api/auth/callback/discord` to `Redirects`
  - Set `DISCORD_CLIENT_ID` in `.env` to `Client ID`
  - Set `DISCORD_CLIENT_SECRET` in `.env` to `Client Secret`
  - Set `NEXTAUTH_SECRET` in `.env` to any string, **yet check comment in** `.env`
  - Set `MONGODB_URI` in `env` to `mongodb://localhost:27017/dicty`
    - Install [MongoDB](https://mongodb.com/try/download/community), if it's not installed
  - Set `NEXT_PUBLIC_AUTH_ENABLED` in `.env` to `true`
- `pnpm run dev`
