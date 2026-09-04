import { useState } from "react";
import HomePage from "./HomePage";
import SignInPage from "./SignInPage";
import RegisterPage from "./RegisterPage";

type Page = "home" | "signin" | "register";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  if (page === "signin") {
    return (
      <SignInPage
        onBack={() => setPage("home")}
        onRegister={() => setPage("register")}
      />
    );
  }

  if (page === "register") {
    return (
      <RegisterPage
        onBack={() => setPage("home")}
        onSignIn={() => setPage("signin")}
      />
    );
  }

  return (
    <HomePage
      onSignIn={() => setPage("signin")}
      onRegister={() => setPage("register")}
    />
  );
}