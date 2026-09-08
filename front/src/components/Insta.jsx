const instagramIds = ['@negisourabh027', '_rockstar__11'];

const Insta = () => {
  return (
    <div className="pointer-events-auto flex w-full max-w-md flex-col gap-2 rounded-xl px-4 py-2 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
          <i className="ri-instagram-fill text-lg" />
        </div>
        <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-1 font-body text-base text-cream/90 sm:text-lg">
          {instagramIds.map((id) => (
            <a
              key={id}
              href={`https://www.instagram.com/${id.slice(1)}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate transition-colors hover:text-turmeric"
            >
              {id}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insta;
