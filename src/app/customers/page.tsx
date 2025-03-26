'use client';

import { useState, useEffect } from 'react';
import { Customer } from '@/types';
import { getCustomers, createCustomer } from '@/lib/api';
import styles from './customers.module.css';
import { Mail, Phone, Building, User, Plus, X, Search, Filter } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'pending',
    tier: 'free',
    notes: '',
    metadata: {}
  });
  
  // Metadata form state
  const [metadataKey, setMetadataKey] = useState('');
  const [metadataValue, setMetadataValue] = useState('');
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  // Load customers on component mount
  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        const data = await getCustomers();
        setCustomers(data);
        setFilteredCustomers(data);
        setError(null);
      } catch (err) {
        setError('Failed to load customers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadCustomers();
  }, []);

  // Filter customers when search term or filters change
  useEffect(() => {
    let results = customers;
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(customer => 
        customer.name.toLowerCase().includes(term) || 
        customer.email.toLowerCase().includes(term) || 
        (customer.company && customer.company.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(customer => customer.status === statusFilter);
    }
    
    // Apply tier filter
    if (tierFilter !== 'all') {
      results = results.filter(customer => customer.tier === tierFilter);
    }
    
    setFilteredCustomers(results);
  }, [customers, searchTerm, statusFilter, tierFilter]);

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
      if (!formData.name || !formData.email) {
        setError('Name and email are required');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Invalid email format');
        return;
      }
      
      // Prepare customer data
      const customerData = {
        ...formData,
        metadata,
        // Convert empty strings to null for optional fields
        phone: formData.phone || null,
        company: formData.company || null,
        notes: formData.notes || null
      };
      
      // Create the customer
      const createdCustomer = await createCustomer(customerData);
      
      if (createdCustomer) {
        // Add the new customer to the customers list
        setCustomers([...customers, createdCustomer]);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'pending',
          tier: 'free',
          notes: '',
          metadata: {}
        });
        setMetadata({});
        setShowForm(false);
        setError(null);
      }
    } catch (err) {
      setError('Failed to create customer');
      console.error(err);
    }
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return styles.active;
      case 'inactive':
        return styles.inactive;
      case 'pending':
        return styles.pending;
      default:
        return '';
    }
  };

  // Get tier badge class
  const getTierClass = (tier: string) => {
    switch (tier) {
      case 'free':
        return styles.free;
      case 'basic':
        return styles.basic;
      case 'premium':
        return styles.premium;
      case 'enterprise':
        return styles.enterprise;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customers</h1>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.button} 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'New Customer'}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Create New Customer</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Name*</label>
              <input
                id="name"
                name="name"
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email*</label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={styles.input}
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                className={styles.input}
                value={formData.company}
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
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="tier">Tier</label>
              <select
                id="tier"
                name="tier"
                className={styles.select}
                value={formData.tier}
                onChange={handleInputChange}
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className={styles.textarea}
                value={formData.notes}
                onChange={handleInputChange}
              />
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
                Create Customer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search customers..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.filterContainer}>
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>

        <select
          className={styles.filterSelect}
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
        >
          <option value="all">All Tiers</option>
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <p>Loading customers...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className={styles.loadingContainer}>
          <p>No customers found. {customers.length > 0 ? 'Try adjusting your filters.' : 'Create your first customer!'}</p>
        </div>
      ) : (
        <div className={styles.customersList}>
          {filteredCustomers.map(customer => (
            <div key={customer.id} className={styles.customerCard}>
              <h3 className={styles.customerName}>{customer.name}</h3>
              
              {customer.company && (
                <div className={styles.customerCompany}>{customer.company}</div>
              )}
              
              <div className={styles.customerMeta}>
                <div className={styles.customerMetaItem}>
                  <Mail size={16} />
                  <span>{customer.email}</span>
                </div>
                
                {customer.phone && (
                  <div className={styles.customerMetaItem}>
                    <Phone size={16} />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <span className={`${styles.statusBadge} ${getStatusClass(customer.status)}`}>
                  {customer.status}
                </span>
                
                <span className={`${styles.tierBadge} ${getTierClass(customer.tier)}`}>
                  {customer.tier}
                </span>
              </div>
              
              {customer.notes && (
                <div className={styles.notes}>
                  <div className={styles.notesTitle}>Notes:</div>
                  <p>{customer.notes}</p>
                </div>
              )}
              
              {Object.keys(customer.metadata).length > 0 && (
                <div style={{ marginTop: '1rem', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: '#475569' }}>
                    Metadata:
                  </div>
                  <div style={{ color: '#64748b', wordBreak: 'break-all' }}>
                    {JSON.stringify(customer.metadata)}
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
