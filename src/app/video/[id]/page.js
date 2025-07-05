'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import '../video.css';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const VideoPage = () => {
  const params = useParams();
  const id = params.id;

  const [signedUrl, setSignedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    document.body.classList.add('video-page');
    return () => {
      document.body.classList.remove('video-page');
    };
  }, []);

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const response1 = await fetch(`/api/fetch-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        const data1 = await response1.json();
        const video_id = data1.video.video_url;
        setName(video_id)

        const response = await fetch(`${process.env.NEXT_PUBLIC_SNGV_BACKEND}/api/get-signed-url?id=${video_id}`);
        if (!response.ok) throw new Error('Failed to fetch signed URL');
        const data = await response.json();
        setSignedUrl(data.signedUrl);
        setFileMeta(data.meta);  // Assuming backend returns meta (size, createdAt)
      } catch (err) {
        console.error(err);
        setError(err.message);
      };
    }
    if (id) fetchSignedUrl();
  }, [id]);

  if (!id) return <p className="no-video-text">No video name provided.</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (!signedUrl) return <p className="loading-text">Loading video...</p>;

  return (
    <ProtectedRoute>
      <div className="vp-page-wrapper">
        <div className="vp-video-container">
          <div className="vp-video-details">
            <h1>{name.split("/")[1]}</h1>
            <div>
              {fileMeta && (
                <>
                  <p>Size: {fileMeta.size}</p>
                  <p>Created At: {fileMeta.createdAt}</p>
                </>
              )}
              <button className='vp-secondary-btn' onClick={() => window.history.back()}>Go Back</button>
              <button className="vp-primary-btn" onClick={() => window.location.href = "/schedule"}>Schedule</button>
            </div>
          </div>

          <div className="vp-video-player">
            <video controls>
              <source src={signedUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VideoPage;
