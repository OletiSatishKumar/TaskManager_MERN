"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import { github } from "@/utils/Icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function Header() {
  const { user } = useUserContext();
  const { openModalForAdd, activeTasks } = useTasks();
  const router = useRouter();
  const { name } = user;
  const userId = user._id;

  return (
    <header className="px-6 my-4 w-full flex items-center justify-between bg-[#f9f9f9]">
      <div>
        <h1 className="text-lg font-medium">
          <span role="img" aria-label="wave">👋</span>
          {userId ? ` Welcome, ${name}!` : " Welcome to Taskfyer"}
        </h1>
        <p className="text-sm">
          {userId ? (
            <>
              You have{" "}
              <span className="font-bold text-[#3aafae]">{activeTasks.length}</span>
              &nbsp;active tasks
            </>
          ) : (
            "Please login or register to view your tasks"
          )}
        </p>
      </div>

      <div className="h-[50px] flex items-center gap-8">
        <button
          className="px-6 py-2 bg-[#3aafae] text-white rounded-full 
          hover:bg-[#00A1F1] transition-all duration-200 ease-in-out"
          onClick={() => (userId ? openModalForAdd() : router.push("/login"))}
        >
          {userId ? "Add a new Task" : "Login / Register"}
        </button>

        {/* GitHub Icon with Better Alignment & Size */}
        <div className="flex gap-4 items-center">
          <Link
            href="https://github.com/OletiSatish"
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="h-[45px] w-[45px] text-purple-500 rounded-full 
            flex items-center justify-center text-2xl border-2 border-[#E6E6E6]"
          >
            {github}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
