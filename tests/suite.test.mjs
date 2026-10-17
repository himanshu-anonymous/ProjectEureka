import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT_DIR = process.cwd();

describe("Maha Government Command Center - Test Suite", () => {
  describe("1. Officer Personas & Dummy Names Integrity", () => {
    it("should have replaced all real officer names with fictional dummy names in serverData.ts", () => {
      const serverDataPath = path.join(ROOT_DIR, "src", "lib", "serverData.ts");
      const content = fs.readFileSync(serverDataPath, "utf8");

      // Assert real human names do NOT exist
      const forbiddenNames = [
        "Deshmukh",
        "Shinde",
        "Gaikwad",
        "Jadhav",
        "Kadam",
        "Rahul Patil",
        "Sanjay Chavan",
        "Govind Bodke",
        "Ashok Shingare",
        "Pravin Khose",
        "देशमुख",
        "शिंदे",
        "गायकवाड",
        "जाधव",
        "कदम",
      ];

      for (const name of forbiddenNames) {
        assert.ok(
          !content.includes(name),
          `Found forbidden real name "${name}" in serverData.ts`,
        );
      }

      // Assert Marathi names exist
      assert.ok(
        content.includes("Dr. Arvind M. Gokhale"),
        "Missing State DG Dr. Arvind M. Gokhale",
      );
      assert.ok(
        content.includes("Rudresh Kumar Sawant"),
        "Missing Divisional Director Rudresh Kumar Sawant",
      );
      assert.ok(
        content.includes("Vikram S. Mahajan, IAS"),
        "Missing Palghar Collector Vikram S. Mahajan",
      );
      assert.ok(
        content.includes("Nilesh R. Kelkar, IAS"),
        "Missing Thane Collector Nilesh R. Kelkar",
      );
      assert.ok(
        content.includes("Mandar S. Nerurkar"),
        "Missing DIO Operator Mandar S. Nerurkar",
      );
    });

    it("should have updated LoginScreen.tsx with new dummy personas", () => {
      const loginPath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "portal",
        "LoginScreen.tsx",
      );
      const content = fs.readFileSync(loginPath, "utf8");

      assert.ok(
        content.includes("Dr. Arvind M. Gokhale (DG)"),
        "LoginScreen missing Dr. Arvind M. Gokhale",
      );
      assert.ok(
        content.includes("Rudresh Kumar Sawant (Dy. Dir)"),
        "LoginScreen missing Rudresh Kumar Sawant",
      );
      assert.ok(
        content.includes("Vikram S. Mahajan, IAS (DM)"),
        "LoginScreen missing Vikram S. Mahajan",
      );
      assert.ok(
        content.includes("Nilesh R. Kelkar, IAS (DM)"),
        "LoginScreen missing Nilesh R. Kelkar",
      );
      assert.ok(
        content.includes("Mandar S. Nerurkar (DIO Desk)"),
        "LoginScreen missing Mandar S. Nerurkar",
      );
    });

    it("should have updated ProfileScreen.tsx and Header.tsx", () => {
      const profilePath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "portal",
        "ProfileScreen.tsx",
      );
      const headerPath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "layout",
        "Header.tsx",
      );
      const profileContent = fs.readFileSync(profilePath, "utf8");
      const headerContent = fs.readFileSync(headerPath, "utf8");

      assert.ok(
        profileContent.includes("Dr. Arvind M. Gokhale"),
        "ProfileScreen missing Dr. Arvind M. Gokhale",
      );
      assert.ok(
        headerContent.includes("Dr. Arvind M. Gokhale"),
        "Header missing Dr. Arvind M. Gokhale",
      );
      assert.ok(
        headerContent.includes("currentUser?.avatarInitials || 'AG'"),
        "Header avatarInitials default should be AG",
      );
    });

    it("should have updated telemetry and audit actor records", () => {
      const auditPath = path.join(
        ROOT_DIR,
        "src",
        "data",
        "telemetryLogsAndAuditData.ts",
      );
      const content = fs.readFileSync(auditPath, "utf8");

      assert.ok(
        content.includes("Dr. Arvind M. Gokhale"),
        "telemetryLogsAndAuditData missing Dr. Arvind M. Gokhale",
      );
      assert.ok(
        content.includes("Rudresh Kumar Sawant"),
        "telemetryLogsAndAuditData missing Rudresh Kumar Sawant",
      );
      assert.ok(
        content.includes("Vikram S. Mahajan, IAS"),
        "telemetryLogsAndAuditData missing Vikram S. Mahajan",
      );
      assert.ok(
        content.includes("Nilesh R. Kelkar, IAS"),
        "telemetryLogsAndAuditData missing Nilesh R. Kelkar",
      );
      assert.ok(
        !content.includes("Deshmukh"),
        "telemetryLogsAndAuditData still contains Deshmukh",
      );
      assert.ok(
        !content.includes("Shinde"),
        "telemetryLogsAndAuditData still contains Shinde",
      );
      assert.ok(
        !content.includes("Gaikwad"),
        "telemetryLogsAndAuditData still contains Gaikwad",
      );
      assert.ok(
        !content.includes("Rahul Patil"),
        "telemetryLogsAndAuditData still contains Rahul Patil",
      );
      assert.ok(
        !content.includes("Sanjay Chavan"),
        "telemetryLogsAndAuditData still contains Sanjay Chavan",
      );
    });
  });

  describe("2. Telemetry and Pipeline Consistent Light-Theme Verification", () => {
    it("should verify AnimatedTelemetryMesh does not use dark theme or radar scanner", () => {
      const telemetryPath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "commandCenter",
        "AnimatedTelemetryMesh.tsx",
      );
      const content = fs.readFileSync(telemetryPath, "utf8");

      // Assert dark mode background and radar scanner classes are removed
      assert.ok(
        !content.includes("bg-slate-950 text-white"),
        "Telemetry should not use bg-slate-950 text-white",
      );
      assert.ok(
        !content.includes("radar-sweep-scanner"),
        "Telemetry should not use radar-sweep-scanner",
      );
      assert.ok(
        !content.includes("conic-gradient"),
        "Telemetry should not use radar conic-gradient",
      );

      // Assert light theme government styles are used
      assert.ok(
        content.includes("bg-surface"),
        "Telemetry should use bg-surface",
      );
      assert.ok(
        content.includes("border-borderLine-standard"),
        "Telemetry should use standard border",
      );
      assert.ok(
        content.includes("text-gov-primary"),
        "Telemetry should use text-gov-primary",
      );
      assert.ok(
        content.includes("embedded"),
        "Telemetry should support embedded prop",
      );
    });

    it("should verify AnimatedPipelineDiagram uses consistent light government theme", () => {
      const pipelinePath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "commandCenter",
        "AnimatedPipelineDiagram.tsx",
      );
      const content = fs.readFileSync(pipelinePath, "utf8");

      // Assert dark mode is removed
      assert.ok(
        !content.includes("bg-slate-950 text-white"),
        "Pipeline should not use bg-slate-950 text-white",
      );

      // Assert light theme styles
      assert.ok(
        content.includes("bg-surface"),
        "Pipeline should use bg-surface",
      );
      assert.ok(
        content.includes("text-gov-primary"),
        "Pipeline should use text-gov-primary",
      );
      assert.ok(
        content.includes("embedded"),
        "Pipeline should support embedded prop",
      );
      assert.ok(
        content.includes("pipeline-conduit-active"),
        "Pipeline should use animated conduit",
      );
    });

    it("should verify global animation keyframes are declared in globals.css", () => {
      const cssPath = path.join(ROOT_DIR, "src", "app", "globals.css");
      const content = fs.readFileSync(cssPath, "utf8");

      assert.ok(
        content.includes("@keyframes conduitFlow"),
        "Missing conduitFlow in globals.css",
      );
      assert.ok(
        content.includes(".pipeline-conduit-active"),
        "Missing pipeline-conduit-active in globals.css",
      );
      assert.ok(
        content.includes(".telemetry-conduit-stream"),
        "Missing telemetry-conduit-stream in globals.css",
      );
      assert.ok(
        content.includes(".wave-bar-pulse"),
        "Missing wave-bar-pulse in globals.css",
      );
      assert.ok(content.includes("html {"), "Missing html rule in globals.css");
      assert.ok(
        content.includes("zoom: 100%;"),
        "Missing default 90% zoom in globals.css",
      );
    });
  });

  describe("3. Konkan Regional Data & District Structure", () => {
    it("should verify all 5 Konkan districts in dashboardData.ts", () => {
      const dataPath = path.join(ROOT_DIR, "src", "data", "dashboardData.ts");
      const content = fs.readFileSync(dataPath, "utf8");

      const expectedDistricts = [
        "Thane",
        "Raigad",
        "Palghar",
        "Ratnagiri",
        "Sindhudurg",
      ];
      for (const dist of expectedDistricts) {
        assert.ok(
          content.includes(`name: '${dist}'`),
          `Missing district definition for ${dist}`,
        );
      }

      // Verify Konkan division restriction
      assert.ok(
        content.includes("division: 'Konkan'"),
        "Missing Konkan division mapping",
      );
    });

    it("should verify News Queue system data definitions", () => {
      const queuePath = path.join(ROOT_DIR, "src", "data", "newsQueueData.ts");
      const content = fs.readFileSync(queuePath, "utf8");

      // Verify the 8 required cells are supported in types/templates
      assert.ok(content.includes("source"), "News queue missing source");
      assert.ok(content.includes("baseScore"), "News queue missing scoring");
      assert.ok(content.includes("sentiment"), "News queue missing sentiment");
      assert.ok(
        content.includes("verification"),
        "News queue missing verification",
      );
      assert.ok(
        content.includes("credibility"),
        "News queue missing credibility",
      );
      assert.ok(
        content.includes("NEWS_CHANNELS"),
        "News queue missing NEWS_CHANNELS",
      );
      assert.ok(
        content.includes("HEADLINE_TEMPLATES"),
        "News queue missing HEADLINE_TEMPLATES",
      );
    });
  });

  describe("4. Command Center Modular Navigation & Routing", () => {
    it("should verify all 3 dedicated Command Center pages exist", () => {
      const page1 = path.join(
        ROOT_DIR,
        "src",
        "app",
        "command-center",
        "page.tsx",
      );
      const page2 = path.join(
        ROOT_DIR,
        "src",
        "app",
        "command-center",
        "raw-ingestion",
        "page.tsx",
      );
      const page3 = path.join(
        ROOT_DIR,
        "src",
        "app",
        "command-center",
        "pipeline-flow",
        "page.tsx",
      );

      assert.ok(fs.existsSync(page1), "Missing /command-center/page.tsx");
      assert.ok(
        fs.existsSync(page2),
        "Missing /command-center/raw-ingestion/page.tsx",
      );
      assert.ok(
        fs.existsSync(page3),
        "Missing /command-center/pipeline-flow/page.tsx",
      );
    });

    it("should verify CommandCenterNavHeader renders all 3 tabs", () => {
      const headerPath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "commandCenter",
        "CommandCenterNavHeader.tsx",
      );
      const content = fs.readFileSync(headerPath, "utf8");

      assert.ok(
        content.includes("/command-center"),
        "Missing /command-center route",
      );
      assert.ok(
        content.includes("/command-center/raw-ingestion"),
        "Missing /command-center/raw-ingestion route",
      );
      assert.ok(
        content.includes("/command-center/pipeline-flow"),
        "Missing /command-center/pipeline-flow route",
      );
    });

    it("should verify Sidebar includes collapsible Command Centre dropdown with all 3 pages", () => {
      const sidebarPath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "layout",
        "Sidebar.tsx",
      );
      const content = fs.readFileSync(sidebarPath, "utf8");

      assert.ok(
        content.includes("Command Centre"),
        "Sidebar missing Command Centre",
      );
      assert.ok(
        content.includes("Telemetry Operations"),
        "Sidebar missing Telemetry Operations sublink",
      );
      assert.ok(
        content.includes("Raw Ingestion"),
        "Sidebar missing Raw Ingestion sublink",
      );
      assert.ok(
        content.includes("Pipeline & Ops Flow"),
        "Sidebar missing Pipeline & Ops Flow sublink",
      );
      assert.ok(
        content.includes("commandCenterParentOpen"),
        "Sidebar missing commandCenterParentOpen state",
      );
    });

    it("should verify Raw Ingestion page updates, re-indexing and column cleanup", () => {
      const rawIngestionPath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "commandCenter",
        "RawIngestionView.tsx",
      );
      const rawContent = fs.readFileSync(rawIngestionPath, "utf8");

      // Verify Status column removed from table header
      assert.ok(
        !rawContent.includes('<th className="py-2.5 px-3 bg-slate-50 w-[14%]">Status</th>') &&
        !rawContent.includes('<th className="py-2.5 px-3 bg-slate-50">Status</th>'),
        "Status column header should be removed from Source Configuration table"
      );

      // Verify exactly 5 table columns present
      assert.ok(rawContent.includes("Source ID"), "Missing Source ID column");
      assert.ok(rawContent.includes("Channel / Feeder Name"), "Missing Channel / Feeder Name column");
      assert.ok(rawContent.includes("Type"), "Missing Type column");
      assert.ok(rawContent.includes("District Target"), "Missing District Target column");
      assert.ok(rawContent.includes("Endpoint URI"), "Missing Endpoint URI column");

      // Verify no duplicate plus signs in Connect button
      assert.ok(
        !rawContent.includes("+ + Connect New Ingestion Source") &&
        !rawContent.includes("<span>+ Connect New Ingestion Source</span>"),
        "Duplicate plus sign should be removed from Connect New Ingestion Source button"
      );

      // Verify Raw Event Stream & JSON Inspector removed from RawIngestionView
      assert.ok(
        !rawContent.includes("Raw Event Stream & JSON Inspector") &&
        !rawContent.includes("३. थेट कच्चा डेटा प्रवाह व विश्लेषक"),
        "Raw Event Stream & JSON Inspector module should NOT be rendered on Raw Ingestion page"
      );

      // Verify standalone component exists
      const standalonePath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "commandCenter",
        "RawEventStreamInspector.tsx",
      );
      assert.ok(
        fs.existsSync(standalonePath),
        "Standalone RawEventStreamInspector.tsx component should exist"
      );
      const standaloneContent = fs.readFileSync(standalonePath, "utf8");
      assert.ok(
        standaloneContent.includes("export const RawEventStreamInspector"),
        "RawEventStreamInspector component should be exported"
      );

      // Verify re-indexing: Section 3 is Processing Failures with 2-column grid
      assert.ok(
        rawContent.includes("3. Processing Failures & Retry") ||
        rawContent.includes("3. Processing Failures & Retries"),
        "Section 3 should be Processing Failures & Retry"
      );
      assert.ok(
        rawContent.includes("grid grid-cols-1 md:grid-cols-2 gap-4"),
        "Processing Failures error cards should be displayed in a 2-column grid"
      );

      // Verify re-indexing: Section 4 is Ingestion Logs and Timestamps
      assert.ok(
        rawContent.includes("4. Ingestion Logs and Timestamps"),
        "Section 4 should be Ingestion Logs and Timestamps"
      );

      // Verify CommandCenterNavHeader subtitle update
      const navHeaderPath = path.join(
        ROOT_DIR,
        "src",
        "components",
        "commandCenter",
        "CommandCenterNavHeader.tsx",
      );
      const navHeaderContent = fs.readFileSync(navHeaderPath, "utf8");
      assert.ok(
        navHeaderContent.includes("Sources • Pipeline Status • Failure Retries • Ingestion Logs"),
        "CommandCenterNavHeader should have updated Raw Ingestion subtitle"
      );
    });
  });
});
