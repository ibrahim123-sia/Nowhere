import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import AgentWidget from "../Agent/AgentWidget";

const UserLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <AgentWidget />
    </>
  );
};

export default UserLayout;
