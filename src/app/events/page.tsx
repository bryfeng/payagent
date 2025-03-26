'use client';

import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { getEvents, createEvent, getAgents } from '@/lib/api';
import styles from './events.module.css';
import { CalendarClock, MapPin, AlertCircle, Plus, X, Calendar, Clock, User } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    status: 'scheduled',
    priority: 'medium',
    agent_id: '',
    metadata: {}
  });
  
  // Metadata form state
  const [metadataKey, setMetadataKey] = useState('');
  const [metadataValue, setMetadataValue] = useState('');
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  // Load events and agents on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Load events
        const eventsData = await getEvents();
        setEvents(eventsData);
        
        // Load agents for the dropdown
        const agentsData = await getAgents();
        setAgents(agentsData.map(agent => ({ id: agent.id, name: agent.name })));
        
        setError(null);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle adding metadata
  const handleAddMetadata = () => {
    if (!metadataKey.trim()) return;
    
    let parsedValue: any = metadataValue;
    
    // Try to parse as JSON if it looks like a JSON structure
    if (metadataValue.trim().startsWith('{') || 
        metadataValue.trim().startsWith('[') ||
        metadataValue.trim() === 'true' ||
        metadataValue.trim() === 'false' ||
        !isNaN(Number(metadataValue))) {
      try {
        parsedValue = JSON.parse(metadataValue);
      } catch (e) {
        // If parsing fails, keep as string
        parsedValue = metadataValue;
      }
    }

    // Add the metadata to the metadata object
    const updatedMetadata = {
      ...metadata,
      [metadataKey]: parsedValue
    };
    
    setMetadata(updatedMetadata);
    setMetadataKey('');
    setMetadataValue('');
  };

  // Handle removing metadata
  const handleRemoveMetadata = (key: string) => {
    const updatedMetadata = { ...metadata };
    delete updatedMetadata[key];
    setMetadata(updatedMetadata);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.title || !formData.start_time) {
        setError('Title and start time are required');
        return;
      }
      
      // Prepare event data
      const eventData = {
        ...formData,
        metadata,
        // Convert empty strings to null for optional fields
        end_time: formData.end_time || null,
        location: formData.location || null,
        agent_id: formData.agent_id || null
      };
      
      // Create the event
      const createdEvent = await createEvent(eventData);
      
      if (createdEvent) {
        // Add the new event to the events list
        setEvents([...events, createdEvent]);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          location: '',
          status: 'scheduled',
          priority: 'medium',
          agent_id: '',
          metadata: {}
        });
        setMetadata({});
        setShowForm(false);
        setError(null);
      }
    } catch (err) {
      setError('Failed to create event');
      console.error(err);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'scheduled':
        return styles.scheduled;
      case 'in_progress':
        return styles.inProgress;
      case 'completed':
        return styles.completed;
      case 'cancelled':
        return styles.cancelled;
      default:
        return '';
    }
  };

  // Get priority badge class
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return styles.low;
      case 'medium':
        return styles.medium;
      case 'high':
        return styles.high;
      default:
        return '';
    }
  };

  // Get agent name by ID
  const getAgentName = (agentId: string | null) => {
    if (!agentId) return 'None';
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : 'Unknown';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Events</h1>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.button} 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'New Event'}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Create New Event</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="title">Title*</label>
              <input
                id="title"
                name="title"
                type="text"
                className={styles.input}
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className={styles.textarea}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.dateTimeContainer}>
              <div className={`${styles.formGroup} ${styles.dateTimeField}`}>
                <label className={styles.label} htmlFor="start_time">Start Time*</label>
                <input
                  id="start_time"
                  name="start_time"
                  type="datetime-local"
                  className={styles.input}
                  value={formData.start_time}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={`${styles.formGroup} ${styles.dateTimeField}`}>
                <label className={styles.label} htmlFor="end_time">End Time</label>
                <input
                  id="end_time"
                  name="end_time"
                  type="datetime-local"
                  className={styles.input}
                  value={formData.end_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                className={styles.input}
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className={styles.select}
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                className={styles.select}
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="agent_id">Assigned Agent</label>
              <select
                id="agent_id"
                name="agent_id"
                className={styles.select}
                value={formData.agent_id}
                onChange={handleInputChange}
              >
                <option value="">None</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.metadataSection}>
              <h3 className={styles.metadataTitle}>Metadata (Optional)</h3>
              
              <div className={styles.formGroup}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Key"
                    className={styles.input}
                    value={metadataKey}
                    onChange={(e) => setMetadataKey(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    className={styles.input}
                    value={metadataValue}
                    onChange={(e) => setMetadataValue(e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <button
                    type="button"
                    className={styles.button}
                    onClick={handleAddMetadata}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {Object.keys(metadata).length > 0 && (
                  <div>
                    {Object.entries(metadata).map(([key, value]) => (
                      <div key={key} className={styles.metadataItem}>
                        <span className={styles.metadataName}>{key}:</span>
                        <span className={styles.metadataValue}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                        <button
                          type="button"
                          className={`${styles.button} ${styles.cancelButton}`}
                          onClick={() => handleRemoveMetadata(key)}
                          style={{ marginLeft: 'auto', padding: '0.25rem' }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.button}
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <p>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className={styles.loadingContainer}>
          <p>No events found. Create your first event!</p>
        </div>
      ) : (
        <div className={styles.eventsList}>
          {events.map(event => (
            <div key={event.id} className={styles.eventCard}>
              <h3 className={styles.eventTitle}>{event.title}</h3>
              
              <div className={styles.eventMeta}>
                <div className={styles.eventMetaItem}>
                  <Calendar size={16} />
                  <span>Start: {formatDate(event.start_time)}</span>
                </div>
                
                {event.end_time && (
                  <div className={styles.eventMetaItem}>
                    <Clock size={16} />
                    <span>End: {formatDate(event.end_time)}</span>
                  </div>
                )}
                
                {event.location && (
                  <div className={styles.eventMetaItem}>
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                )}
                
                <div className={styles.eventMetaItem}>
                  <User size={16} />
                  <span>Agent: {getAgentName(event.agent_id)}</span>
                </div>
              </div>
              
              {event.description && (
                <p className={styles.eventDescription}>{event.description}</p>
              )}
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <span className={`${styles.statusBadge} ${getStatusClass(event.status)}`}>
                  {event.status.replace('_', ' ')}
                </span>
                
                <span className={`${styles.priorityBadge} ${getPriorityClass(event.priority)}`}>
                  {event.priority} priority
                </span>
              </div>
              
              {Object.keys(event.metadata).length > 0 && (
                <div style={{ marginTop: '1rem', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: '#475569' }}>
                    Metadata:
                  </div>
                  <div style={{ color: '#64748b', wordBreak: 'break-all' }}>
                    {JSON.stringify(event.metadata)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
