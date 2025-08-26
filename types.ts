export type Language = 'python' | 'rust';

export type Role = 'user' | 'model';

export interface ChatMessage {
  role: Role;
  content: string;
}

export type View = 'chat' | 'docs';