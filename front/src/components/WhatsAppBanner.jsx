const WhatsAppBanner = () => {
  return (
    <div className="flex items-center justify-between gap-4 bg-panel/80 backdrop-blur-md border border-turmeric/15 px-4 py-2 rounded-xl text-cream shadow-xl max-w-md w-full">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0">
          <i className="ri-whatsapp-fill text-lg" />
        </div>
        <p className="text-xs text-cream/90 font-body truncate">
          Get new songs before everyone else 🔥
        </p>
      </div>
      <a
        href="https://wa.me/?text=Join%20the%20Independence%20Day%20song%20deck!"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-turmeric hover:bg-turmeric/90 text-cocoa text-xs font-semibold px-3 py-1 rounded-full transition-all flex-shrink-0"
      >
        Join Free
      </a>
    </div>
  );
};

export default WhatsAppBanner;
