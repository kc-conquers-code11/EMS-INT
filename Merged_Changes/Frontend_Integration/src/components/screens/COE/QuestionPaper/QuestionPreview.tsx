import React from 'react';
import { useQuestionPaperStore } from '../../../../store/useQuestionPaperStore';
import { X, Printer, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const QuestionPreview: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { template } = useQuestionPaperStore();
  const { paperDetails, instructions, questions } = template;

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = async () => {
    const element = document.getElementById('question-paper-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${paperDetails.examName || 'Question_Paper'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Failed to generate PDF.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden font-['Times_New_Roman'] animate-in fade-in duration-200 print:static print:h-auto print:w-full print:overflow-visible">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 shrink-0 font-['Instrument_Sans'] print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><X size={20} /></button>
          <h2 className="text-lg font-bold text-[#171822]">Live Preview</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 bg-[#0e1680] text-white rounded-lg text-sm font-bold hover:bg-[#0a1060] transition-colors shadow-sm">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-200 flex justify-center print:bg-white print:p-0 print:overflow-visible print:block">
        {/* A4 Paper Container */}
        <div id="question-paper-content" className="bg-white shadow-xl max-w-[800px] w-full min-h-[1122px] p-8 sm:p-12 text-black flex flex-col gap-4 print:shadow-none print:max-w-none print:min-h-0 print:w-full print:p-0 print:m-0">
          {/* Header */}
          <div className="text-center flex flex-col gap-0 border-b-2 border-black pb-2">
            <h1 className="font-bold text-xl uppercase tracking-wider">{paperDetails.examName || 'EXAMINATION NAME'}</h1>
            <h2 className="font-bold text-lg">{paperDetails.subjectName || 'SUBJECT NAME'} ({paperDetails.subjectCode || 'CODE'})</h2>
            <div className="flex justify-between items-center mt-2 text-[15px] font-bold">
              <span>Time: {paperDetails.duration || '3 Hours'}</span>
              <span>Max. Marks: {paperDetails.totalMarks || 100}</span>
            </div>
          </div>

          {/* Instructions */}
          {instructions.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-bold underline decoration-black underline-offset-4">Instructions:</span>
              <ol className="list-decimal pl-5 flex flex-col gap-1 text-[15px]">
                {instructions.map(inst => (
                  <li key={inst.id} dangerouslySetInnerHTML={{ __html: inst.text || '&nbsp;' }} className="[&_p]:inline [&_p]:m-0" />
                ))}
              </ol>
            </div>
          )}

          {/* Questions */}
          <div className="flex flex-col gap-3 mt-1">
            {questions.map((q) => (
              <div key={q.id} className="flex flex-col gap-0 mb-1">
                <div className="flex justify-between items-start font-bold text-[16px]">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="whitespace-nowrap">Q.{q.questionNumber}</span>
                    {q.settings.rule && (
                      <span className="italic text-[15px] font-normal text-gray-800 whitespace-nowrap">({q.settings.rule})</span>
                    )}
                    {q.description && (
                      <div className="max-w-none font-normal text-black text-[15px] [&_p]:m-0 [&_p]:inline" dangerouslySetInnerHTML={{ __html: q.description }} />
                    )}
                  </div>
                  <span className="ml-4 whitespace-nowrap">[{q.marks}]</span>
                </div>

                {q.subQuestions.length > 0 && (
                  <div className="flex flex-col gap-0.5 pl-6 mt-0.5">
                    {q.subQuestions.map(sq => (
                      <div key={sq.id} className="flex flex-col gap-0">
                        <div className="flex justify-between items-start gap-4">
                          <span className="font-bold shrink-0">{sq.label})</span>
                          <div className="flex-1 max-w-none text-black text-[15px] [&_p]:m-0 [&_p]:inline" dangerouslySetInnerHTML={{ __html: sq.text || '&nbsp;' }} />
                          <span className="font-bold shrink-0">[{sq.marks}]</span>
                        </div>

                        {(q.settings.questionType === 'MCQ' || q.settings.questionType === 'Multiple Correct MCQ') && sq.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 pl-6 text-[15px]">
                            {sq.options.map((opt, idx) => (
                              <div key={opt.id} className="flex items-start gap-2">
                                <span>{String.fromCharCode(97 + idx)}.</span>
                                <span>{opt.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto pt-10 text-center font-bold text-xl tracking-[1em]">
            ***
          </div>
        </div>
      </div>
    </div>
  );
};
