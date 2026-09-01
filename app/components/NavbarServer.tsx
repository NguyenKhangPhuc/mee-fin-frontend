import React from "react";
import { getUser } from "@/app/services/auth/user";
import NavBar from "./Navbar";
import NavbarMobile from "./NavbarMobile";

const NavbarServer = async () => {
  const { data: user } = await getUser();
  return (
    <>
      <div className="xl:block hidden">
        <NavBar initialUser={user} />
      </div>
      <div className="xl:hidden block">
        <NavbarMobile initialUser={user} />
      </div>
    </>
  );
};

export default NavbarServer;
