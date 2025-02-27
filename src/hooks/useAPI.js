// src/useAPI.js
import { useState, useCallback } from 'react';

const useAPI = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Centralized API call function
  const callAPI = useCallback(async (url, method = 'GET', body = null) => {
    setLoading(true);
    // Get token from localStorage (if it exists)
    const token = localStorage.getItem('bearerToken');

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'API request failed');
      }
      
      // Check for empty response body
      const text = await response.text();
      let result = text ? JSON.parse(text) : {};
      
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Convenience functions for various HTTP methods
  const get = useCallback((url) => callAPI(url, 'GET'), [callAPI]);
  const post = useCallback((url, body) => callAPI(url, 'POST', body), [callAPI]);
  const put = useCallback((url, body) => callAPI(url, 'PUT', body), [callAPI]);
  const remove = useCallback((url) => callAPI(url, 'DELETE'), [callAPI]);

  return { data, error, loading, get, post, put, delete: remove };
};

export default useAPI;
