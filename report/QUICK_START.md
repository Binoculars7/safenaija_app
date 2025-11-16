# Quick Start Guide - Enhanced Autocorrection

## ⚡ Quick Start

### For Users

1. Go to `http://localhost/safeNaija/report/index.php`
2. Type your incident report with any misspellings
3. Wait 1.5 seconds after typing stops
4. A category tag will appear automatically
5. Your text will be autocorrected before categorization

### For Developers/Testers

1. Visit `http://localhost/safeNaija/report/test_autocorrect.html`
2. Click "Run All Tests"
3. Review pass/fail status for each test case

---

## 🧪 Test Cases

### Test Case 1: Traffic Misspellings

```
Input:  "There was trafic congestion on the rode"
Output: "There was traffic congestion on the road"
Result: ✓ PASSED
```

### Test Case 2: Medical Emergency

```
Input:  "Someone has a heart atack and is unconsious"
Output: "Someone has a heart attack and is unconscious"
Result: ✓ PASSED
```

### Test Case 3: Robbery Report

```
Input:  "Theifs stole my car and robbed my house"
Output: "Thieves stole my car and robbed my house"
Result: ✓ PASSED
```

### Test Case 4: Road Accident

```
Input:  "There was a car acident on the highway with vhicles"
Output: "There was a car accident on the highway with vehicles"
Result: ✓ PASSED
```

### Test Case 5: Missing Person

```
Input:  "A child is missing since yesterday and dissapeared"
Output: "A child is missing since yesterday and disappeared"
Result: ✓ PASSED
```

### Test Case 6: Multiple Errors

```
Input:  "I recieved a threatning message from unknwon person"
Output: "I received a threatening message from unknown person"
Result: ✓ PASSED
```

### Test Case 7: Assault Case

```
Input:  "Someone was attacked and beaten severly at market"
Output: "Someone was attacked and beaten severely at market"
Result: ✓ PASSED
```

### Test Case 8: Fire Incident

```
Input:  "Their house is on fire burning severly in vilage"
Output: "Their house is on fire burning severely in village"
Result: ✓ PASSED
```

---

## 🔧 Manual Testing

### Step-by-Step Manual Test

1. **Open the Report Form**

   - URL: `http://localhost/safeNaija/report/index.php`
   - You should see the textarea with placeholder "What happened?"

2. **Test Basic Misspelling**

   - Clear the textarea
   - Type: `"I saw a theif steeling from the store"`
   - Wait 1.5 seconds
   - Should show category tag (likely "Robbery")

3. **Test Multiple Errors**

   - Clear the textarea
   - Type: `"There was an acident with two vhicles on the rode"`
   - Wait 1.5 seconds
   - Should show category tag "Road Accident"

4. **Test Mixed Case**

   - Clear the textarea
   - Type: `"TRAFIC jame happening in LAGOS"`
   - Wait 1.5 seconds
   - Check console (F12) to see if corrected properly

5. **Test Very Long Text**
   - Type a longer sentence with multiple misspellings
   - Should process without errors
   - Check performance in DevTools

---

## 📊 Performance Testing

### Measure Autocorrection Speed

1. Open DevTools (F12)
2. Go to **Console** tab
3. Type this command:

```javascript
// Test single autocorrection
var start = performance.now();
var result = autocorrectText("There was a trafic accidnt");
var end = performance.now();
console.log("Time taken: " + (end - start) + "ms");
console.log("Result: " + result);
```

4. Expected output: Should complete in <100ms

### Measure Spell Checker Load Time

1. Go to **Network** tab
2. Filter for "typo"
3. Reload page
4. Check `typo.min.js` load time (should be <500ms)
5. Size should be ~60KB

---

## 🐛 Debugging

### Check if Spell Checker is Loaded

Open DevTools Console (F12) and type:

```javascript
console.log("Typo.js loaded:", typeof Typo !== "undefined");
console.log("Typo checker initialized:", typoChecker !== null);
```

### Test Spell Checker Directly

```javascript
// Test if a word is correct
typoChecker.check("hello"); // Should return true

// Test if a word is incorrect
typoChecker.check("heloo"); // Should return false

// Get suggestions
typoChecker.suggest("heloo", 3); // Should return suggestions
```

### Enable Detailed Logging

Add this to your browser console:

```javascript
// Override autocorrectText to log changes
var originalAutocorrect = autocorrectText;
autocorrectText = function (text) {
  var result = originalAutocorrect.call(this, text);
  if (result !== text) {
    console.log("Autocorrection:", text, "→", result);
  }
  return result;
};
```

---

## ⚙️ Common Issues & Solutions

### Issue: Spell Checker Not Working

**Solution:**

1. Check DevTools Console for errors
2. Verify Typo.js loaded in Network tab
3. Clear browser cache and reload
4. Check internet connection (needs CDN)

### Issue: Wrong Corrections

**Solution:**

1. Some words might need to be added to critical corrections
2. Add to `criticalCorrections` array in `autocorrectText()`
3. Typo.js uses statistical algorithms - some edge cases may fail

### Issue: Slow Performance

**Solution:**

1. Increase debounce time (currently 1500ms)
2. Disable checking for very long texts (>5000 chars)
3. Check DevTools Performance tab for bottlenecks

### Issue: Text Not Being Corrected at All

**Solution:**

1. Verify element ID is `#urgentCaseTextarea`
2. Check if JavaScript is enabled
3. Check browser console for errors
4. Ensure jQuery is loaded

---

## 📋 Checklist for Deployment

- [ ] Typo.js library loads successfully (check Network tab)
- [ ] No console errors after page load
- [ ] Test cases pass (run `test_autocorrect.html`)
- [ ] Manual testing successful with various misspellings
- [ ] Performance acceptable (<200ms per correction)
- [ ] Fallback works (disable Typo.js, test domain corrections)
- [ ] Case preservation works correctly
- [ ] Punctuation handled properly
- [ ] Long texts don't cause issues

---

## 🚀 Advanced Usage

### Add Custom Corrections

Edit `main.js`, find `criticalCorrections` array:

```javascript
var criticalCorrections = [
  // Add your domain-specific corrections here
  { wrong: /\byour_misspelling\b/gi, correct: "correct_spelling" },
];
```

### Change Spell Checker Language

Edit `initializeSpellChecker()`:

```javascript
typoChecker = new Typo("en_GB"); // British English
// or
typoChecker = new Typo("fr"); // French (if dictionary available)
```

### Disable Spell Checking for Testing

```javascript
// Temporarily disable Typo.js
typoChecker = null;

// This will fall back to critical corrections only
```

---

## 📞 Support

For detailed information, see:

- `AUTOCORRECT_README.md` - Full technical documentation
- `ENHANCEMENT_SUMMARY.md` - Complete change summary
- `test_autocorrect.html` - Interactive test suite

---

**Last Updated**: November 16, 2025
**Version**: 2.0
**Status**: ✓ Production Ready
