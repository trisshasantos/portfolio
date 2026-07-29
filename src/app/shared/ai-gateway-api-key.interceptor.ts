import { HttpInterceptorFn } from '@angular/common/http';

/**
 * The gateway requires X-API-Key on every /api/** request. The real key is substituted
 * into the placeholder below at build time by the "Inject AI gateway API key" step in
 * .github/workflows/deploy.yml, so it is never committed. Locally the placeholder survives
 * and no header is sent, leaving an honest 401 rather than `X-API-Key: undefined`.
 */
const RAW_API_KEY: string = '__AI_GATEWAY_API_KEY__';
const API_KEY = RAW_API_KEY.startsWith('__') ? '' : RAW_API_KEY;

const GATEWAY_ORIGIN = 'https://ai-gateway-production-0388.up.railway.app';

/** Relative /api/ calls reach the same gateway via proxy.conf.json during local dev. */
const isGatewayRequest = (url: string) =>
  url.startsWith(`${GATEWAY_ORIGIN}/api/`) || url.startsWith('/api/');

export const aiGatewayApiKeyInterceptor: HttpInterceptorFn = (req, next) =>
  API_KEY && isGatewayRequest(req.url)
    ? next(req.clone({ setHeaders: { 'X-API-Key': API_KEY } }))
    : next(req);
