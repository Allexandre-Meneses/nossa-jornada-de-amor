import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm p-6 rounded-2xl bg-white border border-red-200 text-center shadow-romantic-md">
        <div className="w-10 h-10 rounded-full bg-red-50 text-[#dc2626] flex items-center justify-center mx-auto mb-3">
          <RotateCcw className="w-5 h-5" />
        </div>

        <h3 className="font-romantic text-lg font-bold text-[#1f2937] mb-2">
          Reiniciar a Jornada?
        </h3>

        <p className="text-xs text-gray-600 mb-6 leading-relaxed">
          Os níveis 2, 3 e 4 voltarão ao estado bloqueado para você testar as animações novamente.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-xs font-semibold text-white shadow-sm cursor-pointer"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
};
