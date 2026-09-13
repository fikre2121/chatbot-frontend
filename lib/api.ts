const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { Conversation, Message } from "@/lib/types";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return null;
  const data = await res.json();
  setAccessToken(data.access_token);
  return data.access_token;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const doFetch = (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

  let res = await doFetch(accessToken);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  return res;
}

// for the conversation page and sidebare
export async function getConversations(): Promise<Conversation[]> {
  const res = await apiFetch("/conversations");
  if (!res.ok) throw new Error("Failed to load conversations");
  return res.json();
}

export async function createConversation(
  title = "New conversation",
): Promise<Conversation> {
  const res = await apiFetch("/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const res = await apiFetch(`/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error("Failed to load messages");
  return res.json();
}

export async function deleteConversation(
  conversationId: string,
): Promise<void> {
  const res = await apiFetch(`/conversations/${conversationId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete conversation");
}

export async function renameConversation(
  conversationId: string,
  title: string,
): Promise<Conversation> {
  const res = await apiFetch(`/conversations/${conversationId}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to rename conversation");
  return res.json();
}