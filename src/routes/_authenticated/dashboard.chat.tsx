import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bot,
  Send,
  Trash2,
  Loader2,
  User as UserIcon,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import {
  getChatHistory,
  sendChatMessage,
  clearChatHistory,
} from "@/lib/ai.functions";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Route = createFileRoute("/_authenticated/dashboard/chat")({
  component: ChatPage,
});

const SUGGESTIONS = [
  "Why are my tomato leaves turning yellow?",
  "Best fertilizer for wheat in monsoon?",
  "Will rain tomorrow affect my paddy?",
  "How much water for cotton crop?",
];

function ChatPage() {
  const qc = useQueryClient();
  const fetchHistory = useServerFn(getChatHistory);
  const send = useServerFn(sendChatMessage);
  const clear = useServerFn(clearChatHistory);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const historyQ = useQuery({
    queryKey: ["chat"],
    queryFn: () => fetchHistory(),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [historyQ.data, sending]);

  const submit = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || sending) return;
    setSending(true);
    setInput("");
    try {
      // Optimistic
      qc.setQueryData(["chat"], (prev: any[] = []) => [
        ...prev,
        {
          id: `tmp-${Date.now()}`,
          role: "user",
          content: message,
          created_at: new Date().toISOString(),
        },
      ]);
      await send({ data: { message } });
      qc.invalidateQueries({ queryKey: ["chat"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = async () => {
    await clear();
    qc.setQueryData(["chat"], []);
  };

  const messages = historyQ.data ?? [];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-start justify-between">
        <PageHeader
          icon={Bot}
          title="AI Farmer Chat"
          subtitle="Ask anything about your crop, soil, weather or schemes."
        />
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="rounded-full"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-3xl border bg-card p-4 md:p-6 shadow-soft space-y-4"
      >
        {messages.length === 0 && !sending && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="w-16 h-16 rounded-3xl bg-primary/15 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold">
              How can I help your farm today?
            </h3>
            <p className="text-muted-foreground mt-1 max-w-md">
              Ask about diseases, weather, fertilizer, mandi prices, or
              government schemes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="text-sm px-4 py-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role !== "user" && (
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}
            >
              {m.role === "assistant" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {String(m.content)}
                </ReactMarkdown>
              ) : (
                <span className="whitespace-pre-wrap">{String(m.content)}</span>
              )}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-earth/20 text-earth flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3 rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mt-4 flex items-end gap-2 rounded-3xl border bg-card shadow-soft p-2"
      >
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Message KrishiAI..."
          className="min-h-[52px] border-0 shadow-none resize-none focus-visible:ring-0"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          disabled={sending || !input.trim()}
          className="rounded-2xl h-11 w-11 shrink-0 shadow-glow"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
