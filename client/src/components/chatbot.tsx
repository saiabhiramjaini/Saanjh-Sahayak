"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  X,
  Send,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import axios from "axios";
import Image from "next/image";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    {
      role: string;
      content: string;
      imageUrl?: string;
    }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_FLASK_URL}/chatbot`,
        {
          query: input,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response || "I couldn't process your request.",
        },
      ]);
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const imageUrl = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: "Medical image uploaded",
        imageUrl,
      },
    ]);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_FLASK_URL}/chatbot-img`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data.response || "I've analyzed your medical image.",
        },
      ]);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't analyze the image.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50 flex items-center justify-center ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-teal-600 hover:bg-teal-700"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 z-50 flex flex-col shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-teal-600 text-white p-3 font-medium">
            Medical Assistant
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="bg-gray-100 p-3 rounded-lg max-w-[90%] text-sm">
                Hello! I'm your medical assistant. How can I help you today?
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } w-full`}
              >
                <div
                  className={`p-3 rounded-lg mb-2 break-words text-sm overflow-hidden ${
                    message.role === "user"
                      ? "bg-teal-100 max-w-[85%]"
                      : "bg-gray-100 max-w-[85%]"
                  }`}
                >
                  {message.imageUrl && (
                    <div className="mb-2 rounded-md overflow-hidden">
                      <Image
                        src={message.imageUrl}
                        alt="Uploaded medical image"
                        width={300}
                        height={200}
                        className="object-contain max-h-40 w-auto"
                      />
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none prose-headings:text-sm prose-p:text-sm prose-ul:text-sm prose-li:text-sm break-words whitespace-pre-wrap overflow-hidden">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2 max-w-[85%] text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              ref={fileInputRef}
            />
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>

            <Input
              placeholder="Type your medical query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              className="flex-1"
            />

            <Button
              size="icon"
              className="shrink-0 bg-teal-600 hover:bg-teal-700"
              onClick={handleSend}
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
