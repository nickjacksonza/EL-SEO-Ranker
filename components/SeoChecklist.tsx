
import React from 'react';
import type { SEOTask } from '../types';

interface SeoChecklistProps {
  pageId: string;
  tasks: SEOTask[];
  toggleTask: (pageId: string, taskId: string) => void;
}

const CheckSquareIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
);

const SeoChecklist: React.FC<SeoChecklistProps> = ({ pageId, tasks, toggleTask }) => {
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="sticky top-8">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-5">
            <h2 className="text-2xl font-bold text-slate-200 mb-4 flex items-center"><CheckSquareIcon className="mr-3 text-emerald-400" /> SEO Checklist</h2>
            
            <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                    <span>Progress</span>
                    <span>{completedTasks} / {totalTasks} Completed</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="space-y-3">
                {tasks.map(task => (
                    <label key={task.id} className="flex items-center p-3 rounded-md transition-colors duration-200 hover:bg-slate-700/50 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => toggleTask(pageId, task.id)}
                            className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-600 focus:ring-2"
                        />
                        <span className={`ml-3 text-sm ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                            {task.text}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    </div>
  );
};

export default SeoChecklist;
