import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ROUTE_PROMPT_POOL,
  LOCAL_KNOWLEDGE_BASE,
  resolveLocalQuery,
  getRandomRoutePrompts,
} from '../src/lib/ai/route-prompts.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

describe('Global Route-Aware Morphing AI Assistant Widget Suite', () => {
  describe('1. Route-Aware Dynamic Prompts & Local Knowledge Base', () => {
    it('should define 6-8 prompts per key route and a default fallback pool', () => {
      const requiredRoutes = [
        '/dashboard',
        '/',
        '/districts',
        '/crisis',
        '/command-center',
        '/press-releases',
        '/media',
        '/activities',
        '/reports',
        '/notifications',
        '/profile',
        'default',
      ];

      for (const route of requiredRoutes) {
        assert.ok(ROUTE_PROMPT_POOL[route], `Route pool should exist for: ${route}`);
        const prompts = ROUTE_PROMPT_POOL[route];
        assert.ok(
          prompts.length >= 6,
          `Route ${route} should contain at least 6 prompts, found ${prompts.length}`
        );

        for (const prompt of prompts) {
          assert.ok(prompt.label && prompt.label.length > 0, 'Prompt label must be non-empty');
          assert.ok(prompt.query && prompt.query.length > 0, 'Prompt query must be non-empty');
        }
      }
    });

    it('should maintain structured local knowledge items covering core government topics', () => {
      assert.ok(LOCAL_KNOWLEDGE_BASE.length >= 8, 'Knowledge base should have at least 8 items');

      const intents = LOCAL_KNOWLEDGE_BASE.map((item) => item.intent);
      assert.ok(intents.includes('CPI Calculation'), 'Should include CPI calculation knowledge');
      assert.ok(intents.includes('90-Minute Crisis SLA'), 'Should include 90-minute SLA knowledge');
      assert.ok(intents.includes('Konkan Division Districts'), 'Should include Konkan districts knowledge');
      assert.ok(intents.includes('Login Credentials'), 'Should include login credentials knowledge');
      assert.ok(intents.includes('24-Hour Operational Cycle'), 'Should include 24-hr cycle knowledge');
    });

    it('should intercept local knowledge queries accurately', () => {
      // Direct query match
      const cpiAnswer = resolveLocalQuery('What is the Communication Performance Index (CPI) formula?');
      assert.ok(cpiAnswer && cpiAnswer.includes('Volume Score (25)'), 'Should match CPI query directly');

      // Keyword match
      const slaAnswer = resolveLocalQuery('Tell me about 90-minute crisis deadline');
      assert.ok(slaAnswer && slaAnswer.includes('90-minute Service Level Agreement'), 'Should match 90-minute SLA');

      // Konkan districts match
      const konkanAnswer = resolveLocalQuery('Which districts are in konkan division?');
      assert.ok(konkanAnswer && konkanAnswer.includes('Palghar, Thane, Raigad'), 'Should match Konkan districts');

      // Random non-matching query returns null
      const nonMatch = resolveLocalQuery('Random quantum mechanics in space astrophysics');
      assert.strictEqual(nonMatch, null, 'Unmatched query should return null');
    });

    it('should shuffle and slice 3-4 random route prompts deterministically', () => {
      const crisisPrompts = getRandomRoutePrompts('/crisis', 4);
      assert.ok(crisisPrompts.length <= 4 && crisisPrompts.length >= 3, 'Should slice 3-4 prompts');

      const dashboardPrompts = getRandomRoutePrompts('/dashboard/', 4);
      assert.ok(dashboardPrompts.length <= 4 && dashboardPrompts.length >= 3, 'Should handle trailing slashes');
    });
  });

  describe('2. Backend AI Endpoint Route Handler (POST /api/ai/chat)', () => {
    const routeHandlerPath = path.join(projectRoot, 'src', 'app', 'api', 'ai', 'chat', 'route.ts');
    assert.ok(fs.existsSync(routeHandlerPath), 'api/ai/chat/route.ts should exist');
    const routeContent = fs.readFileSync(routeHandlerPath, 'utf-8');

    it('should export a POST route handler conforming to Next.js 16 Route Handler standards', () => {
      assert.ok(routeContent.includes('export async function POST'), 'Must export async function POST');
      assert.ok(routeContent.includes('NextResponse.json'), 'Must return NextResponse.json');
    });

    it('should validate request payload for messages array and handle status 400', () => {
      assert.ok(
        routeContent.includes('!Array.isArray(body.messages) || body.messages.length === 0'),
        'Must validate messages array is non-empty'
      );
      assert.ok(routeContent.includes('status: 400'), 'Must return 400 for invalid payload');
    });

    it('should check local knowledge intercept before invoking fallback generator', () => {
      assert.ok(
        routeContent.includes('resolveLocalQuery(query)'),
        'Must check resolveLocalQuery before generating fallback response'
      );
      assert.ok(
        routeContent.includes("source: 'local_knowledge'"),
        'Must tag local knowledge responses'
      );
    });

    it('should implement state intelligence fallback response generator', () => {
      assert.ok(
        routeContent.includes('generateContextualGovernmentResponse'),
        'Must include contextual government response generator'
      );
      assert.ok(
        routeContent.includes("source: 'ai_fallback'"),
        'Must tag fallback AI responses'
      );
    });
  });

  describe('3. UI Component Architecture & Layout Integration', () => {
    const widgetPath = path.join(projectRoot, 'src', 'components', 'ai', 'ai-assistant-widget.tsx');
    assert.ok(fs.existsSync(widgetPath), 'ai-assistant-widget.tsx should exist');
    const widgetContent = fs.readFileSync(widgetPath, 'utf-8');

    it('should include the strict route visibility guard unmounting on /account and /login', () => {
      assert.ok(
        widgetContent.includes("pathname.startsWith('/account')"),
        'Widget must unmount on /account route'
      );
      assert.ok(
        widgetContent.includes("pathname.startsWith('/login')"),
        'Widget must unmount on /login route'
      );
    });

    it('should seed the initial greeting matching specification', () => {
      assert.ok(
        widgetContent.includes('Hello there, how can I help you?'),
        'Initial greeting must match "Hello there, how can I help you?"'
      );
    });

    it('should bind to project semantic design tokens and dark tinted executive palette', () => {
      assert.ok(widgetContent.includes('bg-primary text-primary-foreground'), 'Must bind to bg-primary');
      assert.ok(widgetContent.includes('bg-slate-950/90'), 'Must bind to dark tinted card bg-slate-950/90');
      assert.ok(widgetContent.includes('border-slate-800/90'), 'Must bind to border-slate-800/90');
      assert.ok(widgetContent.includes('bg-slate-900/90'), 'Must bind to bg-slate-900/90');
      assert.ok(widgetContent.includes('bg-gov-accent'), 'Must bind to bg-gov-accent');
    });

    it('should implement shared layoutId morphing and outside click listener', () => {
      assert.ok(
        widgetContent.includes('layoutId="ai-assistant-container"'),
        'Must use shared layoutId="ai-assistant-container"'
      );
      assert.ok(
        widgetContent.includes('pointerdown'),
        'Must listen to pointerdown for click-outside collapse'
      );
      assert.ok(
        widgetContent.includes('Escape'),
        'Must listen to Escape key for quick collapse'
      );
    });

    it('should mount AIAssistantWidget globally in app/layout.tsx', () => {
      const layoutPath = path.join(projectRoot, 'src', 'app', 'layout.tsx');
      assert.ok(fs.existsSync(layoutPath), 'src/app/layout.tsx should exist');
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      assert.ok(
        layoutContent.includes('AIAssistantWidget'),
        'src/app/layout.tsx must import and mount AIAssistantWidget'
      );
      assert.ok(
        layoutContent.includes('<Suspense') || widgetContent.includes('<Suspense'),
        'AIAssistantWidget must be isolated within a Suspense boundary for React 19 compliance'
      );
    });

    it('should declare all hooks unconditionally before evaluating the route visibility guard', () => {
      const visibilityGuardIndex = widgetContent.indexOf("if (!pathname || pathname.startsWith('/account')");
      const useEffectIndex = widgetContent.indexOf('useEffect(');
      const useStateIndex = widgetContent.indexOf('useState(');

      assert.ok(visibilityGuardIndex > -1, 'Visibility guard must exist');
      assert.ok(
        visibilityGuardIndex > useEffectIndex && visibilityGuardIndex > useStateIndex,
        'Route visibility guard must be placed AFTER all React hooks to preserve hook count in React 19'
      );
    });
    it('should explicitly enforce borderRadius: 9999px on FAB to prevent square-shape regressions on collapse', () => {
      assert.ok(
        widgetContent.includes("borderRadius: '9999px'"),
        'Must explicitly declare borderRadius: 9999px on FAB animation and style targets'
      );
      assert.ok(
        !widgetContent.includes('<AnimatePresence mode="wait">'),
        'Must not use mode="wait" on AnimatePresence to ensure continuous shared layout morphing'
      );
    });
  });
});
