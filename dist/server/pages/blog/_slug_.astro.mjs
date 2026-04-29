import { f as createComponent, j as renderComponent, r as renderTemplate, i as createAstro, m as maybeRenderHead, h as addAttribute } from '../../chunks/astro/server_DrPyCXaf.mjs';
import 'kleur/colors';
import { $ as $$PublicLayout } from '../../chunks/PublicLayout_PVJkOzGl.mjs';
import { b as blogService, B as BlogCarousel } from '../../chunks/blogService_FQSIwkew.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) {
    return Astro2.redirect("/blog");
  }
  let post;
  let otherPosts = [];
  try {
    post = await blogService.fetchPostBySlug(slug);
    const allPosts = await blogService.fetchPublishedPosts();
    otherPosts = allPosts.filter((p) => p.slug !== slug);
  } catch (error) {
    return Astro2.redirect("/blog");
  }
  return renderTemplate`${renderComponent($$result, "PublicLayout", $$PublicLayout, { "title": `${post.title} \u2014 Blog N\xF6nDecants`, "description": post.excerpt || `Lee sobre ${post.title} en el blog de N\xF6nDecants.` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<article class="bg-white pt-6 px-4"> <div class="max-w-4xl mx-auto"> <h1 class="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-wide text-black mb-8"> ${post.title} </h1> ${post.imageUrl && renderTemplate`<img${addAttribute(post.imageUrl, "src")}${addAttribute(post.title, "alt")} class="w-full h-[400px] object-cover rounded-xl mb-10">`} ${post.content && renderTemplate`<p class="text-base text-gray-600 leading-relaxed" style="text-align: justify;"> ${post.content} </p>`} </div> </article> ${otherPosts.length > 0 && renderTemplate`${renderComponent($$result2, "BlogCarousel", BlogCarousel, { "posts": otherPosts, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/app/features/blog/components/BlogCarousel", "client:component-export": "default" })}`}` })}`;
}, "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/blog/[slug].astro", void 0);

const $$file = "C:/Users/Jaely/Documents/Nondecansts/nondecants-front/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
