import { useEffect, useState } from 'react';

const shayaris = [
  'ख़ामोशियों में भी एक सुर छुपा होता है,\nजो दिल से सुनो तो हर गीत अपना होता है।',
  'चाँदनी रातों में यादों का कारवाँ चलता है,\nसंगीत छू ले दिल तो मौसम भी ग़ज़ल कहता है।',
  'कुछ धुनें राहों का पता बन जाती हैं,\nकुछ आवाज़ें उम्र भर की वजह बन जाती हैं।',
  'दिल की धड़कन को जब ताल मिल जाती है,\nज़िंदगी भी एक खूबसूरत धुन बन जाती है।',
];

const HeroTitle = () => {
  const [shayariIndex, setShayariIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShayariIndex((current) => (current + 1) % shayaris.length);
    }, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-end text-center select-none z-10">
      {/* <span className="font-mono text-turmeric/80 tracking-[0.4em] text-[10px] md:text-xs uppercase mb-3">
        The Song Deck
      </span> */}
      <h1 className="hero-title-font text-cream text-8xl md:text-8xl text-zinc-100 tracking-tight mt-40 pt-11 drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
        Desitheka
      </h1>
      <p
        key={shayariIndex}
        className="hero-title-font mt-5 min-h-[4.5rem] max-w-xl whitespace-pre-line px-5 text-xl leading-relaxed text-zinc-100/90 drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)] md:text-2xl"
      >
        {shayaris[shayariIndex]}
      </p>
      {/* <h1 className="font-display text-turmeric text-6xl md:text-8xl font-black tracking-tight leading-[0.95] mt-1 drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
        Day
      </h1> */}
      {/* <p className="text-muted font-body text-xs md:text-sm mt-4 max-w-xs md:max-w-sm">
        Patriotic anthems and Bollywood favourites, all in one deck.
      </p> */}
    </div>
  );
};

export default HeroTitle;
