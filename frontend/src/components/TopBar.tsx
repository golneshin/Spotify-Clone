import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import { buttonVariants } from "./ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import SigninOAuthButtons from "./SigninOAuthButtons";

const TopBar = () => {
  const { isAdmin } = useAuthStore();
  console.log(isAdmin);

  return (
    <div className="flex items-center justify-between p-4 top-0 sticky bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex items-center gap-2">
        <img src="spotify.png" alt="Spotify" className="size-8" />
        Spotify
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <LayoutDashboardIcon className="size-4 mr-2" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SigninOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
};

export default TopBar;
