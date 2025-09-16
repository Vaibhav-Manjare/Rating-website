import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop: uses a semi-transparent slate color with a backdrop blur for a modern effect.
    <div
      className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Panel: Improved rounding, shadow, and structure with a distinct header. */}
      <div
        className="relative bg-white rounded-xl shadow-2xl z-50 w-full max-w-md transform transition-transform duration-300 scale-100"
        onClick={e => e.stopPropagation()} // Prevents closing when clicking inside the modal
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            aria-label="Close modal"
          >
            {/* A clean SVG 'X' icon for a better look and accessibility */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;