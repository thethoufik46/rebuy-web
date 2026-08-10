import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

const STORAGE_KEY =
  "re2buy_recent_searches";

const MAX_RECENT = 15;

export default function SearchPopup({
  allCars = [],
  initialValue = "",
  onClose,
  onSearch,
}) {
  const [query, setQuery] =
    useState(initialValue);

  const [
    recentSearches,
    setRecentSearches,
  ] = useState([]);

  const [
    suggestions,
    setSuggestions,
  ] = useState([]);

  const inputRef =
    useRef(null);

  /* ======================================================
     LOAD RECENT
  ====================================================== */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!saved) return;

      const parsed =
        JSON.parse(saved);

      if (
        Array.isArray(parsed)
      ) {
        setRecentSearches(
          parsed.slice(
            0,
            MAX_RECENT
          )
        );
      }
    } catch (error) {
      console.error(
        "Recent search load error:",
        error
      );
    }
  }, []);

  /* ======================================================
     FOCUS
  ====================================================== */

  useEffect(() => {
    const timer =
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

    return () =>
      clearTimeout(timer);
  }, []);

  /* ======================================================
     BODY LOCK
  ====================================================== */

  useEffect(() => {
    const previous =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previous;
    };
  }, []);

  /* ======================================================
     ESC
  ====================================================== */

  useEffect(() => {
    const handleKey = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKey
      );
    };
  }, [onClose]);

  /* ======================================================
     SEARCH VALUES
  ====================================================== */

  const searchItems =
    useMemo(() => {
      const values =
        new Set();

      if (
        !Array.isArray(
          allCars
        )
      ) {
        return [];
      }

      allCars.forEach(
        (car) => {
          if (
            !car ||
            typeof car !==
              "object"
          ) {
            return;
          }

          const brand =
            car?.brand?.name ??
            car?.brand
              ?.brandName ??
            car?.brand ??
            "";

          const model =
            car?.model?.name ??
            car?.model
              ?.modelName ??
            car?.model ??
            "";

          const variant =
            car?.variant;

          let variantName =
            "";

          if (
            variant &&
            typeof variant ===
              "object"
          ) {
            variantName =
              variant?.variantName ??
              variant?.title ??
              variant?.name ??
              "";
          } else if (
            typeof variant ===
            "string"
          ) {
            variantName =
              variant;
          }

          if (
            typeof brand ===
              "string" &&
            brand.trim()
          ) {
            values.add(
              brand.trim()
            );
          }

          if (
            typeof model ===
              "string" &&
            model.trim()
          ) {
            values.add(
              model.trim()
            );
          }

          if (
            typeof variantName ===
              "string" &&
            variantName.trim()
          ) {
            values.add(
              variantName.trim()
            );
          }
        }
      );

      return [...values];
    }, [allCars]);

  /* ======================================================
     SUGGESTIONS
  ====================================================== */

  useEffect(() => {
    const value =
      query
        .trim()
        .toLowerCase();

    if (!value) {
      setSuggestions([]);
      return;
    }

    setSuggestions(
      searchItems
        .filter((item) =>
          item
            .toLowerCase()
            .includes(value)
        )
        .slice(0, 10)
    );
  }, [
    query,
    searchItems,
  ]);

  /* ======================================================
     SAVE RECENT
  ====================================================== */

  const saveRecentSearch =
    (value) => {
      const clean =
        value.trim();

      if (!clean) return;

      const updated = [
        clean,
        ...recentSearches.filter(
          (item) =>
            item.toLowerCase() !==
            clean.toLowerCase()
        ),
      ].slice(
        0,
        MAX_RECENT
      );

      setRecentSearches(
        updated
      );

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            updated
          )
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  /* ======================================================
     DELETE RECENT
  ====================================================== */

  const deleteRecentSearch =
    (value) => {
      const updated =
        recentSearches.filter(
          (item) =>
            item !== value
        );

      setRecentSearches(
        updated
      );

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(
            updated
          )
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  /* ======================================================
     CLEAR
  ====================================================== */

  const clearAllRecent =
    () => {
      setRecentSearches([]);

      localStorage.removeItem(
        STORAGE_KEY
      );
    };

  /* ======================================================
     GET CAR VALUES
  ====================================================== */

  const getCarValues =
    (car) => {
      if (
        !car ||
        typeof car !==
          "object"
      ) {
        return [];
      }

      const values = [];

      const brand =
        car?.brand?.name ??
        car?.brand
          ?.brandName ??
        car?.brand ??
        "";

      const model =
        car?.model?.name ??
        car?.model
          ?.modelName ??
        car?.model ??
        "";

      const variant =
        car?.variant;

      let variantName =
        "";

      if (
        variant &&
        typeof variant ===
          "object"
      ) {
        variantName =
          variant?.variantName ??
          variant?.title ??
          variant?.name ??
          "";
      } else if (
        typeof variant ===
        "string"
      ) {
        variantName =
          variant;
      }

      if (brand) {
        values.push(
          String(
            brand
          ).toLowerCase()
        );
      }

      if (model) {
        values.push(
          String(
            model
          ).toLowerCase()
        );
      }

      if (variantName) {
        values.push(
          String(
            variantName
          ).toLowerCase()
        );
      }

      return values;
    };

  /* ======================================================
     SUBMIT
  ====================================================== */

  const submitSearch =
    (value = query) => {
      const clean =
        value.trim();

      if (!clean) return;

      const searchValue =
        clean.toLowerCase();

      const matchedCars =
        Array.isArray(
          allCars
        )
          ? allCars.filter(
              (car) =>
                getCarValues(
                  car
                ).some(
                  (item) =>
                    item.includes(
                      searchValue
                    )
                )
            )
          : [];

      saveRecentSearch(
        clean
      );

      onSearch?.(
        clean,
        matchedCars
      );
    };

  /* ======================================================
     BACKDROP
  ====================================================== */

  const handleBackdrop =
    (event) => {
      if (
        event.target ===
        event.currentTarget
      ) {
        onClose?.();
      }
    };

  const isTyping =
    query.trim().length >
    0;

  /* ======================================================
     UI
  ====================================================== */

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      onMouseDown={
        handleBackdrop
      }
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/25
        backdrop-blur-md
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          y: -25,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: -20,
          scale: 0.98,
        }}
        className="
          flex
          h-full
          w-full
          flex-col
          overflow-hidden
          bg-white

          sm:mx-auto
          sm:mt-5
          sm:h-[calc(100vh-40px)]
          sm:max-w-2xl
          sm:rounded-[28px]
          sm:shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            shrink-0
            border-b
            border-black/[0.06]
            bg-white/95
            px-3
            py-3
          "
        >
          <div className="flex gap-2">

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                hover:bg-black/5
              "
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div
              className="
                flex
                h-11
                flex-1
                items-center
                gap-2.5
                rounded-full
                border
                border-black/[0.07]
                bg-black/[0.035]
                px-4
              "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                />
                <path
                  d="m21 21-4.3-4.3"
                />
              </svg>

              <input
                ref={inputRef}
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    submitSearch();
                  }
                }}
                autoComplete="off"
                placeholder="
                  Search cars, bikes, property...
                "
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-sm
                  outline-none
                  placeholder:text-black/35
                "
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-black/5
                  "
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BODY */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
          "
        >
          {isTyping ? (
            suggestions.length >
            0 ? (
              <div className="p-4">

                <p
                  className="
                    mb-3
                    px-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-black/35
                  "
                >
                  Suggestions
                </p>

                <div
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-black/[0.05]
                    bg-white
                    shadow-sm
                  "
                >
                  {suggestions.map(
                    (
                      item,
                      index
                    ) => (
                      <button
                        key={`${item}-${index}`}
                        type="button"
                        onClick={() =>
                          submitSearch(
                            item
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          border-b
                          border-black/[0.04]
                          px-4
                          py-3.5
                          text-left
                          last:border-0
                          hover:bg-black/[0.025]
                        "
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-black/[0.045]
                          "
                        >
                          🔍
                        </span>

                        <span
                          className="
                            min-w-0
                            flex-1
                            truncate
                            text-sm
                            font-medium
                          "
                        >
                          {item}
                        </span>

                        <span className="text-black/25">
                          →
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div
                className="
                  flex
                  min-h-[55vh]
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >
                <div
                  className="
                    mb-4
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-black/[0.045]
                  "
                >
                  🔍
                </div>

                <h3 className="text-sm font-semibold">
                  No results found
                </h3>

                <p className="mt-1 text-xs text-black/35">
                  Try another brand,
                  model or variant.
                </p>
              </div>
            )
          ) : (
            <div className="p-4">

              {recentSearches.length >
              0 ? (
                <>
                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <div>
                      <h3 className="text-sm font-semibold">
                        Recent Searches
                      </h3>

                      <p className="text-[11px] text-black/35">
                        Your recent searches
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        clearAllRecent
                      }
                      className="
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        text-black/45
                        hover:bg-black/5
                      "
                    >
                      Clear all
                    </button>
                  </div>

                  <div
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-black/[0.05]
                      bg-white
                      shadow-sm
                    "
                  >
                    <AnimatePresence>
                      {recentSearches.map(
                        (item) => (
                          <motion.div
                            key={item}
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            exit={{
                              opacity: 0,
                            }}
                            className="
                              flex
                              items-center
                              border-b
                              border-black/[0.04]
                              last:border-0
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                submitSearch(
                                  item
                                )
                              }
                              className="
                                flex
                                min-w-0
                                flex-1
                                items-center
                                gap-3
                                px-4
                                py-3.5
                                text-left
                                hover:bg-black/[0.025]
                              "
                            >
                              <span>
                                🕘
                              </span>

                              <span
                                className="
                                  min-w-0
                                  flex-1
                                  truncate
                                  text-sm
                                  text-black/70
                                "
                              >
                                {item}
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteRecentSearch(
                                  item
                                )
                              }
                              className="
                                mr-2
                                h-8
                                w-8
                                rounded-full
                                text-black/30
                                hover:bg-black/5
                              "
                            >
                              ×
                            </button>
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div
                  className="
                    flex
                    min-h-[55vh]
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >
                  <div
                    className="
                      mb-4
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      bg-black/[0.04]
                    "
                  >
                    🔍
                  </div>

                  <h3 className="text-sm font-semibold">
                    Start searching
                  </h3>

                  <p className="mt-1 text-xs text-black/35">
                    Search cars, brands,
                    models and variants.
                  </p>

                  <div
                    className="
                      mt-6
                      flex
                      flex-wrap
                      justify-center
                      gap-2
                    "
                  >
                    {[
                      "BMW",
                      "Fortuner",
                      "Swift",
                      "Thar",
                    ].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            submitSearch(
                              item
                            )
                          }
                          className="
                            rounded-full
                            border
                            border-black/[0.07]
                            bg-black/[0.025]
                            px-3
                            py-1.5
                            text-xs
                            text-black/50
                            hover:bg-black/[0.06]
                          "
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}