'use client'

import { useEffect, useState } from 'react';
import '../imagegen.css';
import { useParams } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/auth-context';

export default function GenerateImage() {
    const params = useParams();
    const id = params.id;

    const { user } = useAuth()

    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);
    const [imageId, setImageId] = useState("");

    useEffect(() => {
        const fetchScript = async () => {
            try {
                const res = await fetch('/api/get-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch image');
                }

                const data = await res.json();
                const image_data = data.image;

                if (image_data?._id === id) {
                    setImageId(image_data._id);
                    setImages(image_data.images.slice().reverse());
                }
            } catch (err) {
                setError('Error: ' + err.message);
            }
        };

        fetchScript()
    }, [])

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const endpoint = imageId === "" ? '/api/create-image' : '/api/add-image';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userId,
                    prompt,
                    ar: aspectRatio,
                    id: imageId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();

            if (data?.success === true) {
                if (data.newImage) {
                    const image_data = data.newImage;
                    setImageId(image_data._id);
                    setImages(image_data.images.slice().reverse());
                }

                if (data.updatedImage) {
                    const allImages = data.updatedImage;
                    setImages(allImages.images.slice().reverse());
                }
            } else {
                setError('Failed to generate image.');
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
