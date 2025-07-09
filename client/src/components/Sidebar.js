// ==== src/components/Sidebar.js ====
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setUser(res.data);
    }).catch(err => {
      console.error('Failed to fetch user:', err);
    });
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <button className="btn btn-outline-dark toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <i className="bi bi-list"></i>
      </button>

      {isOpen && (
        <div className="sidebar shadow">
          <div className="text-center p-3">
            <img
              src={user.profilePicture ? user.profilePicture : '/default-profile.png'}
              alt="profile"
              className="rounded-circle"
              width="80"
              height="80"
            />
            <h5 className="mt-2">{user.name}</h5>
          </div>
          <ul className="list-unstyled px-3">
            <li className="mb-2">
              <Link className="btn btn-outline-primary w-100" to="/dashboard">My Profile</Link>
            </li>
            <li className="mb-2">
              <Link className="btn btn-outline-secondary w-100" to="/edit-profile">Edit Profile</Link>
            </li>
            <li>
              <button className="btn btn-danger w-100" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
