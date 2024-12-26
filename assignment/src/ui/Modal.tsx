/*eslint max-lines: ["error", 200 ]*/

"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";

import styles from "./Modal.module.scss";


interface CommonModalProps {
  title?: string;
  desc?: string;
  children?: ReactNode;
  Trigger?: ReactNode;
  CloseTrigger?: ReactNode;
  isOpen?: undefined;
  setOpen?: undefined;
  size?: "auto" | "normal" | "big";
  unclosable?: boolean;
  unforceWhite?: boolean;
}

type ModalProps =
  | CommonModalProps
  | (Omit<CommonModalProps, "isOpen" | "setOpen"> & {
      isOpen: boolean;
      setOpen: (isOpen: boolean) => void;
    });

const handleInteractOutside = (unclosable: boolean, event: Event) => {
  if (unclosable) {
    event.preventDefault();
  }
};

const handleModalContentAnimation = (
  size: "auto" | "normal" | "big",
  unforceWhite: boolean,
) => {
  const initialAnimation = { opacity: 0, y: "-40%" };
  const animateAnimation = { opacity: 1, y: "0%" };
  const exitAnimation = { opacity: 0, y: "40%" };

  return {
    initial: initialAnimation,
    animate: animateAnimation,
    exit: exitAnimation,
    className: `h-40 ${styles.modal_content_wrapper} ${styles[size]} ${
      unforceWhite ? styles.white : ""
    }`,
  };
};

export const Modal = ({
  title,
  desc,
  children,
  Trigger,
  CloseTrigger,
  isOpen: customIsOpen,
  setOpen: customSetOpen,
  size = "normal",
  unclosable,
  unforceWhite,
}: ModalProps): React.ReactElement => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog.Root
      open={customIsOpen ?? isOpen}
      onOpenChange={customSetOpen ?? setOpen}
    >
      {Trigger !== undefined && (
        <Dialog.Trigger asChild>{Trigger}</Dialog.Trigger>
      )}
      <AnimatePresence>
        {(customIsOpen ?? isOpen) ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className={styles.modal_container}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Dialog.Content
                  asChild
                  forceMount
                  onInteractOutside={(event) =>
                    handleInteractOutside(!!unclosable, event)
                  }
                >
                  <motion.div
                    {...handleModalContentAnimation(size, !!unforceWhite)}
                  >
                    <Dialog.Title className={styles.title}>
                      {title}
                    </Dialog.Title>
                    <Dialog.Description className={styles.subtitle}>
                      {desc}
                    </Dialog.Description>
                    {children}
                    <Dialog.Close asChild>
                      {CloseTrigger !== undefined ? (
                        CloseTrigger
                      ) : (
                        <button>Close</button>
                      )}
                    </Dialog.Close>
                    {!unclosable && (
                      <Dialog.Close asChild>
                        <div
                          className={styles.close_button_wrapper}
                          aria-label="Close"
                        >
                          X
                        </div>
                      </Dialog.Close>
                    )}
                  </motion.div>
                </Dialog.Content>
              </motion.div>
            </Dialog.Overlay>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
};
