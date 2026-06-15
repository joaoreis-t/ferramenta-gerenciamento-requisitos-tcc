import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        '*.githubdev.com', // Permite subdomínios padrão do Codespaces
        '*.preview.app.github.dev', // Versões mais antigas/alternativas
        'localhost:3000' // Mantém o local padrão seguro
      ],
    },
  },
};

export default nextConfig;
