import {
  Description,
  Dialog as Dialog_,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import Button from '@/components/base/Button.component';

const Dialog = ({
  isOpen,
  setIsOpen,
  title,
  description = null,
  children = null,
}) => {
  const handleButtonClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog_
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">{title}</DialogTitle>
            {description && <Description>{description}</Description>}
            {!children && <Button onClick={handleButtonClick}>Close</Button>}
          </DialogPanel>
        </div>
      </Dialog_>
    </>
  );
};

export default Dialog;
