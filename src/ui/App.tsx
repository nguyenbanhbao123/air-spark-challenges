import { useState, useEffect } from "react";
import HomePage from "./HomePage";
import SignInPage from "./SignInPage";
import RegisterPage from "./RegisterPage";
import ChatPopup from "./ChatPopup";
import type { Conversation } from "../core/types";

type Page = "home" | "signin" | "register";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    window.api.onCaptureCompleted(async (image: string) => {
      setCapturedImage(image);
      setIsChatOpen(true);
      // Create a new conversation with the captured image
      const newConv = await window.api.createConversation("New Conversation");
      setConversation({
        ...newConv,
        image: image
      });
    });
  }, []);

  const handleCaptureComplete = async (image: string | null) => {
    if (image) {
      setCapturedImage(image);
      setIsChatOpen(true);
      // Create a new conversation with the captured image
      const newConv = await window.api.createConversation("New Conversation");
      setConversation({
        ...newConv,
        image: image
      });
    } else {
      // User cancelled capture
      setCapturedImage(null);
      setIsChatOpen(false);
    }
  };

  const handleCaptureClick = async () => {
    const image = await window.api.captureRegion();
    await handleCaptureComplete(image);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setCapturedImage(null);
    setConversation(null);
  };

  const handleConversationUpdate = (updatedConversation: Conversation) => {
    setConversation(updatedConversation);
  };

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
    <>
      <HomePage
        onSignIn={() => setPage("signin")}
        onRegister={() => setPage("register")}
        onCapture={handleCaptureClick}
      />
      
      {isChatOpen && conversation && capturedImage && (
        <ChatPopup
          conversation={conversation}
          onConversationUpdate={handleConversationUpdate}
          onClose={handleCloseChat}
        />
      )}
    </>
  );
}