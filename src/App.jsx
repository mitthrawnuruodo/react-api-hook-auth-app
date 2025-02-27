// src/App.jsx
import { useState } from 'react';
import useAPI from './hooks/useAPI';

const App = () => {
  const [token, setToken] = useState('');
  const { data, error, loading, get, post, put, delete: remove } = useAPI();
  const [loginError, setLoginError] = useState('');

  // Login function: logs in using ReqRes.in and stores the token
  const login = async () => {
    try {
      const res = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'eve.holt@reqres.in',
          password: 'cityslicka',
        }),
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Login failed');
      }
      
      const result = await res.json();
      localStorage.setItem('bearerToken', result.token);
      setToken(result.token);
      console.log('Logged in! Token:', result.token);
    } catch (err) {
      setLoginError(err.message);
      console.error('Login error:', err);
    }
  };

  // GET: Fetch a list of users
  const fetchUsers = async () => {
    try {
      const response = await get('https://reqres.in/api/users?page=2');
      console.log('GET users:', response);
    } catch (err) {
      console.error(err);
    }
  };

  // POST: Create a new user
  const createUser = async () => {
    try {
      const newUser = { name: 'John Doe', job: 'Developer' };
      const response = await post('https://reqres.in/api/users', newUser);
      console.log('POST create user:', response);
    } catch (err) {
      console.error(err);
    }
  };

  // PUT: Update an existing user
  const updateUser = async () => {
    try {
      const updatedUser = { name: 'Jane Doe', job: 'Manager' };
      // ReqRes.in supports updating a user at /api/users/2
      const response = await put('https://reqres.in/api/users/2', updatedUser);
      console.log('PUT update user:', response);
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE: Remove a user
  const deleteUser = async () => {
    try {
      // ReqRes.in supports deletion at /api/users/2 (response is empty)
      const response = await remove('https://reqres.in/api/users/2');
      console.log('DELETE user:', response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ReqRes.in API Demo</h1>
      {!token ? (
        <div>
          <button onClick={login}>Login</button>
          {loginError && <p style={{ color: 'red' }}>Login Error: {loginError}</p>}
        </div>
      ) : (
        <div>
          <p>Logged in! Token: {token}</p>
          <button onClick={fetchUsers}>GET Users</button>
          <button onClick={createUser}>POST Create User</button>
          <button onClick={updateUser}>PUT Update User</button>
          <button onClick={deleteUser}>DELETE User</button>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
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
