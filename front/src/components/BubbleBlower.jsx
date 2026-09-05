// components/BubbleBlower.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const messages = [
  "Wow, great rhythm! 🎧",
  "Let's make this track DROP! 💥",
  "The beat starts here 🚀",
  "Reva loves this melody ❤️",
  "Your playlist is on fire today 🔥",
  "Ready to blast the speakers? 🔊",
];


export default function BubbleBlower() {
  const containerRef = useRef(null);
  useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const createBubble = (e) => {

     if (e.target.closest("a, button, input, textarea ,Navbar,  select, label")) return;

    const bubble = document.createElement("div");
    bubble.className =
      "absolute pointer-events-none text-white text-sm font-medium px-5 py-3 rounded-3xl shadow-2xl flex items-center gap-2 z-[9999]";

    const colors = ["#f97316", "#ec4899", "#8b5cf6", "#06b67f"];
    bubble.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    bubble.style.left = `${e.clientX}px`;
    bubble.style.top = `${e.clientY}px`;

    bubble.innerHTML = `💬 <span>${
      messages[Math.floor(Math.random() * messages.length)]
    }</span>`;

    container.appendChild(bubble);

    gsap.timeline()
      .to(bubble, {
        y: -180,
        scale: 1.1,
        duration: 2.8,
        ease: "power2.out",
      })
      .to(
        bubble,
        {
          opacity: 0,
          scale: 0.6,
          duration: 0.6,
          ease: "power2.in",
        },
        "-=0.6"
      )
      .then(() => bubble.remove());
  };

  window.addEventListener("click", createBubble);

  return () => {
    window.removeEventListener("click", createBubble);
  };
}, []);


  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
    />
  );
};

