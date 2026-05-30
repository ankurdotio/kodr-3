import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { Plus, LogOut, Sun, Moon, ArrowRight, ExternalLink, RefreshCw, Folder } from 'lucide-react';

export default function ProjectsDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Sandbox Start state (key is projectId, value is boolean loading)
  const [startingSandboxes, setStartingSandboxes] = useState({});

  // Fetch Projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/sandbox/project', {
        credentials: 'include',
      });
      if (res.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch projects');
      }
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects. Click refresh to try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setModalError('Project name is required');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      const res = await fetch('/api/sandbox/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newProjectName }),
        credentials: 'include',
      });
      if (res.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create project');
      }
      
      // Close modal and refresh projects
      setIsModalOpen(false);
      setNewProjectName('');
      fetchProjects();
    } catch (err) {
      setModalError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenSandbox = async (projectId) => {
    setStartingSandboxes(prev => ({ ...prev, [projectId]: true }));
    try {
      const res = await fetch('/api/sandbox/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
        credentials: 'include',
      });
      if (res.status === 401) {
        logout();
        navigate('/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to start sandbox');
      }
      
      // Sandbox started successfully! Navigate to editor
      navigate(`/project/${data.sandboxId}`);
    } catch (err) {
      alert(err.message || 'Failed to start sandbox. Please try again.');
      setStartingSandboxes(prev => ({ ...prev, [projectId]: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col page-transition" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Navbar */}
      <nav className="border-b theme-transition px-6 py-4 flex items-center justify-between sticky top-0 z-10" 
           style={{ 
             backgroundColor: 'var(--surface)', 
             borderColor: 'var(--border)' 
           }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg" 
               style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Forge
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-[var(--radius)] hover:opacity-85 theme-transition border cursor-pointer"
            style={{ 
              borderColor: 'var(--border)', 
              color: 'var(--text)',
              backgroundColor: 'var(--bg)' 
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 rounded-[var(--radius)] hover:opacity-85 theme-transition border flex items-center justify-center cursor-pointer text-red-500 hover:bg-red-500/10"
            style={{ 
              borderColor: 'var(--border)',
              backgroundColor: 'var(--bg)'
            }}
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-8 border-b theme-transition"
             style={{ borderColor: 'var(--border)' }}>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text)' }}>
              Your Projects
            </h1>
            <p className="text-sm font-sans" style={{ color: 'var(--muted)' }}>
              Pick up where you left off, or start something new.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 py-2 px-4 rounded-[var(--radius)] font-medium text-sm font-sans theme-transition cursor-pointer shadow-sm hover:opacity-90 active:scale-[0.98]"
            style={{ 
              backgroundColor: 'var(--accent)', 
              color: '#ffffff'
            }}
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Dashboard Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 border rounded-[var(--radius)] border-dashed theme-transition p-8"
               style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm font-mono mb-4 text-red-500">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-4 py-2 text-xs font-mono rounded-[var(--radius)] border theme-transition inline-flex items-center gap-2 cursor-pointer hover:bg-transparent"
              style={{ color: 'var(--text)', borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border rounded-[var(--radius)] border-dashed theme-transition" 
               style={{ borderColor: 'var(--border)' }}>
            <Folder className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--muted)' }} />
            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>No projects found</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Get started by creating your first React sandbox environment.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2 px-4 rounded-[var(--radius)] font-medium text-sm font-sans theme-transition inline-flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const isStarting = startingSandboxes[project._id];
              return (
                <div
                  key={project._id}
                  className="rounded-[var(--radius)] border theme-transition p-6 flex flex-col justify-between group hover:border-[var(--accent)] hover:shadow-md cursor-default"
                  style={{ 
                    backgroundColor: 'var(--surface)', 
                    borderColor: 'var(--border)',
                  }}
                >
                  <div>
                    <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-[var(--accent)] theme-transition line-clamp-1" 
                        style={{ color: 'var(--text)' }}>
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono mb-6" style={{ color: 'var(--muted)' }}>
                      Created {new Date(project.createdAt || Date.now()).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenSandbox(project._id)}
                    disabled={isStarting}
                    className="w-full py-2 px-3 rounded-[var(--radius)] font-mono text-xs border theme-transition flex items-center justify-between cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group/btn hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)]"
                    style={{ 
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)'
                    }}
                  >
                    <span>{isStarting ? 'Spinning up…' : 'Open'}</span>
                    {isStarting ? (
                      <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* New Project Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            className="w-full max-w-[400px] rounded-[var(--radius)] border shadow-xl p-6 theme-transition"
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: 'var(--border)' 
            }}
          >
            <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
              Create New Project
            </h2>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
              Enter a name for your workspace sandbox.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono mb-1.5" style={{ color: 'var(--muted)' }}>
                  Project name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="my-awesome-sandbox"
                  className="w-full px-3 py-2 text-sm rounded-[var(--radius)] border theme-transition outline-none"
                  style={{
                    backgroundColor: 'var(--bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                  autoFocus
                  required
                />
              </div>

              {modalError && (
                <div className="text-xs font-mono p-2.5 rounded border text-red-500 bg-red-500/10 border-red-500/20">
                  {modalError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewProjectName('');
                    setModalError('');
                  }}
                  disabled={modalLoading}
                  className="px-4 py-2 text-xs font-mono rounded-[var(--radius)] border theme-transition cursor-pointer hover:opacity-80"
                  style={{ 
                    borderColor: 'var(--border)', 
                    color: 'var(--text)',
                    backgroundColor: 'var(--bg)' 
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 text-xs font-mono rounded-[var(--radius)] font-medium theme-transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  style={{ 
                    backgroundColor: 'var(--accent)', 
                    color: '#ffffff' 
                  }}
                >
                  {modalLoading && <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
