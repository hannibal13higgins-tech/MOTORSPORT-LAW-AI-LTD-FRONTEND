# Phase 1 — Governance Verification

## Backend

- **Base URL**: `https://web-production-0b967.up.railway.app`
- **AI Route**: `POST /orgs/:orgId/ai/ask`
- **Regulation Set ID**: `c02bbb32-1c5d-4471-afd9-b5aeab885967`
- **Regulation Set Name**: FIA Formula One Sporting Regulations
- **Auth mode**: Dev headers (`Authorization: Bearer dummy`, `x-dev-actor-id: founder-demo`)

## Test Org

- **Org ID**: `0063b456-eec2-4a4f-93e8-5d149c2f1853`
- **Org Name**: Demo Racing Team

---

## Test Questions and Results

### 1. In-scope: "What are the rules about the safety car?"

**Response**: `refused: false`

```json
{
  "refused": false,
  "answer": "The rules about the safety car are outlined in Article 55 of the FIA Formula One Sporting Regulations:\n\n- **When deployed**: Orange lights are illuminated, and SC boards are shown at all marshalling posts.\n- **Formation**: All cars must form up behind the safety car, and no overtaking is permitted.\n- **Delta Time**: Delta time must be respected via FIA ECU.\n- **Pit Lane**: The pit lane remains open.\n- **Lapped Cars**: Lapped cars may be directed to pass the safety car and re-join at the back of the train.\n- **Resuming Race**: When the track is clear, orange lights are extinguished, the safety car enters the pit lane, and the race resumes when the leader crosses the Line.",
  "citations": [
    {
      "regulationObjectId": "53dfaf29-73f2-4be0-be3a-62fb6f0a2729",
      "regulationSetName": "FIA Formula One Sporting Regulations",
      "regulationVersionLabel": "2025 Issue 5",
      "effectiveDate": "2025-04-30T00:00:00.000Z",
      "articleNumber": "55",
      "clausePath": "55"
    }
  ]
}
```

### 2. Out-of-scope: "What is the capital of France?"

**Response**: `refused: true`

```json
{
  "refused": true,
  "refusalReason": "INSUFFICIENT_CITATIONS"
}
```

### 3. In-scope: "What are the parc ferme rules?"

**Response**: `refused: false` — 2 citations (Art. 40, Art. 60)

```json
{
  "refused": false,
  "answer": "The parc ferme rules are outlined in Article 40 and Article 60...",
  "citations": [
    {
      "regulationObjectId": "498c465a-6d5d-443a-8cc4-e665ffd6394a",
      "articleNumber": "40",
      "clausePath": "40",
      "regulationSetName": "FIA Formula One Sporting Regulations",
      "regulationVersionLabel": "2025 Issue 5",
      "effectiveDate": "2025-04-30T00:00:00.000Z"
    },
    {
      "regulationObjectId": "6dd75d76-15a4-42f7-9e17-0fefa9c3a7d9",
      "articleNumber": "60",
      "clausePath": "60",
      "regulationSetName": "FIA Formula One Sporting Regulations",
      "regulationVersionLabel": "2025 Issue 5",
      "effectiveDate": "2025-04-30T00:00:00.000Z"
    }
  ]
}
```

### 4. Out-of-scope: "How many points does the race winner get?"

**Response**: `refused: true`

```json
{
  "refused": true,
  "refusalReason": "INSUFFICIENT_CITATIONS"
}
```

### 5. Out-of-scope: "What happens if a driver causes a collision?"

**Response**: `refused: true`

```json
{
  "refused": true,
  "refusalReason": "INSUFFICIENT_CITATIONS"
}
```

---

## Article Viewer Verification

**GET /regulation-objects/53dfaf29-73f2-4be0-be3a-62fb6f0a2729**

```json
{
  "id": "53dfaf29-73f2-4be0-be3a-62fb6f0a2729",
  "regulationSetId": "c02bbb32-1c5d-4471-afd9-b5aeab885967",
  "regulationVersionId": "90fdfb60-63a5-41ca-8696-e3fc325b6c13",
  "articleNumber": "55",
  "clausePath": "55",
  "title": "SAFETY CAR",
  "text": "55.1-55.8 When deployed: orange lights illuminated..."
}
```

---

## Console UI Description

### Login / Register
- Simple email + password forms
- In dev mode, clicking submit redirects straight to dashboard

### Dashboard
- Lists organisations from GET /orgs
- Each org card shows name + "Open" link
- "Create Organisation" button links to /orgs/new

### AI Console (/orgs/[orgId]) — 3-Panel Layout

**Left Rail:**
- "MOTORSPORT AI" wordmark
- Org name
- Nav: Console (active), Articles (disabled/greyed)
- "Signed in as founder-demo" with sign out link

**Main Panel:**
- Top bar: Regulation set dropdown, version badge, status pills ("Citations enforced", "Refusal enabled")
- Question textarea with helper text
- Ask button (disabled until regulation set selected) + Clear button
- Loading skeleton during AI request
- Answer panel or refusal card on response

**Right Panel:**
- "Citations" header
- Citation cards with article number, clause path, regulation set, version, effective date
- "Open clause" link on each card navigating to /articles/[objectId]
- Skeleton placeholders during loading

### Article Viewer (/articles/[objectId])
- Metadata bar: article number, clause path, version
- Full text in readable typography
- "Back to console" link
- "Copy citation" button

---

## Verification Date

2026-03-04
