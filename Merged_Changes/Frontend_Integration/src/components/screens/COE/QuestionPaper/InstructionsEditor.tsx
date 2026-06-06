import React from 'react';
import { useQuestionPaperStore } from '../../../../store/useQuestionPaperStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface SortableInstructionProps {
  id: string;
  text: string;
  index: number;
}

const SortableInstruction: React.FC<SortableInstructionProps> = ({ id, text, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { updateInstruction, removeInstruction } = useQuestionPaperStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-start gap-3 bg-white p-4 rounded-xl border ${isDragging ? 'border-[#0e1680] shadow-lg' : 'border-gray-200'}`}>
      <div {...attributes} {...listeners} className="mt-2 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing focus:outline-none">
        <GripVertical size={20} />
      </div>
      <div className="flex-1 min-w-0 w-full">
        <RichTextEditor value={text} onChange={(val) => updateInstruction(id, val)} />
      </div>
      <button onClick={() => removeInstruction(id)} className="mt-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export const InstructionsEditor: React.FC = () => {
  const { template, addInstruction, reorderInstructions } = useQuestionPaperStore();
  const { instructions } = template;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = instructions.findIndex((i) => i.id === active.id);
      const newIndex = instructions.findIndex((i) => i.id === over.id);
      reorderInstructions(oldIndex, newIndex);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.04)] border border-gray-100 flex flex-col gap-6 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h2 className="text-[18px] font-bold text-[#171822]">Instructions</h2>
        <button onClick={addInstruction} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-[#344054] rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm">
          <Plus size={16} /> Add Instruction
        </button>
      </div>

      <DndContext id="dnd-instructions" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={instructions.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {instructions.map((inst, index) => (
              <SortableInstruction key={inst.id} id={inst.id} text={inst.text} index={index} />
            ))}
            {instructions.length === 0 && (
              <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-xl">
                No instructions added. Click "Add Instruction" to start.
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
