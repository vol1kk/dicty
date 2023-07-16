import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { type NextApiRequest } from "next";

type CreateContextOptions = {
  session: Session | null;
};

/**
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (
  opts: CreateContextOptions & { req: NextApiRequest },
) => {
  return {
    session: opts.session,
    req: opts.req,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    req,
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  const accessToken = ctx.req.headers.authorization?.split(" ")[1];
  if (!accessToken) throw new TRPCError({ code: "UNAUTHORIZED" });

  const currentUser = await ctx.prisma.account.findFirst({
    where: { access_token: accessToken },
  });

  if (!currentUser) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      authedUser: { id: currentUser.userId },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
