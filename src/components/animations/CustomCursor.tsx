"use client";

import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

export default function CustomCursor() {

  const cursorX =
    useMotionValue(-100);

  const cursorY =
    useMotionValue(-100);

  const smoothX = useSpring(cursorX, {
    stiffness: 400,
    damping: 28,
  });

  const smoothY = useSpring(cursorY, {
    stiffness: 400,
    damping: 28,
  });

  const [hovering, setHovering] =
    useState(false);

  useEffect(() => {

    const mouseMove = (
      e: MouseEvent
    ) => {

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = (
      e: Event
    ) => {

      const target =
        e.target as HTMLElement;

      const isCursorDisabled =
        Boolean(
          target.closest(
            '[data-cursor="false"], .no-cursor-glow, .no-cursor'
          )
        );

      if (isCursorDisabled) {
        setHovering(false);
        return;
      }

      if (
        target.closest(
          "a, button"
        )
      ) {

        setHovering(true);

      } else {

        setHovering(false);
      }
    };

    window.addEventListener(
      "mousemove",
      mouseMove
    );

    window.addEventListener(
      "mouseover",
      handleHover
    );

    return () => {

      window.removeEventListener(
        "mousemove",
        mouseMove
      );

      window.removeEventListener(
        "mouseover",
        handleHover
      );
    };

  }, [cursorX, cursorY]);

  return (

    <>

      {/* Outer Ring */}
      <motion.div
        style={{
          translateX: smoothX,
          translateY: smoothY,
        }}

        animate={{
          width: hovering
            ? 70
            : 40,

          height: hovering
            ? 70
            : 40,

          x: hovering
            ? -35
            : -20,

          y: hovering
            ? -35
            : -20,

          backgroundColor:
            hovering
              ? "rgba(6,182,212,0.15)"
              : "rgba(6,182,212,0.08)",
        }}

        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
        }}

        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-999
          hidden
          md:block
          rounded-full
          border
          border-cyan-400/40
          backdrop-blur-md
        "
      />

      {/* Inner Dot */}
      <motion.div
        style={{
          translateX: cursorX,
          translateY: cursorY,
        }}

        animate={{
          x: -4,
          y: -4,
          scale: hovering
            ? 0.5
            : 1,
        }}

        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}

        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-1000
          hidden
          md:block
          h-2
          w-2
          rounded-full
          bg-cyan-400
        "
      />

    </>

  );
}
