# Vegas Financial Help Navigator

A free mobile-first static web app for Las Vegas and Clark County residents to understand short-term financial pressure, build a practical action plan, and review verified starting points for local support resources.

Vegas Help Finder consolidates verified starting points and official tools. It does not determine ZIP-level eligibility, service coverage, funding availability, appointment availability, or application outcomes. Users should use each provider's official website for ZIP-specific locations, applications, eligibility details, appointments, and availability.

This is not investment, tax, legal, debt-settlement, lending, credit-repair, or individualized financial advice.

## Features

- Financial Check-In for income, essential expenses, savings, overdue bills, due dates, household size, and urgent need.
- Resource Finder with verified Clark County and Nevada resource cards.
- 24-hour, 7-day, and 30-day action plan that prioritizes essential needs.
- Printable budget summary.
- Appointment-preparation checklist.
- Hardship phone-call script generator.
- Hardship-letter template generator.
- Resource contact tracker saved in browser local storage.
- Documents-to-gather checklist by resource category.
- Clear privacy notice, no login, no uploads, and no backend.
- English interface with Spanish version marked as in development.

## Local Privacy Boundary

The app stores check-in values and contact tracker rows only in the user's browser through `localStorage`.

Do not enter:

- Social Security numbers
- Account numbers
- Bank logins
- Credit reports
- Identity documents
- Document images
- Full legal or tax records

## Resource Data

Resource cards are stored in `resources.json`. Each listing should be checked against an official source before it is added or updated.

Keep the directory conservative:

- Do not add placeholder organizations, fake phone numbers, example links, invented hours, or unverified availability claims.
- Show phone numbers and contact instructions as reference text only. Resource cards do not include phone action buttons or `tel:` links.
- Use each provider's official website as the source of truth for ZIP-specific locations, applications, eligibility, appointments, and availability.
- If a category does not yet have a verified direct listing, the app shows Nevada 211 as the fallback verified navigation hub.

Resource type labels:

- `Verified navigation hub`: helps route people to referrals or official program information.
- `Verified direct provider`: provides or screens for a direct service, but availability still must be confirmed.

## Verified Resources Added July 2026

The current directory includes verified starting points such as Nevada 211, Three Square Food Bank, Legal Aid Center of Southern Nevada, Nevada Energy Assistance Program, RTC Southern Nevada, IRS VITA/TCE Locator, GreenPath Financial Wellness, Nevada Department of Health and Human Services, United Way of Southern Nevada Volunteer Connect, Idealist/VolunteerMatch, Catholic Charities of Southern Nevada, The Salvation Army Southern Nevada, Lutheran Social Services of Nevada, Jewish Family Service Agency Las Vegas, UNLV PRACTICE, 988 Suicide & Crisis Lifeline, SAMHSA National Helpline, and Open Path Psychotherapy Collective.

New resource categories added July 7, 2026:

- `volunteer/community groups`
- `faith/community support`
- `therapy/mental health services`

Mental-health and therapy listings are starting points only. They are not emergency care, diagnosis, treatment, or professional advice. For immediate physical danger call 911. For crisis or emotional distress support call, text, or chat 988. SAMHSA's helpline is listed as a referral and information service, not a counseling provider.

Direct housing and workforce providers should only be added after official source verification because funding, intake rules, and availability can change quickly.

## Report Outdated Information

The footer link is controlled by `REPORT_OUTDATED_URL` in `script.js`.

When a public reporting form is ready, replace `REPORT_OUTDATED_URL` with the form URL and test the footer link before sharing the site.

## Pre-Launch Checklist

- Verify every source URL.
- Verify phone numbers.
- Verify verification dates.
- Test on mobile.
- Test all filters.
- Test print summary.
- Test no-results behavior.

## Run Locally

Because the app loads `resources.json`, use a small static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment

This is a static site. It can be hosted on a static hosting service with no backend, build command, API key, or paid dependency required.
