import { test, describe } from 'node:test';
import { ok } from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('Design System Compliance', () => {
  test('TractorMachineDetail.jsx uses semantic tokens instead of absolute colors', () => {
    const filePath = join(process.cwd(), 'src', 'pages', 'catalog', 'TractorMachineDetail.jsx');
    
    // Solo correr la prueba si el archivo existe
    if (!existsSync(filePath)) {
      return;
    }

    const content = readFileSync(filePath, 'utf-8');
    
    // Verificamos que no se usen colores prohibidos
    const forbiddenPatterns = [
      /bg-gray-[0-9]{2,3}/,
      /text-gray-[0-9]{2,3}/,
      /border-gray-[0-9]{2,3}/,
      /bg-red-[0-9]{2,3}/,
      /text-red-[0-9]{2,3}/,
      /border-red-[0-9]{2,3}/
    ];

    for (const pattern of forbiddenPatterns) {
      const match = content.match(pattern);
      ok(
        !match, 
        `Found forbidden absolute color class: ${match?.[0]} in TractorMachineDetail.jsx. Use semantic tokens (bg-background, text-muted-foreground, text-primary, etc.) instead.`
      );
    }
  });

  test('CatalogoTractores.jsx uses semantic tokens for error states', () => {
    const filePath = join(process.cwd(), 'src', 'pages', 'catalog', 'CatalogoTractores.jsx');
    if (!existsSync(filePath)) return;

    const content = readFileSync(filePath, 'utf-8');
    
    const forbiddenPatterns = [
      /bg-red-[0-9]{2,3}/,
      /text-red-[0-9]{2,3}/
    ];

    for (const pattern of forbiddenPatterns) {
      const match = content.match(pattern);
      ok(
        !match, 
        `Found forbidden absolute color class in error state: ${match?.[0]} in CatalogoTractores.jsx. Use bg-destructive/10 and text-destructive instead.`
      );
    }
  });

  test('CatalogoMaquinas.jsx uses semantic tokens for error states', () => {
    const filePath = join(process.cwd(), 'src', 'pages', 'catalog', 'CatalogoMaquinas.jsx');
    if (!existsSync(filePath)) return;

    const content = readFileSync(filePath, 'utf-8');
    
    const forbiddenPatterns = [
      /bg-red-[0-9]{2,3}/,
      /text-red-[0-9]{2,3}/
    ];

    for (const pattern of forbiddenPatterns) {
      const match = content.match(pattern);
      ok(
        !match, 
        `Found forbidden absolute color class in error state: ${match?.[0]} in CatalogoMaquinas.jsx. Use bg-destructive/10 and text-destructive instead.`
      );
    }
  });
});
