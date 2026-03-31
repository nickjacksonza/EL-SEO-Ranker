import React, { useState } from 'react';

interface PluginDocsManagerProps {
  plugins: string[];
  pluginDocs: Record<string, string>;
  onDocChange: (pluginName: string, content: string) => void;
}

// To inform TypeScript about the global JSZip variable after dynamic script loading
declare var JSZip: any;

const FileTextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const DownloadCloudIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg>
);

const AccordionItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-emerald-300 transition-colors hover:bg-slate-700/50"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && <div className="p-4 border-t border-slate-700">{children}</div>}
        </div>
    );
};

const PluginDocsManager: React.FC<PluginDocsManagerProps> = ({ plugins, pluginDocs, onDocChange }) => {
  const [slugs, setSlugs] = useState<Record<string, string>>({});
  const [loadingStatus, setLoadingStatus] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const loadJSZip = () => {
    return new Promise<void>((resolve, reject) => {
        // @ts-ignore
        if (window.JSZip) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
    });
  };

  const handleFetchPluginDocs = async (pluginName: string) => {
    const slug = slugs[pluginName];
    if (!slug) return;

    setLoadingStatus(prev => ({ ...prev, [pluginName]: 'loading' }));
    setErrorMessages(prev => ({ ...prev, [pluginName]: '' }));

    try {
        await loadJSZip();

        const response = await fetch(`https://downloads.wordpress.org/plugin/${slug}.zip`);
        if (!response.ok) {
            throw new Error(`Failed to download plugin. Status: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();

        const jszip = new JSZip();
        const zip = await jszip.loadAsync(blob);
        
        let extractedContent = `/* Fetched from wordpress.org/plugins/${slug} */\n\n`;
        const filesToExtract: Promise<void>[] = [];
        const MAX_TOTAL_SIZE = 200000; // 200k chars limit to avoid performance issues

        zip.forEach((relativePath, zipEntry) => {
            if (!zipEntry.dir && extractedContent.length < MAX_TOTAL_SIZE) {
                const isTextFile = /\.(txt|md|php|js|css|json|html)$/i.test(zipEntry.name);
                if (isTextFile) {
                    filesToExtract.push(
                        zipEntry.async('string').then(content => {
                            if (extractedContent.length < MAX_TOTAL_SIZE) {
                                const fileHeader = `\n\n--- FILE: ${zipEntry.name} ---\n\n`;
                                let contentToAdd = fileHeader + content;
                                if (extractedContent.length + contentToAdd.length > MAX_TOTAL_SIZE) {
                                    contentToAdd = contentToAdd.substring(0, MAX_TOTAL_SIZE - extractedContent.length);
                                }
                                extractedContent += contentToAdd;
                            }
                        })
                    );
                }
            }
        });
        
        await Promise.all(filesToExtract);

        if (extractedContent.length < 50) { // Check if we got more than just the header
            throw new Error('No relevant documentation files found in the plugin zip.');
        }

        onDocChange(pluginName, extractedContent);
        setLoadingStatus(prev => ({ ...prev, [pluginName]: 'success' }));
    } catch (error) {
        console.error('Error fetching plugin docs:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        setErrorMessages(prev => ({ ...prev, [pluginName]: message }));
        setLoadingStatus(prev => ({ ...prev, [pluginName]: 'error' }));
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-emerald-400">Plugin Documentation</h1>
        <p className="mt-2 text-slate-400">
          Paste reference documentation for your plugins below. Gemini will use this context to generate more accurate and customized code, examples, and instructions for your specific website setup.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center">
            <FileTextIcon className="mr-3 text-emerald-400" /> Documentation Hub
        </h2>
        <div className="space-y-4">
            {plugins.map(plugin => (
                <AccordionItem key={plugin} title={plugin}>
                    <label htmlFor={`doc-${plugin}`} className="text-sm font-medium text-slate-400 block mb-2">
                        Paste documentation for {plugin} here:
                    </label>
                    <textarea
                        id={`doc-${plugin}`}
                        value={pluginDocs[plugin] || ''}
                        onChange={(e) => onDocChange(plugin, e.target.value)}
                        placeholder={`e.g., Shortcodes, function references, API examples for ${plugin}...`}
                        className="w-full h-64 bg-slate-900/70 border border-slate-600 rounded-md p-3 text-sm text-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                    <div className="mt-6 pt-4 border-t border-slate-700/50">
                        <label htmlFor={`slug-${plugin}`} className="text-sm font-medium text-slate-400 block mb-2">
                            Or, fetch from wordpress.org by plugin slug
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex items-center flex-1 bg-slate-700 border border-slate-600 rounded-md px-2">
                                <span className="text-sm text-slate-500 whitespace-nowrap hidden sm:inline">wordpress.org/plugins/</span>
                                <input
                                    id={`slug-${plugin}`}
                                    type="text"
                                    value={slugs[plugin] || ''}
                                    onChange={(e) => setSlugs(prev => ({ ...prev, [plugin]: e.target.value }))}
                                    placeholder="e.g., ba-book-everything"
                                    className="w-full bg-transparent py-1.5 text-sm text-slate-200 focus:outline-none"
                                />
                            </div>
                            <button
                                onClick={() => handleFetchPluginDocs(plugin)}
                                disabled={!slugs[plugin] || loadingStatus[plugin] === 'loading'}
                                className="flex items-center justify-center px-4 py-1.5 text-sm font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shrink-0"
                            >
                                {loadingStatus[plugin] === 'loading' ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <DownloadCloudIcon className="w-4 h-4 mr-2" />
                                )}
                                {loadingStatus[plugin] === 'loading' ? 'Fetching...' : 'Fetch & Scan'}
                            </button>
                        </div>
                        {loadingStatus[plugin] === 'success' && <p className="text-xs text-emerald-400 mt-2">Plugin files scanned and documentation populated successfully.</p>}
                        {loadingStatus[plugin] === 'error' && <p className="text-xs text-red-400 mt-2">Error: {errorMessages[plugin]}</p>}
                        <p className="text-xs text-slate-500 mt-2">This will download the plugin zip, scan its text-based files (like readme.txt and .php files), and populate the text area above.</p>
                    </div>
                </AccordionItem>
            ))}
        </div>
      </section>
    </div>
  );
};

export default PluginDocsManager;
