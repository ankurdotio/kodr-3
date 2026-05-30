import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import Editor from '@monaco-editor/react';
import { 
  ArrowLeft, Sun, Moon, LogOut, Play, Code, Eye, 
  ExternalLink, Send, Sparkles, Folder, File, Save, CheckCircle2, AlertTriangle, RefreshCw,
  FileCode, FileJson, FileText, FileImage, FileCog
} from 'lucide-react';

function buildFileTree(filePaths) {
  const root = { name: 'root', type: 'directory', children: {} };

  for (const path of filePaths) {
    const parts = path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        current.children[part] = {
          name: part,
          type: 'file',
          path: path
        };
      } else {
        const dirPath = parts.slice(0, i + 1).join('/');
        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            type: 'directory',
            path: dirPath,
            children: {}
          };
        }
        current = current.children[part];
      }
    }
  }

  return root;
}

export default function ProjectEditor() {
  const { sandboxId } = useParams();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Left panel view: 'preview' or 'editor'
  const [viewMode, setViewMode] = useState('preview');

  // File system state
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContents, setFileContents] = useState({});
  const [originalFileContents, setOriginalFileContents] = useState({});
  const [filesLoading, setFilesLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Folder expand/collapse state
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (dirPath) => {
    setExpandedFolders(prev => ({
      ...prev,
      [dirPath]: prev[dirPath] === undefined ? false : !prev[dirPath]
    }));
  };

  // AI Chat state
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI Frontend Assistant. Ask me to make changes to your React sandbox and I'll write the code for you in real-time."
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  // Ref for chat auto-scroll
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Key to force preview iframe refresh on file save or stream done
  const [iframeKey, setIframeKey] = useState(0);

  const agentBaseUrl = `http://${sandboxId}.agent.localhost`;
  const previewUrl = `http://${sandboxId}.preview.localhost`;

  // Fetch file list on load
  useEffect(() => {
    fetchFileList();
  }, [sandboxId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Adjust textarea height on change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [userInput]);

  const fetchFileList = async () => {
    setFilesLoading(true);
    try {
      const res = await fetch(`${agentBaseUrl}/list-files`);
      const data = await res.json();
      if (res.ok && data.files) {
        setFiles(data.files);
        // Load first file automatically if none selected
        if (data.files.length > 0 && !activeFile) {
          const defaultFile = data.files.find(f => f.endsWith('App.jsx')) || data.files[0];
          handleFileSelect(defaultFile);
        }
      }
    } catch (e) {
      console.error('Error fetching files:', e);
    } finally {
      setFilesLoading(false);
    }
  };

  const handleFileSelect = async (filePath) => {
    setActiveFile(filePath);
    if (fileContents[filePath] !== undefined) {
      return; // Already loaded in local state
    }
    setFileLoading(true);
    try {
      const res = await fetch(`${agentBaseUrl}/read-files?files=${encodeURIComponent(filePath)}`);
      const data = await res.json();
      if (res.ok && data.files && data.files[filePath] !== undefined) {
        const content = data.files[filePath];
        setFileContents(prev => ({ ...prev, [filePath]: content }));
        setOriginalFileContents(prev => ({ ...prev, [filePath]: content }));
      }
    } catch (e) {
      console.error('Error reading file:', e);
    } finally {
      setFileLoading(false);
    }
  };

  const handleEditorChange = (value) => {
    setFileContents(prev => ({ ...prev, [activeFile]: value }));
    setSaveSuccess(false);
  };

  const handleSaveFile = async () => {
    if (!activeFile || fileContents[activeFile] === undefined) return;
    setSaveLoading(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`${agentBaseUrl}/update-files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: {
            [activeFile]: fileContents[activeFile]
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOriginalFileContents(prev => ({ ...prev, [activeFile]: fileContents[activeFile] }));
        setSaveSuccess(true);
        // Trigger iframe reload after save
        setIframeKey(prev => prev + 1);
        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        alert(data.error || 'Failed to save file');
      }
    } catch (e) {
      console.error('Error saving file:', e);
      alert('Failed to save file. Check agent connectivity.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Keyboard shortcut save in editor
  const handleEditorMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveFile();
    });
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isStreaming) return;

    const userMsg = { id: Date.now().toString(), role: 'user', content: userInput };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsStreaming(true);
    setIsThinking(true);

    const aiMsgId = (Date.now() + 1).toString();
    // Insert temporary streaming AI message
    setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/ai/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: userMsg.content, sandboxId }),
      });

      if (!response.ok) {
        throw new Error('AI invoke failed');
      }

      setIsThinking(false);
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let currentEvent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop(); // Hold partial line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('event: ')) {
            currentEvent = trimmed.slice(7).trim();
          } else if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (currentEvent === 'error') {
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: `Error: ${data.message}` } : m));
              } else if (data.type === 'message') {
                setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: m.content + data.content } : m));
              } else if (data.type === 'done') {
                // Completed stream
              }
            } catch (e) {
              console.error('Failed to parse streaming line:', e);
            }
            currentEvent = ''; // reset after data line
          }
        }
      }

      // Reload project file contents and preview after stream is complete
      fetchFileList();
      // Force reload preview
      setIframeKey(prev => prev + 1);

    } catch (err) {
      console.error('Chat error:', err);
      setIsThinking(false);
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: 'Failed to generate response. Check AI service logs.' } : m));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSendMessage();
    }
  };

  const isFileModified = activeFile && fileContents[activeFile] !== originalFileContents[activeFile];
  const activeFileLanguage = activeFile ? activeFile.split('.').pop().toLowerCase() : 'javascript';

  const getMonacoLanguage = (ext) => {
    if (ext === 'js' || ext === 'jsx') return 'javascript';
    if (ext === 'ts' || ext === 'tsx') return 'typescript';
    if (ext === 'css') return 'css';
    if (ext === 'html') return 'html';
    if (ext === 'json') return 'json';
    return 'javascript';
  };

  const getFileIcon = (fileName, isActive) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const activeClass = isActive ? 'text-[var(--accent)]' : 'text-neutral-400';
    
    if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) {
      return <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-blue-400 dark:text-blue-500'}`} />;
    }
    if (ext === 'json') {
      return <FileJson className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-amber-500'}`} />;
    }
    if (['css', 'html'].includes(ext)) {
      return <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-orange-400 dark:text-orange-500'}`} />;
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'ico', 'webp'].includes(ext)) {
      return <FileImage className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-emerald-400 dark:text-emerald-500'}`} />;
    }
    if (['md', 'txt'].includes(ext)) {
      return <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-neutral-400'}`} />;
    }
    if (fileName.includes('config') || fileName.startsWith('.') || fileName.toLowerCase().includes('docker')) {
      return <FileCog className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-pink-400 dark:text-pink-500'}`} />;
    }
    return <File className={`w-3.5 h-3.5 shrink-0 ${activeClass}`} />;
  };

  const renderNode = (node, level = 0) => {
    if (node.type === 'file') {
      const isActive = activeFile === node.path;
      const isChanged = fileContents[node.path] !== undefined && fileContents[node.path] !== originalFileContents[node.path];
      return (
        <button
          key={node.path}
          onClick={() => handleFileSelect(node.path)}
          className="w-full text-left px-2 py-1.5 rounded-[var(--radius)] font-mono text-xs flex items-center justify-between group transition-colors cursor-pointer"
          style={{
            backgroundColor: isActive ? 'var(--bg)' : 'transparent',
            color: isActive ? 'var(--text)' : 'var(--muted)',
            paddingLeft: `${level * 12 + 8}px`
          }}
        >
          <span className="flex items-center gap-2 truncate">
            {getFileIcon(node.name, isActive)}
            <span className="truncate group-hover:text-[var(--text)] transition-colors">{node.name}</span>
          </span>
          {isChanged && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          )}
        </button>
      );
    }

    const isExpanded = expandedFolders[node.path] !== false; // Default to true
    const sortedChildren = Object.values(node.children).sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) {
        return a.type === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return (
      <div key={node.path} className="space-y-0.5">
        <button
          onClick={() => toggleFolder(node.path)}
          className="w-full text-left px-2 py-1.5 rounded-[var(--radius)] font-mono text-xs flex items-center gap-2 group transition-colors cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900"
          style={{
            color: 'var(--text)',
            paddingLeft: `${level * 12 + 8}px`
          }}
        >
          <Folder className={`w-3.5 h-3.5 shrink-0 transition-transform ${isExpanded ? 'text-[var(--accent)]' : 'text-neutral-400'}`} />
          <span className="truncate font-semibold opacity-85 group-hover:opacity-100 transition-opacity">
            {node.name}
          </span>
        </button>
        
        {isExpanded && (
          <div className="space-y-0.5">
            {sortedChildren.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col page-transition overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Top Navbar */}
      <nav className="border-b theme-transition px-6 py-3 flex items-center justify-between shrink-0" 
           style={{ 
             backgroundColor: 'var(--surface)', 
             borderColor: 'var(--border)' 
           }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="p-1.5 rounded-[var(--radius)] hover:opacity-80 theme-transition border cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--bg)' }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text)' }}>
              Forge
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>/</span>
            <span className="text-xs font-mono font-semibold truncate max-w-[200px]" style={{ color: 'var(--text)' }}>
              {sandboxId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-[var(--radius)] hover:opacity-85 theme-transition border cursor-pointer"
            style={{ 
              borderColor: 'var(--border)', 
              color: 'var(--text)',
              backgroundColor: 'var(--bg)' 
            }}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-1.5 rounded-[var(--radius)] hover:opacity-85 theme-transition border cursor-pointer text-red-500 hover:bg-red-500/10"
            style={{ 
              borderColor: 'var(--border)',
              backgroundColor: 'var(--bg)'
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Main Split Panel Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Panel: Preview/Code Editor (60% width) */}
        <div className="w-full md:w-[60%] flex flex-col border-r theme-transition overflow-hidden" 
             style={{ borderColor: 'var(--border)' }}>
          
          {/* Inner Toolbar */}
          <div className="px-4 py-2 border-b theme-transition flex items-center justify-between shrink-0"
               style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sandbox live
              </span>

              {/* View Toggle Tabs */}
              <div className="flex bg-neutral-200 dark:bg-neutral-800 p-0.5 rounded-lg ml-2 border" 
                   style={{ borderColor: 'var(--border)' }}>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'preview' 
                      ? 'shadow-xs' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: viewMode === 'preview' ? 'var(--surface)' : 'transparent',
                    color: 'var(--text)'
                  }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => {
                    setViewMode('editor');
                    fetchFileList();
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'editor' 
                      ? 'shadow-xs' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: viewMode === 'editor' ? 'var(--surface)' : 'transparent',
                    color: 'var(--text)'
                  }}
                >
                  <Code className="w-3.5 h-3.5" />
                  Code Editor
                </button>
              </div>
            </div>

            {/* Actions Contextual to view */}
            <div className="flex items-center gap-2">
              {viewMode === 'preview' ? (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-[var(--radius)] hover:opacity-80 theme-transition border flex items-center justify-center cursor-pointer"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)', backgroundColor: 'var(--bg)' }}
                  title="Open preview in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div className="flex items-center gap-2">
                  {isFileModified && (
                    <span className="text-[11px] font-mono flex items-center gap-1 text-amber-500">
                      <AlertTriangle className="w-3 h-3" />
                      Unsaved changes
                    </span>
                  )}
                  {saveSuccess && (
                    <span className="text-[11px] font-mono flex items-center gap-1 text-emerald-500">
                      <CheckCircle2 className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                  <button
                    onClick={handleSaveFile}
                    disabled={saveLoading || !isFileModified}
                    className="py-1 px-3 rounded-[var(--radius)] font-mono text-xs font-medium theme-transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: isFileModified ? 'var(--accent)' : 'var(--bg)', 
                      color: isFileModified ? '#ffffff' : 'var(--muted)',
                      border: isFileModified ? '1px solid var(--accent)' : '1px solid var(--border)'
                    }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Left panel Content */}
          <div className="flex-1 overflow-hidden relative">
            
            {/* View 1: Iframe Preview */}
            {viewMode === 'preview' && (
              <iframe
                key={iframeKey}
                src={previewUrl}
                title="Sandbox Preview"
                className="w-full h-full border-none bg-white"
              />
            )}

            {/* View 2: Monaco Code Editor */}
            {viewMode === 'editor' && (
              <div className="w-full h-full flex overflow-hidden">
                
                {/* File Explorer Sidebar */}
                <div className="w-[200px] border-r theme-transition flex flex-col"
                     style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <div className="p-3 border-b theme-transition shrink-0 flex items-center justify-between"
                       style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      Files
                    </span>
                    <button 
                      onClick={fetchFileList}
                      className="p-1 rounded hover:opacity-85 text-xs" 
                      style={{ color: 'var(--muted)' }}
                      title="Refresh files"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filesLoading ? (
                      <div className="flex items-center gap-2 p-2">
                        <span className="w-3.5 h-3.5 border border-t-transparent border-[var(--accent)] rounded-full animate-spin" />
                        <span className="text-[11px] font-mono" style={{ color: 'var(--muted)' }}>Reading files...</span>
                      </div>
                    ) : (
                      Object.values(buildFileTree(files).children)
                        .sort((a, b) => {
                          if (a.type !== b.type) {
                            return a.type === 'directory' ? -1 : 1;
                          }
                          return a.name.localeCompare(b.name);
                        })
                        .map(child => renderNode(child, 0))
                    )}
                  </div>
                </div>

                {/* Editor Container */}
                <div className="flex-1 h-full flex flex-col relative overflow-hidden">
                  {fileLoading && (
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-10">
                      <span className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="flex-1 h-full">
                    {activeFile ? (
                      <Editor
                        height="100%"
                        language={getMonacoLanguage(activeFileLanguage)}
                        theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        value={fileContents[activeFile] || ''}
                        onChange={handleEditorChange}
                        onMount={handleEditorMount}
                        options={{
                          fontSize: 13,
                          minimap: { enabled: false },
                          scrollbar: { vertical: 'visible', horizontal: 'visible' },
                          automaticLayout: true,
                          padding: { top: 8 },
                          tabSize: 2,
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center flex-col text-center p-6">
                        <Code className="w-8 h-8 mb-2" style={{ color: 'var(--muted)' }} />
                        <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>Select a file to begin editing</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Right Panel: AI Chat (40% width) */}
        <div className="w-full md:w-[40%] flex flex-col overflow-hidden" 
             style={{ backgroundColor: 'var(--surface)' }}>
          
          {/* Header */}
          <div className="px-6 py-3.5 border-b theme-transition flex items-center justify-between shrink-0"
               style={{ borderColor: 'var(--border)' }}>
            <div>
              <h2 className="text-sm font-bold tracking-tight flex items-center gap-1.5" style={{ color: 'var(--text)' }}>
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                AI Assistant
              </h2>
              <p className="text-[10px] font-mono tracking-wider uppercase" style={{ color: 'var(--muted)' }}>
                Gemini 3.5 Flash
              </p>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} page-transition`}>
                  <div className="max-w-[85%] flex flex-col gap-1">
                    {/* Role Tag */}
                    <span className="text-[10px] font-mono px-1" style={{ 
                      color: 'var(--muted)',
                      textAlign: isUser ? 'right' : 'left'
                    }}>
                      {isUser ? 'User' : 'Assistant'}
                    </span>
                    
                    {/* Text Bubble */}
                    <div 
                      className="px-4 py-3 rounded-[var(--radius)] text-sm font-sans theme-transition border whitespace-pre-wrap leading-relaxed shadow-xs"
                      style={{
                        backgroundColor: isUser ? 'var(--accent)' : 'var(--bg)',
                        color: isUser ? '#ffffff' : 'var(--text)',
                        borderColor: isUser ? 'var(--accent)' : 'var(--border)',
                        borderLeft: isUser ? 'none' : '3px solid var(--accent)'
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Thinking Indicator */}
            {isThinking && (
              <div className="flex justify-start page-transition">
                <div className="max-w-[85%] flex flex-col gap-1">
                  <span className="text-[10px] font-mono px-1" style={{ color: 'var(--muted)' }}>
                    Assistant
                  </span>
                  <div className="px-4 py-3 rounded-[var(--radius)] border flex items-center gap-1.5"
                       style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', borderLeft: '3px solid var(--accent)' }}>
                    <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} 
                className="p-4 border-t theme-transition shrink-0" 
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
            <div className="relative flex items-end gap-2 p-1 rounded-lg border theme-transition" 
                 style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI to edit code... (Cmd+Enter to send)"
                rows="1"
                className="flex-1 px-3 py-2 text-sm bg-transparent border-none outline-none resize-none min-h-[38px] max-h-[120px]"
                style={{ color: 'var(--text)' }}
                disabled={isStreaming}
              />

              <button
                type="submit"
                disabled={!userInput.trim() || isStreaming}
                className="p-2 rounded-[var(--radius)] theme-transition flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-default"
                style={{
                  backgroundColor: userInput.trim() && !isStreaming ? 'var(--accent)' : 'transparent',
                  color: userInput.trim() && !isStreaming ? '#ffffff' : 'var(--muted)',
                }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
