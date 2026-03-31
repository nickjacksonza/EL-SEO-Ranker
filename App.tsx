import React, { useState, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import PluginChecklist from './components/PluginChecklist';
import PluginDocsManager from './components/PluginDocsManager';
import SchemaMapper from './components/SchemaMapper';
import PluginConfigGuide from './components/PluginConfigGuide';
import { INITIAL_PAGES_DATA, SEO_TASKS, PLUGINS, INITIAL_BRAND_SETTINGS, INITIAL_SITE_INFO, INITIAL_SCHEMA_MAPPINGS } from './constants';
import type { PageData, SEOTask, BrandSettings, SiteInfo, SchemaMapping, PageStructureSection } from './types';

function App() {
  const [pluginsConfirmed, setPluginsConfirmed] = useState(false);
  const [pagesData, setPagesData] = useState<PageData[]>(INITIAL_PAGES_DATA);
  const [seoTasks, setSeoTasks] = useState<Record<string, SEOTask[]>>(SEO_TASKS);
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>(INITIAL_BRAND_SETTINGS);
  const [pluginDocs, setPluginDocs] = useState<Record<string, string>>({});
  const [schemaMappings, setSchemaMappings] = useState<SchemaMapping[]>(INITIAL_SCHEMA_MAPPINGS);
  const siteInfo: SiteInfo = INITIAL_SITE_INFO; // Static for this version

  const handleSelectPage = (id: string) => {
    setSelectedPageId(id);
  };
  
  const handleToggleTask = (pageId: string, taskId: string) => {
    setSeoTasks(prevTasks => {
      const pageTasks = prevTasks[pageId] || [];
      const newTasks = pageTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      );
      return { ...prevTasks, [pageId]: newTasks };
    });
  };

  const handleBrandSettingsChange = (settings: BrandSettings) => {
    setBrandSettings(settings);
  };
  
  const handleDocChange = (pluginName: string, content: string) => {
    setPluginDocs(prevDocs => ({...prevDocs, [pluginName]: content}));
  }

  const handlePageAdd = (title: string) => {
      const newPageId = title.toLowerCase().replace(/\s+/g, '-');
      const newPage: PageData = {
          id: newPageId,
          title: title,
          description: `This is the ${title} page.`,
          structure: [
              { id: `${newPageId}-hero`, title: 'Hero Section', description: 'A compelling hero section for the new page.', elementorTip: 'Use a section with a background image and a Heading widget.', reusable: false, h1: `Welcome to ${title}` }
          ],
          schemaInfo: [],
      };
      setPagesData(prev => [...prev, newPage]);
      setSelectedPageId(newPageId);
  };
  
  const handleSitemapImport = async (sitemapUrl: string) => {
      // Note: In a real-world app, this would likely need a server-side proxy
      // to bypass CORS (Cross-Origin Resource Sharing) restrictions.
      try {
          const response = await fetch(sitemapUrl);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const text = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, "text/xml");
          const urls = Array.from(xmlDoc.getElementsByTagName("loc")).map(loc => loc.textContent).filter(Boolean) as string[];

          const newPages: PageData[] = urls.map(url => {
              const path = new URL(url).pathname;
              const title = path.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'home';
              const capitalizedTitle = title.charAt(0).toUpperCase() + title.slice(1);
              const pageId = title.replace(/\s+/g, '-');

              return {
                  id: pageId,
                  title: capitalizedTitle,
                  description: `Imported page for ${path}`,
                  structure: [
                    { id: `${pageId}-hero`, title: 'Hero Section', description: 'A compelling hero section.', elementorTip: 'Use a section with a background image and a Heading widget.', reusable: false, h1: capitalizedTitle }
                  ],
                  schemaInfo: [],
              };
          });
          
          setPagesData(prev => [...prev.filter(p => !newPages.some(np => np.id === p.id)), ...newPages]);
          if (newPages.length > 0) {
              setSelectedPageId(newPages[0].id);
          }
          alert(`${newPages.length} pages imported successfully!`);
      } catch (error) {
          console.error("Sitemap import failed:", error);
          alert(`Sitemap import failed. Check the console for details. Note: This feature may be blocked by your browser's CORS policy.`);
      }
  };


  const handleStructureChange = useCallback((pageId: string, action: { type: 'MOVE'; from: number; to: number } | { type: 'CLONE'; index: number } | { type: 'DELETE'; index: number } | { type: 'ADD' }) => {
    setPagesData(prevPages => {
      const newPages = [...prevPages];
      const pageIndex = newPages.findIndex(p => p.id === pageId);
      if (pageIndex === -1) return prevPages;

      const page = newPages[pageIndex];
      const structure = [...page.structure];
      const dynamicStructure = structure.slice(1); // Exclude H1 section

      switch(action.type) {
        case 'MOVE': {
          const [movedItem] = dynamicStructure.splice(action.from, 1);
          dynamicStructure.splice(action.to, 0, movedItem);
          break;
        }
        case 'CLONE': {
          const originalSection = dynamicStructure[action.index];
          const clonedSection = { ...originalSection, id: `${originalSection.id}-${Date.now()}` };
          dynamicStructure.splice(action.index + 1, 0, clonedSection);
          break;
        }
        case 'DELETE': {
          dynamicStructure.splice(action.index, 1);
          break;
        }
        case 'ADD': {
          const newSection: PageStructureSection = {
            id: `section-${Date.now()}`,
            title: 'New Section',
            description: 'A new editable section for your page.',
            elementorTip: 'Use any combination of widgets to build this out.',
            reusable: false,
            h2: 'New Section Heading',
            h3s: ['', '', '']
          };
          dynamicStructure.push(newSection);
          break;
        }
      }

      newPages[pageIndex] = { ...page, structure: [structure[0], ...dynamicStructure] };
      return newPages;
    });
  }, []);
  
  const handleSectionUpdate = useCallback((pageId: string, sectionId: string, newTitle: string) => {
    setPagesData(prevPages => {
        return prevPages.map(page => {
            if (page.id !== pageId) return page;
            const newStructure = page.structure.map(section => {
                if (section.id !== sectionId) return section;
                return { ...section, title: newTitle };
            });
            return { ...page, structure: newStructure };
        });
    });
  }, []);

  const handleHeadingChange = useCallback((pageId: string, sectionId: string, headingType: 'h1' | 'h2' | 'h3', value: string, h3Index?: number) => {
      setPagesData(prevPages => {
        return prevPages.map(page => {
            if (page.id !== pageId) return page;
            
            const newStructure = page.structure.map(section => {
                if (section.id !== sectionId) return section;

                const newSection = { ...section };
                if (headingType === 'h2') {
                    newSection.h2 = value;
                } else if (headingType === 'h3' && h3Index !== undefined) {
                    const newH3s = newSection.h3s ? [...newSection.h3s] : [];
                    while (newH3s.length <= h3Index) {
                        newH3s.push('');
                    }
                    newH3s[h3Index] = value;
                    newSection.h3s = newH3s;
                }
                return newSection;
            });
            return { ...page, structure: newStructure };
        });
      });
  }, []);

  const handleSchemaMappingChange = useCallback((action: { type: 'TOGGLE'; id: string } | { type: 'CLONE'; id: string } | { type: 'DELETE'; id: string } | { type: 'UPDATE_PROP'; mappingId: string; propId: string; value: string }) => {
    setSchemaMappings(prevMappings => {
        switch(action.type) {
            case 'TOGGLE':
                return prevMappings.map(m => m.id === action.id ? { ...m, isEnabled: !m.isEnabled } : m);
            case 'DELETE':
                return prevMappings.filter(m => m.id !== action.id);
            case 'CLONE': {
                const original = prevMappings.find(m => m.id === action.id);
                if (!original) return prevMappings;
                const clone = { 
                    ...original, 
                    id: `sm-${Date.now()}`,
                    properties: original.properties.map(p => ({...p, id: `sm-prop-${Date.now()}-${Math.random()}`}))
                };
                const originalIndex = prevMappings.findIndex(m => m.id === action.id);
                const newMappings = [...prevMappings];
                newMappings.splice(originalIndex + 1, 0, clone);
                return newMappings;
            }
            case 'UPDATE_PROP':
                return prevMappings.map(m => {
                    if (m.id !== action.mappingId) return m;
                    const newProps = m.properties.map(p => p.id === action.propId ? { ...p, value: action.value } : p);
                    return { ...m, properties: newProps };
                });
            default: {
              const exhaustiveCheck: never = action;
              return prevMappings;
            }
        }
    });
  }, []);

  const selectedPage = useMemo(() => pagesData.find(p => p.id === selectedPageId) || pagesData[0], [pagesData, selectedPageId]);
  const currentTasks = useMemo(() => seoTasks[selectedPageId] || [], [seoTasks, selectedPageId]);
  
  const headerSection = useMemo(() => pagesData.find(p => p.id === 'globals')?.structure.find(s => s.id === 'global-header'), [pagesData]);
  const footerSection = useMemo(() => pagesData.find(p => p.id === 'globals')?.structure.find(s => s.id === 'global-footer'), [pagesData]);

  if (!pluginsConfirmed) {
    return <PluginChecklist plugins={PLUGINS} onConfirm={() => setPluginsConfirmed(true)} />;
  }

  const renderContent = () => {
    if (!selectedPage) {
        return <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-slate-300">No Page Selected</h1>
            <p className="text-slate-400 mt-2">Please select a page from the sidebar, or import a sitemap to get started.</p>
        </div>;
    }
    switch (selectedPageId) {
      case 'plugin-docs':
        return <PluginDocsManager plugins={PLUGINS} pluginDocs={pluginDocs} onDocChange={handleDocChange} />;
      case 'schema-mapper':
        return <SchemaMapper 
            pages={pagesData.filter(p => !['globals', 'plugin-docs', 'schema-mapper'].includes(p.id))} 
            mappings={schemaMappings} 
            onMappingChange={handleSchemaMappingChange}
        />;
      case 'config-guide': // Example for a future page
        return <PluginConfigGuide />;
      default:
        return (
          <MainContent
            pageData={selectedPage}
            tasks={currentTasks}
            toggleTask={handleToggleTask}
            pluginDocs={pluginDocs}
            siteInfo={siteInfo}
            brandSettings={brandSettings}
            headerSection={headerSection}
            footerSection={footerSection}
            onStructureChange={handleStructureChange}
            onHeadingChange={handleHeadingChange}
            onSectionUpdate={handleSectionUpdate}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-300">
      <Sidebar 
        pages={pagesData}
        selectedPageId={selectedPageId}
        onSelectPage={handleSelectPage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        brandSettings={brandSettings}
        onBrandSettingsChange={handleBrandSettingsChange}
        onPageAdd={handlePageAdd}
        onSitemapImport={handleSitemapImport}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 mb-4 rounded-md bg-slate-800 text-slate-400 hover:bg-slate-700"
                aria-label="Open sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
