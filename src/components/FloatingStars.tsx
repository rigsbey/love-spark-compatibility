import { useEffect, useRef } from "react";

const FloatingStars = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      const star = document.createElement("div");
      star.className = "star animate-float-star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(star);

      setTimeout(() => {
        star.remove();
      }, 3000);
    };

    const interval = setInterval(() => {
      createStar();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="floating-stars" />;
};

export default FloatingStars;