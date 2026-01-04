import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSpreadsheet, 
  FileText, 
  File, 
  Download, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Edit3,
  ArrowRight,
  Maximize2,
  RotateCcw,
  MessageSquare,
  Save,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

const ReviewPanel = ({ results, onReset }) => {
  const { toast } = useToast();
  const [format, setFormat] = useState('excel');
  
  // Use passed results to initialize state
  // Fallback to empty array if refinedData is undefined to prevent crashes
  const [data, setData] = useState(results.refinedData || []);
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState({});
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [tempNote, setTempNote] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // Use API provided changeLog or fallback to empty
  const changeLog = results.changeLog || [];
  
  // Use API provided explanation or default
  const aiExplanation = results.aiExplanation || "Analysis complete.";
  
  // Use API provided confidence or default
  const overallConfidence = results.overallConfidence || 0;

  const formats = [
    { id: 'excel', name: 'Excel (.xlsx)', icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'word', name: 'Word (.docx)', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'pdf', name: 'PDF Document', icon: File, color: 'text-red-600', bg: 'bg-red-100' },
    { id: 'text', name: 'Plain Text', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' }
  ];

  const pushToHistory = () => {
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(data))]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousData = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setData(previousData);
    setHistory(newHistory);
    toast({
      title: "Undo Successful",
      description: "Reverted to previous state."
    });
  };

  const handleDataChange = (index, value) => {
    // Only push to history if value is actually different
    if (data[index].value !== value) {
      pushToHistory();
      const newData = [...data];
      newData[index].value = value;
      setData(newData);
    }
  };

  const handleNoteOpen = (index) => {
    setActiveNoteId(index);
    setTempNote(notes[index] || '');
  };

  const handleNoteSave = (index) => {
    setNotes(prev => ({
      ...prev,
      [index]: tempNote
    }));
    setActiveNoteId(null);
    toast({
      title: "Note Saved",
      description: "Your note has been attached to this record."
    });
  };

  const handleDownloadOriginal = () => {
    const link = document.createElement('a');
    link.href = results.originalImage;
    link.download = `original-upload-${new Date().getTime()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Download Started",
      description: "Original file is being downloaded."
    });
  };

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Export Successful",
        description: `Your file has been exported as ${formats.find(f => f.id === format).name}`
      });
    }, 2000);
  };

  const getConfidenceColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
      >
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-black flex items-center gap-3 flex-wrap">
              Review & Export
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border-2 border-purple-500">
                AI CONFIDENCE: {overallConfidence}%
              </span>
            </h2>
            <p className="text-slate-600 mt-1">Verify the AI-refined data before exporting.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative group w-full sm:w-64">
              <Label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Output Format</Label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-4 border-black text-black font-bold py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500/20 cursor-pointer transition-all hover:bg-slate-100"
              >
                {formats.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 bottom-4 flex items-center px-2 text-black">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto mt-5">
              <Button
                onClick={handleDownloadOriginal}
                variant="outline"
                className="flex-1 sm:flex-none bg-white hover:bg-slate-50 text-black font-bold h-[52px] px-4 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none"
                title="Download Original File"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Original
              </Button>
              
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold h-[52px] px-6 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none"
              >
                {isExporting ? (
                  <span className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     Exporting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* AI Communication Area */}
        <div className="mt-6 bg-slate-50 rounded-lg border-2 border-slate-200 p-4 flex items-start gap-4">
          <div className="p-2 bg-purple-100 rounded-full border-2 border-purple-200 mt-1">
            <Bot className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-black text-sm mb-1">AI Processing Log</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {aiExplanation}
              <span className="block mt-1 text-purple-600 font-bold text-xs uppercase tracking-wide">Ready for review</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Split View */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Left: Original Source */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col h-full"
        >
          <div className="bg-white rounded-t-xl border-4 border-black border-b-0 p-4 flex justify-between items-center bg-slate-100">
            <div className="flex items-center gap-2 font-bold text-black">
              <File className="w-5 h-5" />
              Original Source
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-slate-200 rounded-lg transition-colors"
              onClick={() => window.open(results.originalImage, '_blank')}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 bg-slate-200 border-4 border-black rounded-b-xl overflow-hidden relative group min-h-[400px]">
             <img 
               src={results.originalImage} 
               alt="Original Document" 
               className="w-full h-full object-contain absolute inset-0 transition-transform duration-300 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
          </div>
        </motion.div>

        {/* Right: AI Refined Data (Editable) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col h-full"
        >
          <div className="bg-white rounded-t-xl border-4 border-black border-b-0 p-4 flex justify-between items-center bg-purple-50">
            <div className="flex items-center gap-2 font-bold text-black">
              {formats.find(f => f.id === format)?.icon && React.createElement(formats.find(f => f.id === format).icon, { className: "w-5 h-5" })}
              AI Refined Data 
              <span className="text-xs font-normal text-slate-500 ml-2 hidden sm:inline">(Editable)</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleUndo} 
                disabled={history.length === 0}
                className="h-8 text-xs font-bold text-slate-600 hover:text-black hover:bg-purple-100 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <RotateCcw className="w-3 h-3 mr-1.5" /> Undo
              </Button>
              <div className="w-px h-4 bg-slate-300" />
              <Button variant="ghost" size="sm" onClick={() => {
                setData(results.refinedData || []);
                setHistory([]);
              }} className="h-8 text-xs font-bold text-slate-600 hover:text-black hover:bg-purple-100">
                <RefreshCw className="w-3 h-3 mr-1.5" /> Reset
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-white border-4 border-black rounded-b-xl overflow-hidden flex flex-col min-h-[400px]">
            {format === 'excel' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b-2 border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-bold w-32">Field</th>
                      <th className="px-4 py-3 font-bold">Value</th>
                      <th className="px-4 py-3 font-bold text-center w-20">Conf.</th>
                      <th className="px-4 py-3 font-bold text-center w-16">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                          No data found in this document.
                        </td>
                      </tr>
                    ) : (
                      data.map((item, index) => (
                      <React.Fragment key={index}>
                        <tr className={`bg-white border-b border-slate-100 hover:bg-purple-50/50 transition-colors group ${activeNoteId === index ? 'bg-purple-50' : ''}`}>
                          <td className="px-4 py-4 font-bold text-slate-700 align-top">
                            {item.field}
                          </td>
                          <td className="px-4 py-2 align-top">
                            <div className="relative">
                              <input 
                                type="text" 
                                value={item.value}
                                onChange={(e) => handleDataChange(index, e.target.value)}
                                onFocus={() => setActiveField(index)}
                                onBlur={() => setActiveField(null)}
                                className={`w-full bg-transparent border-2 border-transparent hover:border-slate-200 focus:border-purple-500 rounded px-2 py-1.5 outline-none transition-all font-medium text-black ${activeField === index ? 'bg-white shadow-sm' : ''}`}
                              />
                              <Edit3 className={`w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center align-top">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getConfidenceColor(item.confidence || 0)}`}>
                              {item.confidence || 0}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center align-top">
                            <button 
                              onClick={() => activeNoteId === index ? setActiveNoteId(null) : handleNoteOpen(index)}
                              className={`p-2 rounded-lg transition-colors ${
                                notes[index] 
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                              }`}
                              title={notes[index] ? "Edit Note" : "Add Note"}
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                        
                        {/* Inline Note Editor */}
                        <AnimatePresence>
                          {activeNoteId === index && (
                            <motion.tr 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="bg-yellow-50/50 border-b border-yellow-100"
                            >
                              <td colSpan="4" className="p-4">
                                <div className="flex gap-2 items-start max-w-lg mx-auto bg-white p-3 rounded-lg border-2 border-yellow-200 shadow-sm">
                                  <div className="flex-1">
                                    <Label className="text-xs font-bold text-yellow-600 uppercase mb-1 block">Review Note</Label>
                                    <textarea
                                      value={tempNote}
                                      onChange={(e) => setTempNote(e.target.value)}
                                      placeholder="Add comments about this field for your records..."
                                      className="w-full text-sm p-2 bg-slate-50 border-2 border-slate-200 rounded-md focus:outline-none focus:border-yellow-400 resize-none min-h-[60px]"
                                      autoFocus
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        onClick={() => setActiveNoteId(null)}
                                        className="h-7 text-xs"
                                      >
                                        Cancel
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleNoteSave(index)}
                                        className="h-7 text-xs bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                                      >
                                        <Save className="w-3 h-3 mr-1" /> Save Note
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    )))}
                  </tbody>
                </table>
              </div>
            )}

            {(format === 'word' || format === 'pdf') && (
              <div className="p-8 bg-white min-h-full">
                <div className="max-w-md mx-auto bg-white shadow-lg border border-slate-200 min-h-[300px] p-8 relative">
                   {/* Document Header Mock */}
                   <div className="h-4 w-1/3 bg-slate-200 mb-8"></div>
                   
                   <div className="space-y-6">
                      {data.map((item, index) => (
                        <div key={index} className="group relative pl-4 border-l-2 border-transparent hover:border-purple-200 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                             <Label className="text-xs text-slate-400 uppercase tracking-wider block">{item.field}</Label>
                             <button 
                                onClick={() => activeNoteId === index ? setActiveNoteId(null) : handleNoteOpen(index)}
                                className={`opacity-0 group-hover:opacity-100 transition-opacity ${notes[index] ? 'opacity-100 text-yellow-500' : 'text-slate-300 hover:text-purple-500'}`}
                             >
                               <MessageSquare className="w-3 h-3" />
                             </button>
                          </div>
                          
                          {/* Note Display for Document View */}
                          {notes[index] && activeNoteId !== index && (
                            <div className="mb-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800 italic flex gap-2">
                               <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                               {notes[index]}
                            </div>
                          )}

                          {activeNoteId === index ? (
                            <div className="mb-2 p-2 bg-white border-2 border-yellow-200 rounded shadow-sm z-10 relative">
                               <textarea
                                  value={tempNote}
                                  onChange={(e) => setTempNote(e.target.value)}
                                  className="w-full text-xs p-1 border border-slate-200 rounded mb-2 focus:outline-none focus:border-yellow-400"
                                  rows={2}
                                  autoFocus
                               />
                               <div className="flex justify-end gap-1">
                                 <button onClick={() => setActiveNoteId(null)} className="p-1 hover:bg-slate-100 rounded"><X className="w-3 h-3" /></button>
                                 <button onClick={() => handleNoteSave(index)} className="p-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"><Save className="w-3 h-3" /></button>
                               </div>
                            </div>
                          ) : null}

                          <div 
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleDataChange(index, e.target.innerText)}
                            className="text-black font-serif text-lg border-b border-transparent hover:border-slate-300 focus:border-purple-500 outline-none transition-colors"
                          >
                            {item.value}
                          </div>
                        </div>
                      ))}
                   </div>
                   
                   {/* Page corner fold effect */}
                   <div className="absolute top-0 right-0 border-t-[20px] border-r-[20px] border-t-white border-r-slate-100 shadow-sm"></div>
                </div>
              </div>
            )}

            {format === 'text' && (
              <div className="flex-1 bg-slate-900 p-6 overflow-auto font-mono text-sm">
                <div className="text-slate-400 mb-2"># Generated output based on OCR scan</div>
                <div className="text-slate-400 mb-4"># {new Date().toISOString()}</div>
                <div className="space-y-2">
                  {data.map((item, index) => (
                    <div key={index} className="flex group relative">
                      <span className="text-purple-400 min-w-[120px]">{item.field}:</span>
                      <input 
                        className="bg-transparent text-green-400 border-none outline-none flex-1 focus:bg-slate-800 rounded px-1 -ml-1"
                        value={`"${item.value}"`}
                        onChange={(e) => {
                          // Strip quotes for state update
                          const val = e.target.value.replace(/^"|"$/g, '');
                          handleDataChange(index, val);
                        }}
                      />
                      {notes[index] && (
                        <span className="ml-2 text-yellow-600 opacity-50 text-xs flex items-center gap-1 select-none">
                           # {notes[index]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-slate-500 animate-pulse">_</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Change Log Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6"
      >
        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple-600" />
          Modifications & Change Log
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {changeLog.length === 0 ? (
            <div className="col-span-3 text-center py-4 text-slate-500 italic">No significant changes or corrections detected.</div>
          ) : (
            changeLog.map((log, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              {log.type === 'formatting' && <ArrowRight className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />}
              {log.type === 'correction' && <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />}
              {log.type === 'structure' && <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />}
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block mb-0.5">{log.type}</span>
                <p className="text-sm font-medium text-slate-700 leading-tight">{log.message}</p>
              </div>
            </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewPanel;