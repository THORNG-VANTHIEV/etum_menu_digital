import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateMenuData } from '../src/domain/validation/validate';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isProduction = process.argv.includes('--production') || process.env.NODE_ENV === 'production';

function loadJsonFile(relativePath: string): unknown {
  const fullPath = path.resolve(rootDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[ERROR] File not found: ${fullPath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(raw);
}

function assetExistenceChecker(assetPath: string): boolean {
  // Strip leading slash
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  const fullPath = path.resolve(rootDir, 'public', cleanPath);
  return fs.existsSync(fullPath);
}

function runValidation() {
  console.log(`\n========================================`);
  console.log(`Menu Data & Schema Validation`);
  console.log(`Mode: ${isProduction ? 'PRODUCTION (Strict Gates Active)' : 'DEVELOPMENT'}`);
  console.log(`========================================\n`);

  const categories = loadJsonFile('src/data/categories.json');
  const items = loadJsonFile('src/data/menu-items.json');
  const siteConfig = loadJsonFile('src/data/site-config.json');

  const report = validateMenuData(categories, items, siteConfig, {
    isProduction,
    assetExistenceChecker,
  });

  if (report.warnings.length > 0) {
    console.log(`⚠️  WARNINGS (${report.warnings.length}):`);
    report.warnings.forEach((w, idx) => {
      console.log(`  ${idx + 1}. [${w.field || 'General'}] Record ${w.recordId || 'N/A'}: ${w.message}`);
    });
    console.log();
  }

  if (report.errors.length > 0) {
    console.error(`❌ ERRORS (${report.errors.length}):`);
    report.errors.forEach((e, idx) => {
      console.error(`  ${idx + 1}. [${e.field || 'General'}] Record ${e.recordId || 'N/A'}: ${e.message}`);
    });
    console.error(`\nValidation FAILED. Please resolve errors before continuing.\n`);
    process.exit(1);
  }

  console.log(`✅ Validation PASSED!`);
  console.log(`   - Categories checked: ${(categories as unknown[]).length}`);
  console.log(`   - Menu items checked: ${(items as unknown[]).length}`);
  console.log(`   - Warnings: ${report.warnings.length} (fallback applied)`);
  console.log(`   - Errors: 0\n`);
}

runValidation();
