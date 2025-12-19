"use client";

import React from "react";
import { supabase } from "@/lib/supabase";

export default function GithubAuthButton(): JSX.Element {
  const handleGithubLogin = async () => {
  const redirectTo = `${window.location.origin}/auth`;
  const { error } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo } });
    if (error) console.error("GitHub login error", error.message);
  };

  return (
    <button
      type="button"
      onClick={handleGithubLogin}
      className="w-full border rounded py-2 bg-white hover:bg-gray-50"
    >
      Continue with GitHub
    </button>
  );
}
