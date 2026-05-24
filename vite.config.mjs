import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.js',
            name: 'OzTime',
            fileName: (format) => `oz-time.${format}.js`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {},
            },
        },
        target: 'es2021',
        sourcemap: true,
    },
    test: {
        environment: 'node',
        include: ['tests/**/*.test.js'],
        coverage: {
            reporter: ['text', 'html'],
            reportsDirectory: 'coverage',
        },
    },
});
