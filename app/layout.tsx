import React, { ReactNode } from "react";
import "@/styles/globals.css";
import Providers from "./providers";
import { Metadata } from "next";
import PoweredByLogo from "@/modules/ui/PoweredByLogo";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "AutoYield",
    template: "%s | App Name",
  },
};

interface Props {
  children?: ReactNode;
}

const RootLayout = async (props: Props) => {
  const { children } = props;

  return (
    <html lang="en">
      <body className="dark">
        <Providers>
          <ThemeProvider
          attribute={"class"}
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <PoweredByLogo />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
