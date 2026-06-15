# EasyLinkMD — Senior QA Engineer Assessment

This repository contains everything for the Senior QA Engineer assessment including test strategy, automation framework, defect reports, and QA infrastructure notes.

---

## Part A: Test Strategy & Test Case Design

Path: `test-strategy-and-test-case-design/`

- Patient_Test_Strategy.docx  
  Covers overall test strategy including scope, test approach, what to automate vs manual testing, and basic notes on data and security considerations.

- Patient_Appointment_Test_Cases.docx  
  11 test cases covering happy paths, edge cases, negative scenarios, security checks, plus cross-platform and timezone cases.

---

## Parts B & C: API & UI Automation

Path: `automation/`

Single Playwright + TypeScript framework covering:

- API tests (Restful Booker)
- UI tests (SauceDemo)

---

## Setup

cd automation
npm install
npx playwright install chromium

---

## Run all tests

npm test

---

## Run API tests only (Part B)

npm run test:api

---

## Run UI tests only (Part C)

npm run test:ui

---

## Run UI tests in headed mode

SLOW=1 npm run test:ui

---

## Open test report

npm run report

---

## Test outputs

| Artifact               | Path                          |
| ---------------------- | ----------------------------- |
| HTML report            | automation/playwright-report/ |
| Screenshots (failures) | automation/test-results/      |

---

## Part D: Defect Reports

Path: `defect-reports/`

- Defect_Reports.docx  
  Contains 4 defects (API + UI) with steps to reproduce, expected vs actual results screenshots for ui, and notes on possible root cause.

---

## Part E: QA Infrastructure & Strategy

Path: `qa-infrastructure-strategy/`

- QA_Infrastructure_Strategy.docx  
  Covers QA approach including CI/CD, handling sensitive FHIR integrations, test metrics, and prioritization approach.
