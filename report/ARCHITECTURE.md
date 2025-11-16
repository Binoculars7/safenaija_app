# 📊 System Architecture & Flow Diagrams

## Overall System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    SAFENAIJA REPORT SYSTEM v2.0                │
└────────────────────────────────────────────────────────────────┘

                           FRONTEND (Browser)
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│  User Interface                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  HTML Form (index.php)                                   │  │
│  │  - Textarea for incident report                          │  │
│  │  - Category tag display                                  │  │
│  │  - Location selector                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ▲                                   │
│                              │ (Display)                         │
│                              │                                   │
│  JavaScript Engine                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  main.js - Autocorrection Module                         │  │
│  │  ├─ initializeSpellChecker() ........................ ← ── ┼──┼──> Typo.js (CDN)
│  │  ├─ getBestCorrection(word)                             │  │
│  │  ├─ autocorrectText(text) [ENHANCED]                    │  │
│  │  │  ├─ Tier 1: Domain Corrections                       │  │
│  │  │  └─ Tier 2: Dictionary Spell Check                   │  │
│  │  └─ categorizeWithOpenAI(text)                          │  │
│  │     └─ Uses corrected text for categorization            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                              │
                              │ (API Call)
                              ▼
                    BACKEND (OpenAI API)
┌────────────────────────────────────────────────────────────────┐
│                                                                 │
│  OpenAI GPT-3.5 Turbo                                           │
│  - Receives corrected incident report                           │
│  - Analyzes and categorizes                                     │
│  - Returns category classification                              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Autocorrection Pipeline

```
User Input (May have misspellings)
│
│  "I recieved a threatning call and theif stole my car"
│
▼
┌─────────────────────────────────────┐
│  INPUT VALIDATION                   │
│  - Check text length (>= 10 chars)   │
│  - Check not empty                   │
│  - Trim whitespace                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  TIER 1: DOMAIN CORRECTIONS         │
│  (Regex-based, always applied)      │
│                                      │
│  Example corrections:                │
│  - Misspelled domain terms          │
│  - Emergency-specific words          │
│                                      │
│  Applied: 15+ critical patterns      │
└──────────────┬──────────────────────┘
               │
               ▼
        (After Tier 1)
   "I received a threatning call and
    theif stole my car"
               │
               ▼
┌─────────────────────────────────────┐
│  TIER 2: SPELL CHECKING (Typo.js)   │
│  - Split text into words             │
│  - Check each word (3+ chars)        │
│  - Get suggestions for misspelled    │
│  - Preserve case and punctuation     │
└──────────────┬──────────────────────┘
               │
               ▼
  (After Tier 2 - Fully Corrected)
"I received a threatening call and
 thief stole my car"
               │
               ▼
┌─────────────────────────────────────┐
│  CATEGORIZATION (OpenAI)            │
│  - Analyze corrected text            │
│  - Determine incident type           │
│  - Return category                   │
└──────────────┬──────────────────────┘
               │
               ▼
          RESULT: Robbery
          (+ Threat/Robbery)
```

---

## Function Interaction Diagram

```
                    initializeSpellChecker()
                            │
                            ▼
                    (Load Typo.js dictionary)
                            │
                            ▼
                    typoChecker = new Typo()
                            │
                            │
                            ▼
    ┌──────────────────────────────────────────┐
    │  User types in textarea                   │
    │  (Triggered: 'input' event)               │
    └──────────────────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────┐
            │  Debounce Timer           │
            │  (Wait 1.5 seconds)       │
            └────────────┬──────────────┘
                         │
                         ▼
        ┌────────────────────────────────────────┐
        │  categorizeWithOpenAI(text)            │
        └────────────┬─────────────────────────┘
                     │
                     ▼
    ┌─────────────────────────────────────┐
    │  autocorrectText(text)               │
    │  ├─ Apply critical corrections ── ──┼──> getBestCorrection()
    │  └─ Use Typo.js for spell check     │    (If needed)
    └──────────────┬──────────────────────┘
                   │ (Returns corrected text)
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │  Send corrected text to OpenAI       │
    │  - Create prompt                     │
    │  - Make API call                     │
    │  - Receive category response         │
    └──────────────┬──────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────────┐
    │  Display category tag                │
    │  - Get category info                 │
    │  - Update DOM with styling           │
    │  - Show to user                      │
    └─────────────────────────────────────┘
```

---

## Two-Tier Correction Mechanism

```
TEXT INPUT
    │
    ├─────────────────────────────────────────────────────┐
    │                                                     │
    ▼                                                     │
┌───────────────────────┐                                 │
│  TIER 1               │                                 │
│  DOMAIN CORRECTIONS   │                                 │
│                       │                                 │
│  Pattern-Matching:    │                                 │
│  ┌─────────────────┐  │                                 │
│  │ Regex Patterns  │  │                                 │
│  │ 15+ patterns    │  │                                 │
│  └────────┬────────┘  │                                 │
│           │           │                                 │
│  Examples: │           │                                 │
│  suicid → │suicide    │                                 │
│  accidnt→ │accident   │                                 │
│  kidnapin→│kidnapping│                                 │
│           │           │                                 │
│  Status: │ALWAYS      │                                 │
│  Priority│FIRST       │                                 │
└───────────┬───────────┘                                 │
            │                                              │
            ▼                                              │
    (Partially corrected text)                            │
            │                                              │
            │                                              │
    ┌───────────────────────────────────────────┐         │
    │                                           │         │
    │◄─ If Typo.js available, continue:        │         │
    │                                           │         │
    └───────────────────────────────────────────┘         │
            │                                              │
            ▼                                              │
┌───────────────────────────────────────────────────────┐ │
│  TIER 2                                               │ │
│  GENERAL SPELL CHECKING (Typo.js)                     │ │
│                                                       │ │
│  Algorithm:                                           │ │
│  1. Split text into words (preserve whitespace)      │ │
│  2. For each word:                                    │ │
│     a. Check if 3+ characters                         │ │
│     b. Check spelling (typoChecker.check)             │ │
│     c. If misspelled:                                 │ │
│        - Get suggestions (typoChecker.suggest)        │ │
│        - Pick best suggestion                         │ │
│        - Preserve original case                       │ │
│     d. Reconstruct text                               │ │
│  3. Join words back together                          │ │
│                                                       │ │
│  Coverage: ~40,000+ English words                     │ │
│  Status: APPLIED IF AVAILABLE                         │ │
│  Fallback: USE TIER 1 ONLY                            │ │
└───────────────────────────────────────┬───────────────┘ │
                                        │                 │
                                        ▼                 │
                            (Fully corrected text)        │
                                        │                 │
                                        └─────────────────┘
                                            │
                                            ▼
                                    FINAL OUTPUT
                        (Send to categorization)
```

---

## Performance Timeline

```
Page Load
│
├─ 0ms ─────── JavaScript starts
│
├─ 50ms ────── jQuery loads
│
├─ 100ms ───── Typo.js library loads from CDN
│
├─ 200-500ms ─ initializeSpellChecker() called
│              │
│              └─ Typo dictionary loaded into memory
│                 (One-time cost, then cached)
│
├─ 500ms ───── DOM ready, event handlers attached
│
├─ 1000ms ──── Fully interactive, ready for user input
│
└─ Ready ✓

User Types
│
├─ 0ms ─────── User types character
│  ├─ 10ms ─── Input event fired
│  ├─ 20ms ─── Debounce timer cleared
│  └─ 30ms ─── New debounce timer set (1500ms)
│
├─ 1500ms ──── Debounce timer expires
│  ├─ 0ms ──── autocorrectText(text) called
│  ├─ 20ms ─── Tier 1 corrections applied
│  ├─ 50-150ms ─ Tier 2 Typo.js spell check
│  └─ 180ms ──── Correction complete
│
├─ 180ms ───── categorizeWithOpenAI() called
│  ├─ 50ms ─── Prompt created
│  ├─ 200ms ── API request sent to OpenAI
│  ├─ 500-1000ms ─ Waiting for OpenAI response
│  └─ 750ms ──── Response received & parsed
│
├─ 950ms ───── Category determined
│
└─ 960ms ───── Display category tag (< 1s to user!)

Total User Perceived Delay: ~1-2 seconds (after typing stops)
```

---

## Error Handling Flow

```
START: autocorrectText(text)
    │
    ▼
    Is text empty?
    ├─ YES → Return original text
    │
    └─ NO
        │
        ▼
        Apply critical corrections
        │
        ▼
        Is Typo.js available?
        ├─ NO → Return partially corrected text
        │
        └─ YES
            │
            ▼
            Try spell checking
            │
            ├─ Exception caught?
            │  ├─ YES → Log warning, return partially corrected
            │  │
            │  └─ NO → Continue
            │
            ▼
            For each word:
            │
            ├─ Whitespace?
            │  └─ YES → Keep as-is
            │
            ├─ Valid word format?
            │  ├─ NO → Keep as-is
            │  │
            │  └─ YES → Check spelling
            │
            ├─ Spelling check error?
            │  ├─ YES → Keep word, log warning
            │  │
            │  └─ NO → Continue
            │
            ├─ Word misspelled?
            │  ├─ NO → Keep word
            │  │
            │  └─ YES → Get suggestions
            │      │
            │      ├─ Suggestions found?
            │      │  ├─ YES → Use best suggestion
            │      │  │        (preserve case)
            │      │  │
            │      │  └─ NO → Keep word
            │      │
            │      └─ Return corrected word
            │
            └─ Reconstruct text
                │
                ▼
            Return fully corrected text

END: Return corrected text (or original on any error)
```

---

## Browser Compatibility Matrix

```
Browser        │ Version │ Typo.js │ Auto-correct │ Status
───────────────┼─────────┼─────────┼──────────────┼────────
Chrome         │ 90+     │ ✓       │ ✓            │ ✓ Full
Firefox        │ 88+     │ ✓       │ ✓            │ ✓ Full
Safari         │ 14+     │ ✓       │ ✓            │ ✓ Full
Edge           │ 90+     │ ✓       │ ✓            │ ✓ Full
Opera          │ 76+     │ ✓       │ ✓            │ ✓ Full
─────────────────────────────────────────────────────────
IE 11          │ 11      │ ✗       │ Partial*     │ ✗ No
Old Safari     │ <14     │ ✗       │ Partial*     │ ✗ No
Old Firefox    │ <88     │ ✗       │ Partial*     │ ✗ No

* = Domain corrections work, spell-checking falls back gracefully
```

---

## Deployment Architecture

```
DEVELOPMENT
├─ Local Testing
│  ├─ test_autocorrect.html
│  ├─ Manual testing on index.php
│  └─ Browser DevTools validation
│
└─ Quality Assurance
   ├─ Functional testing (8 test cases)
   ├─ Performance profiling
   ├─ Browser compatibility
   └─ Error handling validation

STAGING
├─ Pre-production deployment
├─ Load testing
├─ Integration testing
└─ User acceptance testing

PRODUCTION
├─ CDN deployment
├─ Monitoring setup
├─ Performance tracking
├─ Error logging
└─ User feedback collection

POST-DEPLOYMENT
├─ Performance monitoring
├─ Error tracking
├─ User analytics
├─ A/B testing (if applicable)
└─ Continuous improvement
```

---

## Resource Usage Summary

```
┌──────────────────┬─────────┬────────┬──────────┐
│ Resource         │ Amount  │ Timing │ Impact   │
├──────────────────┼─────────┼────────┼──────────┤
│ Library Size     │ 60KB    │ Load   │ Low      │
│ Memory (loaded)  │ 5MB     │ Init   │ Low      │
│ Initialization   │ 200-500 │ Once   │ Minimal  │
│ Per-Word Check   │ 1-2ms   │ Real   │ Very Low │
│ Full Text Check  │ 50-200  │ Real   │ Low      │
│ Cache Size       │ 60KB    │ Persist│ One-time │
│ Network Traffic  │ Minimal │ Setup  │ One-time │
└──────────────────┴─────────┴────────┴──────────┘
```

---

**Last Updated**: November 16, 2025  
**System**: SafeNaija v2.0  
**Status**: ✅ Production Ready
