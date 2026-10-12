import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove o header "X-Powered-By: Next.js" (menos bytes por resposta e menos informação exposta)
  poweredByHeader: false,
  // Compressão gzip das respostas servidas pelo `next start`
  compress: true,
};

export default nextConfig;
