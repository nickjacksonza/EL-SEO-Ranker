import React from 'react';
import type { PageData, SEOTask, SiteInfo, BrandSettings, PageStructureSection } from '../types';
import PageStructurePlanner from './PageStructurePlanner';
import SeoChecklist from './SeoChecklist';
import SchemaHelper from './SchemaHelper';
import SiteInfoManager from './SiteInfoManager';
import HeadingsPreview from './HeadingsPreview';
import ElementorExporter from './ElementorExporter';

interface MainContentProps {
  pageData: PageData;
  tasks: SEOTask[];
  toggleTask: (pageId: string, taskId: string) => void;
  pluginDocs: Record<string, string>;
  siteInfo: SiteInfo;
  brandSettings: BrandSettings;
  headerSection?: PageStructureSection;
  footerSection?: PageStructureSection;
  onStructureChange: (pageId: string, action: { type: 'MOVE'; from: number; to: number } | { type: 'CLONE'; index: number } | { type: 'DELETE'; index: number } | { type: 'ADD' }) => void;
  onHeadingChange: (pageId: string, sectionId: string, headingType: 'h1' | 'h2' | 'h3', value: string, h3Index?: number) => void;
  onSectionUpdate: (pageId: string, sectionId: string, newTitle: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ pageData, tasks, toggleTask, pluginDocs, siteInfo, brandSettings, headerSection, footerSection, onStructureChange, onHeadingChange, onSectionUpdate }) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-emerald-400">{pageData.title}</h1>
        <p className="mt-2 text-slate-400 max-w-3xl">{pageData.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <PageStructurePlanner
             pageId={pageData.id}
             sections={pageData.structure}
             headerSection={headerSection}
             footerSection={footerSection}
             onStructureChange={onStructureChange}
             onHeadingChange={onHeadingChange}
             onSectionUpdate={onSectionUpdate}
          />
          
          {pageData.structure.length > 0 && pageData.id !== 'globals' && (
            <>
              <HeadingsPreview 
                  sections={pageData.structure}
                  brandSettings={brandSettings}
                  headerSection={headerSection}
                  footerSection={footerSection}
              />
              <ElementorExporter pageData={pageData} />
            </>
          )}

          {pageData.id === 'globals' && <SiteInfoManager siteInfo={siteInfo} />}
          
          {pageData.schemaInfo && (
            <SchemaHelper pageData={pageData} pluginDocs={pluginDocs} siteInfo={siteInfo} />
          )}
        </div>
        <div className="lg:col-span-2">
          <SeoChecklist pageId={pageData.id} tasks={tasks} toggleTask={toggleTask} />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
