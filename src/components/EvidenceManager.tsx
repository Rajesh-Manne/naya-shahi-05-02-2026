import React, { useState, useCallback, useMemo } from 'react';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Folder, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Loader2, 
  Plus,
  Trash2,
  Tag,
  Eye,
  ChevronRight,
  Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

interface EvidenceFile {
  id: string;
  file: File;
  preview: string;
  category: string;
  timestamp: number;
  tags: string[];
  description: string;
  metadata: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
}

interface EvidenceManagerProps {
  incidentData: any;
  incident: any;
  complaintText: string;
  onPackageGenerated: (blob: Blob) => void;
}

const CATEGORIES = [
  { id: 'chats', name: 'Chats', icon: <MessageCircle size={18} />, color: 'bg-blue-50 text-blue-600' },
  { id: 'financial', name: 'Financial', icon: <CreditCard size={18} />, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'emails', name: 'Emails', icon: <Mail size={18} />, color: 'bg-amber-50 text-amber-600' },
  { id: 'identity', name: 'Identity', icon: <Shield size={18} />, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'misc', name: 'Miscellaneous', icon: <Folder size={18} />, color: 'bg-slate-50 text-slate-600' }
];

import { MessageCircle, CreditCard, Mail, Shield, Type } from 'lucide-react';

import { PDFDocument } from 'pdf-lib';

export const EvidenceManager: React.FC<EvidenceManagerProps> = ({ 
  incidentData, 
  incident, 
  complaintText,
  onPackageGenerated 
}) => {
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('chats');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const processedFiles: EvidenceFile[] = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      category: selectedCategory,
      timestamp: Date.now(),
      tags: [],
      description: '',
      metadata: {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }
    }));
    setFiles(prev => [...prev, ...processedFiles]);
  }, [selectedCategory]);

  const removeFile = (id: string) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const updateFile = (id: string, updates: Partial<EvidenceFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const extractIdentifiers = (text: string) => {
    const utrMatch = text.match(/[A-Z0-9]{12,}/g);
    const phoneMatch = text.match(/\+?\d{10,12}/g);
    return {
      utrs: utrMatch || [],
      phones: phoneMatch || []
    };
  };

  const generatePackage = async () => {
    setIsGenerating(true);

    try {
      const zip = new JSZip();
      const metadata: any[] = [];

      // 1. Create Folders
      const folders: Record<string, JSZip> = {};
      CATEGORIES.forEach(cat => {
        folders[cat.id] = zip.folder(cat.name)!;
      });

      // 2. Add Original Files & Collect Metadata
      for (const ef of files) {
        const folder = folders[ef.category];
        folder.file(ef.metadata.name, ef.file);
        
        metadata.push({
          id: ef.id,
          filename: ef.metadata.name,
          category: ef.category,
          size: ef.metadata.size,
          type: ef.metadata.type,
          timestamp: new Date(ef.timestamp).toISOString(),
          tags: ef.tags,
          description: ef.description,
          extracted: extractIdentifiers(ef.metadata.name + " " + ef.description)
        });
      }

      // 3. Generate Metadata File
      zip.file("metadata.json", JSON.stringify({
        caseId: `NS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        generatedAt: new Date().toISOString(),
        incident: {
          title: incident.title,
          category: incident.category,
          location: incidentData.location,
          date: incidentData.date,
          totalLoss: incidentData.transactions.reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0)
        },
        evidenceCount: files.length,
        items: metadata
      }, null, 2));

      // 4. Generate Complaint PDF
      const complaintDoc = new jsPDF();
      complaintDoc.setFontSize(12);
      const splitText = complaintDoc.splitTextToSize(complaintText, 180);
      complaintDoc.text(splitText, 15, 20);
      zip.file("Official_Complaint.pdf", complaintDoc.output('blob'));

      // 5. Generate Consolidated Evidence PDF
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229); // Indigo-600
      doc.text("NAYA SAHAI - EVIDENCE DOSSIER", 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });
      
      doc.setDrawColor(200);
      doc.line(20, 35, 190, 35);

      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("INCIDENT SUMMARY", 20, 45);
      doc.setFontSize(11);
      doc.text(`Incident: ${incident.title}`, 20, 55);
      doc.text(`Location: ${incidentData.location}`, 20, 62);
      doc.text(`Date: ${incidentData.date}`, 20, 69);
      
      doc.setFontSize(14);
      doc.text("TRANSACTION LOG", 20, 85);
      let ty = 95;
      doc.setFontSize(10);
      doc.text("UTR/Ref", 20, ty);
      doc.text("Date", 80, ty);
      doc.text("Amount", 140, ty);
      doc.line(20, ty + 2, 190, ty + 2);
      ty += 10;
      
      incidentData.transactions.forEach((t: any) => {
        doc.text(t.utr || 'N/A', 20, ty);
        doc.text(t.date || 'N/A', 80, ty);
        doc.text(`INR ${t.amount || '0'}`, 140, ty);
        ty += 8;
      });

      doc.addPage();
      doc.setFontSize(14);
      doc.text("EVIDENCE ATTACHMENTS", 20, 20);
      
      let ey = 35;
      const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      };

      for (const f of files) {
        if (ey > 260) {
          doc.addPage();
          ey = 20;
        }

        doc.setFontSize(11);
        doc.setTextColor(79, 70, 229);
        doc.text(`[${f.category.toUpperCase()}] ${f.metadata.name}`, 20, ey);
        doc.setTextColor(100);
        doc.setFontSize(9);
        doc.text(`Description: ${f.description || 'No description provided'}`, 20, ey + 5);
        ey += 12;

        if (f.metadata.type.startsWith('image/')) {
          try {
            const dataUrl = await readFileAsDataURL(f.file);
            const imgProps = doc.getImageProperties(dataUrl);
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const maxWidth = pageWidth - (margin * 2);
            
            let imgWidth = imgProps.width;
            let imgHeight = imgProps.height;
            
            const ratio = maxWidth / imgWidth;
            imgWidth = maxWidth;
            imgHeight = imgHeight * ratio;
            
            const maxPossibleHeight = pageHeight - margin * 2 - 20;
            if (imgHeight > maxPossibleHeight) {
               const scaleRatio = maxPossibleHeight / imgHeight;
               imgHeight = maxPossibleHeight;
               imgWidth = imgWidth * scaleRatio;
            }

            if (ey + imgHeight > pageHeight - margin) {
               doc.addPage();
               ey = 20;
            }
            
            doc.addImage(dataUrl, 'JPEG', margin, ey, imgWidth, imgHeight);
            ey += imgHeight + 20;
          } catch (e) {
            console.error("Failed to embed image:", e);
            doc.setTextColor(255, 0, 0);
            doc.text("[Error: Could not embed image preview]", 20, ey);
            ey += 10;
          }
        } else if (f.metadata.type === 'application/pdf') {
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text("(Full PDF content appended to the end of this dossier)", 20, ey);
          ey += 15;
        } else {
          ey += 10;
        }
      }

      // Final Merging with pdf-lib
      const jsPdfBytes = doc.output('arraybuffer');
      const mergedPdf = await PDFDocument.create();
      
      const jsPdfDoc = await PDFDocument.load(jsPdfBytes);
      const copiedPages = await mergedPdf.copyPages(jsPdfDoc, jsPdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));

      // Append actual PDFs
      for (const f of files) {
        if (f.metadata.type === 'application/pdf') {
          try {
            const pdfBytes = await readFileAsArrayBuffer(f.file);
            const externalPdf = await PDFDocument.load(pdfBytes);
            const externalPages = await mergedPdf.copyPages(externalPdf, externalPdf.getPageIndices());
            externalPages.forEach((page) => mergedPdf.addPage(page));
          } catch (e) {
            console.error(`Failed to merge PDF ${f.metadata.name}:`, e);
          }
        }
      }

      const finalPdfBytes = await mergedPdf.save();
      zip.file("Consolidated_Evidence.pdf", finalPdfBytes);

      // 6. Generate ZIP
      const content = await zip.generateAsync({ type: "blob" });
      onPackageGenerated(content);
    } catch (error) {
      console.error("Package generation failed:", error);
      alert("Failed to generate evidence package. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all font-bold text-sm relative ${
              selectedCategory === cat.id 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {cat.icon}
            {cat.name}
            <span className="ml-1 bg-black/10 px-2 py-0.5 rounded-full text-[10px]">
              {files.filter(f => f.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
        className={`relative border-4 border-dashed rounded-[3rem] p-12 text-center transition-all ${
          dragActive ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white'
        }`}
      >
        <input
          type="file"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="space-y-4 pointer-events-none">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
            <Upload size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-900">Drop files here or click to upload</h4>
            <p className="text-slate-500 font-bold">Uploading to <span className="text-indigo-600 uppercase">{selectedCategory}</span></p>
          </div>
          <p className="text-xs text-slate-400 font-bold">Supports JPG, PNG, PDF (Max 10MB per file)</p>
        </div>
      </div>

      {/* File List */}
      <div className="space-y-4">
        <AnimatePresence>
          {files.map(file => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-slate-200 p-6 rounded-[2rem] flex flex-col gap-4 group hover:border-indigo-400 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  CATEGORIES.find(c => c.id === file.category)?.color || 'bg-slate-100'
                }`}>
                  {file.metadata.type.startsWith('image/') ? <ImageIcon size={24} /> : <FileText size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="font-black text-slate-900 truncate text-base">{file.metadata.name}</h5>
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-black text-slate-500 uppercase tracking-widest">{file.category}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {(file.metadata.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingFileId(editingFileId === file.id ? null : file.id)}
                    className={`p-2 rounded-xl transition-all ${editingFileId === file.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
                  >
                    <Tag size={20} />
                  </button>
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-2 bg-red-50 rounded-xl text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {editingFileId === file.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-4 pt-4 border-t-2 border-slate-50"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description / Caption</label>
                    <textarea
                      value={file.description}
                      onChange={(e) => updateFile(file.id, { description: e.target.value })}
                      placeholder="e.g. Screenshot showing the fraudulent UPI transaction on GPay..."
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-indigo-600 transition-all resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['UTR Proof', 'Chat Log', 'Identity', 'Bank Alert'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          const newTags = file.tags.includes(tag) 
                            ? file.tags.filter(t => t !== tag) 
                            : [...file.tags, tag];
                          updateFile(file.id, { tags: newTags });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          file.tags.includes(tag) 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {files.length === 0 && (
          <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
            <p className="text-slate-400 font-bold">No files uploaded yet.</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-8 border-t-2 border-slate-100">
        <button
          disabled={files.length === 0 || isGenerating}
          onClick={generatePackage}
          className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" /> Generating Official Bundle...</>
          ) : (
            <><Archive /> Build Evidence Package (ZIP)</>
          )}
        </button>
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-emerald-500" /> PDF Consolidated
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-emerald-500" /> Metadata JSON
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <CheckCircle2 size={14} className="text-emerald-500" /> Structured Folders
          </div>
        </div>
      </div>
    </div>
  );
};

