import { motion } from "framer-motion";

const AILogo = () => {
  return (
    <div
      className="relative h-12 w-12 flex items-center justify-center"
      aria-label="AI is online"
    >
      {/* Soft outer halo glow — breathes */}
      <motion.div
        className="absolute -inset-1 rounded-[20px]"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 65%)",
          filter: "blur(10px)",
        }}
        animate={{ opacity: [0.45, 0.9, 0.45], scale: [0.85, 1.08, 0.85] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating conic gradient ring (the sweep) */}
      <div className="absolute inset-0 rounded-[16px] overflow-hidden">
        <motion.div
          className="absolute -inset-1/2"
          style={{
            background:
              "conic-gradient(from 0deg, #2F4A3A, #5B7C6A, #A8C4B3, #5B7C6A, #2F4A3A)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Inner card (creates the ring frame) */}
      <div className="relative h-[38px] w-[38px] rounded-[12px] bg-[var(--surface)] flex items-center justify-center overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Soft inner gradient backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, var(--accent-soft) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Larger AI Star (Increased to 26px) */}
        <motion.svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_0_4px_rgba(168,196,179,0.5)]"
          animate={{
            scale: [1, 1.12, 1],
            rotate: [0, 8, -8, 0],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z"
            fill="url(#star-gradient)"
          />
          <defs>
            <linearGradient
              id="star-gradient"
              x1="0"
              y1="0"
              x2="24"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A8C4B3" />
              <stop offset="0.5" stopColor="#5B7C6A" />
              <stop offset="1" stopColor="#2F4A3A" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Inner highlight sparkle */}
        <motion.div
          className="absolute h-[3px] w-[3px] rounded-full bg-white pointer-events-none"
          style={{ boxShadow: "0 0 6px rgba(255,255,255,0.9)" }}
          animate={{
            opacity: [0, 1, 0],
            top: ["28%", "42%", "62%"],
            left: ["38%", "58%", "42%"],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tiny second sparkle */}
        <motion.div
          className="absolute h-[2px] w-[2px] rounded-full bg-white pointer-events-none"
          style={{ boxShadow: "0 0 4px rgba(255,255,255,0.8)" }}
          animate={{
            opacity: [0, 1, 0],
            top: ["58%", "30%", "60%"],
            left: ["62%", "40%", "30%"],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.1,
          }}
        />
      </div>
    </div>
  );
};

export default AILogo;