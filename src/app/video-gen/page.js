'use client';

import { useEffect, useState } from 'react';
import './VideoGenerationPage.css';
import ProtectedRoute from '../components/ProtectedRoute';

export default function VideoGenerationPage() {
    const [step, setStep] = useState(1);
    const [scriptOption, setScriptOption] = useState('');
    const [idea, setIdea] = useState('');
    const [script, setScript] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [videoAR, setVideoAR] = useState('16:9');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [loadingStage, setLoadingStage] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [videoLink, setVideoLink] = useState('');

    const assetGenerationMessages = [
        'Generating assets...',
        'Optimizing scenes...',
        'Rendering visual elements...',
        'Generating audio layers...',
        'Finalizing content...',
        'Almost done with assets...'
    ];

    const renderingMessages = [
        'Preparing video rendering...',
        'Compositing scenes...',
        'Syncing audio...',
        'Finalizing video...',
        'Almost done with rendering...'
    ];

    const [captionStyle, setCaptionStyle] = useState({
        CaptionType: 'line',
        Fontname: 'Arial',
        Fontsize: 90,
        PrimaryColour: '&H00FFFFFF',
        Bold: -1,
        Italic: 0,
        Alignment: 2,
        Outline: 0,
        Shadow: 1,
    });


    useEffect(() => {
        if (!loadingStage) return;

        const messages =
            loadingStage === 'script'
                ? ['Generating description...']
                : loadingStage === 'assets'
                    ? assetGenerationMessages
                    : renderingMessages;

        let index = 0;
        setLoadingMessage(messages[index]);

        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setLoadingMessage(messages[index]);
        }, 2000);

        return () => clearInterval(interval);
    }, [loadingStage]);


    const handleOptionSelect = (option) => {
        setScriptOption(option);
        setError('');
        if (option === 'own') setStep(2);
        else setStep(1.5);
    };

    const handleGenerateScript = async () => {
        if (!idea.trim()) {
            setError('Please describe your idea.');
            return;
        }
        setLoading(true);
        setLoadingStage('script');
        setError('');
        try {
            const resp = await fetch('/api/generate-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: idea }),
            });
            const data = await resp.json();
            if (data?.script) {
                setScript(data.script);
                setStep(2);
            } else {
                setError('Failed to generate script.');
            }
        } catch (err) {
            setError(err.message || 'Unknown error');
        }
        setLoading(false);
    };

    const handleSubmitDetailsStep = () => {
        if (!script.trim()) {
            setError('Script is required.');
            return;
        }
        setError('');
        setStep(3);
    };

    const handleFinalSubmit = async () => {
    setLoading(true);
    setLoadingStage('assets');
    setError('');

    try {
        // 🚀 Call /api/generate-link
        const firstResponse = await fetch("/api/generate-link", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: localStorage.getItem('id'),
                prompt: script,
                usr_lang: selectedLanguage,
                transcription_style: captionStyle.CaptionType,
                aspect_ratio: videoAR,
                generate_images: true,
                generate_audio: true,
            }),
        });

        if (!firstResponse.ok) throw new Error('First backend failed');
        const firstData = await firstResponse.json();
        console.log('✅ First backend response:', firstData);

        if (!firstData?.assets) throw new Error('No assets returned');

        setLoadingStage('rendering');

        // 🚀 Call /api/render
        const secondResponse = await fetch("/api/render", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: localStorage.getItem('id'),
                fid: firstData.request_id,
                images: firstData.assets.images,
                audio: firstData.assets.audio,
                captions: firstData.assets.captions,
                scenes: firstData.assets.scenes,
                aspect_ratio: videoAR,
                add_image_overlay: false, // adjust if needed
                styles: captionStyle,
            }),
        });

        if (!secondResponse.ok) throw new Error('Second backend failed');
        const secondData = await secondResponse.json();
        console.log('✅ Second backend response:', secondData);

        if (secondData.status === 'success' && secondData.video_url) {
            // 🚀 Call /api/create-video
            try {
                const saveResponse = await fetch('/api/create-video', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: localStorage.getItem("id"),
                        videoUrl: `${localStorage.getItem("id")}/${firstData.request_id}.mp4`
                    }),
                });

                if (!saveResponse.ok) {
                    const errorData = await saveResponse.json();
                    throw new Error(errorData.error || 'Failed to save video');
                }

                const saveData = await saveResponse.json();
                if (saveData.success === true) {
                    setVideoLink(saveData.newVideo._id);
                    setStep('completed');
                }
            } catch (err) {
                console.log(`❌ Save error: ${err.message}`);
                throw err;
            }
        } else {
            throw new Error('Video generation failed');
        }
    } catch (err) {
        console.error(err);
        setError(err.message || 'Something went wrong');
        setStep('error');
    }

    setLoading(false);
};


    const whisperLanguages = [
        { code: "af", name: "Afrikaans" },
        { code: "sq", name: "Albanian" },
        { code: "am", name: "Amharic" },
        { code: "ar", name: "Arabic" },
        { code: "hy", name: "Armenian" },
        { code: "as", name: "Assamese" },
        { code: "az", name: "Azerbaijani" },
        { code: "ba", name: "Bashkir" },
        { code: "eu", name: "Basque" },
        { code: "be", name: "Belarusian" },
        { code: "bn", name: "Bengali" },
        { code: "bs", name: "Bosnian" },
        { code: "br", name: "Breton" },
        { code: "bg", name: "Bulgarian" },
        { code: "my", name: "Burmese" },
        { code: "ca", name: "Catalan" },
        { code: "zh", name: "Chinese" },
        { code: "hr", name: "Croatian" },
        { code: "cs", name: "Czech" },
        { code: "da", name: "Danish" },
        { code: "nl", name: "Dutch" },
        { code: "en", name: "English" },
        { code: "et", name: "Estonian" },
        { code: "fo", name: "Faroese" },
        { code: "fi", name: "Finnish" },
        { code: "fr", name: "French" },
        { code: "gl", name: "Galician" },
        { code: "ka", name: "Georgian" },
        { code: "de", name: "German" },
        { code: "el", name: "Greek" },
        { code: "gu", name: "Gujarati" },
        { code: "ht", name: "Haitian Creole" },
        { code: "ha", name: "Hausa" },
        { code: "haw", name: "Hawaiian" },
        { code: "he", name: "Hebrew" },
        { code: "hi", name: "Hindi" },
        { code: "hu", name: "Hungarian" },
        { code: "is", name: "Icelandic" },
        { code: "id", name: "Indonesian" },
        { code: "it", name: "Italian" },
        { code: "ja", name: "Japanese" },
        { code: "jw", name: "Javanese" },
        { code: "kn", name: "Kannada" },
        { code: "kk", name: "Kazakh" },
        { code: "km", name: "Khmer" },
        { code: "ko", name: "Korean" },
        { code: "lo", name: "Lao" },
        { code: "la", name: "Latin" },
        { code: "lv", name: "Latvian" },
        { code: "lt", name: "Lithuanian" },
        { code: "ln", name: "Lingala" },
        { code: "lb", name: "Luxembourgish" },
        { code: "mg", name: "Malagasy" },
        { code: "ms", name: "Malay" },
        { code: "ml", name: "Malayalam" },
        { code: "mt", name: "Maltese" },
        { code: "mi", name: "Maori" },
        { code: "mk", name: "Macedonian" },
        { code: "mr", name: "Marathi" },
        { code: "mn", name: "Mongolian" },
        { code: "ne", name: "Nepali" },
        { code: "no", name: "Norwegian" },
        { code: "oc", name: "Occitan" },
        { code: "pa", name: "Punjabi" },
        { code: "ps", name: "Pashto" },
        { code: "fa", name: "Persian" },
        { code: "pl", name: "Polish" },
        { code: "pt", name: "Portuguese" },
        { code: "ro", name: "Romanian" },
        { code: "ru", name: "Russian" },
        { code: "sa", name: "Sanskrit" },
        { code: "sr", name: "Serbian" },
        { code: "sd", name: "Sindhi" },
        { code: "si", name: "Sinhala" },
        { code: "sk", name: "Slovak" },
        { code: "sl", name: "Slovenian" },
        { code: "so", name: "Somali" },
        { code: "es", name: "Spanish" },
        { code: "sw", name: "Swahili" },
        { code: "sv", name: "Swedish" },
        { code: "tg", name: "Tajik" },
        { code: "tl", name: "Tagalog" },
        { code: "ta", name: "Tamil" },
        { code: "tt", name: "Tatar" },
        { code: "te", name: "Telugu" },
        { code: "th", name: "Thai" },
        { code: "ti", name: "Tigrinya" },
        { code: "tr", name: "Turkish" },
        { code: "tk", name: "Turkmen" },
        { code: "ug", name: "Uyghur" },
        { code: "uk", name: "Ukrainian" },
        { code: "ur", name: "Urdu" },
        { code: "uz", name: "Uzbek" },
        { code: "vi", name: "Vietnamese" },
        { code: "cy", name: "Welsh" },
        { code: "yi", name: "Yiddish" },
        { code: "yo", name: "Yoruba" }
    ];


    const assToHex = (ass) => {
        const bb = ass.slice(4, 6);
        const gg = ass.slice(6, 8);
        const rr = ass.slice(8, 10);
        return `${rr}${gg}${bb}`;
    };

    const hexToAss = (hex) => {
        const cleanHex = hex.replace('#', '').toUpperCase();
        const rr = cleanHex.slice(0, 2);
        const gg = cleanHex.slice(2, 4);
        const bb = cleanHex.slice(4, 6);
        return `&H00${bb}${gg}${rr}`;
    };

    return (
        <ProtectedRoute>
            <div className="video-gen-container">
                {loading ? (
                    <div className="video-gen-loader-container">
                        <h1 className="video-gen-title">Video Generator</h1>
                        <div className="video-gen-loader"></div>
                        <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>{loadingMessage}</p>

                    </div>
                ) : step === 'completed' ? (
                    <div className="video-gen-card">
                        <h2>🎉 Video Generated Successfully!</h2>
                        <p>Your video is ready.</p>
                        <a
                            href={`video/${videoLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="video-gen-button"
                        >
                            View Video
                        </a>
                    </div>
                ) : (
                    <div className="video-gen-card">
                        <h1 className="video-gen-title">Video Generator</h1>


                        {step === 1 && (
                            <>
                                <p>Choose how you want to provide the script:</p>
                                <div className="video-gen-button-group">
                                    <button onClick={() => handleOptionSelect('own')} className="video-gen-button">
                                        Use My Own Script
                                    </button>
                                    <button onClick={() => handleOptionSelect('ai')} className="video-gen-button">
                                        Generate with AI
                                    </button>
                                </div>
                                {error && <p className="video-gen-error">{error}</p>}
                            </>
                        )}

                        {step === 1.5 && (
                            <>
                                <p>Describe your idea and we’ll generate a script for you:</p>
                                <textarea
                                    placeholder="Enter your idea here..."
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                    rows={4}
                                    className="video-gen-input"
                                />
                                {error && <p className="video-gen-error">{error}</p>}
                                <div className="video-gen-button-group">
                                    <button onClick={() => setStep(1)} className="video-gen-button">⬅ Back</button>
                                    <button onClick={handleGenerateScript} disabled={loading} className="video-gen-button">
                                        {loading ? 'Generating Script...' : 'Generate Script'}
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h2 className="video-gen-subtitle">Script (Editable)</h2>
                                <textarea
                                    value={script}
                                    onChange={(e) => setScript(e.target.value)}
                                    rows={6}
                                    className="video-gen-input"
                                />

                                <h3>Video & Image Aspect Ratio</h3>
                                <select
                                    value={videoAR}
                                    onChange={(e) => setVideoAR(e.target.value)}
                                    className="video-gen-input"
                                >
                                    <option>1:1</option>
                                    <option>16:9</option>
                                    <option>21:9</option>
                                    <option>3:2</option>
                                    <option>2:3</option>
                                    <option>4:5</option>
                                    <option>5:4</option>
                                    <option>3:4</option>
                                    <option>4:3</option>
                                    <option>9:16</option>
                                    <option>9:21</option>
                                </select>

                                <h3>Language</h3>
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="video-gen-input"
                                >
                                    {whisperLanguages.map((lang) => (
                                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                                    ))}
                                </select>

                                {error && <p className="video-gen-error">{error}</p>}

                                <div className="video-gen-button-group">
                                    <button onClick={() => setStep(1)} className="video-gen-button">⬅ Back</button>
                                    <button onClick={handleSubmitDetailsStep} className="video-gen-button">
                                        Next ➡
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <h2 className="video-gen-subtitle">Subtitle Settings</h2>

                                <div className="video-gen-form-grid">
                                    <label>Caption Type</label>
                                    <select
                                        value={captionStyle.CaptionType}
                                        onChange={(e) => setCaptionStyle({ ...captionStyle, CaptionType: e.target.value })}
                                    >
                                        <option value="line">Line by Line</option>
                                        <option value="word">Word by Word</option>
                                    </select>

                                    <label>Font</label>
                                    <select
                                        value={captionStyle.Fontname}
                                        onChange={(e) => setCaptionStyle({ ...captionStyle, Fontname: e.target.value })}
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Helvetica">Helvetica</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Verdana">Verdana</option>
                                    </select>

                                    <label>Font Size</label>
                                    <input
                                        type="number"
                                        value={captionStyle.Fontsize}
                                        onChange={(e) =>
                                            setCaptionStyle({ ...captionStyle, Fontsize: parseInt(e.target.value) })
                                        }
                                    />

                                    <label>Primary Color</label>
                                    <input
                                        type="color"
                                        value={'#' + assToHex(captionStyle.PrimaryColour)}
                                        onChange={(e) =>
                                            setCaptionStyle({ ...captionStyle, PrimaryColour: hexToAss(e.target.value) })
                                        }
                                    />

                                    <label style={{ marginBottom: 10, marginTop: 10 }}>Bold</label>
                                    <input
                                        type="checkbox"
                                        checked={captionStyle.Bold === -1}
                                        onChange={(e) => setCaptionStyle({ ...captionStyle, Bold: e.target.checked ? -1 : 0 })}
                                    />

                                    <label>Italic</label>
                                    <input
                                        type="checkbox"
                                        checked={captionStyle.Italic === 1}
                                        onChange={(e) => setCaptionStyle({ ...captionStyle, Italic: e.target.checked ? 1 : 0 })}
                                    />

                                    <label>Alignment</label>
                                    <select
                                        value={captionStyle.Alignment}
                                        onChange={(e) =>
                                            setCaptionStyle({ ...captionStyle, Alignment: parseInt(e.target.value) })
                                        }
                                    >
                                        <option value={1}>Bottom Left (1)</option>
                                        <option value={2}>Bottom Center (2)</option>
                                        <option value={3}>Bottom Right (3)</option>
                                        <option value={4}>Middle Left (4)</option>
                                        <option value={5}>Middle Center (5)</option>
                                        <option value={6}>Middle Right (6)</option>
                                        <option value={7}>Top Left (7)</option>
                                        <option value={8}>Top Center (8)</option>
                                        <option value={9}>Top Right (9)</option>
                                    </select>

                                    <label>Outline (px)</label>
                                    <input
                                        type="number"
                                        value={captionStyle.Outline}
                                        onChange={(e) =>
                                            setCaptionStyle({ ...captionStyle, Outline: parseInt(e.target.value) })
                                        }
                                    />

                                    <label>Shadow (px)</label>
                                    <input
                                        type="number"
                                        value={captionStyle.Shadow}
                                        onChange={(e) =>
                                            setCaptionStyle({ ...captionStyle, Shadow: parseInt(e.target.value) })
                                        }
                                    />
                                </div>

                                {error && <p className="video-gen-error">{error}</p>}

                                <div className="video-gen-button-group">
                                    <button onClick={() => setStep(2)} className="video-gen-button">⬅ Back</button>
                                    <button onClick={handleFinalSubmit} disabled={loading} className="video-gen-button">
                                        {loading ? 'Submitting...' : 'Generate Video'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
