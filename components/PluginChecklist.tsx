
import React, { useState } from 'react';

interface PluginChecklistProps {
  plugins: string[];
  onConfirm: () => void;
}

const PluginChecklist: React.FC<PluginChecklistProps> = ({ plugins, onConfirm }) => {
  const [checkedPlugins, setCheckedPlugins] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (plugin: string) => {
    setCheckedPlugins(prev => ({ ...prev, [plugin]: !prev[plugin] }));
  };

  const allChecked = plugins.every(plugin => checkedPlugins[plugin]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-emerald-400 mb-4"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          <h1 className="text-3xl font-bold text-slate-100">Prerequisite Plugins</h1>
          <p className="mt-2 text-slate-400">
            This tool is designed to work with a specific set of plugins. Please confirm they are installed and activated on your WordPress site.
          </p>
        </div>

        <div className="my-8 space-y-4">
          {plugins.map(plugin => (
            <label
              key={plugin}
              className="flex items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700 cursor-pointer transition-all duration-200 hover:border-emerald-500/50"
            >
              <input
                type="checkbox"
                checked={!!checkedPlugins[plugin]}
                onChange={() => handleCheckboxChange(plugin)}
                className="w-5 h-5 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-600"
              />
              <span className="ml-4 text-lg font-medium text-slate-200">{plugin}</span>
            </label>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onConfirm}
            disabled={!allChecked}
            className="w-full sm:w-auto px-8 py-3 text-lg font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
          >
            {allChecked ? "Let's Get Building!" : 'Please Confirm All Plugins'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PluginChecklist;
