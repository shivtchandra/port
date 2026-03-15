"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    getDocs,
    getDoc,
    setDoc,
    doc,
    deleteDoc,
    addDoc,
    serverTimestamp,
    updateDoc
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail, Clock, Trash2, Loader2, RefreshCw, AlertCircle,
    Briefcase, Code2, GraduationCap, FileText, Settings,
    ChevronRight, Plus, Save, X, ExternalLink
} from "lucide-react";

export const dynamic = "force-dynamic";

type Tab = "messages" | "projects" | "experience" | "skills" | "blogs" | "leadership" | "certifications" | "settings" | "freelance_missions";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>("messages");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [inputPassword, setInputPassword] = useState("");
    const [authError, setAuthError] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const isConfigured = true; // Firebase is initialized in lib/firebase

    const fetchData = async (tab: Tab) => {
        setRefreshing(true);
        try {
            if (tab === 'settings') {
                const docRef = doc(db, 'site_settings', 'about');
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setData([{ id: docSnap.id, ...docSnap.data() }]);
                } else {
                    setData([]);
                }
            } else {
                const table = tab === 'messages' ? 'transmissions' : tab;
                const orderField = tab === 'messages' ? 'timestamp' : 'display_order';
                const q = query(collection(db, table), orderBy(orderField, 'desc'));
                const querySnapshot = await getDocs(q);
                
                setData(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        } catch (e: any) {
            console.error(`Fetch failed for ${tab}:`, e.message || e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const auth = sessionStorage.getItem("admin_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
        setIsCheckingAuth(false);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && isConfigured && isAuthenticated) {
            fetchData(activeTab);
        } else if (!isAuthenticated) {
            setLoading(false);
        }
    }, [activeTab, isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputPassword === "theone") {
            setIsAuthenticated(true);
            sessionStorage.setItem("admin_auth", "true");
            setAuthError(false);
        } else {
            setAuthError(true);
            setInputPassword("");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_auth");
    };

    const handleDelete = async (id: any) => {
        if (activeTab === 'settings') return;
        if (!confirm("Are you sure? This cannot be undone.")) return;

        const table = activeTab === 'messages' ? 'transmissions' : activeTab;
        try {
            await deleteDoc(doc(db, table, id));
            setData(data.filter(item => item.id !== id));
        } catch (e: any) {
            alert("Error deleting item: " + e.message);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (activeTab === 'settings') {
                await setDoc(doc(db, 'site_settings', 'about'), editingItem);
            } else {
                const table = activeTab === 'messages' ? 'transmissions' : activeTab;
                if (editingItem.id) {
                    const { id, ...saveData } = editingItem;
                    await setDoc(doc(db, table, id), saveData);
                } else {
                    await addDoc(collection(db, table), {
                        ...editingItem,
                        created_at: serverTimestamp()
                    });
                }
            }
            setEditingItem(null);
            fetchData(activeTab);
        } catch (e: any) {
            alert("Error saving: " + e.message);
        }
    };

    if (loading || isCheckingAuth) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono">
                <Loader2 className="w-8 h-8 text-neon-red animate-spin mb-4" />
                <p className="text-neon-red animate-pulse uppercase tracking-widest text-sm">Accessing Portal Core...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-mono relative overflow-hidden">
                <div className="fixed inset-0 pointer-events-none vhs-scanlines opacity-50 z-50" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full border border-neon-red/50 bg-black p-8 relative z-10 shadow-[0_0_20px_rgba(229,9,20,0.2)]"
                >
                    <div className="flex items-center gap-3 mb-8 border-b border-neon-red/30 pb-4">
                        <AlertCircle className="text-neon-red w-6 h-6" />
                        <h2 className="text-xl font-black uppercase tracking-widest text-glow">Security Gate</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-neon-red/60 uppercase tracking-[0.3em]">Identity Key Required</label>
                            <input
                                type="password"
                                value={inputPassword}
                                onChange={(e) => setInputPassword(e.target.value)}
                                placeholder="Enter Access Code..."
                                className="w-full bg-neon-red/5 border border-neon-red/30 p-4 text-white focus:outline-none focus:border-neon-red transition-all font-mono placeholder:text-neon-red/20"
                                autoFocus
                            />
                        </div>

                        {authError && (
                            <motion.p
                                initial={{ x: -10 }}
                                animate={{ x: [0, -10, 10, -10, 0] }}
                                className="text-neon-red text-[10px] uppercase font-bold tracking-widest"
                            >
                                // Access Denied: Incorrect Identity Key
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-neon-red text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 shadow-lg"
                        >
                            Authorize Access
                        </button>
                    </form>

                    <div className="mt-8 flex justify-between text-[8px] text-neon-red/30 uppercase tracking-widest">
                        <span>Encrypted_Link: Stable</span>
                        <span>Node: SC-Alpha</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 font-mono relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none vhs-scanlines opacity-50 z-50" />

            <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-neon-red/30 pb-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black uppercase text-glow glitch mb-2" data-text="TERMINAL COMMAND">
                        TERMINAL <span className="text-neon-red">COMMAND</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <p className="text-neon-red/60 text-[10px] uppercase tracking-[0.3em]">
                            {">"} Dimension_Management_System
                        </p>
                        <button
                            onClick={handleLogout}
                            className="text-white/40 hover:text-white text-[8px] uppercase tracking-widest border-l border-white/10 pl-4"
                        >
                            Terminate_Session [Logout]
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 mt-4 md:mt-0">
                    <button
                        onClick={() => fetchData(activeTab)}
                        disabled={refreshing || !isConfigured}
                        className="flex items-center gap-2 px-4 py-2 border border-neon-red/50 text-neon-red hover:bg-neon-red hover:text-black transition-all duration-300 uppercase text-xs font-bold tracking-widest disabled:opacity-30"
                    >
                        <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                    {(activeTab !== 'settings' && activeTab !== 'messages') && (
                        <button
                            onClick={() => setEditingItem({})}
                            className="flex items-center gap-2 px-4 py-2 bg-neon-red text-black hover:bg-white transition-all duration-300 uppercase text-xs font-bold tracking-widest"
                        >
                            <Plus className="w-3 h-3" />
                            New Entry
                        </button>
                    )}
                </div>
            </header>

            {!isConfigured && (
                <div className="relative z-10 max-w-2xl mx-auto mb-12 border border-neon-red p-4 bg-neon-red/10 text-neon-red text-sm uppercase tracking-widest flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Signal Lost: Configure Supabase environment variables to establish connection.</span>
                </div>
            )}

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <nav className="lg:col-span-3 space-y-2">
                    {[
                        { id: "messages", label: "Transmissions", icon: Mail },
                        { id: "projects", label: "Experiments", icon: Code2 },
                        { id: "experience", label: "History", icon: Briefcase },
                        { id: "blogs", label: "Logs", icon: FileText },
                        { id: "leadership", label: "Commands", icon: Clock },
                        { id: "certifications", label: "Tokens", icon: GraduationCap },
                        { id: "freelance_missions", label: "Contracts", icon: Briefcase },
                        { id: "skills", label: "Power Grid", icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center justify-between p-4 transition-all duration-300 uppercase text-xs font-bold tracking-widest border ${activeTab === item.id
                                ? 'bg-neon-red text-black border-neon-red'
                                : 'text-neon-red/60 border-neon-red/20 hover:border-neon-red/50 hover:text-neon-red'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'translate-x-1' : ''}`} />
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <main className="lg:col-span-9">
                    {editingItem ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-2 border-neon-red p-8 bg-black/80 highlight-red"
                        >
                            <h2 className="text-2xl font-black mb-6 uppercase text-neon-red">Update_Manifest</h2>
                            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                                {activeTab === 'projects' && (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Title</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Category</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.category || ''} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Description</label>
                                            <textarea className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none h-24" value={editingItem.description || ''} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">GitHub Link</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.github_link || ''} onChange={e => setEditingItem({ ...editingItem, github_link: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Demo Link</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.demo_link || ''} onChange={e => setEditingItem({ ...editingItem, demo_link: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Stack (comma separated)</label>
                                            <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={Array.isArray(editingItem.stack) ? editingItem.stack.join(', ') : editingItem.stack || ''} onChange={e => setEditingItem({ ...editingItem, stack: e.target.value.split(',').map((s: string) => s.trim()) })} />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'experience' && (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Role</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.role || ''} onChange={e => setEditingItem({ ...editingItem, role: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Company</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.company || ''} onChange={e => setEditingItem({ ...editingItem, company: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">ID (e.g. EXP-001)</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.id || ''} onChange={e => setEditingItem({ ...editingItem, id: e.target.value })} required={!editingItem.created_at} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Period</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.period || ''} onChange={e => setEditingItem({ ...editingItem, period: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Description</label>
                                            <textarea className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none h-24" value={editingItem.description || ''} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Tech (comma separated)</label>
                                            <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={Array.isArray(editingItem.tech) ? editingItem.tech.join(', ') : editingItem.tech || ''} onChange={e => setEditingItem({ ...editingItem, tech: e.target.value.split(',').map((s: string) => s.trim()) })} />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'skills' && (
                                    <>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Category Title</label>
                                            <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.category_title || ''} onChange={e => setEditingItem({ ...editingItem, category_title: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Skills List (comma separated)</label>
                                            <textarea className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none h-24" value={Array.isArray(editingItem.skills_list) ? editingItem.skills_list.join(', ') : editingItem.skills_list || ''} onChange={e => setEditingItem({ ...editingItem, skills_list: e.target.value.split(',').map((s: string) => s.trim()) })} />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'blogs' && (
                                    <>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Title</label>
                                            <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} required />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Date (YYYY-MM-DD)</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" type="date" value={editingItem.date || ''} onChange={e => setEditingItem({ ...editingItem, date: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Link</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.link || ''} onChange={e => setEditingItem({ ...editingItem, link: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Preview Text</label>
                                            <textarea className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none h-24" value={editingItem.preview || ''} onChange={e => setEditingItem({ ...editingItem, preview: e.target.value })} />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'leadership' && (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Role</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.role || ''} onChange={e => setEditingItem({ ...editingItem, role: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Event/Organization</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.event || ''} onChange={e => setEditingItem({ ...editingItem, event: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Description</label>
                                            <textarea className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none h-24" value={editingItem.description || ''} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'certifications' && (
                                    <>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Title</label>
                                            <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} required />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Issuer</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.issuer || ''} onChange={e => setEditingItem({ ...editingItem, issuer: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Credential ID</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.cert_id || ''} onChange={e => setEditingItem({ ...editingItem, cert_id: e.target.value })} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'freelance_missions' && (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Client Name</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.client_name || ''} onChange={e => setEditingItem({ ...editingItem, client_name: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Mission Title</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.mission_title || ''} onChange={e => setEditingItem({ ...editingItem, mission_title: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Description</label>
                                            <textarea className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none h-24" value={editingItem.description || ''} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Result Metric (e.g. 45% faster)</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.result_metric || ''} onChange={e => setEditingItem({ ...editingItem, result_metric: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Link</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.link || ''} onChange={e => setEditingItem({ ...editingItem, link: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Services (comma separated)</label>
                                            <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={Array.isArray(editingItem.services) ? editingItem.services.join(', ') : editingItem.services || ''} onChange={e => setEditingItem({ ...editingItem, services: e.target.value.split(',').map((s: string) => s.trim()) })} />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="space-y-6">
                                        <div className="border border-neon-red/20 p-4 bg-neon-red/5 mb-6">
                                            <p className="text-neon-red text-[10px] font-black uppercase tracking-[0.2em] mb-2">// IDENTITY_SITE_CONFIG</p>
                                            <p className="text-off-white/60 text-xs font-mono">Modify the core dossier data displayed on the About section.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Location</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.location || ''} onChange={e => setEditingItem({ ...editingItem, location: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Current Mission</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.mission || ''} onChange={e => setEditingItem({ ...editingItem, mission: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Education Title</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.education_title || ''} onChange={e => setEditingItem({ ...editingItem, education_title: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-neon-red uppercase mb-2">Education School</label>
                                                <input className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none" value={editingItem.education_school || ''} onChange={e => setEditingItem({ ...editingItem, education_school: e.target.value })} />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Bio (Observation Log)</label>
                                            <textarea className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none h-40" value={editingItem.bio || ''} onChange={e => setEditingItem({ ...editingItem, bio: e.target.value })} />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-neon-red uppercase mb-2">Specializations (Comma separated)</label>
                                            <input
                                                className="w-full bg-black border border-neon-red/30 p-3 text-white focus:border-neon-red outline-none"
                                                value={Array.isArray(editingItem.specializations) ? editingItem.specializations.join(', ') : ''}
                                                onChange={e => setEditingItem({ ...editingItem, specializations: e.target.value.split(',').map((s: string) => s.trim()) })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'messages' && (
                                    <div className="text-neon-red/60 text-sm p-4 border border-neon-red/20 uppercase tracking-widest font-black italic">
                                        // Signal_Locked: Transmissions are immutable evidence records.
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6">
                                    <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-neon-red text-black uppercase font-bold text-xs tracking-widest hover:bg-white transition-all">
                                        <Save className="w-4 h-4" /> Commit_Changes
                                    </button>
                                    <button type="button" onClick={() => setEditingItem(null)} className="px-6 py-3 border border-white/20 text-white uppercase font-bold text-xs tracking-widest hover:border-neon-red transition-all">
                                        Abort
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {data.length === 0 ? (
                                    <div className="text-center py-20 border border-dashed border-neon-red/20">
                                        <p className="text-neon-red/40 uppercase tracking-widest text-xs italic mb-4">
                                            No data detected for this sector.
                                        </p>
                                        {activeTab === 'settings' ? (
                                            <button
                                                onClick={() => setEditingItem({})}
                                                className="px-4 py-2 border border-neon-red text-neon-red hover:bg-neon-red hover:text-black transition-all text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Initialize Core Dossier
                                            </button>
                                        ) : activeTab !== 'messages' && (
                                            <p className="text-off-white/20 text-[10px] font-mono uppercase">
                                                Use 'New Entry' to establish a link.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    data.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group border border-neon-red/30 hover:border-neon-red p-6 transition-all duration-300 relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <h3 className="text-lg font-bold uppercase tracking-tight mb-1">
                                                        {activeTab === 'settings' ? `Dossier: ${item.id}` : (item.mission_title || item.title || item.name || item.role || item.id)}
                                                    </h3>
                                                    <p className="text-off-white/60 text-xs font-mono line-clamp-2 max-w-xl">
                                                        {activeTab === 'settings' ? item.content.bio : (item.message || item.description || item.preview)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {activeTab !== 'messages' && (
                                                        <button
                                                            onClick={() => setEditingItem(activeTab === 'settings' ? item.content : item)}
                                                            className="p-2 text-white hover:text-neon-red transition-colors"
                                                        >
                                                            <Plus className="w-4 h-4 rotate-45" /> {/* Using Plus as a simple Edit icon substitute here or just leave as is */}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 text-neon-red/40 hover:text-neon-red transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Static background text for aesthetic */}
                                            <div className="absolute top-0 right-0 p-2 opacity-[0.03] text-[40px] font-black uppercase pointer-events-none select-none">
                                                {activeTab}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
