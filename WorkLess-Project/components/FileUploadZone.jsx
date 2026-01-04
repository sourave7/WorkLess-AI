import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FileUploadZone = ({ onFileSelect, selectedFile }) => {
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB."
        });
        return;
      }

      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a JPG, PNG, or PDF file."
        });
        return;
      }

      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  const handleClearFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="text-2xl font-black mb-4 text-black">Upload Document</h2>

      <motion.div
        whileHover={{ scale: 1.02 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`border-4 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          selectedFile
            ? 'border-green-500 bg-green-50'
            : 'border-slate-300 hover:border-purple-500 hover:bg-slate-50'
        }`}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <File className="w-12 h-12 text-green-500" />
            </div>
            <div>
              <p className="font-bold text-black">{selectedFile.name}</p>
              <p className="text-sm text-slate-600">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearFile();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg border-2 border-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
              Remove File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-slate-400" />
            <div>
              <p className="font-bold text-black mb-1">Drop your file here</p>
              <p className="text-sm text-slate-600">or click to browse</p>
            </div>
            <p className="text-xs text-slate-500">
              Supports JPG, PNG, PDF (max 10MB)
            </p>
          </div>
        )}
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUploadZone;