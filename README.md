# LexaRox AI Assist

Build a Modern AI-First Accountancy Management Platform — LexaRox

Design and build a production-quality, modern SaaS web application for LexaRox Accountancy, an accountancy firm that wants to transform its internal operations into an AI-first accountancy platform.

This is NOT a generic accounting dashboard.

The product vision is to create an intelligent platform where AI agents handle background work, data processing, document preparation, communication, onboarding and repetitive accountancy tasks, while human users primarily focus on reviewing exceptions, recommendations, approvals and completed work.

The UI should feel like a premium modern SaaS + AI operations platform, not an old-fashioned accounting application.

1. Product Vision

LexaRox wants to build a platform that can eventually support:

Accountancy operations

Client onboarding

Document collection

Data processing

Email preparation and communication

Marketing activities

Task management

AI recommendations

AI-generated summaries

Exception detection

Human review and approvals

Multilingual client onboarding

CRM/data management

Future phone/VoIP integration

Call transcription

AI-generated call notes

Future mobile application

The platform should be designed so that AI is a core part of the experience, rather than an AI chatbot added on top of a traditional dashboard.

2. Target Users

Design the system primarily for:

Admin

Responsible for:

Managing clients

Managing users

Assigning tasks

Reviewing AI-generated work

Managing documents

Monitoring workflows

Managing system settings

Accountancy Staff

Responsible for:

Client accounts

Documents

Tasks

Reviews

Financial/accountancy workflows

Client communication

Managers

Responsible for:

Team performance

Work queues

Exceptions

Approvals

AI recommendations

Operational overview

Clients

Future client-facing experience:

Onboarding

Uploading documents

Completing required information

Receiving instructions

Communicating with LexaRox

Viewing task/document status

3. Phase 1 Design Priority

Do NOT attempt to build every future feature.

Phase 1 should focus on the Must Have functionality.

The primary discovery journey is:

Admin → Clients → Client onboarding → Documents → Tasks → AI assistance → Review/Approval

Future functionality such as VoIP, call recording, transcription and advanced AI agents should be represented as planned/future capabilities rather than dominating the initial product.

4. Main Application Structure

Create a professional application shell with:

Left Sidebar

Dashboard

Clients

Onboarding

Documents

Tasks

AI Workspace

Communications

Reports

Team

Settings

At the bottom:

Help & Support

User Profile

Account Settings

The sidebar should be clean, compact and modern.

Use icons with labels.

5. Dashboard

Create a premium AI-powered operational dashboard.

The dashboard should immediately answer:

"What needs my attention today?"

Instead of showing only traditional accounting statistics, prioritize actionable information.

Top Header

Show:

Good morning, Andrea

Subtitle:

"Here’s what needs your attention today."

Include:

Search

Notifications

AI assistant shortcut

User profile

Dashboard KPI Cards

Create elegant cards for:

Active Clients

Example:
1,284

Pending Onboarding

Example:
24

Documents Awaiting Review

Example:
38

Tasks Requiring Attention

Example:
17

AI Completed

Example:
126

Each card should include:

Number

Small trend indicator

Supporting text

Relevant icon

Avoid excessive colors.

6. AI Activity Section

Create a prominent section called:

AI Activity

Show what the AI system has completed in the background.

Example activities:

AI processed 18 client documents

AI prepared 7 email drafts

AI detected 4 missing documents

AI categorised 32 uploaded files

AI prepared onboarding instructions for 5 clients

AI flagged 3 items for human review

Each activity should show:

AI agent/category

Action

Time

Status

Review button where required

Use subtle AI visual treatment.

Do NOT make this look like a chatbot.

It should feel like an AI operations feed.

7. "Needs Your Attention" Section

This is one of the most important dashboard areas.

Create a card/list titled:

Needs Your Attention

Examples:

Client document missing

ABC Ltd is missing its bank statement.

[Review]

AI recommendation

AI recommends reviewing an unusual transaction for XYZ Ltd.

[Review]

Approval required

Email prepared by AI for John Smith.

[Approve] [Edit]

Onboarding exception

Client onboarding is incomplete.

[View Client]

Use priority indicators:

High

Medium

Low

8. Client Management

Create a modern client management screen.

Header:

Clients

Actions:

Search clients

Filter

Add Client

Table columns:

Client

Type

Onboarding Status

Documents

Tasks

Last Activity

AI Status

Account Manager

Actions

Example statuses:

Onboarding

Active

Review Required

Awaiting Documents

Completed

Use clean badges and whitespace.

9. Client Detail Page

Create a comprehensive client profile.

Header:

Client name

Example:

Brightside Consulting Ltd

Show:

Client status

Account manager

Contact details

Onboarding progress

Last activity

Use tabs:

Overview

Onboarding

Documents

Tasks

Communications

Activity

AI Insights

Client Overview

Include:

Client information

Current onboarding status

Pending items

Recent activity

AI insights

Upcoming tasks

10. Client Onboarding

Create a highly polished onboarding workflow.

This is a major product feature.

Show a progress indicator:

Step 1 → Step 2 → Step 3 → Step 4 → Complete

Example:

Business Information

Personal Information

Required Documents

Verification

Review

Show:

Onboarding Progress — 72%

Use a clear checklist.

Example:

✓ Business details completed

✓ Director details completed

✓ Identification uploaded

⚠ Bank statement missing

○ Final verification

11. AI Multilingual Onboarding

Create an AI-powered onboarding panel.

Title:

AI Onboarding Assistant

Description:

"Your AI assistant is helping this client complete onboarding."

Allow selecting:

Preferred Language

Example:

English
Spanish
French
Hindi
Arabic
German

Do NOT design this as a simple Google Translate style feature.

The experience should communicate that AI is:

Explaining instructions

Guiding the client

Answering questions

Identifying missing information

Helping complete onboarding

Include an example:

"Your AI assistant has detected that the client is having difficulty understanding the document requirements."

Button:

View AI Conversation

12. Documents

Create a modern document management interface.

Categories:

Identity

Bank Statements

Tax Documents

Company Documents

Contracts

Other

Each document should show:

File name

Client

Type

Uploaded date

AI processing status

Verification status

Actions

AI statuses:

Processing

Processed

Needs Review

Verified

13. AI Document Processing

When opening a document, show:

Document Preview

alongside:

AI Analysis

Example:

AI Summary

"Bank statement successfully processed. 42 transactions identified."

Then:

AI Findings

2 unusual transactions detected

1 missing month

Account holder verified

Actions:

Approve

Request Review

Ask AI

14. Tasks

Create an intelligent task management screen.

Views:

My Tasks

Team Tasks

AI Tasks

Completed

Overdue

Each task should show:

Task name

Client

Assigned to

Priority

Due date

Source

Status

Include AI-generated tasks.

Example:

AI detected missing VAT documentation

Client:
Brightside Consulting Ltd

Priority:
High

[Review Task]

15. AI Workspace

Create a dedicated AI Workspace.

This should be one of the most visually impressive areas of the application.

Do NOT make it look like a basic ChatGPT clone.

Instead, create an AI command center.

Header:

AI Workspace

Subtitle:

"Your intelligent operations layer for accountancy."

Show AI agents as cards.

AI Agents

Document Agent

Processes and analyses documents.

Client Onboarding Agent

Guides clients through onboarding.

Communication Agent

Prepares emails and client communications.

Accountancy Agent

Supports accountancy workflows.

Task Agent

Creates and prioritises tasks.

Marketing Agent

Supports marketing activities.

Each agent card should display:

Status

Tasks completed

Current activity

Last run

View activity

Example:

Document Agent

● Active

126 documents processed today

[View Activity]

16. AI Review Queue

Create a dedicated review screen:

AI Review Queue

The concept:

AI does the background work.

Humans review exceptions.

Display:

18 items waiting for human review

Each item should show:

What AI did

Why it needs review

AI recommendation

Confidence level

Relevant client

Recommended action

Buttons:

Approve

Edit

Reject

View Details

This should be one of the core UX patterns of the entire application.

17. Communications

Create a communication center.

Tabs:

Email

WhatsApp

Phone

Internal Notes

For Phase 1, focus mainly on:

Email

WhatsApp contact actions

Click-to-call

Example:

Client communication card:

Email prepared by AI

"Your annual accounts are ready for review..."

Buttons:

[Edit] [Approve & Send]

Future functionality can be shown under:

Coming Soon

VoIP Calling

Call Recording

Call Transcription

AI Call Summary

18. Reports & Analytics

Create a clean analytics dashboard.

Show:

Client growth

Onboarding completion

Documents processed

Tasks completed

AI automation rate

Review workload

Team workload

Include charts but avoid making the screen overly dense.

19. Admin Settings

Create settings areas for:

Users

Roles & Permissions

Departments

AI Agents

Notifications

Languages

Communication

Data & Privacy

GDPR

Integrations

20. GDPR / Data Protection

Create a professional settings section for:

Data & Privacy

Include:

Data retention

Client consent

Document access

User permissions

Audit logs

Data processing

Privacy controls

The design should communicate trust and security.

Avoid making unsupported legal claims.

21. Future Integrations

Create an integrations page showing:

Existing / Planned

LexaRox Services

Email

WhatsApp

Phone

Future VoIP

AI/LLM services

LexaRox should be presented as:

Planned / Data Migration Reference

The system should make it clear that existing CRM data may eventually be migrated after understanding its structure.

22. Industry Survey

Create a lightweight survey management screen.

Title:

Industry Insights

Purpose:

Help LexaRox understand problems faced by other accountancy firms.

Show:

Survey responses

Number of firms surveyed

Common pain points

Technology adoption

Most requested features

Include charts/cards for:

Manual workload

Client onboarding problems

Document collection

Communication issues

AI adoption

This should feel like an internal product research dashboard.

23. Design Direction

The visual design is extremely important.

Do NOT create:

Old-fashioned accounting software

Heavy enterprise UI

Excessively dark UI

Neon cyberpunk AI interface

Excessive gradients

Overloaded dashboards

Too many cards

Generic Bootstrap dashboard styling

Instead create:

Premium

Minimal

Intelligent

Trustworthy

Human

Futuristic but professional

Think:

Modern fintech SaaS + AI operations platform + premium enterprise product.

The interface should feel calm and sophisticated.

24. Color Direction

Use a light-first interface.

Primary direction:

Warm white / very light background

Deep navy / charcoal typography

Sophisticated teal or blue-green as the primary brand accent

Very subtle AI gradient accents

Soft borders

Minimal shadows

Avoid overly saturated colors.

AI elements can use a subtle gradient treatment, but keep it restrained.

25. Typography

Use a modern SaaS typography system.

Recommended:

Inter

or another clean modern sans-serif.

Typography should have:

Strong hierarchy

Large page headings

Clear section titles

Comfortable body text

Compact metadata

26. Components

Create reusable components for:

Sidebar

Header

KPI Cards

Data Tables

Status Badges

Progress Indicators

AI Activity Cards

AI Agent Cards

Review Cards

Client Cards

Document Cards

Task Cards

Modals

Drawers

Tabs

Dropdowns

Filters

Search

Notifications

Empty States

Loading States

All components should have consistent spacing, radius, typography and interaction states.

27. UX Principles

Follow these principles throughout the product:

1. Show what needs attention first

Users should immediately understand what requires action.

2. AI works in the background

AI should not constantly interrupt the user.

3. Humans control important decisions

AI can recommend, prepare and flag.

Humans approve important actions.

4. Reduce cognitive load

Do not overload the dashboard with information.

5. Make complex processes feel simple

Especially:

onboarding

document collection

review

task management

6. Progressive disclosure

Show important information first.

Advanced details should appear when needed.

28. AI Interaction Pattern

Do NOT use a large chatbot window as the primary AI experience.

Instead use:

AI suggestions + AI activity + AI recommendations + Review Queue + contextual "Ask AI" actions

For example:

Inside a client page:

AI Insight

"3 documents appear to be missing from this client's onboarding."

[Review]

[Ask AI]

Inside a document:

AI Summary

"42 transactions detected. 2 items require review."

[View Findings]

This makes AI feel naturally integrated into the workflow.

29. Responsive Design

The platform must be fully responsive.

Desktop:

Full sidebar

Multi-column dashboard

Data tables

Tablet:

Collapsible sidebar

Responsive cards

Horizontal scrolling tables where necessary

Mobile browser:

Compact navigation

Stacked cards

Mobile-friendly tables

Bottom navigation or compact menu where appropriate

The Phase 1 product is web-first but must work well on mobile browsers.

30. Important Product Philosophy

The key product concept is:

Traditional software:

User → searches → processes → enters data → communicates → completes task

LexaRox:

AI → processes → prepares → detects issues → recommends → user reviews → user approves

Design the entire UX around this transformation.

The platform should visually communicate:

"AI handles the work. You handle the decisions."

31. Build Requirements

Create the application as a polished SaaS prototype with:

Production-quality UI

Responsive layouts

Reusable components

Realistic sample data for prototype presentation

Functional navigation

Working tabs

Working filters

Working search

Working modals

Working dropdowns

Working status changes

Interactive dashboard

Client detail pages

Document review interface

AI Workspace

AI Review Queue

Use realistic accountancy terminology.

Do not use meaningless lorem ipsum.

Do not make every section visually heavy.

Prioritize clarity, whitespace and hierarchy.

32. Start With These Screens

For the initial design, prioritize these screens:

Login

Dashboard

Clients

Client Detail

Client Onboarding

Documents

Document AI Review

Tasks

AI Workspace

AI Review Queue

Communications

Reports

Settings

Industry Survey

Make the Dashboard, Client Detail, Onboarding and AI Workspace especially polished because these screens will establish the overall product direction.

33. Final Visual Goal

When someone opens the LexaRox platform, the immediate impression should be:

"This is a next-generation accountancy platform where AI is actually doing the operational work."

It should feel significantly more advanced than traditional accounting software while still being trustworthy enough for professional accountants and their clients.

Focus on:

Clarity + Trust + AI + Automation + Human Review + Premium SaaS UX

Do not over-design.

Make it feel like a real product that could eventually be launched commercially.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lexarox-ai-assist.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0f6c6b81-1494-456e-8df6-2607ecf6d7be).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
