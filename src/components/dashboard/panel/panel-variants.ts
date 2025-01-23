import { Variants } from "framer-motion";

export const sidebarVariants: Variants = {
  open: {
    width: "280px",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
  closed: {
    width: "80px",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    },
  },
};

export const menuItemVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
  closed: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};
