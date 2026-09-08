import Insta from '../components/Insta';
import gsap from 'gsap';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroTitle from '../components/HeroTitle';
import { useSongs } from '../context/SongContext';
import { usePlayer } from '../context/PlayerContext';

const Home = () => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const bgRef = useRef(null);
  const { songs } = useSongs();
  const { playSong, currentSong, isPlaying } = usePlayer();

  // Subtle parallax on the ambient glow layer, following the cursor.
  const handleMouseMove = (e) => {
    if (!containerRef.current || !glowRef.current || !bgRef.current) return;
    const { width, height, left, top } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const offsetX = (x / width - 0.5) * 30;
    const offsetY = (y / height - 0.5) * 20;

    gsap.to(glowRef.current, {
      x: offsetX,
      y: offsetY,
      duration: 0.6,
      ease: 'power2.out',
    });

    gsap.to(bgRef.current, {
      x: offsetX * 0.8,
      y: offsetY * 0.8,
      scale: 1,
      duration: 0.7,
      ease: 'power2.out',
    });
  };

  const teaser = songs.slice(0, 4);
  const featuredImage =  '/bg.jpg';

  return (
    <main
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen overflow-hidden bg-[#f6efe4] flex flex-col items-center select-none"
    >
      <div
        ref={bgRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
        style={{
          backgroundImage: `url(${featuredImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          transform: 'scale(1)',
        }}
      />

      <div
        ref={glowRef}
        aria-hidden="true"
        className="absolute -inset-24 pointer-events-none will-change-transform"
        style={{
          background:
            'radial-gradient(closest-side, rgba(227,160,8,0.25), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(245,236,221,0.05) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-[#1b1714]/10 via-transparent to-[#1b1714]/30" />
      <div className="absolute inset-x-0 bottom-0 h-[calc(100%-100vh)] bg-gradient-to-b from-[#f6efe4]/95 via-[#f6efe4] to-[#f6efe4]" />

      <div className="relative z-10 flex flex-col items-center w-full flex-1 justify-center gap-10 px-4 pt-28 ">
        <HeroTitle />

         <Link
           to="/songs"
           className="font-body text-xl md:text-sm tracking-wide text-white bg-turmeric hover:bg-turmeric/90 px-5  rounded-full transition-all shadow-glow"
         >
           Browse all songs →
         </Link>

        {/* <footer className="text-[20px] font-mono text-muted tracking-wider">
          contact: sourabhnegi557@gmail.com
        </footer> */}
      </div>

      <div className="fixed inset-x-0 bottom-[9.5rem] z-40 flex w-full max-w-md justify-end px-4 pointer-events-none sm:bottom-[8.5rem] md:bottom-6">
          <Insta />
        </div>
    </main>
  );
};

export default Home;
