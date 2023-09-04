import { type Session } from "next-auth";
import { type AppType } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";

import "~/styles/globals.css";
import { api } from "~/utils/api";
import RootLayout from "~/layouts/RootLayout";
import nextI18nConfig from "../../next-i18next.config.mjs";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextNProgress color="#a445ed" />
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp, nextI18nConfig));
