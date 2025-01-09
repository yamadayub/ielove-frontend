import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface PurchaseRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseRequiredModal: React.FC<PurchaseRequiredModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="text-center">
            <Dialog.Description className="text-base text-gray-600">
              詳細情報は物件仕様購入後に閲覧可能になります
            </Dialog.Description>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 