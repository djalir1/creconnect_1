import * as React from "react";
import { FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-full m-4",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 sm:p-0">
      <div
        className={cn(
          "relative w-full transform rounded-xl bg-white text-left shadow-xl transition-all sm:my-8",
          sizeClasses[size]
        )}
      >
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full opacity-70 hover:opacity-100"
          >
            <FaTimes />
          </Button>
        </div>

        <div className="p-6">
          {(title || description) && (
            <div className="mb-4">
              {title && (
                <h3 className="text-xl font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              )}
            </div>
          )}
          <div className="mt-2">{children}</div>
        </div>

        {footer && <div className="bg-gray-50 px-6 py-4 rounded-b-xl">{footer}</div>}
      </div>
    </div>
  );
}
