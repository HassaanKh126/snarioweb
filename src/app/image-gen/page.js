'use client'

import { useState } from 'react';
import './imagegen.css';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/auth-context';

export default function GenerateImage() {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [imageId, setImageId] = useState("");
    const { user } = useAuth();

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userId,
                    prompt,
                    ar: aspectRatio,
                    id: imageId,
                }),
            });

            const data = await response.json();

            if (data?.success === true) {
                if (data.newImage) {
                    const image_data = data.newImage;
                    setImageId(image_data._id);
                    setImages((prev) => [image_data.images.at(-1), ...prev]);
                }

                if (data.updatedImage) {
                    const allImages = data.updatedImage.images;
                    setImages((prev) => [allImages.at(-1), ...prev]);
                }
            } else {
                setError(data.error || 'Failed to generate image.');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }

        setLoading(false);
    };


    return (
        <ProtectedRoute>
            <div className="page">
                <div className="panel">
                    <h1>Generate AI Image</h1>

                    <label>Prompt</label>
                    <textarea
                        placeholder="Describe your image..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                    />

                    <label>Aspect Ratio</label>
                    <div className="ar-group">
                        {['1:1', '16:9', '21:9', '3:2', '2:3', '4:5', '5:4', '3:4', '4:3', '9:16', '9:21'].map(ar => (
                            <button
                                key={ar}
                                className={`ar-btn ${aspectRatio === ar ? 'active' : ''}`}
                                onClick={() => setAspectRatio(ar)}
                            >
                                {ar}
                            </button>
                        ))}
                    </div>

                    <button
                        className="generate-btn"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Image'}
                    </button>

                    {error && <div className="error">{error}</div>}

                    {images.length > 0 && (
                        <div className="output">
                            {images.map((imgUrl, idx) => (
                                <div key={idx} className="image-wrapper">
                                    <img src={imgUrl} alt={`Generated ${idx}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
