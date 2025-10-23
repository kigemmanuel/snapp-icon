import { minify } from 'terser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SRC_FOLDER = path.join(__dirname, 'src');
const EXCLUDE_PATTERNS = ['.min.js', 'index.js']; // Don't minify these

const minifyFile = async (inputPath, outputPath) => {
    try {
        const code = fs.readFileSync(inputPath, 'utf8');

        const result = await minify(code, {
            compress: {
                dead_code: true,
                drop_console: false,
                drop_debugger: true,
                pure_funcs: [],
            },
            mangle: {
                toplevel: false,
                keep_classnames: true,
                keep_fnames: true,
            },
            format: {
                comments: false,
            },
            sourceMap: false
        });

        fs.writeFileSync(outputPath, result.code, 'utf8');

        const originalSize = (fs.statSync(inputPath).size / 1024).toFixed(2);
        const minifiedSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
        const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);

        console.log(`✓ ${path.relative(__dirname, inputPath)}`);
        console.log(`  ${originalSize}KB → ${minifiedSize}KB (${savings}% smaller)\n`);

    } catch (err) {
        console.error(`✗ Error minifying ${inputPath}:`, err.message);
    }
};

const shouldMinify = (filename) => {
    return filename.endsWith('.js') &&
        !EXCLUDE_PATTERNS.some(pattern => filename.includes(pattern));
};

const scanAndMinify = async (dir) => {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively scan subdirectories
            await scanAndMinify(fullPath);
        } else if (shouldMinify(item)) {
            // Generate .min.js filename
            const minPath = fullPath.replace(/\.js$/, '.min.js');
            await minifyFile(fullPath, minPath);
        }
    }
};

console.log('🚀 Starting minification...\n');
await scanAndMinify(SRC_FOLDER);
console.log('✅ All files minified!');