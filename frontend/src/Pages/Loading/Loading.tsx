import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const Loading: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 via-indigo-400 to-purple-600">
      <motion.svg
        animate={controls}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-60 h-60 text-blue-200"
      >
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          className="stroke-blue-300 opacity-50"
          initial={{ strokeDasharray: 0 }}
          animate={{
            strokeDasharray: [0, 50],
            rotate: [0, 360],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <motion.circle
          cx="12"
          cy="12"
          r="8"
          className="stroke-blue-100 opacity-50"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{
            opacity: [0.5, 0.2, 0.5],
            scale: [1, 1.1, 1],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <motion.path
          d="M12 2 Q9 2.2 7.3 7 Q6.5 9.5 6.5 12 Q6.5 15 7.3 17 Q9 22 12 22"
          opacity="0.5"
          className="stroke-white"
          animate={{
            d: [
              "M12 2 Q9 2.2 7.3 7 Q6.5 9.5 6.5 12 Q6.5 15 7.3 17 Q9 22 12 22",
              "M12 2 Q12 2.2 12 7 Q12 9.5 12 12 Q12 15 12 17 Q12 22 12 22",
              "M12 2 Q15 2.2 16.6 7 Q17.5 9.5 17.5 12 Q17.5 15 16.7 17 Q15 22 12 22",
              "M12 2 Q9 2.2 7.3 7 Q6.5 9.5 6.5 12 Q6.5 15 7.3 17 Q9 22 12 22",
            ],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </motion.svg>
    </div>
  );
};

export default Loading;
