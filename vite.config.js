import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'parsed_references/syndromes_json/**/*',
          dest: 'syndromes_json'
        },
        {
          src: 'parsed_references/bacteria_json/**/*',
          dest: 'bacteria_json'
        },
        {
          src: 'parsed_references/antibacterial_drugs_json/**/*',
          dest: 'antibacterial_drugs_json'
        },
        {
          src: 'parsed_references/organisms_clsi/**/*',
          dest: 'organisms_clsi'
        },
        {
          src: 'parsed_references/antimicrobial_resistance.json',
          dest: '.'
        },
        {
          src: 'parsed_references/sagaSpectrumData.json',
          dest: '.'
        }
      ]
    })
  ],
  base: '/antibiogram_react_app/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild'
  }
})
