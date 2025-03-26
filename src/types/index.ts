// Agent Types
export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  model: string;
  configuration: AgentConfiguration;
  created_at: string;
  updated_at: string;
}

export interface AgentConfiguration {
  prompt_template: string;
  temperature: number;
  max_tokens: number;
  system_message: string;
  tools: AgentTool[];
  metadata: Record<string, any>;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

// Item Types
export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  properties: Record<string, any>;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ItemProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'object' | 'array';
  value: any;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  agent_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: 'active' | 'inactive' | 'pending';
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Conversation Types
export interface Conversation {
  id: string;
  agent_id: string;
  user_id: string | null;
  messages: Message[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: 'admin' | 'user';
  created_at: string;
}
