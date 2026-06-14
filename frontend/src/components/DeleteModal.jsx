import React from 'react';
import BrutalistButton from './BrutalistButton';

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "CONFIRM SYSTEM PURGE",
  message = "This action will permanently delete the entry from database registers.",
  itemName = ""
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#EAE7DC] dark:bg-black border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] select-none">
        <div className="flex justify-between items-center border-b-2 border-black dark:border-white pb-3 mb-4">
          <h2 className="font-headline font-black uppercase text-lg text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">warning</span> {title}
          </h2>
          <button 
            onClick={onClose} 
            className="font-mono text-xl font-bold hover:text-primary transition-colors cursor-crosshair"
          >
            [X]
          </button>
        </div>

        <div className="mb-6 font-mono text-xs text-black dark:text-white uppercase leading-relaxed space-y-3">
          <p>{message}</p>
          {itemName && (
            <div className="p-2 border border-black/20 bg-white/50 dark:bg-neutral-900 dark:border-neutral-700 font-bold truncate">
              TARGET: {itemName}
            </div>
          )}
          <p className="text-[#B30320] font-bold">
            // WARNING: THIS ACTION IS REVERSIBLE ONLY BY ARCHIVE RESTORATION.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <BrutalistButton 
            variant="ghost" 
            onClick={onClose}
          >
            ABORT
          </BrutalistButton>
          <BrutalistButton 
            variant="danger" 
            onClick={onConfirm}
          >
            EXECUTE PURGE
          </BrutalistButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
