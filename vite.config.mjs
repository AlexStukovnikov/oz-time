import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.js',
            name: 'OzTime',
            formats: ['es', 'cjs'],
            fileName: (format) => {
                if (format === 'es') return 'oz-time.esm.js';
                if (format === 'cjs') return 'oz-time.cjs';
                return `oz-time.${format}.js`;
            },
        },
        target: 'es2021',
        sourcemap: false,
        rollupOptions: {
            external: [],
        },
    },
    test: {
        environment: 'node',
        include: ['tests/**/*.test.js'],
        coverage: {
            reporter: ['text', 'html'],
            reportsDirectory: 'coverage',
            exclude: ['src/index.js', 'tests/**/*', 'dist/**/*'],
        },
    },
});
