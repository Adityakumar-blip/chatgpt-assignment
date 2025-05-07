import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import Sidebar, { type ChatHistory, type ChatMessage } from "./Sidebar";
import { User2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ChartComponent from "./RandomChart";

const ChatApp = () => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [_, setRows] = useState(1);
  const textareaRef = useRef<any>(null);
  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    const storedCurrentChatId = localStorage.getItem("currentChatId");

    if (storedCurrentChatId) {
      setCurrentChatId(storedCurrentChatId);

      const storedHistories = localStorage.getItem("chatHistories");
      if (storedHistories) {
        const parsedHistories: ChatHistory[] = JSON.parse(storedHistories).map(
          (history: any) => ({
            ...history,
            lastUpdated: new Date(history.lastUpdated),
            messages: history.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          })
        );

        const currentChat = parsedHistories.find(
          (chat) => chat.id === storedCurrentChatId
        );
        if (currentChat) {
          setMessages(currentChat.messages);
        }
      }
    } else {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(
        Math.max(textareaRef.current.scrollHeight, 24),
        200
      );
      textareaRef.current.style.height = `${newHeight}px`;
      setRows(inputMessage === "" ? 1 : Math.ceil(newHeight / 24));
    }
  }, [inputMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      updateChatHistory();
    }
  }, [messages, currentChatId]);

  const createNewChat = () => {
    const newChatId = uuidv4();
    setCurrentChatId(newChatId);
    setMessages([
      {
        id: 1,
        role: "assistant",
        content: "Hello! How can I help you today?",
        timestamp: new Date(),
      },
    ]);

    localStorage.setItem("currentChatId", newChatId);

    const storedHistories = localStorage.getItem("chatHistories");
    const chatHistories: ChatHistory[] = storedHistories
      ? JSON.parse(storedHistories)
      : [];

    const newChatHistory: ChatHistory = {
      id: newChatId,
      title: "New conversation",
      messages: [
        {
          id: 1,
          role: "assistant",
          content: "Hello! How can I help you today?",
          timestamp: new Date(),
        },
      ],
      lastUpdated: new Date(),
    };

    chatHistories.push(newChatHistory);
    localStorage.setItem("chatHistories", JSON.stringify(chatHistories));
  };

  const updateChatHistory = () => {
    if (!currentChatId) return;

    const storedHistories = localStorage.getItem("chatHistories");
    const chatHistories: ChatHistory[] = storedHistories
      ? JSON.parse(storedHistories)
      : [];

    const currentChatIndex = chatHistories.findIndex(
      (chat) => chat.id === currentChatId
    );

    if (currentChatIndex !== -1) {
      chatHistories[currentChatIndex] = {
        ...chatHistories[currentChatIndex],
        messages: messages,
        lastUpdated: new Date(),
        title: getChatTitle(messages),
      };
    } else {
      chatHistories.push({
        id: currentChatId,
        title: getChatTitle(messages),
        messages: messages,
        lastUpdated: new Date(),
      });
    }

    localStorage.setItem("chatHistories", JSON.stringify(chatHistories));
  };

  const getChatTitle = (msgs: ChatMessage[]): string => {
    const firstUserMessage = msgs.find((msg) => msg.role === "user");
    if (firstUserMessage) {
      const content = firstUserMessage.content;
      return content.length > 25 ? content.substring(0, 25) + "..." : content;
    }
    return "New conversation";
  };

  const handleSelectChat = (chatHistory: ChatHistory) => {
    setCurrentChatId(chatHistory.id);
    setMessages(chatHistory.messages);
    localStorage.setItem("currentChatId", chatHistory.id);
  };

  const isChartRequest = (message: string) => {
    return message.toLowerCase().includes("chart");
  };

  const generateChartConfig = (message: string) => {
    const chartTypes = ["line", "bar", "pie", "area"];
    const randomType =
      chartTypes[Math.floor(Math.random() * chartTypes.length)];

    let chartTitle = "Random Data Chart";
    const titleMatch = message.match(/chart for (.*?)(?:$|\.|,)/i);
    if (titleMatch && titleMatch[1]) {
      chartTitle = titleMatch[1].trim();
    }

    return {
      type: randomType,
      title: chartTitle,
      dataPoints: Math.floor(Math.random() * 5) + 5,
    };
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        role: "user" as const,
        content: inputMessage,
        timestamp: new Date(),
      };

      setMessages([...messages, userMessage]);
      setInputMessage("");

      setTimeout(() => {
        let assistantResponse;

        if (isChartRequest(userMessage.content)) {
          const chartConfig = generateChartConfig(userMessage.content);
          assistantResponse = {
            id: messages.length + 2,
            role: "assistant" as const,
            content: `Here's a ${chartConfig.type} chart for ${chartConfig.title}:`,
            timestamp: new Date(),
            chartData: chartConfig,
          };
        } else {
          assistantResponse = {
            id: messages.length + 2,
            role: "assistant" as const,
            content: `This is a simulated response to: "${inputMessage}"`,
            timestamp: new Date(),
          };
        }

        setMessages((prev) => [...prev, assistantResponse]);
      }, 1000);
    }
  };

  const formatTime = (date: any) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        onSelectChat={handleSelectChat}
        onNewChat={createNewChat}
        currentChatId={currentChatId}
      />
      <div className="w-full bg-white">
        <div className="flex flex-col flex-1 h-screen ml-0 md:ml-64">
          <div className="flex-1 overflow-y-auto p-4 bg-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2 mt-1">
                    <User2 size={15} className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg py-2 px-4 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="mb-1">{message.content}</p>
                  {message.chartData && (
                    <div className="mt-4 mb-2 w-full">
                      <ChartComponent
                        type={message.chartData.type}
                        title={message.chartData.title}
                        dataPoints={message.chartData.dataPoints}
                      />
                    </div>
                  )}
                  <p
                    className={`text-xs ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500"
                    } text-right`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2 mt-1">
                    <User2 className="text-white" size={15} />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            handleSendMessage={handleSendMessage}
            message={inputMessage}
            setMessage={setInputMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
