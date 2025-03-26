'use client';

import { useState, useEffect } from 'react';
import { Item } from '@/types';
import { getItems, createItem } from '@/lib/api';
import styles from './items.module.css';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    status: 'active',
    properties: {}
  });
  
  // Property form state
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState<'string' | 'number' | 'boolean' | 'datetime'>('string');
  const [propertyValue, setPropertyValue] = useState('');
  const [properties, setProperties] = useState<Record<string, any>>({});

  // Load items on component mount
  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        const data = await getItems();
        setItems(data);
        setError(null);
      } catch (err) {
        setError('Failed to load items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadItems();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Add a property to the item
  const handleAddProperty = () => {
    if (!propertyName.trim()) {
      return;
    }

    let parsedValue: any = propertyValue;
    
    // Parse the value based on the type
    if (propertyType === 'number') {
      parsedValue = parseFloat(propertyValue);
    } else if (propertyType === 'boolean') {
      parsedValue = propertyValue === 'true';
    } else if (propertyType === 'datetime') {
      parsedValue = new Date(propertyValue);
    }

    // Add the property to the properties object
    setProperties({
      ...properties,
      [propertyName]: {
        type: propertyType,
        value: parsedValue
      }
    });

    // Reset the property form
    setPropertyName('');
    setPropertyValue('');
    setPropertyType('string');
  };

  // Remove a property
  const handleRemoveProperty = (name: string) => {
    const newProperties = { ...properties };
    delete newProperties[name];
    setProperties(newProperties);
  };

  // Submit the form to create a new item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const newItem = await createItem({
        ...formData,
        properties
      });
      
      if (newItem) {
        // Add the new item to the list
        setItems([newItem, ...items]);
        
        // Reset the form
        setFormData({
          name: '',
          description: '',
          category: 'general',
          status: 'active',
          properties: {}
        });
        setProperties({});
        setShowForm(false);
      }
    } catch (err) {
      setError('Failed to create item');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Items</h1>
        <button 
          className={styles.createButton}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create Item'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <div className={styles.formContainer}>
          <h2>Create New Item</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className={styles.propertiesSection}>
              <h3>Properties</h3>
              
              <div className={styles.propertyForm}>
                <div className={styles.propertyInputs}>
                  <input
                    type="text"
                    placeholder="Property Name"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                  />
                  
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="datetime">Datetime</option>
                  </select>
                  
                  {propertyType === 'boolean' ? (
                    <select
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)}
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : propertyType === 'datetime' ? (
                    <input
                      type="datetime-local"
                      placeholder="Value"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)}
                    />
                  ) : (
                    <input
                      type={propertyType === 'number' ? 'number' : 'text'}
                      placeholder="Value"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)}
                    />
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={handleAddProperty}
                  className={styles.addPropertyButton}
                >
                  Add Property
                </button>
              </div>

              {Object.keys(properties).length > 0 && (
                <div className={styles.propertiesList}>
                  <h4>Added Properties:</h4>
                  <ul>
                    {Object.entries(properties).map(([name, property]: [string, any]) => (
                      <li key={name} className={styles.propertyItem}>
                        <span>
                          <strong>{name}</strong> ({property.type}): {String(property.value)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProperty(name)}
                          className={styles.removeButton}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || !formData.name}
              >
                {loading ? 'Creating...' : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.itemsList}>
        <h2>All Items</h2>
        {loading && !showForm ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p>No items found. Create your first item!</p>
        ) : (
          <div className={styles.itemsGrid}>
            {items.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h3>{item.name}</h3>
                  <span className={`${styles.status} ${styles[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <p className={styles.itemDescription}>{item.description}</p>
                <div className={styles.itemMeta}>
                  <span>Category: {item.category}</span>
                </div>
                {Object.keys(item.properties).length > 0 && (
                  <div className={styles.itemProperties}>
                    <h4>Properties:</h4>
                    <ul>
                      {Object.entries(item.properties).map(([key, value]: [string, any]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {typeof value === 'object' ? value.value : value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
