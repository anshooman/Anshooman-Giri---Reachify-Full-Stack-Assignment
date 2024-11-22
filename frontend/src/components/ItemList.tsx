import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Item {
  id: number;
  name: string;
  description: string;
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useAuth();

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else if (response.status === 401) {
        logout();
      } else {
        setError('Failed to fetch items');
      }
    } catch (err) {
      setError('An error occurred while fetching items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const item = await response.json();
        setItems([...items, item]);
        setNewItem({ name: '', description: '' });
      } else if (response.status === 401) {
        logout();
      } else {
        setError('Failed to add item');
      }
    } catch (err) {
      setError('An error occurred while adding the item');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      } else if (response.status === 401) {
        logout();
      } else {
        setError('Failed to delete item');
      }
    } catch (err) {
      setError('An error occurred while deleting the item');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Items</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - {item.description}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          placeholder="Description"
          required
        />
        <button type="submit">Add Item</button>
      </form>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default ItemList;

