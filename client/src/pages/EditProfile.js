import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlus, faMinus, faMinusCircle, faLink
} from '@fortawesome/free-solid-svg-icons';
import {
  faLinkedin, faGithub, faYoutube, faInstagram, faHackerrank
} from '@fortawesome/free-brands-svg-icons';
import './EditProfile.css';

library.add(
  faPlus, faMinus, faMinusCircle, faLink,
  faLinkedin, faGithub, faYoutube, faInstagram, faHackerrank
);

function getIconForLink(link) {
  const l = link.toLowerCase();
  if (l.includes('linkedin.com')) return ['fab', 'linkedin'];
  if (l.includes('github.com')) return ['fab', 'github'];
  if (l.includes('youtube.com')) return ['fab', 'youtube'];
  if (l.includes('instagram.com')) return ['fab', 'instagram'];
  if (l.includes('hackerrank.com')) return ['fab', 'hackerrank'];
  return ['fas', 'link'];
}

// Full lists of skills
const ALL_TECHNICAL_SKILLS = [
  "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Go", "Swift",
  "Kotlin", "TypeScript", "SQL", "HTML", "CSS", "React", "Angular", "Vue.js",
  "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "TensorFlow",
  "PyTorch", "Machine Learning", "Data Analysis", "AWS", "Azure", "Docker",
  "Kubernetes", "Git", "Linux", "REST API", "GraphQL", "MongoDB", "PostgreSQL",
  "MySQL", "Redis", "Firebase", "Agile", "Scrum", "CI/CD", "Jenkins", "Ansible"
];

const ALL_NON_TECHNICAL_SKILLS = [
  "Communication", "Leadership", "Teamwork", "Time Management", "Problem Solving",
  "Critical Thinking", "Creativity", "Adaptability", "Emotional Intelligence",
  "Conflict Resolution", "Decision Making", "Negotiation", "Public Speaking",
  "Project Management", "Networking", "Customer Service", "Collaboration",
  "Work Ethic", "Attention to Detail", "Organizational Skills"
];

export default function EditProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({
    name: '',
    aboutMe: '',
    phone: '',
    email: '',
    address: '',
    socials: [],
    skills: { technical: [], nonTechnical: [] },
    experiences: [],
    education: [],
    certifications: [],
    achievements: [],
    languages: [],
    hobbies: [],
    profilePicture: null
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const u = res.data;
      setProfile({
        name: u.name || '',
        aboutMe: u.aboutMe || '',
        phone: u.phone || '',
        email: u.email || '',
        address: u.address || '',
        socials: Array.isArray(u.socials) ? u.socials : [],
        skills: u.skills || { technical: [], nonTechnical: [] },
        experiences: u.experiences || [],
        education: u.education || [],
        certifications: u.certifications || [],
        achievements: u.achievements || [],
        languages: u.languages || [],
        hobbies: u.hobbies || [],
        profilePicture: null
      });
    });
  }, [token]);

  const handleChangeArray = (field, index, value) => {
    setProfile(p => ({ ...p, [field]: p[field].map((v, i) => i === index ? value : v) }));
  };

  const handleAddField = (field, emptyValue = '') => {
    setProfile(p => ({ ...p, [field]: [...p[field], emptyValue] }));
  };

  const handleRemoveField = (field, index) => {
    setProfile(p => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));
  };

  const handleSocialChange = (index, value) => {
    handleChangeArray('socials', index, value);
  };

  const addSocialField = () => handleAddField('socials', '');

  const handleImageChange = e => setProfile(p => ({ ...p, profilePicture: e.target.files[0] }));

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(profile).forEach(([k, v]) => {
      formData.append(k, typeof v === 'object' && !(v instanceof File) ? JSON.stringify(v) : v);
    });
    axios.put('http://localhost:5000/api/user/update', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    }).then(() => navigate('/dashboard'));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>

        {/* Name + About */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Name</label>
            <input
              className="form-control"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>About Me</label>
            <textarea
              className="form-control"
              value={profile.aboutMe}
              onChange={e => setProfile(p => ({ ...p, aboutMe: e.target.value }))}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Phone</label>
            <input
              className="form-control"
              value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
            />
          </div>
        </div>

        {/* Profile Picture */}
        <div className="mb-3">
          <label>Profile Picture</label>
          <input type="file" className="form-control" onChange={handleImageChange} />
        </div>

        {/* Social Links */}
        <h5>Social Links</h5>
        {profile.socials.map((link, i) => (
          <div className="input-group mb-2" key={i}>
            <span className="input-group-text">
              <FontAwesomeIcon icon={getIconForLink(link)} />
            </span>
            <input
              className="form-control"
              placeholder="https://..."
              value={link}
              onChange={e => handleSocialChange(i, e.target.value)}
            />
            <button type="button" className="btn btn-outline-danger" onClick={() => handleRemoveField('socials', i)}>
              <FontAwesomeIcon icon="minus" />
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline-primary mb-4" onClick={addSocialField}>
          <FontAwesomeIcon icon="plus" /> Add Social
        </button>

        {/* Experience */}
        <h5>Experience</h5>
        {profile.experiences.map((exp, i) => (
          <div className="border rounded p-3 mb-3" key={i}>
            <div className="d-flex justify-content-between mb-2">
              <h6>Experience #{i + 1}</h6>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveField('experiences', i)}>
                <FontAwesomeIcon icon="minus-circle" />
              </button>
            </div>
            <input
              className="form-control mb-2"
              placeholder="Company"
              value={exp.company || ''}
              onChange={e => setProfile(p => {
                const arr = [...p.experiences]; arr[i].company = e.target.value;
                return { ...p, experiences: arr };
              })}
            />
            <textarea
              className="form-control mb-2"
              placeholder="About Job"
              value={exp.aboutJob || ''}
              onChange={e => setProfile(p => {
                const arr = [...p.experiences]; arr[i].aboutJob = e.target.value;
                return { ...p, experiences: arr };
              })}
            />
            <div className="row">
              <div className="col">
                <label>From</label>
                <input
                  type="month"
                  className="form-control"
                  value={exp.from || ''}
                  onChange={e => setProfile(p => {
                    const arr = [...p.experiences]; arr[i].from = e.target.value;
                    return { ...p, experiences: arr };
                  })}
                />
              </div>
              <div className="col">
                <label>To</label>
                <input
                  type="month"
                  className="form-control"
                  value={exp.to || ''}
                  onChange={e => setProfile(p => {
                    const arr = [...p.experiences]; arr[i].to = e.target.value;
                    return { ...p, experiences: arr };
                  })}
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline-primary mb-4"
          onClick={() => setProfile(p => ({
            ...p,
            experiences: [...p.experiences, { company: '', aboutJob: '', from: '', to: '' }],
          }))}>
          <FontAwesomeIcon icon="plus" /> Add Experience
        </button>

        {/* Education */}
        <h5>Education</h5>
        {profile.education.map((edu, i) => (
          <div className="border rounded p-3 mb-3" key={i}>
            <div className="d-flex justify-content-between mb-2">
              <h6>Education #{i + 1}</h6>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveField('education', i)}>
                <FontAwesomeIcon icon="minus-circle" />
              </button>
            </div>
            <input
              className="form-control mb-2"
              placeholder="University/Institution"
              value={edu.university || ''}
              onChange={e => setProfile(p => {
                const arr = [...p.education]; arr[i].university = e.target.value;
                return { ...p, education: arr };
              })}
            />
            <div className="row mb-2">
              <div className="col">
                <label>From</label>
                <input
                  type="month"
                  className="form-control"
                  value={edu.from || ''}
                  onChange={e => setProfile(p => {
                    const arr = [...p.education]; arr[i].from = e.target.value;
                    return { ...p, education: arr };
                  })}
                />
              </div>
              <div className="col">
                <label>To</label>
                <input
                  type="month"
                  className="form-control"
                  value={edu.to || ''}
                  onChange={e => setProfile(p => {
                    const arr = [...p.education]; arr[i].to = e.target.value;
                    return { ...p, education: arr };
                  })}
                />
              </div>
            </div>
            <input
              className="form-control"
              placeholder="Grade (e.g., A, 3.5 GPA)"
              value={edu.grade || ''}
              onChange={e => setProfile(p => {
                const arr = [...p.education]; arr[i].grade = e.target.value;
                return { ...p, education: arr };
              })}
            />
          </div>
        ))}
        <button type="button" className="btn btn-outline-primary mb-4"
          onClick={() => setProfile(p => ({
            ...p,
            education: [...p.education, { university: '', from: '', to: '', grade: '' }],
          }))}>
          <FontAwesomeIcon icon="plus" /> Add Education
        </button>

        {/* Skills */}
<h5>Technical Skills</h5>
{profile.skills.technical.map((s, i) => (
  <div className="input-group mb-2" key={`tech-${i}`}>
    <input
      className="form-control"
      list="technical-skill-list"
      value={s}
      onChange={e => setProfile(p => {
        const arr = [...p.skills.technical];
        arr[i] = e.target.value;
        return { ...p, skills: { ...p.skills, technical: arr } };
      })}
      placeholder="Select or type a skill"
    />
    <datalist id="technical-skill-list">
      {ALL_TECHNICAL_SKILLS.map(skill => <option key={skill} value={skill} />)}
    </datalist>
    <button type="button" className="btn btn-outline-danger" onClick={() => setProfile(p => {
      const arr = [...p.skills.technical];
      arr.splice(i, 1);
      return { ...p, skills: { ...p.skills, technical: arr } };
    })}>
      <FontAwesomeIcon icon="minus" />
    </button>
  </div>
))}
<button type="button" className="btn btn-outline-primary mb-3" onClick={() => setProfile(p => ({
  ...p,
  skills: {
    ...p.skills,
    technical: [...p.skills.technical, '']
  }
}))}>
  <FontAwesomeIcon icon="plus" /> Add Technical Skill
</button>

<h5>Non-Technical Skills</h5>
{profile.skills.nonTechnical.map((s, i) => (
  <div className="input-group mb-2" key={`nontech-${i}`}>
    <input
      className="form-control"
      list="nontechnical-skill-list"
      value={s}
      onChange={e => setProfile(p => {
        const arr = [...p.skills.nonTechnical];
        arr[i] = e.target.value;
        return { ...p, skills: { ...p.skills, nonTechnical: arr } };
      })}
      placeholder="Select or type a skill"
    />
    <datalist id="nontechnical-skill-list">
      {ALL_NON_TECHNICAL_SKILLS.map(skill => <option key={skill} value={skill} />)}
    </datalist>
    <button type="button" className="btn btn-outline-danger" onClick={() => setProfile(p => {
      const arr = [...p.skills.nonTechnical];
      arr.splice(i, 1);
      return { ...p, skills: { ...p.skills, nonTechnical: arr } };
    })}>
      <FontAwesomeIcon icon="minus" />
    </button>
  </div>
))}
<button type="button" className="btn btn-outline-primary mb-3" onClick={() => setProfile(p => ({
  ...p,
  skills: {
    ...p.skills,
    nonTechnical: [...p.skills.nonTechnical, '']
  }
}))}>
  <FontAwesomeIcon icon="plus" /> Add Non-Technical Skill
</button>
        {/* Certifications */}
        <h5>Certifications</h5>
        {profile.certifications.map((cert, i) => (
          <div className="border rounded p-3 mb-3" key={i}>
            <div className="d-flex justify-content-between mb-2">
              <h6>Certification #{i + 1}</h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleRemoveField('certifications', i)}
              >
                <FontAwesomeIcon icon="minus-circle" />
              </button>
            </div>
            <input
              className="form-control mb-2"
              placeholder="Name"
              value={cert.name || ''}
              onChange={e => setProfile(p => {
                const arr = [...p.certifications];
                arr[i].name = e.target.value;
                return { ...p, certifications: arr };
              })}
            />
            <input
              className="form-control mb-2"
              placeholder="Link or Image URL"
              value={cert.link || ''}
              onChange={e => setProfile(p => {
                const arr = [...p.certifications];
                arr[i].link = e.target.value;
                return { ...p, certifications: arr };
              })}
            />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary mb-4"
          onClick={() => handleAddField('certifications', { name: '', link: '' })}
        >
          <FontAwesomeIcon icon="plus" /> Add Certification
        </button>

        {/* Achievements */}
        <h5>Achievements</h5>
        {profile.achievements.map((ach, i) => (
          <div className="input-group mb-2" key={`ach-${i}`}>
            <input
              className="form-control"
              value={ach}
              onChange={e => handleChangeArray('achievements', i, e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => handleRemoveField('achievements', i)}
            >
              <FontAwesomeIcon icon="minus" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={() => handleAddField('achievements', '')}
        >
          <FontAwesomeIcon icon="plus" /> Add Achievement
        </button>

        {/* Hobbies */}
        <h5>Hobbies</h5>
        {profile.hobbies.map((hobby, i) => (
          <div className="input-group mb-2" key={`hobby-${i}`}>
            <input
              className="form-control"
              value={hobby}
              onChange={e => handleChangeArray('hobbies', i, e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => handleRemoveField('hobbies', i)}
            >
              <FontAwesomeIcon icon="minus" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={() => handleAddField('hobbies', '')}
        >
          <FontAwesomeIcon icon="plus" /> Add Hobby
        </button>

        {/* Languages */}
        <h5>Languages</h5>
        {profile.languages.map((lang, i) => (
          <div className="input-group mb-2" key={`lang-${i}`}>
            <input
              className="form-control"
              value={lang}
              onChange={e => handleChangeArray('languages', i, e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => handleRemoveField('languages', i)}
            >
              <FontAwesomeIcon icon="minus" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={() => handleAddField('languages', '')}
        >
          <FontAwesomeIcon icon="plus" /> Add Language
        </button>

        <button type="submit" className="btn btn-success w-100 mt-4">Save Profile</button>
      </form>
    </div>
  );
}
