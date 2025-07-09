// ==== src/pages/Dashboard.js ====
import React, { useEffect, useState } from 'react';
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/user/me')
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!profile) return <div className="text-center mt-5">Loading...</div>;

  const renderField = (label, value) =>
    value ? <p><strong>{label}:</strong> {value}</p> : null;

  return (
    <div className="dashboard-container">
      <div className="container mt-5 dashboard-content">
        <div className="text-center mb-4">
          <img
            src={profile.profileImage || '/default-profile.png'}
            alt="Profile"
            className="rounded-circle mb-3 profile-img"
          />
          <h3>{profile.name}</h3>
          {renderField('About Me', profile.aboutMe)}
          {renderField('Phone', profile.phone)}
          {renderField('Email', profile.email)}
          {renderField('Address', profile.address)}

          {profile.socials?.length > 0 && (
            <div className="social-icons">
              <h5>Social Links</h5>
              {profile.socials.map((link, i) => (
                <a key={i} href={link} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm me-2">
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>

        {profile.experiences?.length > 0 && (
          <div className="mb-4">
            <h4 className="section-title">Experiences</h4>
            {profile.experiences.map((exp, i) => (
              <div key={i} className="mb-2">
                <strong>{exp.company}</strong> ({exp.from} to {exp.to})
                <p>{exp.aboutJob}</p>
              </div>
            ))}
          </div>
        )}

        {profile.education?.length > 0 && (
          <div className="mb-4">
            <h4 className="section-title">Education</h4>
            {profile.education.map((edu, i) => (
              <div key={i} className="mb-2">
                <strong>{edu.university}</strong> ({edu.from} to {edu.to})
                <p>Grade: {edu.grade}</p>
              </div>
            ))}
          </div>
        )}

        {(profile.skills?.technical?.length > 0 || profile.skills?.nonTechnical?.length > 0) && (
          <div className="mb-4">
            <h4 className="section-title">Skills</h4>
            {profile.skills.technical?.length > 0 && <p><strong>Technical:</strong> {profile.skills.technical.join(', ')}</p>}
            {profile.skills.nonTechnical?.length > 0 && <p><strong>Non-Technical:</strong> {profile.skills.nonTechnical.join(', ')}</p>}
          </div>
        )}

        {profile.achievements?.length > 0 && (
          <div className="mb-4">
            <h4 className="section-title">Achievements</h4>
            <ul>
              {profile.achievements.map((ach, i) => (
                <li key={i}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {profile.certifications?.length > 0 && (
          <div className="mb-4">
            <h4 className="section-title">Certifications</h4>
            <ul>
              {profile.certifications.map((cert, i) => (
                <li key={i}>
                  {cert.name} {cert.link && (<a href={cert.link} target="_blank" rel="noreferrer">[View]</a>)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {profile.languages?.length > 0 && (
          <div className="mb-4">
            <h4 className="section-title">Languages</h4>
            <p>{profile.languages.join(', ')}</p>
          </div>
        )}

        {profile.hobbies?.length > 0 && (
          <div className="mb-4">
            <h4 className="section-title">Hobbies</h4>
            <p>{profile.hobbies.join(', ')}</p>
          </div>
        )}

        {/* Shareable link */}
        <div className="text-center mt-5">
          <h5>Public Portfolio Link:</h5>
          <a
            href={`http://localhost:3000/portfolio/${encodeURIComponent(profile.name.replace(/\s+/g, '-').toLowerCase())}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary"
          >
            View Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
