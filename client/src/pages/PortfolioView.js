import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PortfolioView() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/user/${userId}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  if (!profile) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <img
          src={profile.profileImage || '/default-profile.png'}
          alt="Profile"
          className="rounded-circle mb-3"
          width="120"
          height="120"
        />
        <h3>{profile.name}</h3>
        {profile.aboutMe && <p>{profile.aboutMe}</p>}
        {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
        {profile.email && <p><strong>Email:</strong> {profile.email}</p>}
        {profile.address && <p><strong>Address:</strong> {profile.address}</p>}

        <div className="social-icons mb-3">
          {Object.entries(profile.socials || {}).map(([platform, link], i) => (
            link && (
              <a key={i} href={link} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm me-2">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            )
          ))}
        </div>
      </div>

      {[
        { key: 'experiences', label: 'Experiences' },
        { key: 'education', label: 'Education' },
        { key: 'skills', label: 'Skills' },
        { key: 'achievements', label: 'Achievements' },
        { key: 'certifications', label: 'Certifications' },
        { key: 'languages', label: 'Languages Known' },
        { key: 'hobbies', label: 'Hobbies' }
      ].map(({ key, label }) => (
        profile[key] && profile[key].length > 0 && (
          <div className="mb-4" key={key}>
            <h4 className="border-bottom pb-2">{label}</h4>

            {key === 'skills' ? (
              <>
                {profile.skills.technical?.length > 0 && (
                  <p><strong>Technical:</strong> {profile.skills.technical.join(', ')}</p>
                )}
                {profile.skills.nonTechnical?.length > 0 && (
                  <p><strong>Non-Technical:</strong> {profile.skills.nonTechnical.join(', ')}</p>
                )}
              </>
            ) : key === 'certifications' ? (
              <div className="row">
                {profile.certifications.map((cert, i) => (
                  <div key={i} className="col-md-4 mb-3">
                    {cert.image ? (
                      <img src={cert.image} alt="Certificate" className="img-fluid rounded" />
                    ) : cert.link ? (
                      <a href={cert.link} target="_blank" rel="noreferrer">View Certification</a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-group">
                {profile[key].map((item, i) => (
                  <li className="list-group-item" key={i}>
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      ))}
    </div>
  );
}
