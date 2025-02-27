// src/App.jsx
// This is the main component for the ReqRes.in API demo.
// It allows a user to log in and then perform GET, POST, PUT, and DELETE requests.

import { useState } from 'react';
import useAPI from './hooks/useAPI'; // Import our custom API hook

const App = () => {
  // token: stores the authentication token after a successful login
  // loginError: stores any error messages that occur during login
  const [token, setToken] = useState('');
  const [loginError, setLoginError] = useState('');

  // Destructure the API functions and state from our custom hook.
  // data: response data from the API calls
  // error: error message if any API call fails
  // loading: boolean flag indicating if a request is in progress
  // get, post, put, delete (aliased as remove): functions to perform the respective HTTP methods
  const { data, error, loading, get, post, put, delete: remove } = useAPI();

  // Function to log in via ReqRes.in's login endpoint.
  // On success, stores the token in localStorage and updates local state.
  const login = async () => {
    try {
      // Use the post() function from useAPI to send a POST request
      const result = await post('https://reqres.in/api/login', {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      });
      // Store the token in localStorage and update state
      localStorage.setItem('bearerToken', result.token);
      setToken(result.token);
      console.log('Logged in! Token:', result.token);
    } catch (err) {
      setLoginError(err.message);
      console.error('Login error:', err);
    }
  };

  // Function to perform a GET request to fetch a list of users.
  const fetchUsers = async () => {
    try {
      // Call the get method from our hook with the endpoint URL.
      const response = await get('https://reqres.in/api/users?page=2');
      console.log('GET users:', response);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to perform a POST request to create a new user.
  const createUser = async () => {
    try {
      // Define a new user object to send in the request body.
      const newUser = { name: 'John Doe', job: 'Developer' };
      // Call the post method with the endpoint URL and the user data.
      const response = await post('https://reqres.in/api/users', newUser);
      console.log('POST create user:', response);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to perform a PUT request to update an existing user.
  const updateUser = async () => {
    try {
      // Define updated user data.
      const updatedUser = { name: 'Jane Doe', job: 'Manager' };
      // ReqRes.in supports updating a user at /api/users/2.
      const response = await put('https://reqres.in/api/users/2', updatedUser);
      console.log('PUT update user:', response);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to perform a DELETE request to remove a user.
  const deleteUser = async () => {
    try {
      // ReqRes.in supports deletion at /api/users/2.
      // Note: This endpoint returns an empty response, which is handled in the hook.
      const response = await remove('https://reqres.in/api/users/2');
      console.log('DELETE user:', response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ReqRes.in API Demo</h1>
      {/* If not logged in, show the login button and any error message */}
      {!token ? (
        <div>
          <button onClick={login}>Login</button>
          {loginError && <p style={{ color: 'red' }}>Login Error: {loginError}</p>}
        </div>
      ) : (
        // Once logged in, display the token and buttons to trigger API calls.
        <div>
          <p>Logged in! Token: {token}</p>
          <button onClick={fetchUsers}>GET Users</button>
          <button onClick={createUser}>POST Create User</button>
          <button onClick={updateUser}>PUT Update User</button>
          <button onClick={deleteUser}>DELETE User</button>
        </div>
      )}
      {/* Show loading indicator if an API call is in progress */}
      {loading && <p>Loading...</p>}
      {/* Display error messages if any API call fails */}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {/* Render the returned data if available */}
      {data && (
        <div>
          <h3>Response Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
