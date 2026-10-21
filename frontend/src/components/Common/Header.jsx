import React from "react";
import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

// Rendered as siblings (not wrapped) so the navbar can stick to the top
// of the page while the announcement bar scrolls away.
const Header = () => {
  return (
    <>
      <Topbar />
      <Navbar />
    </>
  );
};

export default Header;
