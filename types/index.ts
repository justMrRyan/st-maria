// Project type for portfolio
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

// Message type from contact form
export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

// User session
export interface UserSession {
  email: string;
  isOwner: boolean;
}

// Auth token from Coflow
export interface CoflowTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user?: {
    email: string;
    id: string;
  };
}
