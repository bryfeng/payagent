import { Agent, Item, Event, Customer } from '@/types';

// Agent API functions
export async function getAgents(): Promise<Agent[]> {
  try {
    const response = await fetch('/api/agents');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch agents');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
}

export async function getAgent(id: string): Promise<Agent | null> {
  try {
    const response = await fetch(`/api/agents/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch agent with ID: ${id}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching agent ${id}:`, error);
    return null;
  }
}

export async function createAgent(agentData: Partial<Agent>): Promise<Agent | null> {
  try {
    const response = await fetch('/api/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create agent');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating agent:', error);
    return null;
  }
}

export async function updateAgent(id: string, agentData: Partial<Agent>): Promise<Agent | null> {
  try {
    const response = await fetch(`/api/agents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agentData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update agent with ID: ${id}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error updating agent ${id}:`, error);
    return null;
  }
}

export async function deleteAgent(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/agents/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete agent with ID: ${id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting agent ${id}:`, error);
    return false;
  }
}

// Item API functions
export async function getItems(): Promise<Item[]> {
  try {
    const response = await fetch('/api/items');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch items');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

export async function getItem(id: string): Promise<Item | null> {
  try {
    const response = await fetch(`/api/items/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch item with ID: ${id}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    return null;
  }
}

export async function createItem(itemData: Partial<Item>): Promise<Item | null> {
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create item');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating item:', error);
    return null;
  }
}

export async function updateItem(id: string, itemData: Partial<Item>): Promise<Item | null> {
  try {
    const response = await fetch(`/api/items/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update item with ID: ${id}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error updating item ${id}:`, error);
    return null;
  }
}

export async function deleteItem(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete item with ID: ${id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error);
    return false;
  }
}

// Event API functions
export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch('/api/events');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch events');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEvent(id: string): Promise<Event | null> {
  try {
    const response = await fetch(`/api/events/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch event with ID: ${id}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    return null;
  }
}

export async function createEvent(eventData: Partial<Event>): Promise<Event | null> {
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create event');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
}

export async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event | null> {
  try {
    const response = await fetch(`/api/events/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update event with ID: ${id}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    return null;
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete event with ID: ${id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    return false;
  }
}

// Customer API functions
export async function getCustomers(): Promise<Customer[]> {
  try {
    const response = await fetch('/api/customers');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch customers');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomer(id: string): Promise<Customer | null> {
  try {
    const response = await fetch(`/api/customers/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch customer with ID: ${id}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    return null;
  }
}

export async function createCustomer(customerData: Partial<Customer>): Promise<Customer | null> {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create customer');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

export async function updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer | null> {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to update customer with ID: ${id}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    return null;
  }
}

export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to delete customer with ID: ${id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    return false;
  }
}
