'use client'

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import '../script.css';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function GenerateScript() {
    const params = useParams();
    const id = params.id;

    const [input, setInput] = useState('');
    const [generatedScript, setGeneratedScript] = useState('');
    const [modification, setModification] = useState('');
    const [loadingGenerate, setLoadingGenerate] = useState(false);
    const [loadingModify, setLoadingModify] = useState(false);
    const [error, setError] = useState('');
    const [saveStatus, setSaveStatus] = useState('');
    const [currentId, setCurrentId] = useState('');

    useEffect(() => {
        const fetchScript = async () => {
            try {
                const response = await fetch(`/api/fetch-script`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id }),
                });

                const data = await response.json();
                const script_data = data.script
                if (script_data._id === id) {
                    setGeneratedScript(script_data.generatedScript)
                    setInput(script_data.userInput)
                    setCurrentId(id)
                }

            } catch (err) {
                setError('Error: ' + err.message);
            }
        };
        fetchScript()
    }, [])

    const handleGenerate = async () => {
        if (input.trim() === '') {
            setError('Please enter your video idea.');
            return;
        }

        setLoadingGenerate(true);
        setError('');
        setSaveStatus('');

        try {
            const response = await fetch('/api/generate-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                }),
            });

            const data = await response.json();
            if (data && data.script) {
                setGeneratedScript(data.script);
                handleSave(data.script)
            } else {
                setError('Failed to generate script.');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }
        setLoadingGenerate(false);
    };

    const handleModify = async () => {
        if (modification.trim() === '') {
            setError('Please describe the changes you want.');
            return;
        }

        setLoadingModify(true);
        setError('');
        setSaveStatus('');

        try {
            const response = await fetch('/api/generate-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `${modification}\n\n\n${generatedScript}`,
                }),
            });

            const data = await response.json();
            if (data && data.script) {
                setGeneratedScript(data.script);
                handleedit(data.script)
                setModification('');
            } else {
                setError('Modification failed.');
            }
        } catch (err) {
            setError('Error: ' + err.message);
        }

        setLoadingModify(false);
    };

    const handleSave = async (script) => {
        if (!script) {
            setSaveStatus('No script to save.');
            return;
        }

        setSaveStatus('Saving...');

        try {
            const response = await fetch('/api/create-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: localStorage.getItem("id"),
                    userInput: input,
                    generatedScript: script,  // Optional: If you're associating with a project
                }),
            });


            if (response.ok) {
                setSaveStatus('✅ Script saved successfully.');
                const data = await response.json()
                setCurrentId(data._id)
            } else {
                const errorData = await response.json();
                setSaveStatus(`❌ Save failed: ${errorData.error || 'Unknown error'}`);
            }
        } catch (err) {
            setSaveStatus(`❌ Save error: ${err.message}`);
        }
    };

    const handleedit = async (script) => {
        if (!script) {
            setSaveStatus('No script to save.');
            return;
        }

        setSaveStatus('Saving...');

        try {
            const response = await fetch('/api/edit-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: currentId,
                    newScript: script,  // Optional: If you're associating with a project
                }),
            });

            const data = await response.json()
            console.log(data);


            if (response.ok) {
                setSaveStatus('✅ Script saved successfully.');
            } else {
                const errorData = await response.json();
                setSaveStatus(`❌ Save failed: ${errorData.error || 'Unknown error'}`);
            }
        } catch (err) {
            setSaveStatus(`❌ Save error: ${err.message}`);
        }
    };

    return (
        <ProtectedRoute>
            <div className="script-page">
                <div className="script-container user-panel">
                    <h2>Your Video Idea</h2>
                    <textarea
                        className="script-textarea"
                        placeholder="Describe your video idea..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={6}
                        disabled={generatedScript !== ''}
                    />
                    <button
                        className="script-btn primary-btn"
                        onClick={handleGenerate}
                        disabled={loadingGenerate || generatedScript !== ''}
                    >
                        {loadingGenerate ? 'Generating...' : 'Generate Script'}
                    </button>

                    {generatedScript && (
                        <>
                            <h3>Refine the Script</h3>
                            <textarea
                                className="script-textarea"
                                placeholder="Example: Make it funnier, shorter, etc..."
                                value={modification}
                                onChange={(e) => setModification(e.target.value)}
                                rows={3}
                            />
                            <button
                                className="script-btn secondary-btn"
                                onClick={handleModify}
                                disabled={loadingModify}
                            >
                                {loadingModify ? 'Modifying...' : 'Modify Script'}
                            </button>
                        </>
                    )}

                    {error && <div className="script-error">{error}</div>}
                    {saveStatus && <div className="script-save-status">{saveStatus}</div>}
                </div>

                <div className="script-container output-panel">
                    <h2>Generated Script</h2>
                    <div className="script-output">
                        {generatedScript ? <pre>{generatedScript}</pre> : <p>No script generated yet.</p>}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
