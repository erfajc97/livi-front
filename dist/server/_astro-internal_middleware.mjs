import { d as defineMiddleware, s as sequence } from './chunks/index_Ag8_vdTL.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_BL_jCm-Q.mjs';
import '@astrojs/internal-helpers/path';
import 'cookie';

const onRequest$1 = defineMiddleware(async (_context, next) => {
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
