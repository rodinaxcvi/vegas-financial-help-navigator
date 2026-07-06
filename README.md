# Vegas Financial Help Navigator

A free mobile-first static web app for Las Vegas and Clark County residents to understand short-term financial pressure, build a practical action plan, and review verified starting points for local support resources.

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

Resource cards are stored in `resources.json`. Every public resource entry must be verified against an official source before it is added.

Do not add placeholder organizations, fake phone numbers, example links, invented hours, invented eligibility rules, invented assistance availability, or unverified email addresses. If a category does not yet have a verified organization, leave that category without a direct listing; the app will show Nevada 211 as a verified navigation resource.

Each resource must include:

- `resourceType`: either `Verified navigation hub` or `Verified direct provider`.
- `sourceUrl`: the official page used for verification.
- `verifiedDate`: the date the record was checked.
- `lastVerified`: the same verification date shown to users.

Only include an email address when the official source explicitly provides one.

Phone numbers and contact instructions are displayed as reference information only. Resource cards do not include phone action buttons or `tel:` links.

To edit resources:

1. Open `resources.json`.
2. Add, remove, or edit objects in the array.
3. Keep the same core field names: `organization`, `resourceType`, `category`, `address`, `phone`, `website`, `hours`, `eligibility`, `documents`, `access`, `busAccessible`, `physicalAddress`, `lastVerified`, `verifiedDate`, `sourceUrl`, `neighborhoods`, `householdTypes`, and `urgency`.
4. Use one of these categories:
   - `rent/housing help`
   - `utility help`
   - `food`
   - `transportation`
   - `employment/job training`
   - `benefits navigation`
   - `free tax help`
   - `credit counseling/financial coaching`
   - `legal aid referrals`
5. Verify the information against the official source URL.
6. Update both `verifiedDate` and `lastVerified` whenever a listing is checked.
7. Confirm that the entry does not include invented contact details, hours, office locations, eligibility rules, document requirements, or availability claims.

Use `resourceType` to distinguish how a visitor should treat the listing:

- `Verified navigation hub`: helps route people to current local referrals or official program information.
- `Verified direct provider`: provides or screens for a direct service, but availability and eligibility still must be confirmed.

Set `physicalAddress` to `true` only when the listed address is a physical walk-in or appointment location. The app hides the Directions button when `physicalAddress` is false.

If filters do not find a direct match, the app shows a no-results message and displays Nevada 211 as the fallback verified navigation hub for current local referrals.

## Report Outdated Information

The footer link is controlled by `REPORT_OUTDATED_URL` in `script.js`. It is currently a placeholder (`#`).

When a public reporting form is ready:

1. Create a Google Form for outdated or incorrect resource information.
2. Copy the public form URL.
3. Replace `REPORT_OUTDATED_URL` with that URL.
4. Test the footer link before sharing the site publicly.

## Pre-Launch Checklist

- Verify every source URL.
- Verify phone numbers.
- Verify verification dates.
- Test on mobile.
- Test all filters.
- Test print summary.
- Test no-results behavior.

## Run Locally

Because the app loads `resources.json`, use a small static server instead of opening the file directly:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy Free To GitHub Pages

1. Create a GitHub repository.
2. Commit `index.html`, `styles.css`, `script.js`, `resources.json`, and `README.md`.
3. Push to GitHub.
4. In the repository, go to Settings -> Pages.
5. Select the main branch and root folder.
6. Save, then use the published GitHub Pages URL.

## Deploy Free To Vercel

1. Create a Vercel account or sign in.
2. Import the GitHub repository.
3. Use the default static project settings.
4. Deploy.

No build command, backend, API key, or paid dependency is required.
