import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.js',
            name: 'OzTime',
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
