import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const [time, setTime] = useState(() => new Date());
  const [onlineUsers, setOnlineUsers] = useState(
    () => Math.floor(Math.random() * 1501) + 500
  );

  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setOnlineUsers((current) => {
        const change = Math.floor(Math.random() * 121) - 60;
        return Math.min(2000, Math.max(500, current + change));
      });
    }, 15000);

    return () => clearInterval(id);
  }, []);

  const formatted = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-4 md:px-8 py-4 flex items-center justify-between pointer-events-none">

      <div className="pointer-events-auto font-mono text-cream/80 tracking-widest text-xs md:text-sm bg-[#ce9353] backdrop-blur-md px-3 py-1.5 rounded-md border border-cream/10">
        <h3 onClick={() => navigate('/')}>SN</h3>
      </div>

      {/* Left: live time */}
      <div className="pointer-events-auto font-mono text-cream/80 tracking-widest text-xs md:text-sm bg-[#ce9353] backdrop-blur-md px-3 py-1.5 rounded-md border border-cream/10">
        {formatted}
      </div>

      {/* Center: live indicator (hidden on small screens to save space) */}
      <div className="hidden sm:flex pointer-events-auto items-center gap-2 bg-[#ce9353] backdrop-blur-md px-3 py-1.5 rounded-full border border-cream/10 text-xs text-muted">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium text-cream">{onlineUsers}</span> online
      </div>

      {/* Right: nav */}
      <div className="pointer-events-auto flex items-center gap-2">
        <NavLink
          to="/songs"
          className={({ isActive }) =>
            `px-3 py-1.5 bg-[#ce9353] backdrop-blur-md hover:bg-panel border border-cream/10 rounded-full text-xs transition-all ${
              isActive ? 'text-turmeric border-turmeric/40' : 'text-cream/80'
            }`
          }
        >
          Songs
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `px-3 py-1.5 bg-[#ce9353] backdrop-blur-md hover:bg-panel border border-cream/10 rounded-full text-xs transition-all ${
              isActive ? 'text-turmeric border-turmeric/40' : 'text-cream/80'
            }`
          }
        >
          Admin
        </NavLink>
      </div>
    </header>
  );
};

export default Header;
