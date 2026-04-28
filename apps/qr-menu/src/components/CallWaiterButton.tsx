import { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface CallWaiterButtonProps {
  onCall: () => void;
}

export default function CallWaiterButton({ onCall }: CallWaiterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onCall();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-4 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 active:scale-95 transition-all border border-gray-100 group"
        aria-label="Вызвать официанта"
      >
        <Bell className="w-5 h-5 text-gray-700 group-hover:animate-wiggle" />
        <span className="absolute inset-0 rounded-full bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
      </button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вызвать официанта?</AlertDialogTitle>
            <AlertDialogDescription>
              Официант получит уведомление и скоро подойдёт к вашему столику.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Вызвать
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
