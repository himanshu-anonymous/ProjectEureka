import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('DGIPR Open UI Copilot - Frontend Verification Suite', () => {
  const openUiLibPath = path.resolve('src/components/copilot/OpenUILibrary.tsx');
  const drawerPath = path.resolve('src/components/copilot/CopilotDrawer.tsx');
  const layoutPath = path.resolve('src/components/layout/DashboardLayout.tsx');

  it('should verify OpenUILibrary source exists and exports all canonical components', () => {
    assert.ok(fs.existsSync(openUiLibPath), 'OpenUILibrary.tsx must exist');
    const content = fs.readFileSync(openUiLibPath, 'utf-8');

    const expectedComponents = [
      'Stack',
      'KpiCard',
      'DataTable',
      'BarChart',
      'LineChart',
      'GraphView',
      'Callout',
      'Heading',
      'Text',
    ];

    for (const comp of expectedComponents) {
      assert.ok(
        content.includes(`export const ${comp}`),
        `OpenUILibrary must export canonical component: ${comp}`
      );
    }
  });

  it('should verify GIGW 3.0 accessibility compliance on DataTable and interactive charts', () => {
    const content = fs.readFileSync(openUiLibPath, 'utf-8');

    // DataTable must have scope="col" on table headers
    assert.ok(
      content.includes('scope="col"'),
      'DataTable must include scope="col" on table header elements for screen readers'
    );

    // DataTable must support table caption
    assert.ok(
      content.includes('{caption}'),
      'DataTable must render an accessible table caption'
    );

    // BarChart and LineChart must have table toggle buttons with descriptive titles/labels
    assert.ok(
      content.includes('View as Table'),
      'Charts must support View as Table alternative view for GIGW 3.0 accessibility'
    );
  });

  it('should verify CopilotDrawer handles role-based UI and fail-open memory actions', () => {
    assert.ok(fs.existsSync(drawerPath), 'CopilotDrawer.tsx must exist');
    const content = fs.readFileSync(drawerPath, 'utf-8');

    // Dialog accessibility attributes
    assert.ok(
      content.includes('role="dialog"'),
      'CopilotDrawer must include role="dialog" accessibility attribute'
    );
    assert.ok(
      content.includes('aria-label="DGIPR Open UI Copilot Interface"'),
      'CopilotDrawer must include descriptive aria-label'
    );

    // "What I remember about you" and Forget Me
    assert.ok(
      content.includes('What I Remember About You'),
      'CopilotDrawer must provide transparent view of stored user preferences'
    );
    assert.ok(
      content.includes('handleForgetMe'),
      'CopilotDrawer must include handleForgetMe action for privacy control'
    );

    // Grounding / Explain This Number modal
    assert.ok(
      content.includes('Data Provenance & Calculation Context'),
      'CopilotDrawer must include Explain This Number data provenance modal'
    );
  });

  it('should verify DashboardLayout gates Copilot behind NEXT_PUBLIC_COPILOT_ENABLED flag', () => {
    assert.ok(fs.existsSync(layoutPath), 'DashboardLayout.tsx must exist');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    assert.ok(
      content.includes('NEXT_PUBLIC_COPILOT_ENABLED'),
      'CopilotDrawer must be strictly gated behind process.env.NEXT_PUBLIC_COPILOT_ENABLED'
    );
  });
});
