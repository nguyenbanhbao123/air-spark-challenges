import { useState, useEffect } from "react";
import HomePage from "./HomePage";
import SignInPage from "./SignInPage";
import RegisterPage from "./RegisterPage";
import ChatPopup from "./ChatPopup";
import type { Conversation, CaptureResult } from "../core/types";

type Page = "home" | "signin" | "register";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  // The question typed on the capture page, sent automatically once the chat opens.
  const [pendingQuestion, setPendingQuestion] = useState<string>("");

  useEffect(() => {
    window.api.onCaptureCompleted((result: CaptureResult) => {
      void handleCaptureComplete(result);
    });
  }, []);

  const handleCaptureComplete = async (result: CaptureResult | null) => {
    if (!result) {
      // User cancelled the capture
      setCapturedImage(null);
      setPendingQuestion("");
      setIsChatOpen(false);
      return;
    }

    setCapturedImage(result.image);
    setPendingQuestion(result.question);
    setIsChatOpen(true);

    const newConv = await window.api.createConversation("New Conversation");
    setConversation({
      ...newConv,
      image: result.image,
    });
  };

  const handleCaptureClick = async () => {
    const result = await window.api.captureRegion();
    await handleCaptureComplete(result);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setCapturedImage(null);
    setPendingQuestion("");
    setConversation(null);
  };

  const handleConversationUpdate = (updatedConversation: Conversation) => {
    setConversation(updatedConversation);
  };

  // The chat takes over the whole window — the landing page behind it would only
  // be a distraction once the user is in a conversation.
  if (isChatOpen && conversation && capturedImage) {
    return (
      <ChatPopup
        initialQuestion={pendingQuestion}
        conversation={conversation}
        onConversationUpdate={handleConversationUpdate}
        onClose={handleCloseChat}
      />
    );
  }

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
      onCapture={handleCaptureClick}
    />
  );
}