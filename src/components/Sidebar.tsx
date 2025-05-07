import { useState, useEffect } from "react";
import { X, Plus, Hamburger } from "lucide-react";

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  chartData?: {
    type: string;
    title: string;
    dataPoints: number;
  };
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

interface SidebarProps {
  onSelectChat: (chatHistory: ChatHistory) => void;
  onNewChat: () => void;
  currentChatId: string | null;
}

const Sidebar = ({ onSelectChat, onNewChat, currentChatId }: SidebarProps) => {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const storedHistories = localStorage.getItem("chatHistories");
    if (storedHistories) {
      const parsedHistories = JSON.parse(storedHistories).map(
        (history: any) => ({
          ...history,
          lastUpdated: new Date(history.lastUpdated),
          messages: history.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        })
      );
      setChatHistories(parsedHistories);
    }
  }, []);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative h-screen">
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-20 p-2 bg-gray-800 text-white rounded-md ${
          isOpen ? "hidden" : "block"
        }`}
      >
        <Hamburger size={20} />
      </button>

      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform duration-300 fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-10 flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Chat History</h2>
          <div className="flex space-x-2">
            <button
              onClick={onNewChat}
              className="p-1 hover:bg-gray-700 rounded-md"
              title="New Chat"
            >
              <Plus size={20} />
            </button>
            <button
              onClick={toggleSidebar}
              className="md:hidden p-1 hover:bg-gray-700 rounded-md"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* chat histories */}
        <div className="flex-1 overflow-y-auto">
          {chatHistories.length > 0 ? (
            <ul className="py-2">
              {chatHistories
                .sort(
                  (a, b) =>
                    new Date(b.lastUpdated).getTime() -
                    new Date(a.lastUpdated).getTime()
                )
                .map((chat) => (
                  <li
                    key={chat.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                      currentChatId === chat.id ? "bg-gray-700" : ""
                    }`}
                    onClick={() => {
                      onSelectChat(chat);
                      if (window.innerWidth < 768) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{chat.title}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(chat.lastUpdated)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-400">
              <p>No chat history found</p>
              <p className="text-sm">Start a new conversation</p>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
