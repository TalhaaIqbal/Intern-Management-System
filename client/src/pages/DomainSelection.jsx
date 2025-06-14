import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DomainSelection = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            const fetchEmail = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/api/get-user');
                    if (res.status === 200) {
                        console.log(res.data);
                        setEmail(res.data.email);
                        localStorage.setItem("userEmail", res.data.email);
                    } else {
                        console.error("Failed to fetch user email");
                    }
                } catch (err) {
                    console.error("Error fetching user email:", err);
                    setError("Unable to retrieve user email.");
                }
            };

            fetchEmail();
        }
    }, []);


    const domains = [
        { id: 'web', title: '🌐 Web Development', description: 'Frontend, Backend, Full Stack Development', skills: ['JavaScript', 'React', 'Node.js', 'SQL'] },
        { id: 'ai', title: '🤖 AI/ML', description: 'Machine Learning, Artificial Intelligence, Data Science', skills: ['Python', 'ML/AI', 'SQL', 'AWS'] },
        { id: 'mobile', title: '📱 Mobile/App Development', description: 'iOS, Android, Cross-platform Development', skills: ['Swift', 'Kotlin', 'Java'] },
        { id: 'cybersecurity', title: '🔐 Cybersecurity', description: 'Ethical Hacking, Network Security, Information Security', skills: ['Linux', 'Networking', 'Python', 'Burp Suite'] },
        { id: 'cloud', title: '☁️ Cloud Computing', description: 'Cloud Architecture, DevOps, Infrastructure as Code', skills: ['AWS', 'Azure', 'Docker', 'Kubernetes'] },
        { id: 'blockchain', title: '⛓️ Blockchain Development', description: 'Smart Contracts, Decentralized Apps, Crypto', skills: ['Solidity', 'Ethereum', 'Web3.js', 'Truffle'] },
    ];

    const handleDomainSelect = async (domainId) => {
        if (!email) return;

        try {
            setLoading(true);
            setError(null);

            // 1. Set domain
            const res = await axios.patch('http://localhost:5000/api/select-domain', {
                email,
                domain: domainId
            });

            if (res.status === 200) {
                const userEmail = res.data.userEmail;
                localStorage.setItem("userEmail", userEmail);
                console.log("Domain selected successfully for:", res.data);

                console.log("User email:", userEmail, "Domain ID:", domainId);

                // 2. Assign tasks
                const assignRes = await axios.post('http://localhost:5000/api/assign-tasks', {
                    email,
                    domain: domainId,
                });

                if (assignRes.status === 200) {
                    console.log("Tasks auto-assigned:", assignRes.data);
                    navigate('/intern-dashboard');
                } else {
                    setError("Domain set but failed to auto-assign tasks.");
                }
            } else {
                setError("Failed to select domain. Please try again.");
            }
        } catch (err) {
            console.error("Full error:", err);
            if (err.response) {
                console.error("Backend error response:", err.response.data);
            } else {
                console.error("Unexpected error:", err.message);
            }
            setError("An error occurred during domain setup.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] pt-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Select Your Domain</h1>
                    <p className="text-gray-600">Choose the domain you want to specialize in during your internship</p>
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {domains.map((domain) => (
                        <div
                            key={domain.id}
                            onClick={() => !loading && handleDomainSelect(domain.id)}
                            className={`bg-white rounded-lg p-6 shadow-md cursor-pointer hover:shadow-lg transition-transform duration-300 ease-in-out ${loading ? 'opacity-50 pointer-events-none' : 'hover:scale-105'
                                }`}
                        >
                            <h2 className="text-xl text-center font-bold text-gray-800 mb-2">{domain.title}</h2>
                            <p className="text-gray-600 mb-4">{domain.description}</p>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Key Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                    {domain.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DomainSelection;