(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    // Initiate the wowjs
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('bg-primary shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('bg-primary shadow-sm').css('top', '-150px');
        }
    });

    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

    // Testimonials carousel
    if ($(".testimonial-carousel").length > 0) {
        $(".testimonial-carousel").owlCarousel({
            items: 1,
            autoplay: true,
            smartSpeed: 1000,
            dots: true,
            loop: true,
            nav: true,
            navText : [
                '<i class="bi bi-chevron-left"></i>',
                '<i class="bi bi-chevron-right"></i>'
            ]
        });
    }
    

    // ============================================
    // Configuration - Gemini API
    // ============================================
    var GEMINI_API_KEY = 'AIzaSyDgrfEeH5w4rxGp6QNEuoCd4qDSjvMMXN4';
    var GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    // Issue categories
    var issueCategories = {
        'accident': { displayName: 'Accident', color: '#f0ad4e', bgColor: '#fff3cd' },
        'fire': { displayName: 'Fire', color: '#d9534f', bgColor: '#f8d7da' },
        'robbery': { displayName: 'Robbery', color: '#d9534f', bgColor: '#f8d7da' },
        'kidnapping': { displayName: 'Kidnapping', color: '#d9534f', bgColor: '#f8d7da' },
        'murder': { displayName: 'Murder', color: '#8b0000', bgColor: '#ffcccc' },
        'fraud': { displayName: 'Fraud', color: '#ff9800', bgColor: '#fff3e0' },
        'health': { displayName: 'Health', color: '#5cb85c', bgColor: '#d4edda' },
        'vandalism': { displayName: 'Vandalism', color: '#5bc0de', bgColor: '#d1ecf1' },
        'misplace': { displayName: 'Misplace', color: '#6c757d', bgColor: '#e2e3e5' }
    };

    // ============================================
    // FALLBACK: Comprehensive keyword-based classifier
    // Weights longer/more-specific phrases higher.
    // ============================================
    var categoryKeywords = {
        'fire': [
            'fire', 'flame', 'flames', 'burning', 'burned', 'burn', 'burnt',
            'blaze', 'smoke', 'inferno', 'arson', 'combustion', 'ignite', 'ignited',
            'explosion', 'explode', 'exploded', 'ablaze', 'wildfire', 'house fire',
            'gas leak', 'charred', 'ember', 'on fire', 'caught fire', 'set ablaze',
            'fire outbreak', 'building on fire', 'car on fire'
        ],
        'robbery': [
            'rob', 'robbery', 'robbed', 'steal', 'stolen', 'theft', 'thief', 'thieves',
            'burglar', 'burglary', 'broke in', 'break in', 'break-in', 'broken into',
            'armed robbers', 'armed robbery', 'gunpoint', 'knifepoint',
            'mugged', 'mugging', 'pickpocket', 'loot', 'looted', 'looting',
            'carjack', 'carjacking', 'hijack', 'snatch', 'snatched', 'bag snatched',
            'bandit', 'raided', 'raid', 'heist', 'held at gunpoint',
            'took my', 'took our', 'seized property', 'stole my', 'stole our',
            'dispossessed', 'forcefully collected', 'robbers broke', 'thieves entered'
        ],
        'kidnapping': [
            'kidnap', 'kidnapped', 'kidnapping', 'abduct', 'abducted', 'abduction',
            'missing person', 'person is missing', 'hostage', 'ransom', 'taken away',
            'dragged away', 'child taken', 'gone missing', 'disappeared', 'trafficking',
            'human trafficking', 'forced into a car', 'held captive', 'captive',
            'seized person', 'taken by force', 'abductors', 'kidnappers', 'taken from home'
        ],
        'accident': [
            'accident', 'crash', 'crashed', 'collision', 'hit and run', 'car crash',
            'road accident', 'vehicle accident', 'run over', 'knocked down',
            'fell', 'fall', 'fallen', 'slip', 'slipped', 'tripped', 'trip',
            'injured', 'injury', 'hurt', 'wound', 'wounded', 'broken bone', 'fracture',
            'fractured', 'traffic accident', 'overturn', 'overturned', 'vehicle overturned',
            'skidded', 'motorbike accident', 'motorcycle crash', 'hit by car',
            'hit by truck', 'electrocuted', 'electrocution', 'drowning', 'drowned',
            'flood accident', 'building collapse', 'scaffold fell', 'construction accident',
            'hit by vehicle', 'knocked by', 'road mishap', 'fatal crash'
        ],
        'fraud': [
            'fraud', 'scam', 'scammed', 'swindle', 'swindled', 'fake', 'forged', 'forgery',
            'counterfeit', 'deceive', 'deceived', 'deception', 'impersonate', 'impersonation',
            'phishing', 'ponzi', 'pyramid scheme', '419', 'advance fee', 'fake website',
            'identity theft', 'credit card fraud', 'wire transfer scam', 'money transfer scam',
            'investment fraud', 'false pretense', 'false pretences', 'duped', 'conned',
            'con artist', 'cheat', 'cheated', 'cheating', 'bribe', 'bribery',
            'extort', 'extortion', 'blackmail', 'online fraud', 'internet fraud',
            'fake document', 'fake currency', 'money doubling', 'yahoo yahoo',
            'g-fraud', 'romance scam', 'bitcoin scam', 'crypto scam'
        ],
        'health': [
            'sick', 'sickness', 'ill', 'illness', 'disease', 'infection', 'infected',
            'fever', 'pain', 'hospital', 'doctor', 'medical emergency',
            'heart attack', 'stroke', 'coma', 'unconscious', 'fainted', 'faint',
            'fainting', 'collapsed', 'collapse', 'seizure', 'convulsion', 'convulsing',
            'bleeding heavily', 'excessive bleeding', 'epidemic', 'outbreak', 'malaria',
            'cholera', 'typhoid', 'covid', 'coronavirus', 'poison', 'poisoning',
            'food poisoning', 'overdose', 'snake bite', 'dog bite', 'animal bite',
            'allergy', 'allergic reaction', 'asthma attack', 'diabetic', 'hypertension',
            'surgery needed', 'ambulance', 'clinic', 'nursing home', 'mental breakdown',
            'suicide attempt', 'self harm', 'vomiting blood', 'difficulty breathing',
            'not breathing', 'died', 'dead', 'death', 'corpse', 'body found'
        ],
        'vandalism': [
            'vandal', 'vandalism', 'vandalize', 'vandalized', 'destroy', 'destroyed',
            'destruction of property', 'graffiti', 'broken window', 'windows smashed',
            'smash', 'smashed', 'property damage', 'deface', 'defaced', 'defacement',
            'spray paint', 'scratched', 'ruined', 'sabotage', 'sabotaged',
            'riot', 'rioting', 'rioters', 'trespassing', 'trespass', 'protesters destroying',
            'street destroyed', 'road damaged', 'facilities destroyed', 'burnt property',
            'deliberate damage', 'wanton destruction'
        ],
        'misplace': [
            'lost', 'lose', 'misplace', 'misplaced', 'missing item', 'lost item',
            'left behind', 'forgot', 'forgotten', 'can\'t find', 'cannot find',
            'where is my', 'where is our', 'lost and found', 'mislay', 'mislaid',
            'dropped my', 'left my', 'lost my', 'lost phone', 'lost wallet',
            'lost bag', 'lost keys', 'lost document', 'lost passport', 'lost card',
            'left in taxi', 'left on bus', 'left in vehicle', 'abandoned property',
            'found a', 'someone lost', 'item found', 'misplaced item'
        ],
        'murder': [
            'murder', 'killed', 'kill', 'killing', 'homicide',
            'assassinated', 'assassination', 'slain', 'deadly attack',
            'shot dead', 'shot', 'gunshot', 'gun attack',
            'stabbed', 'stabbing', 'knife attack',
            'beheaded', 'strangled', 'choked to death',
            'poisoned', 'poisoning', 'burned alive', 'set on fire',
            'lynched', 'mob killing', 'mob attack',
            'domestic killing', 'domestic violence death',
            'ritual killing', 'cult killing',
            'found dead', 'body found', 'corpse found',
            'death under suspicious circumstances',
            'execution', 'executed', 'extra judicial killing',
            'mass killing', 'multiple قتل', 'massacre',
            'kidnapped and killed', 'abducted and killed',
            'robbery killing', 'killed during robbery'
]
    };

    function classifyByKeywords(text) {
        if (!text || text.trim().length === 0) return null;
        var lower = text.toLowerCase();
        var scores = {};
        var maxScore = 0;
        var bestCategory = null;

        Object.keys(categoryKeywords).forEach(function(category) {
            var keywords = categoryKeywords[category];
            var score = 0;
            keywords.forEach(function(keyword) {
                var escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                // Use word boundary for single words, flexible match for phrases
                var pattern = keyword.indexOf(' ') !== -1
                    ? new RegExp(escaped, 'i')
                    : new RegExp('\\b' + escaped + '\\b', 'i');
                if (pattern.test(lower)) {
                    // Weight: multi-word phrases score higher
                    score += keyword.split(' ').length * 2;
                }
            });
            scores[category] = score;
            if (score > maxScore) {
                maxScore = score;
                bestCategory = category;
            }
        });

        return maxScore > 0 ? bestCategory : null;
    }

    var categorizationTimer = null;
    var lastCategorizedText = '';
    var isClassifying = false;
    
    // ============================================
    // Classification via Gemini AI API
    // ============================================
    function classify_with_gemini(text, callback) {
        console.log('🔍 CLASSIFYING WITH GEMINI:', text.substring(0, 50));
        
        if (!text || text.trim().length === 0) {
            callback(null);
            return;
        }

        var categoryList = Object.keys(issueCategories).join(', ');

        // Explicit, structured prompt that forces a strict single-word output
        var prompt = [
            'You are a strict one-word text classifier for a Nigerian emergency reporting system.',
            '',
            'CATEGORIES: ' + categoryList,
            '',
            'RULES:',
            '- Output EXACTLY one word from the categories list above.',
            '- No punctuation. No explanation. No extra words. Just the category.',
            '- fire = burning, flames, smoke, explosion, arson',
            '- robbery = theft, stolen items, armed robbers, mugging, burglary, looting',
            '- kidnapping = abduction, taken by force, held hostage, missing person taken',
            '- accident = crash, fall, injury, collision, electrocution, drowning',
            '- fraud = scam, deception, fake, forgery, 419, swindle, impersonation',
            '- health = sickness, disease, medical emergency, poison, death, convulsion',
            '- vandalism = property destruction, graffiti, damage to infrastructure',
            '- misplace = lost item, forgotten, cannot find something',
            '- murder = killed, kill, killing, homicide, assassinated, slain, shot, shot dead',
            '',
            'TEXT: "' + text + '"',
            '',
            'ONE WORD ANSWER:'
        ].join('\n');
        
        var requestBody = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0,
                maxOutputTokens: 10,
                stopSequences: ['\n', '.', ',', '!', '?', ' ']
            }
        };

        console.log('📤 Sending Gemini request...');
        
        fetch(GEMINI_API_URL + '?key=' + GEMINI_API_KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
        .then(function(response) {
            console.log('📥 HTTP Status:', response.status, response.statusText);
            if (!response.ok) {
                return response.text().then(function(errorText) {
                    console.error('❌ HTTP ERROR:', response.status, errorText);
                    callback(null);
                    throw new Error('HTTP ' + response.status);
                });
            }
            return response.json();
        })
        .then(function(data) {
            console.log('📦 Raw Gemini Response:', JSON.stringify(data));

            if (data.error) {
                console.error('❌ API Error:', data.error);
                callback(null);
                return;
            }

            var responseText = '';
            try {
                if (data.candidates && data.candidates[0] &&
                    data.candidates[0].content &&
                    data.candidates[0].content.parts &&
                    data.candidates[0].content.parts[0]) {
                    responseText = data.candidates[0].content.parts[0].text;
                    console.log('✓ Gemini raw text:', JSON.stringify(responseText));
                } else {
                    console.error('❌ Unexpected Gemini response structure:', JSON.stringify(data));
                }
            } catch (e) {
                console.error('❌ Parse error:', e.message);
            }

            if (!responseText) {
                console.error('❌ Empty Gemini response');
                callback(null);
                return;
            }

            // Aggressively clean: strip all non-alpha, lowercase, take first word
            var cleaned = responseText
                .replace(/[^a-zA-Z\s]/g, '')
                .trim()
                .toLowerCase()
                .split(/\s+/)[0];

            console.log('🧹 Cleaned Gemini response:', cleaned);

            var categories = Object.keys(issueCategories);
            var matched = null;

            // Exact match
            for (var i = 0; i < categories.length; i++) {
                if (cleaned === categories[i]) {
                    matched = categories[i];
                    break;
                }
            }

            // Partial/stem match (e.g. "robberies" → "robbery", "fires" → "fire")
            if (!matched) {
                for (var j = 0; j < categories.length; j++) {
                    if (cleaned.indexOf(categories[j]) !== -1 || categories[j].indexOf(cleaned) !== -1) {
                        matched = categories[j];
                        break;
                    }
                }
            }

            if (matched) {
                console.log('✅ Gemini matched:', matched);
            } else {
                console.log('⚠️ Gemini could not match. Cleaned response was:', cleaned);
            }

            callback(matched);
        })
        .catch(function(error) {
            console.error('❌ Fetch error:', error.message);
            callback(null);
        });
    }
    
    // ============================================
    // Display category tag with engine source label
    // source: 'gemini' | 'fallback'
    // ============================================
    function ensureSourceLabel() {
        if ($('#classificationSource').length === 0) {
            $('#issueCategoryTag').after(
                '<span id="classificationSource" style="display:none;font-size:9px;font-weight:700;' +
                'letter-spacing:0.8px;text-transform:uppercase;padding:2px 8px;border-radius:10px;' +
                'margin-left:6px;vertical-align:middle;position:relative;top:-1px;"></span>'
            );
        }
        return $('#classificationSource');
    }

    function displayCategoryTag(category, source) {
        var $tagElement = $('#issueCategoryTag');
        var $sourceLabel = ensureSourceLabel();

        console.log('🏷️ displayCategoryTag:', category, '| source:', source);
        
        if (!category || !issueCategories[category]) {
            $tagElement.hide().text('');
            $sourceLabel.hide();
            return;
        }
        
        var categoryInfo = issueCategories[category];

        $tagElement
            .text(categoryInfo.displayName)
            .attr('style',
                'display:inline-block !important;' +
                'visibility:visible !important;' +
                'opacity:1 !important;' +
                'background:' + categoryInfo.bgColor + ' !important;' +
                'color:' + categoryInfo.color + ' !important;' +
                'border:2px solid ' + categoryInfo.color + ' !important;' +
                'border-radius:20px !important;' +
                'padding:0.4em 1.2em !important;' +
                'font-weight:600 !important;' +
                'font-size:13px !important;' +
                'margin-bottom:0.8em !important;' +
                'box-shadow:0 3px 10px rgba(0,0,0,0.15) !important;' +
                'text-transform:uppercase !important;' +
                'letter-spacing:0.5px !important;'
            )
            .show();

        // Source badge — blue pill for Gemini AI, amber pill for keyword fallback
        if (source === 'gemini') {
            $sourceLabel
                .text('AI')
                .attr('style',
                    'display:inline-block !important;' +
                    'background:#e8f0fe !important;' +
                    'color:#1a5dc5 !important;' +
                    'border:1px solid #b3cdf5 !important;' +
                    'font-size:9px !important;font-weight:700 !important;' +
                    'letter-spacing:0.8px !important;text-transform:uppercase !important;' +
                    'padding:2px 8px !important;border-radius:10px !important;' +
                    'margin-left:6px !important;vertical-align:middle !important;' +
                    'position:relative !important;top:-1px !important;'
                )
                .show();
        } else {
            $sourceLabel
                .text('Auto')
                .attr('style',
                    'display:inline-block !important;' +
                    'background:#fff8e1 !important;' +
                    'color:#b45309 !important;' +
                    'border:1px solid #fbbf24 !important;' +
                    'font-size:9px !important;font-weight:700 !important;' +
                    'letter-spacing:0.8px !important;text-transform:uppercase !important;' +
                    'padding:2px 8px !important;border-radius:10px !important;' +
                    'margin-left:6px !important;vertical-align:middle !important;' +
                    'position:relative !important;top:-1px !important;'
                )
                .show();
        }

        console.log('✅ Tag displayed:', categoryInfo.displayName, '| Badge:', source);
    }

    function showStatusTag(status) {
        var $tagElement = $('#issueCategoryTag');
        var $sourceLabel = $('#classificationSource');
        if ($sourceLabel.length > 0) $sourceLabel.hide();

        var text, styles;
        if (status === 'analyzing') {
            text = 'Analyzing...';
            styles =
                'display:inline-block !important;visibility:visible !important;' +
                'background:#e2e3e5 !important;color:#6c757d !important;' +
                'border:2px solid #adb5bd !important;border-radius:20px !important;' +
                'padding:0.4em 1.2em !important;font-weight:600 !important;' +
                'font-size:13px !important;margin-bottom:0.8em !important;';
        } else {
            text = 'Unable to classify';
            styles =
                'display:inline-block !important;visibility:visible !important;' +
                'background:#fff3cd !important;color:#856404 !important;' +
                'border:2px solid #ffc107 !important;border-radius:20px !important;' +
                'padding:0.4em 1.2em !important;font-weight:600 !important;' +
                'font-size:13px !important;margin-bottom:0.8em !important;';
        }
        $tagElement.text(text).attr('style', styles).show();
    }

    // ============================================
    // Combined classifier: Gemini first, keyword fallback
    // ============================================
    function classifyText(text, callback) {
        classify_with_gemini(text, function(geminiCategory) {
            if (geminiCategory) {
                console.log('✅ Using Gemini classification:', geminiCategory);
                callback(geminiCategory, 'gemini');
                return;
            }
            // Gemini failed or returned unmatched response — try keyword fallback
            console.log('⚡ Gemini failed or unmatched — running keyword fallback...');
            var fallbackCategory = classifyByKeywords(text);
            if (fallbackCategory) {
                console.log('✅ Keyword fallback matched:', fallbackCategory);
                callback(fallbackCategory, 'fallback');
            } else {
                console.log('❌ Both Gemini and keyword fallback failed');
                callback(null, null);
            }
        });
    }
    
    // ============================================
    // Auto-categorize textarea
    // ============================================
    $(document).ready(function() {
        console.log('==========================================');
        console.log('🚀 SafeNaija Classification System Initialized');
        console.log('Gemini API Key:', GEMINI_API_KEY ? 'YES' : 'NO');
        console.log('Categories:', Object.keys(issueCategories).length);
        console.log('Keyword rules:', Object.keys(categoryKeywords).length, 'categories');
        console.log('==========================================');
        
        var $textarea = $('#urgentCaseTextarea');
        var $tagElement = $('#issueCategoryTag');
        
        if ($textarea.length === 0) {
            console.error('❌ CRITICAL: Textarea #urgentCaseTextarea not found!');
            return;
        }
        if ($tagElement.length === 0) {
            console.error('❌ CRITICAL: Tag element #issueCategoryTag not found!');
            return;
        }
        
        console.log('✅ DOM elements found');

        $textarea.on('input', function() {
            var text = $(this).val().trim();
            console.log('⌨️ Input event, length:', text.length);

            if (categorizationTimer) clearTimeout(categorizationTimer);

            if (!text || text.length === 0) {
                $tagElement.hide().text('');
                var $sl = $('#classificationSource');
                if ($sl.length) $sl.hide();
                lastCategorizedText = '';
                isClassifying = false;
                return;
            }

            if (text.length >= 10) {
                showStatusTag('analyzing');
            } else {
                $tagElement.hide().text('');
                var $sl2 = $('#classificationSource');
                if ($sl2.length) $sl2.hide();
            }

            categorizationTimer = setTimeout(function() {
                var currentText = text;

                if (currentText === lastCategorizedText || currentText.length < 10) {
                    console.log('⏭️ Skipping: already classified or too short');
                    return;
                }
                if (isClassifying) {
                    console.log('⏸️ Classification in progress, skipping');
                    return;
                }

                console.log('⏰ Starting classification:', currentText.substring(0, 60));
                isClassifying = true;

                classifyText(currentText, function(category, source) {
                    isClassifying = false;
                    if (category) {
                        displayCategoryTag(category, source);
                        lastCategorizedText = currentText;
                    } else {
                        showStatusTag('error');
                    }
                });
            }, 1500);
        });

        $textarea.on('blur', function() {
            var text = $(this).val().trim();

            if (!text || text.length === 0) {
                $tagElement.hide().text('');
                var $sl = $('#classificationSource');
                if ($sl.length) $sl.hide();
                return;
            }

            if (categorizationTimer) {
                clearTimeout(categorizationTimer);
                categorizationTimer = null;
            }

            if (text !== lastCategorizedText && text.length >= 10 && !isClassifying) {
                console.log('🔄 Blur event - immediate classification');
                isClassifying = true;
                showStatusTag('analyzing');

                classifyText(text, function(category, source) {
                    isClassifying = false;
                    if (category) {
                        displayCategoryTag(category, source);
                        lastCategorizedText = text;
                    } else {
                        showStatusTag('error');
                    }
                });
            }
        });
    });


    // ============================================
    // State to LGA mapping
    // ============================================
    var stateLGAs = {
        'abia': ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu Nneochi'],
        'adamawa': ['Demsa', 'Fufure', 'Ganye', 'Gayuk', 'Gombi', 'Grie', 'Hong', 'Jada', 'Larmurde', 'Madagali', 'Maiha', 'Mayo Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'],
        'akwa_ibom': ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo'],
        'anambra': ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'],
        'bauchi': ['Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa', 'Ganjuwa', 'Giade', 'Itas/Gadau', 'Jama\'are', 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 'Tafawa Balewa', 'Toro', 'Warji', 'Zaki'],
        'bayelsa': ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
        'benue': ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 'Otukpo', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'],
        'borno': ['Abadam', 'Askira/Uba', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Jere', 'Kaga', 'Kala/Balge', 'Konduga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani'],
        'cross_river': ['Abi', 'Akpabuyo', 'Akwa', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South', 'Etung', 'Ikom', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Yakuur', 'Yala'],
        'delta': ['Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri North', 'Warri South', 'Warri South West'],
        'ebonyi': ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North', 'Ezza South', 'Ikwo', 'Ishielu', 'Ivo', 'Izzi', 'Ohaozara', 'Ohaukwu', 'Onicha'],
        'edo': ['Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba Okha', 'Oredo', 'Orhionmwon', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 'Uhunmwonde'],
        'ekiti': ['Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 'Gbonyin', 'Ido Osi', 'Ijero', 'Ikere', 'Ikole', 'Ilejemeje', 'Irepodun/Ifelodun', 'Ise/Orun', 'Moba', 'Oye'],
        'enugu': ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo Etiti', 'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka', 'Oji River', 'Udenu', 'Udi', 'Uzo Uwani'],
        'gombe': ['Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 'Kwami', 'Nafada', 'Shongom', 'Yamaltu/Deba'],
        'imo': ['Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 'Obowo', 'Oguta', 'Ohaji/Egbema', 'Okigwe', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 'Owerri North', 'Owerri West', 'Unuimo'],
        'jigawa': ['Auyo', 'Babura', 'Biriniwa', 'Birnin Kudu', 'Buji', 'Dutse', 'Gagarawa', 'Garki', 'Gumel', 'Guri', 'Gwaram', 'Gwiwa', 'Hadejia', 'Jahun', 'Kafin Hausa', 'Kazaure', 'Kiri Kasama', 'Kiyawa', 'Kaugama', 'Maigatari', 'Malam Madori', 'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankwashi'],
        'kaduna': ['Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', 'Jema\'a', 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'],
        'kano': ['Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'],
        'katsina': ['Bakori', 'Batagarawa', 'Batsari', 'Baure', 'Bindawa', 'Charanchi', 'Dandume', 'Danja', 'Dan Musa', 'Daura', 'Dutsi', 'Dutsin Ma', 'Faskari', 'Funtua', 'Ingawa', 'Jibia', 'Kafur', 'Kaita', 'Kankara', 'Kankia', 'Katsina', 'Kurfi', 'Kusada', 'Mai\'Adua', 'Malumfashi', 'Mani', 'Mashi', 'Matazu', 'Musawa', 'Rimi', 'Sabuwa', 'Safana', 'Sandamu', 'Zango'],
        'kebbi': ['Aleiro', 'Arewa Dandi', 'Argungu', 'Augie', 'Bagudo', 'Bunza', 'Dandi', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko/Besse', 'Maiyama', 'Ngaski', 'Sakaba', 'Shanga', 'Suru', 'Wasagu/Danko', 'Yauri', 'Zuru'],
        'kogi': ['Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 'Igalamela Odolu', 'Ijumu', 'Kabba/Bunu', 'Kogi', 'Lokoja', 'Mopa Muro', 'Ofu', 'Ogori/Magongo', 'Okehi', 'Okene', 'Olamaboro', 'Omala', 'Yagba East', 'Yagba West'],
        'kwara': ['Asa', 'Baruten', 'Edu', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 'Moro', 'Offa', 'Oke Ero', 'Oyun', 'Pategi'],
        'lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
        'nasarawa': ['Akwanga', 'Awe', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa', 'Nasarawa Egon', 'Obi', 'Toto', 'Wamba'],
        'niger': ['Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara', 'Katcha', 'Kontagora', 'Lapai', 'Lavun', 'Magama', 'Mariga', 'Mashegu', 'Mokwa', 'Moya', 'Paikoro', 'Rafi', 'Rijau', 'Shiroro', 'Suleja', 'Tafa', 'Wushishi'],
        'ogun': ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Egbado North', 'Egbado South', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne', 'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Remo North', 'Shagamu'],
        'ondo': ['Akoko North-East', 'Akoko North-West', 'Akoko South-West', 'Akoko South-East', 'Akure North', 'Akure South', 'Ese Odo', 'Idanre', 'Ifedore', 'Ilaje', 'Ile Oluji/Okeigbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo East', 'Ondo West', 'Ose', 'Owo'],
        'osun': ['Atakunmosa East', 'Atakunmosa West', 'Aiyedaade', 'Aiyedire', 'Boluwaduro', 'Boripe', 'Ede North', 'Ede South', 'Ife Central', 'Ife East', 'Ife North', 'Ife South', 'Egbedore', 'Ejigbo', 'Ifedayo', 'Ifelodun', 'Ila', 'Ilesa East', 'Ilesa West', 'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo Otin', 'Ola Oluwa', 'Olorunda', 'Oriade', 'Orolu', 'Osogbo'],
        'oyo': ['Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-West', 'Ibadan South-East', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogbomoso North', 'Ogbomoso South', 'Ogo Oluwa', 'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo', 'Oyo East', 'Saki East', 'Saki West', 'Surulere'],
        'plateau': ['Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua\'an Pan', 'Riyom', 'Shendam', 'Wase'],
        'rivers': ['Abua/Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Eleme', 'Emuoha', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio/Akpor', 'Ogba/Egbema/Ndoni', 'Ogu/Bolo', 'Okrika', 'Omuma', 'Opobo/Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai'],
        'sokoto': ['Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 'Gwadabawa', 'Illela', 'Isa', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'],
        'taraba': ['Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo', 'Karim Lamido', 'Kumi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari', 'Yorro', 'Zing'],
        'yobe': ['Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gujba', 'Gulani', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'],
        'zamfara': ['Anka', 'Bakura', 'Birnin Magaji/Kiyaw', 'Bukkuyum', 'Bungudu', 'Gummi', 'Kaura Namoda', 'Katsina', 'Maradun', 'Maru', 'Shinkafi', 'Talata Mafara', 'Chafe', 'Zurmi'],
        'fct': ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council']
    };
    
    $('#stateSelect').on('change', function() {
        var selectedState = $(this).val();
        var lgaSelect = $('#lgaSelect');
        lgaSelect.find('option:not(:first)').remove();
        if (selectedState && stateLGAs[selectedState]) {
            stateLGAs[selectedState].forEach(function(lga) {
                lgaSelect.append($('<option></option>')
                    .attr('value', lga.toLowerCase().replace(/\s+/g, '_'))
                    .text(lga)
                    .css('color', 'black'));
            });
        }
    });
    
    var stateNameMapping = {
        'abia': ['abia', 'abia state'], 'adamawa': ['adamawa', 'adamawa state'],
        'akwa_ibom': ['akwa ibom', 'akwa-ibom', 'akwa ibom state'],
        'anambra': ['anambra', 'anambra state'], 'bauchi': ['bauchi', 'bauchi state'],
        'bayelsa': ['bayelsa', 'bayelsa state'], 'benue': ['benue', 'benue state'],
        'borno': ['borno', 'borno state'], 'cross_river': ['cross river', 'cross-river', 'cross river state'],
        'delta': ['delta', 'delta state'], 'ebonyi': ['ebonyi', 'ebonyi state'],
        'edo': ['edo', 'edo state'], 'ekiti': ['ekiti', 'ekiti state'],
        'enugu': ['enugu', 'enugu state'], 'gombe': ['gombe', 'gombe state'],
        'imo': ['imo', 'imo state'], 'jigawa': ['jigawa', 'jigawa state'],
        'kaduna': ['kaduna', 'kaduna state'], 'kano': ['kano', 'kano state'],
        'katsina': ['katsina', 'katsina state'], 'kebbi': ['kebbi', 'kebbi state'],
        'kogi': ['kogi', 'kogi state'], 'kwara': ['kwara', 'kwara state'],
        'lagos': ['lagos', 'lagos state'], 'nasarawa': ['nasarawa', 'nasarawa state'],
        'niger': ['niger', 'niger state'], 'ogun': ['ogun', 'ogun state'],
        'ondo': ['ondo', 'ondo state'], 'osun': ['osun', 'osun state'],
        'oyo': ['oyo', 'oyo state'], 'plateau': ['plateau', 'plateau state'],
        'rivers': ['rivers', 'rivers state'], 'sokoto': ['sokoto', 'sokoto state'],
        'taraba': ['taraba', 'taraba state'], 'yobe': ['yobe', 'yobe state'],
        'zamfara': ['zamfara', 'zamfara state'],
        'fct': ['fct', 'federal capital territory', 'abuja', 'federal capital', 'abuja fct']
    };
    
    var cityToStateMapping = {
        'akure': 'ondo', 'ondo': 'ondo', 'owo': 'ondo',
        'ado ekiti': 'ekiti', 'ado-ekiti': 'ekiti', 'ikere': 'ekiti',
        'abeokuta': 'ogun', 'ijebu ode': 'ogun',
        'ibadan': 'oyo', 'ogbomoso': 'oyo', 'oyo': 'oyo',
        'osogbo': 'osun', 'ile-ife': 'osun', 'ife': 'osun', 'ilesa': 'osun',
        'lagos': 'lagos', 'ikeja': 'lagos', 'abuja': 'fct', 'gwagwalada': 'fct',
        'kano': 'kano', 'kaduna': 'kaduna', 'port harcourt': 'rivers',
        'benin city': 'edo', 'benin': 'edo', 'enugu': 'enugu',
        'onitsha': 'anambra', 'awka': 'anambra', 'nnewi': 'anambra',
        'calabar': 'cross_river', 'uyo': 'akwa_ibom', 'owerri': 'imo',
        'aba': 'abia', 'umuahia': 'abia', 'makurdi': 'benue', 'jos': 'plateau',
        'minna': 'niger', 'lokoja': 'kogi', 'ilorin': 'kwara', 'jalingo': 'taraba',
        'yola': 'adamawa', 'maiduguri': 'borno', 'gombe': 'gombe', 'bauchi': 'bauchi',
        'sokoto': 'sokoto', 'birnin kebbi': 'kebbi', 'gusau': 'zamfara',
        'damaturu': 'yobe', 'dutse': 'jigawa', 'katsina': 'katsina',
        'asaba': 'delta', 'warri': 'delta', 'yenagoa': 'bayelsa', 'abakaliki': 'ebonyi'
    };
    
    function getStateFromCoordinates(lat, lon) {
        var stateBoundaries = {
            'ondo': [5.9, 7.9, 4.5, 6.1], 'ekiti': [7.2, 8.1, 4.8, 5.9],
            'osun': [7.2, 8.2, 4.0, 5.0], 'oyo': [7.2, 9.1, 2.7, 4.6],
            'ogun': [6.4, 7.8, 2.7, 4.3], 'lagos': [6.4, 6.7, 2.7, 4.3],
            'fct': [8.6, 9.3, 6.7, 7.8], 'plateau': [8.6, 10.0, 8.5, 9.9],
            'nasarawa': [7.5, 9.5, 7.0, 9.0], 'kogi': [6.7, 8.8, 5.5, 7.9],
            'benue': [6.5, 8.1, 7.3, 9.6], 'niger': [8.2, 11.0, 3.5, 7.7],
            'kwara': [7.7, 9.6, 2.7, 6.0], 'kaduna': [9.0, 11.3, 6.2, 8.5],
            'kano': [10.5, 13.0, 7.6, 9.5], 'jigawa': [11.0, 13.5, 8.5, 10.5],
            'katsina': [11.5, 13.5, 6.9, 9.0], 'sokoto': [11.5, 13.9, 4.0, 6.9],
            'zamfara': [11.0, 13.2, 5.2, 7.2], 'kebbi': [10.5, 13.0, 3.5, 5.5],
            'rivers': [4.4, 5.3, 6.4, 7.6], 'bayelsa': [4.4, 5.5, 5.5, 6.8],
            'delta': [5.0, 6.5, 5.2, 6.9], 'edo': [5.8, 7.7, 5.4, 6.8],
            'anambra': [5.6, 6.9, 6.6, 7.3], 'enugu': [5.9, 7.3, 6.9, 7.9],
            'ebonyi': [5.7, 6.9, 7.7, 8.5], 'abia': [4.8, 6.1, 7.2, 8.1],
            'imo': [4.9, 6.1, 6.6, 7.6], 'akwa_ibom': [4.3, 5.6, 7.3, 8.4],
            'cross_river': [4.3, 6.9, 7.7, 9.4], 'adamawa': [7.2, 11.0, 11.0, 14.0],
            'taraba': [6.4, 9.3, 9.3, 12.0], 'gombe': [9.3, 11.2, 10.2, 12.0],
            'bauchi': [9.8, 12.3, 9.0, 11.0], 'yobe': [11.0, 13.5, 10.5, 13.0],
            'borno': [10.5, 13.9, 11.0, 14.5]
        };
        for (var state in stateBoundaries) {
            var b = stateBoundaries[state];
            if (lat >= b[0] && lat <= b[1] && lon >= b[2] && lon <= b[3]) return state;
        }
        return null;
    }

    function findStateFromCity(cityName) {
        if (!cityName) return null;
        var lc = cityName.toLowerCase().trim();
        if (cityToStateMapping[lc]) return cityToStateMapping[lc];
        for (var city in cityToStateMapping) {
            if (lc.indexOf(city) !== -1 || city.indexOf(lc) !== -1) return cityToStateMapping[city];
        }
        return null;
    }

    function findStateValue(stateName) {
        if (!stateName) return null;
        var lc = stateName.toLowerCase().trim();
        for (var key in stateNameMapping) {
            if (stateNameMapping[key].indexOf(lc) !== -1) return key;
        }
        for (var key2 in stateNameMapping) {
            for (var i = 0; i < stateNameMapping[key2].length; i++) {
                if (lc.indexOf(stateNameMapping[key2][i]) !== -1 || stateNameMapping[key2][i].indexOf(lc) !== -1) return key2;
            }
        }
        return null;
    }

    function findLGAFromAddress(addressData, stateValue) {
        if (!stateValue || !stateLGAs[stateValue]) return null;
        var lgas = stateLGAs[stateValue];
        var searchText = '';
        if (typeof addressData === 'string') {
            searchText = addressData.toLowerCase();
        } else if (typeof addressData === 'object') {
            var fields = ['city', 'town', 'municipality', 'county', 'suburb', 'village', 'district', 'local_government', 'lga'];
            if (addressData.display_name) searchText += ' ' + addressData.display_name.toLowerCase();
            if (addressData.address) {
                fields.forEach(function(f) { if (addressData.address[f]) searchText += ' ' + addressData.address[f].toLowerCase(); });
                if (addressData.address.city_district) searchText += ' ' + addressData.address.city_district.toLowerCase();
                if (addressData.address.state_district) searchText += ' ' + addressData.address.state_district.toLowerCase();
            }
        }
        for (var i = 0; i < lgas.length; i++) {
            if (searchText.indexOf(lgas[i].toLowerCase()) !== -1) return lgas[i];
        }
        for (var j = 0; j < lgas.length; j++) {
            var words = lgas[j].toLowerCase().split(/\s+/);
            var all = words.every(function(w) { return w.length <= 2 || searchText.indexOf(w) !== -1; });
            if (all) return lgas[j];
        }
        return null;
    }
    
    $('#autodetectLink').on('click', function(e) {
        e.preventDefault();
        var link = $(this);
        var originalText = link.text();
        var geolocationTimeout, watchId;
        link.text('Detecting location...').css('pointer-events', 'none');
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            link.text(originalText).css('pointer-events', 'auto');
            return;
        }
        
        function processGeocodingResponse(data, lat, lon) {
            if (!data) {
                alert('Could not retrieve address information. GPS coordinates have been set.');
                link.text(originalText).css('pointer-events', 'auto');
                return;
            }
            var address = data.address || {};
            var displayName = data.display_name || '';
            $('#addressInput').val(displayName);
            var stateValue = findStateFromCity(address.city || address.town || address.municipality || address.village || address.suburb || '');
            if (!stateValue) stateValue = findStateValue(address.state || address.region || address.province || address.state_district || address.county || '');
            if (!stateValue) stateValue = getStateFromCoordinates(lat, lon);
            if (!stateValue && displayName) {
                var dl = displayName.toLowerCase();
                for (var city in cityToStateMapping) {
                    if (dl.indexOf(city) !== -1) { stateValue = cityToStateMapping[city]; break; }
                }
                if (!stateValue) {
                    for (var key in stateNameMapping) {
                        for (var j = 0; j < stateNameMapping[key].length; j++) {
                            var sn = stateNameMapping[key][j];
                            if (sn.length >= 4 && new RegExp('\\b' + sn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(dl)) {
                                stateValue = key; break;
                            }
                        }
                        if (stateValue) break;
                    }
                }
                if (!stateValue) stateValue = getStateFromCoordinates(lat, lon);
            }
            if (stateValue) {
                $('#stateSelect').val(stateValue).trigger('change');
                var lgaName = findLGAFromAddress(data, stateValue);
                if (lgaName) {
                    setTimeout(function() {
                        var lgaValue = lgaName.toLowerCase().replace(/\s+/g, '_');
                        var lgaSelect = $('#lgaSelect');
                        if (!lgaSelect.find('option[value="' + lgaValue + '"]').length) {
                            lgaSelect.find('option').each(function() {
                                if ($(this).text().toLowerCase() === lgaName.toLowerCase()) { lgaSelect.val($(this).val()); return false; }
                            });
                        } else { lgaSelect.val(lgaValue); }
                    }, 500);
                }
            } else {
                alert('State could not be automatically detected. Please select manually.');
            }
            link.text(originalText).css('pointer-events', 'auto');
        }
        
        function reverseGeocode(lat, lon, attempt) {
            attempt = attempt || 1;
            link.text('Getting address... (' + attempt + '/2)');
            var services = [
                'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=16&addressdetails=1&countrycodes=ng&accept-language=en'),
                'https://corsproxy.io/?https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=16&addressdetails=1&countrycodes=ng&accept-language=en'
            ];
            $.ajax({
                url: services[Math.min(attempt - 1, services.length - 1)], method: 'GET', dataType: 'json', timeout: 10000,
                success: function(data) {
                    if (data && (data.address || data.display_name)) { processGeocodingResponse(data, lat, lon); }
                    else if (attempt < 2) { setTimeout(function() { reverseGeocode(lat, lon, attempt + 1); }, 1000); }
                    else { alert('Could not retrieve address information. Please fill in manually.'); link.text(originalText).css('pointer-events', 'auto'); }
                },
                error: function() {
                    if (attempt < 2) { setTimeout(function() { reverseGeocode(lat, lon, attempt + 1); }, 1000); }
                    else { alert('Error retrieving address. Please fill in manually.'); link.text(originalText).css('pointer-events', 'auto'); }
                }
            });
        }
        
        function handleSuccess(position) {
            if (watchId) navigator.geolocation.clearWatch(watchId);
            if (geolocationTimeout) clearTimeout(geolocationTimeout);
            var lat = position.coords.latitude, lon = position.coords.longitude;
            $('#gpsInput').val(lat + ', ' + lon);
            reverseGeocode(lat, lon, 1);
        }
        
        function handleError(error) {
            if (watchId) navigator.geolocation.clearWatch(watchId);
            if (geolocationTimeout) clearTimeout(geolocationTimeout);
            var msgs = { 1: 'Please allow location access in your browser settings.', 2: 'Location information is unavailable.', 3: 'Location request timed out. Please try again.' };
            alert('Error getting location: ' + (msgs[error.code] || 'An unknown error occurred.'));
            link.text(originalText).css('pointer-events', 'auto');
        }
        
        var opts = { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 };
        navigator.geolocation.getCurrentPosition(handleSuccess, function() {
            link.text('Getting accurate location...');
            watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, opts);
            geolocationTimeout = setTimeout(function() {
                if (watchId) navigator.geolocation.clearWatch(watchId);
                handleError({ code: 3 });
            }, 15000);
        }, opts);
    });

    // Debug helper: call from browser console
    // e.g. debugCategorize("Armed men broke into our shop and stole everything")
    window.debugCategorize = function(text) {
        console.log('=== debugCategorize START ===');
        console.log('Text:', text);
        var kb = classifyByKeywords(text);
        console.log('Keyword fallback ->', kb);
        classify_with_gemini(text, function(geminiResult) {
            console.log('Gemini result ->', geminiResult);
            console.log('Final (Gemini wins if set) ->', geminiResult || kb);
            console.log('=== debugCategorize END ===');
        });
    };

})(jQuery);