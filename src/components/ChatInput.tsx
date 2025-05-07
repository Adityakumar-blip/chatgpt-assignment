import { useRef } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ handleSendMessage, message, setMessage }: any) => {
  const textareaRef = useRef<any>(null);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <form
        onSubmit={handleSendMessage}
        className="relative flex items-end bg-white border border-gray-300 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          placeholder="Message ChatGPT..."
          className="w-full px-4 py-3 max-h-60 resize-none bg-transparent focus:outline-none text-gray-800"
          style={{ minHeight: "24px" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />

        <div className="flex items-center pr-2 pb-2">
          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-1 rounded-md ml-1 ${
              message.trim()
                ? "text-white bg-green-600 hover:bg-green-700"
                : "text-gray-400 bg-gray-100"
            }`}
            aria-label="Send message"
          >
            <Send />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
