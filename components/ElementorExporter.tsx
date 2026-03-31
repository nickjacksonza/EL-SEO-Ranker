import React, { useState } from 'react';
import type { PageData } from '../types';

interface ElementorExporterProps {
    pageData: PageData;
}

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

const slugify = (text: string) => {
    if (!text) return 'untitled';
    return text
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
};


const generateElementorJson = (pageData: PageData) => {
    const content = pageData.structure.map(section => {
        const elements: any[] = [];
        const sectionSlug = slugify(section.title);
        
        const headings = [
            ...(section.h1 ? [{ level: 'h1', text: section.h1 }] : []),
            ...(section.h2 ? [{ level: 'h2', text: section.h2 }] : []),
            ...(section.h3s ? section.h3s.map(h3 => ({ level: 'h3', text: h3 })) : []),
        ];

        headings.forEach((heading, index) => {
            if (heading.text) {
                elements.push({
                    id: `el-${slugify(pageData.id)}-${sectionSlug}-${heading.level}-${index}`,
                    elType: 'widget',
                    widgetType: 'heading',
                    settings: {
                        title: heading.text,
                        header_size: heading.level.toUpperCase(),
                    }
                });
            }
        });

        return {
            id: `sec-${slugify(pageData.id)}-${sectionSlug}`,
            elType: 'section',
            settings: {}, // Removed all styling settings for a pure structural export
            elements: [{
                id: `col-${slugify(pageData.id)}-${sectionSlug}`,
                elType: 'column',
                elements: elements,
            }],
        };
    });

    return {
        "version": "0.4",
        "title": pageData.title,
        "type": "page",
        "content": content
    };
};

const ElementorExporter: React.FC<ElementorExporterProps> = ({ pageData }) => {
    const [buttonText, setButtonText] = useState('Export Elementor Template');

    const handleExport = () => {
        const elementorData = generateElementorJson(pageData);
        const jsonString = JSON.stringify(elementorData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pageData.id}-template.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setButtonText('Exported!');
        setTimeout(() => setButtonText('Export Elementor Template'), 2000);
    };

    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center">
                <DownloadIcon className="mr-3 text-emerald-400" /> Export
            </h2>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <p className="text-sm text-slate-400 mb-4">
                    Download a pure structural JSON template of this page. You can import this file into your Elementor library to kickstart your page build, allowing your site's global styles to control the design.
                </p>
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-md hover:bg-emerald-500 transition-colors"
                >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    {buttonText}
                </button>
            </div>
        </section>
    );
};

export default ElementorExporter;