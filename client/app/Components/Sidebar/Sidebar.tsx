import React from "react";
import Profile from "../Profile/Profile";
import RadialChart from "../RadialChart/RadialChart";
import { useUserContext } from "@/context/userContext";

function Sidebar() {
  const { logoutUser } = useUserContext();

  return (
    <div className="w-[20rem] mt-[5rem] h-[calc(100%-5rem)] fixed right-0 top-0 bg-[#f9f9f9] flex flex-col z-50">
      {/* Profile Section */}
      <div className="flex-shrink-0">
        <Profile />
      </div>

      {/* Scrollable content */}
      <div className="flex-grow overflow-y-auto px-4 py-4">
        <RadialChart />
      </div>

      {/* Sign Out Button */}
      <div className="flex-shrink-0 mb-6 px-4">
        <button
          className="w-full py-4 bg-[#EB4E31] text-white rounded-[50px] hover:bg-[#3aafae] transition duration-200 ease-in-out"
          onClick={logoutUser}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
