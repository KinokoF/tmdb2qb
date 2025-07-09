import { ChatRequest } from "../models/chat-request.js";
import { ChatResponse } from "../models/chat-response.js";
import { OI_CHAT_ENDPOINT } from "../utils/constants.js";
import { OI_TOKEN } from "../utils/secrets.js";

export async function chat(request: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(OI_CHAT_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OI_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.detail);
  }

  return body;
}
