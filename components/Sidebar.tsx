import React, { useState } from 'react';
import type { PageData, BrandSettings, BrandColors, BrandFonts } from '../types';
import { INITIAL_SITE_INFO, FONT_OPTIONS } from '../constants';

interface SidebarProps {
  pages: PageData[];
  selectedPageId: string;
  onSelectPage: (id: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  brandSettings: BrandSettings;
  onBrandSettingsChange: (settings: BrandSettings) => void;
  onPageAdd: (title: string) => void;
  onSitemapImport: (url: string) => void;
}

const LayersIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
);

const FileTextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const SettingsIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

const getIconForPage = (pageId: string) => {
    switch(pageId) {
        case 'globals':
            return <LayersIcon className="w-5 h-5 mr-3 text-slate-500" />;
        case 'plugin-docs':
            return <FileTextIcon className="w-5 h-5 mr-3 text-slate-500" />;
        case 'schema-mapper':
            return <SettingsIcon className="w-5 h-5 mr-3 text-slate-500" />;
        default:
            return <div className="w-5 h-5 mr-3 flex items-center justify-center"><div className="w-2 h-2 bg-slate-500 rounded-full"></div></div>;
    }
}

const Sidebar: React.FC<SidebarProps> = ({ pages, selectedPageId, onSelectPage, isSidebarOpen, setIsSidebarOpen, brandSettings, onBrandSettingsChange, onPageAdd, onSitemapImport }) => {
  const [sitemapUrl, setSitemapUrl] = useState('');
  
  const pageGroups = {
    contentPages: pages.filter(p => !['globals', 'plugin-docs', 'schema-mapper'].includes(p.id)),
    globalElements: pages.filter(p => p.id === 'globals'),
    settings: pages.filter(p => ['schema-mapper', 'plugin-docs'].includes(p.id))
  };

  const handleSelectPage = (id: string) => {
    onSelectPage(id);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleColorChange = (key: keyof BrandColors, value: string) => {
    onBrandSettingsChange({
        ...brandSettings,
        colors: { ...brandSettings.colors, [key]: value }
    });
  };

  const handleFontChange = (type: 'heading' | 'body', value: BrandFonts['body']) => {
    onBrandSettingsChange({
        ...brandSettings,
        fonts: { ...brandSettings.fonts, [type]: value }
    });
  };
  
  const handleAddNewPage = () => {
    const title = prompt("Enter the new page title:");
    if(title) {
        onPageAdd(title);
    }
  };

  const handleImportSitemap = () => {
      if (sitemapUrl && sitemapUrl.startsWith('http')) {
          onSitemapImport(sitemapUrl);
      } else {
          alert('Please enter a valid sitemap URL (e.g., https://example.com/sitemap.xml)');
      }
  };

  const { colors, fonts } = brandSettings;

  return (
    <>
      <div 
          className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
      ></div>

      <aside className={`fixed inset-y-0 left-0 w-80 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 flex flex-col z-50 transform transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-slate-700/50">
          <h1 className="text-xl font-bold text-white flex items-center">
              <LayersIcon className="mr-2 text-emerald-400" />
              {INITIAL_SITE_INFO.siteName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Elementor SEO & Structure Planner</p>
        </div>
        <div className='flex-1 overflow-y-auto'>
            <nav className="p-4 space-y-6">
            <div>
                <h2 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pages</h2>
                <div className="space-y-1">
                    {pageGroups.contentPages.map(page => (
                    <button key={page.id} onClick={() => handleSelectPage(page.id)} className={`w-full text-left flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${selectedPageId === page.id ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                        {getIconForPage(page.id)}
                        {page.title}
                    </button>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Global Setup</h2>
                <div className="space-y-1">
                    {pageGroups.globalElements.map(page => (<button key={page.id} onClick={() => handleSelectPage(page.id)} className={`w-full text-left flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${selectedPageId === page.id ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-slate-700/50'}`}>{getIconForPage(page.id)}{page.title}</button>))}
                    {pageGroups.settings.map(page => (<button key={page.id} onClick={() => handleSelectPage(page.id)} className={`w-full text-left flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${selectedPageId === page.id ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-300 hover:bg-slate-700/50'}`}>{getIconForPage(page.id)}{page.title}</button>))}
                </div>
            </div>
            </nav>
            <div className="p-4 border-t border-slate-700/50 space-y-4">
                <h2 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Page Management</h2>
                 <div className="px-2 space-y-2">
                     <div className="flex items-stretch gap-2">
                        <input 
                            type="url" 
                            placeholder="Sitemap.xml URL..."
                            value={sitemapUrl}
                            onChange={(e) => setSitemapUrl(e.target.value)}
                            className="w-full text-sm bg-slate-700 border border-slate-600 rounded-md px-2 py-1 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <button onClick={handleImportSitemap} className="px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-md transition-colors">Import</button>
                     </div>
                    <button onClick={handleAddNewPage} className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold text-sm rounded-md transition-colors">Add New Page</button>
                </div>
            </div>
            <div className="p-4 border-t border-slate-700/50 space-y-4">
                <h2 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand Settings</h2>
                <div className='space-y-3 px-2'>
                    {Object.entries(colors).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                            <label htmlFor={`color-${key}`} className="text-sm capitalize text-slate-400">{key}</label>
                            <div className='flex items-center gap-2 border border-slate-600 rounded-md px-2'>
                               <input type="color" id={`color-${key}`} value={value} onChange={e => handleColorChange(key as keyof BrandColors, e.target.value)} className="w-5 h-5 bg-transparent border-none cursor-pointer" />
                               <input type="text" value={String(value || '').substring(1)} onChange={e => handleColorChange(key as keyof BrandColors, `#${e.target.value}`)} maxLength={6} className="w-16 bg-transparent text-sm text-right focus:outline-none" />
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="font-heading" className="text-sm text-slate-400">Heading Font</label>
                        <select id="font-heading" value={fonts.heading} onChange={e => handleFontChange('heading', e.target.value as BrandFonts['body'])} className="bg-slate-700 border border-slate-600 rounded-md text-sm p-1">
                            {FONT_OPTIONS.map(font => <option key={font} value={font}>{font}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="font-body" className="text-sm text-slate-400">Body Font</label>
                        <select id="font-body" value={fonts.body} onChange={e => handleFontChange('body', e.target.value as BrandFonts['body'])} className="bg-slate-700 border border-slate-600 rounded-md text-sm p-1">
                            {FONT_OPTIONS.map(font => <option key={font} value={font}>{font}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 px-2">Brand Preview</h3>
                <div className="p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                    <div className="w-full h-12 bg-slate-500/50 rounded-md mb-4 flex items-center justify-center text-sm text-slate-400">Site Logo</div>
                    <h1 style={{ color: colors.primary, fontFamily: fonts.heading, fontSize: '1.875rem', fontWeight: 'bold' }}>Heading 1</h1>
                    <h2 style={{ color: colors.secondary, fontFamily: fonts.heading, fontSize: '1.5rem', fontWeight: 'bold' }}>Heading 2</h2>
                    <p style={{ color: colors.body, fontFamily: fonts.body }}><strong style={{ color: colors.accent }}>Bolded Sub-heading:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.</p>
                    <h3 style={{ color: colors.primary, fontFamily: fonts.heading, fontSize: '1.25rem', fontWeight: 'bold' }}>Heading 3</h3>
                    <p style={{ color: colors.body, fontFamily: fonts.body }}>Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod.</p>
                    <h4 style={{ color: colors.secondary, fontFamily: fonts.heading, fontSize: '1.125rem', fontWeight: 'bold' }}>Heading 4</h4>
                    <p style={{ color: colors.body, fontFamily: fonts.body }}><strong>Bolded body text</strong> and <em>Italicised body text.</em></p>
                </div>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
