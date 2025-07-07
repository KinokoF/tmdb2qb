export interface ChatRequest {
  model: string;
  messages: { role: "user" | "assistant"; content: string }[];
}
