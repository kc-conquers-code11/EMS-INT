import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ZoomIn, ZoomOut, Check, Trash2, 
  RotateCw, Undo2, Type, Pen, Eye, EyeOff,
  ChevronLeft, ChevronRight, CheckCircle2, Download
} from 'lucide-react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import SamplePdf from '../../../../assets/Sample_Pdfs/Sample_Ans_Sheet.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface DualMarksEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatNo: string;
  studentName: string;
  courseCode: string;
  courseTitle: string;
}

export const DualMarksEvaluationModal: React.FC<DualMarksEvaluationModalProps> = ({ 
  isOpen, 
  onClose,
  seatNo,
  studentName,
  courseCode,
  courseTitle
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  
  const [mod1MarksData, setMod1MarksData] = useState<Record<string, { max: number, input: number | null }[]>>({
    Q1: [{max: 2, input: null}, {max: 2, input: null}, {max: 1, input: null}],
    Q2: [{max: 5, input: null}],
    Q3: [{max: 5, input: null}],
    Q4: [{max: 5, input: null}],
    Q5: [{max: 5, input: null}],
    Q6: [{max: 5, input: null}],
  });
  
  const [mod2MarksData, setMod2MarksData] = useState<Record<string, { max: number, input: number | null }[]>>({
    Q1: [{max: 2, input: null}, {max: 2, input: null}, {max: 1, input: null}],
    Q2: [{max: 5, input: null}],
    Q3: [{max: 5, input: null}],
    Q4: [{max: 5, input: null}],
    Q5: [{max: 5, input: null}],
    Q6: [{max: 5, input: null}],
  });

  const [currentModerator, setCurrentModerator] = useState<1 | 2>(1);

  const [activeInput, setActiveInput] = useState<{ q: string, index: number } | null>(null);

  const [activeTool, setActiveTool] = useState<'tick' | 'cross' | 'text' | 'draw' | null>(null);
  const [annotations, setAnnotations] = useState<Record<number, any[]>>({});
  const [visitedPages, setVisitedPages] = useState<Set<number>>(new Set([1]));
  const [deletedPages, setDeletedPages] = useState<Set<number>>(new Set());
  const [hiddenPages, setHiddenPages] = useState<Set<number>>(new Set());
  
  const [typingCoord, setTypingCoord] = useState<{x: number, y: number} | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{x: number, y: number}[]>([]);
  
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState<React.ReactNode>("");
  const [isLockConfirmOpen, setIsLockConfirmOpen] = useState(false);
  const [lockPageNumber, setLockPageNumber] = useState(1);
  const [viewPdfConfig, setViewPdfConfig] = useState<{ title: string, file: any } | null>(null);
  const [viewPdfPage, setViewPdfPage] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    setVisitedPages(prev => new Set(prev).add(newPage));
  };

  const handleNumberClick = (valStr: string) => {
    if (!activeInput) return;
    
    let val = 0;
    if (valStr === '½') val = 0.5;
    else if (valStr === '¼') val = 0.25;
    else val = parseInt(valStr);

    const currentData = currentModerator === 1 ? mod1MarksData : mod2MarksData;
    const qData = currentData[activeInput.q];
    if (val > qData[activeInput.index].max) {
      alert(`Marks cannot exceed the maximum marks (${qData[activeInput.index].max}) for this question.`);
      return;
    }

    const updater = currentModerator === 1 ? setMod1MarksData : setMod2MarksData;
    updater(prev => {
      const newData = { ...prev };
      newData[activeInput.q] = [...newData[activeInput.q]];
      newData[activeInput.q][activeInput.index] = {
        ...newData[activeInput.q][activeInput.index],
        input: val
      };
      return newData;
    });
  };

  const handleReset = () => {
    const resetData = {
      Q1: [{max: 2, input: null}, {max: 2, input: null}, {max: 1, input: null}],
      Q2: [{max: 5, input: null}],
      Q3: [{max: 5, input: null}],
      Q4: [{max: 5, input: null}],
      Q5: [{max: 5, input: null}],
      Q6: [{max: 5, input: null}],
    };
    if (currentModerator === 1) setMod1MarksData(resetData);
    else setMod2MarksData(resetData);
    setAnnotations({});
    setDeletedPages(new Set());
    setHiddenPages(new Set());
    setScale(1.0);
    setActiveInput(null);
    setPageNumber(1);
    setVisitedPages(new Set([1]));
  };

  const handleUndo = () => {
    if (deletedPages.has(pageNumber)) {
      setDeletedPages(prev => {
        const n = new Set(prev);
        n.delete(pageNumber);
        return n;
      });
      return;
    }
    setAnnotations(prev => {
      const pageAnns = prev[pageNumber] || [];
      if (pageAnns.length === 0) return prev;
      return { ...prev, [pageNumber]: pageAnns.slice(0, -1) };
    });
  };

  const getNextStackY = () => {
    const pageAnns = annotations[pageNumber] || [];
    return 60 + pageAnns.length * 40;
  };

  const handleInstantTick = () => {
    setAnnotations(prev => {
      const pageAnns = prev[pageNumber] || [];
      return { ...prev, [pageNumber]: [...pageAnns, { type: 'tick', x: 500, y: getNextStackY() }] };
    });
  };

  const handleInstantCross = () => {
    setAnnotations(prev => {
      const pageAnns = prev[pageNumber] || [];
      return { ...prev, [pageNumber]: [...pageAnns, { type: 'cross', x: 500, y: getNextStackY() }] };
    });
  };

  const handleInstantText = () => {
    setTypingCoord({ x: 50, y: getNextStackY() });
  };

  const handlePdfClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTool) return;
    
    // Ignore if clicking on the input
    if ((e.target as HTMLElement).tagName === 'INPUT') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'draw') {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    }
  };

  const handlePdfMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || activeTool !== 'draw') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const handlePdfMouseUp = () => {
    if (!isDrawing || activeTool !== 'draw') return;
    setIsDrawing(false);
    if (currentPath.length > 0) {
      setAnnotations(prev => {
        const pageAnns = prev[pageNumber] || [];
        return { ...prev, [pageNumber]: [...pageAnns, { type: 'draw', points: currentPath }] };
      });
      setCurrentPath([]);
    }
  };

  const handleTextSubmit = (text: string) => {
    if (text.trim() && typingCoord) {
      setAnnotations(prev => {
        const pageAnns = prev[pageNumber] || [];
        return { ...prev, [pageNumber]: [...pageAnns, { type: 'text', x: typingCoord.x, y: typingCoord.y, text: text.trim() }] };
      });
    }
    setTypingCoord(null);
  };

  const currentMarksData = currentModerator === 1 ? mod1MarksData : mod2MarksData;
  const totalMarks = Object.values(currentMarksData).reduce((sum, q) => sum + q.reduce((acc, sub) => acc + (sub.input || 0), 0), 0);
  const maxTotal = Object.values(currentMarksData).reduce((sum, q) => sum + q.reduce((acc, sub) => acc + sub.max, 0), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8">
      <div className="bg-white rounded-xl w-full h-full max-w-[1400px] flex flex-col p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 relative">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-[#101828]">Marks Evaluation</h2>
              <p className="text-[14px] font-medium text-[#344054] mt-1">
                Seat_no - Student_name : <span className="font-semibold text-[#0E1680]">{seatNo} - {studentName}</span>
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-[#667085] hover:text-[#101828] transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setViewPdfPage(1); setViewPdfConfig({ title: `View Question Paper - ${courseTitle} (December 2023)`, file: SamplePdf }); }}
              className="px-4 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
            >
              View Question Paper
            </button>
            <button 
              onClick={() => { setViewPdfPage(1); setViewPdfConfig({ title: `View Model Answers - ${courseTitle} (December 2023)`, file: SamplePdf }); }}
              className="px-4 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
            >
              View Model Answers
            </button>
          </div>
        </div>

        {/* Body Container */}
        <div className="flex flex-row gap-6 flex-1 min-h-0">
          
          {/* Left Toolbar */}
          <div className="w-[120px] flex gap-2 flex-wrap content-start overflow-y-auto pr-2 custom-scrollbar">
            {/* Number pads */}
            {['0', '1', '½', '¼', '2', '3', '4', '5', '6', '7', '8', '9'].map((num, i) => (
              <button 
                key={i}
                onClick={() => handleNumberClick(num)}
                className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#22C55E] font-bold text-[16px] rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                {num}
              </button>
            ))}
            
            {/* Action Icons */}
            <div className="w-full flex gap-2 flex-wrap mt-2">
              <button onClick={() => setScale(s => s + 0.2)} className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#344054] rounded-lg hover:bg-gray-50 transition-colors shadow-sm"><ZoomIn size={20} /></button>
              <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#344054] rounded-lg hover:bg-gray-50 transition-colors shadow-sm"><ZoomOut size={20} /></button>
              
              <button onClick={handleInstantTick} className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#22C55E] rounded-lg hover:bg-green-50 transition-colors shadow-sm" title="Add Tick"><Check size={20} /></button>
              <button onClick={handleInstantCross} className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#EF4444] rounded-lg hover:bg-red-50 transition-colors shadow-sm" title="Add Cross"><X size={20} /></button>
              
              <button onClick={() => setDeletedPages(prev => new Set(prev).add(pageNumber))} className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#344054] rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm" title="Delete Page"><Trash2 size={20} /></button>
              <button onClick={handleUndo} className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#344054] rounded-lg hover:bg-gray-50 transition-colors shadow-sm" title="Undo Last Action"><Undo2 size={20} /></button>
              
              <button onClick={handleInstantText} className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#0E1680] rounded-lg hover:bg-blue-50 transition-colors shadow-sm" title="Add Text Remark"><Type size={20} /></button>
              <button onClick={() => setActiveTool(activeTool === 'draw' ? null : 'draw')} className={`w-12 h-12 flex items-center justify-center border border-[#d0d5dd] rounded-lg transition-colors shadow-sm ${activeTool === 'draw' ? 'bg-blue-100 text-[#0E1680]' : 'bg-white text-[#344054] hover:bg-gray-50'}`}><Pen size={20} /></button>
              
              
              <button onClick={() => setHiddenPages(prev => { const n = new Set(prev); n.delete(pageNumber); return n; })} className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#344054] rounded-lg hover:bg-gray-50 transition-colors shadow-sm"><Eye size={20} /></button>
              <button onClick={() => setHiddenPages(prev => new Set(prev).add(pageNumber))} className="w-12 h-12 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#344054] rounded-lg hover:bg-gray-50 transition-colors shadow-sm"><EyeOff size={20} /></button>
            </div>
          </div>

          {/* Center Document Viewer */}
          <div className="flex-1 border border-[#eaecf0] rounded-xl flex flex-col bg-[#f8f9fc] relative overflow-hidden">
            <div className="h-10 bg-white border-b border-[#eaecf0] flex items-center justify-center text-[12px] font-medium text-[#475467]">
              Page No: {pageNumber}
            </div>
            
            <div className="flex-1 relative flex items-center justify-center p-8 overflow-auto">
              {/* Pagination Arrows */}
              <button 
                onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#344054] rounded shadow-sm hover:bg-gray-50 z-10 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => handlePageChange(Math.min(numPages || 1, pageNumber + 1))}
                disabled={pageNumber >= (numPages || 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white border border-[#d0d5dd] text-[#344054] rounded shadow-sm hover:bg-gray-50 z-10 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>

              <div className="w-full h-full flex justify-center overflow-auto bg-[#f8f9fc]">
                {hiddenPages.has(pageNumber) ? (
                  <div className="w-[600px] h-[800px] flex items-center justify-center bg-white border border-[#eaecf0] shadow-sm">
                    <p className="text-[#667085] font-semibold text-lg flex items-center gap-2"><EyeOff /> Page Hidden</p>
                  </div>
                ) : deletedPages.has(pageNumber) ? (
                  <div className="w-[600px] h-[800px] flex items-center justify-center bg-red-50 border border-red-200 shadow-sm">
                    <p className="text-red-500 font-semibold text-lg flex items-center gap-2"><Trash2 /> Page Deleted</p>
                  </div>
                ) : (
                  <div className={`relative inline-block ${activeTool ? 'cursor-crosshair' : ''}`}>
                    <Document
                      file={SamplePdf}
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="shadow-sm border border-[#eaecf0] bg-white flex justify-center pointer-events-none"
                    >
                      <Page 
                        pageNumber={pageNumber} 
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        scale={scale}
                      />
                    </Document>

                    {/* Interaction Layer (receives all mouse events) */}
                    {activeTool && !typingCoord && (
                      <div 
                        className="absolute inset-0 z-30"
                        onMouseDown={handlePdfClick}
                        onMouseMove={handlePdfMouseMove}
                        onMouseUp={handlePdfMouseUp}
                        onMouseLeave={handlePdfMouseUp}
                      />
                    )}

                    {/* Annotations Overlay */}
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {(annotations[pageNumber] || []).filter(a => a.type === 'draw').map((ann, i) => (
                          <polyline key={`draw-${i}`} points={ann.points.map((p: any) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#0E1680" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        ))}
                        {currentPath.length > 0 && (
                          <polyline points={currentPath.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#0E1680" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                      
                      {(annotations[pageNumber] || []).map((ann, i) => {
                        if (ann.type === 'tick') return <Check key={i} className="absolute text-green-500 stroke-[3]" style={{ left: ann.x, top: ann.y, transform: 'translate(-50%, -50%)' }} size={32} />;
                        if (ann.type === 'cross') return <X key={i} className="absolute text-red-500 stroke-[3]" style={{ left: ann.x, top: ann.y, transform: 'translate(-50%, -50%)' }} size={32} />;
                        if (ann.type === 'text') return <span key={i} className="absolute text-[#0E1680] font-bold text-lg px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded border border-white/50 whitespace-nowrap shadow-sm" style={{ left: ann.x, top: ann.y }}>{ann.text}</span>;
                        return null;
                      })}
                      {/* TextInput Overlay if typing */}
                      {typingCoord && (
                        <input 
                          autoFocus 
                          className="absolute border border-blue-500 bg-yellow-50 text-[#0E1680] font-bold text-lg px-1 outline-none z-30 pointer-events-auto shadow-md" 
                          style={{ left: typingCoord.x, top: typingCoord.y }} 
                          onKeyDown={e => { if (e.key === 'Enter') handleTextSubmit(e.currentTarget.value) }} 
                          onBlur={e => handleTextSubmit(e.currentTarget.value)} 
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Evaluation Panel */}
          <div className="w-[560px] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            
            <div className="flex justify-between items-center px-2">
              <span className="text-[13px] font-bold text-[#101828]">Moderator 1: ABC</span>
              <span className="text-[13px] font-bold text-[#101828]">Moderator 2 : ABC</span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex items-center justify-center text-center shadow-sm h-14">
                  <span className="text-[12px] font-bold text-[#344054] leading-tight">Questions<br/>& Marks</span>
                </div>
                <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex items-center justify-center text-center shadow-sm h-14">
                  <span className="text-[12px] font-bold text-[#344054]">Input Marks</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex items-center justify-center text-center shadow-sm h-14 opacity-50">
                  <span className="text-[12px] font-bold text-[#344054] leading-tight">Questions<br/>& Marks</span>
                </div>
                <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex items-center justify-center text-center shadow-sm h-14 opacity-50">
                  <span className="text-[12px] font-bold text-[#344054]">Input Marks</span>
                </div>
              </div>
            </div>

            {/* Questions Rendering */}
            {Object.keys(mod1MarksData).map((qKey) => (
              <div key={qKey} className="grid grid-cols-2 gap-6">
                
                {/* Mod 1 Column */}
                <div className={`grid grid-cols-2 gap-2 ${currentModerator === 2 ? 'opacity-70 pointer-events-none' : ''}`}>
                  <div className="bg-white border border-[#eaecf0] rounded-lg p-2 flex flex-col items-center justify-center shadow-sm min-h-[70px]">
                    <span className="text-[13px] font-bold text-[#101828] mb-1">{qKey}</span>
                    <div className="flex gap-1.5 flex-wrap justify-center">
                      {mod1MarksData[qKey].map((sub, idx) => (
                        <span key={idx} className="text-[#22C55E] text-[12px] font-bold bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                          {sub.max}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border border-[#eaecf0] rounded-lg p-2 flex flex-col items-center justify-center shadow-sm min-h-[70px]">
                    <span className="text-[13px] font-bold text-[#101828] mb-1">{qKey}</span>
                    <div className="flex gap-1.5 h-full items-center flex-wrap justify-center">
                      {mod1MarksData[qKey].map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveInput({ q: qKey, index: idx })}
                          className={`text-[13px] font-bold px-1.5 py-1 rounded transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center ${
                            activeInput?.q === qKey && activeInput?.index === idx 
                              ? 'bg-[#0E1680] text-white' 
                              : 'text-[#101828] bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {sub.input !== null ? sub.input : '-'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mod 2 Column */}
                <div className={`grid grid-cols-2 gap-2 ${currentModerator === 1 ? 'opacity-40 pointer-events-none' : ''}`}>
                  <div className="bg-white border border-[#eaecf0] rounded-lg p-2 flex flex-col items-center justify-center shadow-sm min-h-[70px]">
                    <span className="text-[13px] font-bold text-[#101828] mb-1">{qKey}</span>
                    <div className="flex gap-1.5 flex-wrap justify-center">
                      {mod2MarksData[qKey].map((sub, idx) => (
                        <span key={idx} className="text-[#22C55E] text-[12px] font-bold bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                          {sub.max}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white border border-[#eaecf0] rounded-lg p-2 flex flex-col items-center justify-center shadow-sm min-h-[70px]">
                    <span className="text-[13px] font-bold text-[#101828] mb-1">{qKey}</span>
                    <div className="flex gap-1.5 h-full items-center flex-wrap justify-center">
                      {mod2MarksData[qKey].map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveInput({ q: qKey, index: idx })}
                          className={`text-[13px] font-bold px-1.5 py-1 rounded transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center ${
                            activeInput?.q === qKey && activeInput?.index === idx 
                              ? 'bg-[#0E1680] text-white' 
                              : 'text-[#101828] bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {sub.input !== null ? sub.input : '-'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}

            <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex items-center justify-center shadow-sm mt-2">
              <span className="text-[14px] font-bold text-[#101828]">Total Marks Calculated : {totalMarks} / {maxTotal}</span>
            </div>

            <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex items-center justify-center shadow-sm gap-4">
              <span className="text-[12px] font-bold text-[#101828]">Total Pages : <span className="text-[#22C55E] bg-[#DCFCE7] px-1.5 py-0.5 rounded">{numPages || 0}</span></span>
              <span className="text-[12px] font-bold text-[#101828]">Visited : <span className="text-[#22C55E] bg-[#DCFCE7] px-1.5 py-0.5 rounded">{visitedPages.size}</span></span>
              <span className="text-[12px] font-bold text-[#101828]">Not Visited : <span className="text-[#22C55E] bg-[#DCFCE7] px-1.5 py-0.5 rounded">{Math.max(0, (numPages || 0) - visitedPages.size)}</span></span>
            </div>

            <button 
              onClick={() => {
                if (currentModerator === 1) {
                  setCurrentModerator(2);
                  setActiveInput(null);
                } else {
                  setIsLockConfirmOpen(true);
                }
              }} 
              className="w-full py-3 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm mt-2"
            >
              {currentModerator === 1 ? 'Send to Next Moderator' : 'Lock Marks'}
            </button>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <button onClick={handleReset} className="py-2.5 bg-[#0E1680] text-white text-[13px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm">
                Reset
              </button>
              <button onClick={() => setIsRemarkModalOpen(true)} className="py-2.5 bg-[#0E1680] text-white text-[13px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm">
                Reject & Add Remarks
              </button>
            </div>

          </div>
        </div>
      </div>
      
      {/* Add Remark Modal */}
      {isRemarkModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
              <h3 className="text-[16px] font-bold text-[#101828]">Add Remark</h3>
              <button onClick={() => setIsRemarkModalOpen(false)} className="text-[#667085] hover:text-[#101828] transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#344054]">Enter Remark</label>
                <textarea 
                  rows={4}
                  placeholder="Enter reason details..."
                  className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#0E1680]/20 focus:border-[#0E1680] transition-shadow resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[#344054]">Select Question Number</label>
                <select className="w-full px-3 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0E1680]/20 focus:border-[#0E1680] transition-shadow appearance-none cursor-pointer">
                  <option value="">Select question...</option>
                  <option value="1a">Q1 (2 marks)</option>
                  <option value="1b">Q1 (2 marks)</option>
                  <option value="1c">Q1 (1 mark)</option>
                  <option value="2">Q2</option>
                  <option value="3">Q3</option>
                  <option value="4">Q4</option>
                  <option value="5">Q5</option>
                  <option value="6">Q6</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-[#eaecf0] flex justify-end">
              <button 
                onClick={() => {
                  setIsRemarkModalOpen(false);
                  setSuccessTitle(<>Remark Submitted<br/>sucessfully!</>);
                  setIsSuccessModalOpen(true);
                }}
                className="px-6 py-2 bg-[#0E1680] text-white text-[14px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[360px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-8 flex flex-col items-center text-center">
            <CheckCircle2 className="w-[72px] h-[72px] text-[#22C55E] mb-5" strokeWidth={2} />
            <h3 className="text-[18px] font-bold text-[#101828] mb-6 leading-snug">Remark Submitted<br/>sucessfully!</h3>
            
            <div className="text-[13px] font-bold text-[#344054] mb-8 leading-relaxed flex flex-col gap-1">
              <p>Seat_no : <span className="font-medium text-[#475467]">{seatNo}</span></p>
              <p>Student_name : <span className="font-medium text-[#475467]">{studentName}</span></p>
              <p>ID: <span className="font-medium text-[#475467]">{courseCode}</span></p>
              <p>Course : <span className="font-medium text-[#475467]">{courseTitle}</span></p>
            </div>

            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="px-10 py-2 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Lock Confirm Modal */}
      {isLockConfirmOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[1100px] h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
              <h3 className="text-[18px] font-bold text-[#101828]">Lock Marks</h3>
              <button onClick={() => setIsLockConfirmOpen(false)} className="text-[#667085] hover:text-[#101828] transition-colors"><X size={20} /></button>
            </div>
            
            {/* Sub-header info */}
            <div className="px-6 py-3 border-b border-[#eaecf0] bg-white flex items-center gap-2 text-[14px] font-bold text-[#344054]">
              <span>ID: {courseCode}</span>
              <span className="text-gray-300">|</span>
              <span>Seat_no : {seatNo}</span>
              <span className="text-gray-300">|</span>
              <span>Student_name : {studentName}</span>
              <span className="text-gray-300">|</span>
              <span>Course Name : {courseTitle}</span>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-row p-6 gap-8 bg-white">
              {/* Left PDF */}
              <div className="flex-1 bg-white border border-[#eaecf0] rounded-xl flex flex-col relative overflow-hidden shadow-sm">
                <div className="h-10 border-b border-[#eaecf0] flex items-center justify-center text-[12px] font-bold text-[#475467]">
                  Page No: {lockPageNumber}
                </div>
                <div className="flex-1 relative flex items-center justify-center bg-[#f8f9fc] p-4 overflow-auto">
                  <button onClick={() => setLockPageNumber(p => Math.max(1, p - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white border border-[#eaecf0] rounded shadow-sm hover:bg-gray-50 z-10"><ChevronLeft size={16} /></button>
                  <button onClick={() => setLockPageNumber(p => Math.min(numPages || 1, p + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white border border-[#eaecf0] rounded shadow-sm hover:bg-gray-50 z-10"><ChevronRight size={16} /></button>
                  
                  <Document file={SamplePdf} className="shadow-sm border border-[#eaecf0] bg-white pointer-events-none">
                    <Page pageNumber={lockPageNumber} renderTextLayer={false} renderAnnotationLayer={false} scale={0.7} />
                  </Document>
                </div>
              </div>

              {/* Right Summary Panel */}
              <div className="w-[360px] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex items-center justify-center text-center shadow-sm">
                    <span className="text-[13px] font-bold text-[#344054]">Questions<br/>& Marks</span>
                  </div>
                  <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex items-center justify-center text-center shadow-sm">
                    <span className="text-[13px] font-bold text-[#344054]">Input Marks</span>
                  </div>
                </div>

                {Object.keys(mod2MarksData).map((qKey) => (
                  <div key={qKey} className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex flex-col items-center justify-center shadow-sm min-h-[70px]">
                      <span className="text-[14px] font-bold text-[#101828] mb-1">{qKey}</span>
                      <div className="flex gap-2">
                        {mod2MarksData[qKey].map((sub, idx) => (
                          <span key={idx} className="text-[#22C55E] text-[13px] font-bold bg-[#DCFCE7] px-2 py-0.5 rounded">
                            {sub.max}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white border border-[#eaecf0] rounded-lg p-3 flex flex-col items-center justify-center shadow-sm min-h-[70px]">
                      <span className="text-[14px] font-bold text-[#101828] mb-1">{qKey}</span>
                      <div className="flex gap-2 h-full items-center">
                        {mod2MarksData[qKey].map((sub, idx) => (
                          <span key={idx} className="text-[#101828] text-[14px] font-bold flex items-center justify-center min-w-[24px]">
                            {sub.input !== null ? sub.input : '-'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-white border border-[#eaecf0] rounded-lg p-4 flex items-center justify-center shadow-sm mt-2">
                  <span className="text-[15px] font-bold text-[#101828]">Total Marks Calculated : {totalMarks} / {maxTotal}</span>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button onClick={() => { 
                    setIsLockConfirmOpen(false);
                    setSuccessTitle("Locked Marks!");
                    setIsSuccessModalOpen(true);
                  }} className="w-full py-3 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm">
                    Confirm
                  </button>
                  <button onClick={() => setIsLockConfirmOpen(false)} className="w-full py-3 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm">
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[360px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-8 flex flex-col items-center text-center">
            <CheckCircle2 className="w-[72px] h-[72px] text-[#22C55E] mb-5" strokeWidth={2} />
            <h3 className="text-[18px] font-bold text-[#101828] mb-6 leading-snug">{successTitle}</h3>
            
            <div className="text-[13px] font-bold text-[#344054] mb-8 leading-relaxed flex flex-col gap-1">
              <p>Seat_no : <span className="font-medium text-[#475467]">{seatNo}</span></p>
              <p>Student_name : <span className="font-medium text-[#475467]">{studentName}</span></p>
              <p>ID: <span className="font-medium text-[#475467]">{courseCode}</span></p>
              <p>Course : <span className="font-medium text-[#475467]">{courseTitle}</span></p>
            </div>

            <button 
              onClick={() => {
                setIsSuccessModalOpen(false);
                if (successTitle === "Locked Marks!") onClose();
              }}
              className="px-10 py-2 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* PDF Viewer Overlay Modal */}
      {viewPdfConfig && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[800px] h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
              <h3 className="text-[16px] font-bold text-[#101828]">{viewPdfConfig.title}</h3>
              <button onClick={() => setViewPdfConfig(null)} className="text-[#667085] hover:text-[#101828] transition-colors"><X size={20} /></button>
            </div>
            
            {/* Body */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-white p-6">
              <div className="flex-1 border border-[#eaecf0] rounded-xl flex flex-col relative overflow-hidden shadow-sm">
                <div className="h-10 border-b border-[#eaecf0] flex items-center justify-center text-[12px] font-bold text-[#475467]">
                  Page No: {viewPdfPage}
                </div>
                <div className="flex-1 relative flex items-center justify-center bg-[#f8f9fc] p-4 overflow-auto">
                  <button onClick={() => setViewPdfPage(p => Math.max(1, p - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white border border-[#eaecf0] rounded shadow-sm hover:bg-gray-50 z-10"><ChevronLeft size={16} /></button>
                  <button onClick={() => setViewPdfPage(p => Math.min(numPages || 1, p + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white border border-[#eaecf0] rounded shadow-sm hover:bg-gray-50 z-10"><ChevronRight size={16} /></button>
                  
                  <Document file={viewPdfConfig.file} className="shadow-sm border border-[#eaecf0] bg-white pointer-events-none">
                    <Page pageNumber={viewPdfPage} renderTextLayer={false} renderAnnotationLayer={false} scale={0.9} />
                  </Document>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#eaecf0] flex justify-end gap-3 bg-white">
              <button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = viewPdfConfig.file;
                  link.download = `${viewPdfConfig.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
              >
                Download <Download size={16} />
              </button>
              <button 
                onClick={() => setViewPdfConfig(null)}
                className="px-6 py-2.5 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
