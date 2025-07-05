'use client';
import { useEffect, useState } from 'react';
import './signup.css';
import { useAuth } from '../context/auth-context';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        console.log(isAuthenticated);

        if (isAuthenticated) {
            window.location.href = '/dashboard';
        }
    }, [isAuthenticated]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            console.log(res);

            const data = await res.json()

            console.log(data);

            if (!res.ok) {
                if (data.message === "Username taken!") {
                    setError("Username already taken!")
                }
                else if (data.message === "An account with this email already exists!") {
                    setError("An account with this email already exists!")
                }
                else {
                    setError('Registration failed');
                }
            }
            else {
                if (data.message === "User registered successfully") {
                    window.location.href = '/login';
                }
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="singularity">
            <div className="left-panel">
                <h2>Create your account</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                    <div className="register">
                        Already have an account? <a href="/login">Sign In</a>
                    </div>
                </form>
            </div>
            <div className="right-panel">
                {/* <div className="brand">Snario</div> */}
                <div className="brand">Kontent Flow</div>
                <div className="tagline">
                    Build and deliver content pipelines with clarity, speed, and flow.
                </div>
                <div className="grain-overlay"></div>
            </div>
        </div>
    );
}
