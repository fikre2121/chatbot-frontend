export interface User {
  id: string;
  email: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
