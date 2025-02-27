// src/hooks/useAPI.js
// This custom hook abstracts the API call logic and supports GET, POST, PUT, and DELETE requests.
// It also reads a bearer token from localStorage and attaches it to the request headers for authenticated endpoints.

import { useState, useCallback } from 'react';

const useAPI = () => {
  // data: stores the response data from the API call
  const [data, setData] = useState(null);
  // error: stores any error encountered during an API call
  const [error, setError] = useState(null);
  // loading: indicates whether an API call is in progress
  const [loading, setLoading] = useState(false);

  // callAPI: central function to perform the API call.
  // It takes a URL, an HTTP method (default 'GET'), and an optional body for POST/PUT requests.
  const callAPI = useCallback(async (url, method = 'GET', body = null) => {
    // Set loading state to true before starting the request.
    setLoading(true);
    // Retrieve the token from localStorage, if present.
    const token = localStorage.getItem('bearerToken');

    // Construct the headers for the request.
    // Always set Content-Type to JSON.
    // Conditionally add the Authorization header if the token exists.
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    try {
      // Perform the API request using fetch.
      const response = await fetch(url, {
        method,
        headers,
        // If a body is provided, stringify it into JSON format.
        ...(body && { body: JSON.stringify(body) }),
      });

      // If the response status is not in the 200-299 range, throw an error.
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'API request failed');
      }
      
      // Some endpoints (like DELETE) return an empty response.
      // Retrieve the response as text first.
      const text = await response.text();
      // If text is not empty, parse it as JSON; otherwise, use an empty object.
      let result = text ? JSON.parse(text) : {};
      
      // Save the result in state.
      setData(result);
      return result;
    } catch (err) {
      // In case of error, set the error state and rethrow the error.
      setError(err);
      throw err;
    } finally {
      // Reset the loading state after the request is finished.
      setLoading(false);
    }
  }, []);

  // Convenience functions for each HTTP method.
  // These wrap the callAPI function, presetting the method parameter.

  // GET: Call callAPI with method 'GET'
  const get = useCallback((url) => callAPI(url, 'GET'), [callAPI]);
  // POST: Call callAPI with method 'POST' and include a body.
  const post = useCallback((url, body) => callAPI(url, 'POST', body), [callAPI]);
  // PUT: Call callAPI with method 'PUT' and include a body.
  const put = useCallback((url, body) => callAPI(url, 'PUT', body), [callAPI]);
  // DELETE: Call callAPI with method 'DELETE'.
  // We alias this to "remove" since "delete" is a reserved word.
  const remove = useCallback((url) => callAPI(url, 'DELETE'), [callAPI]);

  // Return the API methods and state to be used by components.
  return { data, error, loading, get, post, put, delete: remove };
};

export default useAPI;
