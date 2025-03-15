// "use client";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import React, { Children } from "react";

const Provider = ({session, children} : SessionProviderProps) => {
  return (
    <SessionProvider session = {session}>
      {children}
    </SessionProvider>
    

  );
};

export default Provider;
