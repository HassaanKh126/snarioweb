'use client'

import Head from 'next/head';
import { useEffect, useState } from 'react';
import './dashboard.css';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/auth-context';

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [scripts, setScripts] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      if (!user) return;

      try {
        const scriptsRes = await fetch('/api/fetch-scripts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userId }),
        });
        if (!scriptsRes.ok) throw new Error('Failed to fetch scripts');
        const scriptsData = await scriptsRes.json();
        setScripts(scriptsData.scripts || []);

        const imagesRes = await fetch('/api/fetch-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userId }),
        });
        if (!imagesRes.ok) throw new Error('Failed to fetch images');
        const imagesData = await imagesRes.json();
        setImages(imagesData.images || []);

        const videosRes = await fetch('/api/fetch-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userId }),
        });
        if (!videosRes.ok) throw new Error('Failed to fetch videos');
        const videosData = await videosRes.json();
        setVideos(videosData.videos || []);

      } catch (err) {
        console.log(err.message);
      }
    };

    fetchAll();
  }, [user]);


  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCreate = (type) => {
    if (type === "Script") {
      window.location.href = "/script-gen"
    }
    if (type === "Image") {
      window.location.href = "/image-gen"
    }
    if (type === "Video") {
      window.location.href = "/video-gen"
    }

    closeModal();
  };

  return (
    <ProtectedRoute>
      <div className="dash-container">
        {/* Sidebar */}
        <div className="dash-sidebar">
          <button className="dash-create-btn" onClick={openModal}>
            Create
          </button>
        </div>

        {/* Main Content */}
        <div className="dash-main-content">
          {/* App header */}
          <div className="dash-header">
            <div className="dash-app-name">KontentFlow</div>
            <div className="dash-account">
              <button
                className="dash-account-btn"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user?.username}
              </button>
              {showDropdown && (
                <div className="dash-dropdown">
                  <button className="dash-dropdown-item" onClick={logout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <h1 className="dash-heading">Bring your ideas to life</h1>

          <div className="dash-recent-projects">
            <h2>Recent Projects</h2>
            <div className="dash-projects-grid">
              {scripts.map((script, index) => (
                <div
                  key={index}
                  className="dash-project-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    window.location.href = `/script-gen/${script._id}`;
                  }}
                >
                  <strong>{script.script_name}</strong>
                  <div className="dash-project-type">Script</div>
                </div>
              ))}
              {images.map((image, index) => (
                <div
                  key={index}
                  className="dash-project-card"
                  style={{ animationDelay: `${(scripts.length + index) * 0.05}s` }}
                  onClick={() => {
                    window.location.href = `/image-gen/${image._id}`;
                  }}
                >
                  <strong>{image.img_proj_name}</strong>
                  <div className="dash-project-type">Image</div>
                </div>
              ))}
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="dash-project-card"
                  style={{
                    animationDelay: `${(scripts.length + images.length + index) * 0.05
                      }s`,
                  }}
                  onClick={() => {
                    window.location.href = `/video/${video._id}`;
                  }}
                >
                  <strong>{video.vid_proj_name}</strong>
                  <div className="dash-project-type">Video</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="dash-modal-overlay">
          <div className="dash-modal">
            <h3>Create New Project</h3>

            <p>Choose type:</p>
            <div className="dash-modal-buttons">
              <button className="dash-modal-btn" onClick={() => handleCreate('Script')}>
                Script
              </button>
              <button className="dash-modal-btn" onClick={() => handleCreate('Image')}>
                Image
              </button>
              <button className="dash-modal-btn" onClick={() => handleCreate('Video')}>
                Video
              </button>
            </div>
            <button className="dash-modal-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

    </ProtectedRoute>
  );
}
