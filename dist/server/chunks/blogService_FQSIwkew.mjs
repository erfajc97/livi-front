import { jsx, jsxs } from 'react/jsx-runtime';
import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import axios from 'axios';
import { b as API_ENDPOINTS } from './AppProviders_CurmEGpy.mjs';

function BlogCarousel({ posts }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  if (posts.length === 0) return null;
  return /* @__PURE__ */ jsx("section", { className: "bg-white border-t border-border pt-8 pb-14 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx("h2", { className: "font-heading text-xl sm:text-2xl font-black md:text-3xl text-bg uppercase tracking-wide mb-8 px-4 sm:px-12", children: "Más del blog" }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-center group", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: scrollPrev,
          "aria-label": "Anterior",
          className: "absolute left-0 sm:left-2 lg:-left-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-accent text-black shadow-lg hover:scale-105 transition-transform",
          children: /* @__PURE__ */ jsx("div", { className: "bg-bg w-9 h-9 flex items-center justify-center rounded-full text-white", children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) }) })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden w-full px-2 sm:px-12", ref: emblaRef, children: /* @__PURE__ */ jsx("div", { className: "flex", children: posts.map((post) => /* @__PURE__ */ jsx("div", { className: "px-2 shrink-0 basis-full sm:basis-1/2 lg:basis-1/3", children: /* @__PURE__ */ jsxs("a", { href: `/blog/${post.slug}`, className: "group/card flex flex-col border border-border rounded-2xl overflow-hidden h-full", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: post.imageUrl || "/home-3.png",
            alt: post.title,
            className: "w-full h-52 object-cover",
            loading: "lazy"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 p-6 flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-heading text-base font-bold text-black text-center group-hover/card:text-text-muted transition-colors line-clamp-2", children: post.title }),
          (post.content || post.excerpt) && /* @__PURE__ */ jsx("p", { className: "font-body text-sm leading-relaxed text-text-muted text-center line-clamp-3", children: post.content || post.excerpt }),
          /* @__PURE__ */ jsx("span", { className: "mt-auto w-full py-2.5 bg-black text-white font-heading text-sm font-bold uppercase tracking-wider text-center rounded-full group-hover/card:bg-black/80 transition-colors", children: "Leer el post" })
        ] })
      ] }) }, post.slug)) }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: scrollNext,
          "aria-label": "Siguiente",
          className: "absolute right-0 sm:right-2 lg:-right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-accent text-black shadow-lg hover:scale-105 transition-transform",
          children: /* @__PURE__ */ jsx("div", { className: "bg-bg w-9 h-9 flex items-center justify-center rounded-full text-white", children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) }) })
        }
      )
    ] })
  ] }) });
}

const API_BASE_URL = "http://localhost:4001/api";
const blogService = {
  async fetchPublishedPosts() {
    const { data } = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.BLOG_PUBLISHED}`);
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  },
  async fetchPostBySlug(slug) {
    const { data } = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.BLOG_BY_SLUG}/${slug}`);
    return data?.data ?? data;
  }
};

export { BlogCarousel as B, blogService as b };
