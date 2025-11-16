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
    
    // OpenAI API Key - Add your OpenAI API key here
    // Get your API key from: https://platform.openai.com/api-keys
    var OPENAI_API_KEY = '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'; // Add your OpenAI API key here
    
    // Issue categories list
    var issueCategories = {
        'robbery': {
            displayName: 'Robbery',
            color: '#d9534f',
            bgColor: '#f8d7da'
        },
        'road_accident': {
            displayName: 'Road Accident',
            color: '#f0ad4e',
            bgColor: '#fff3cd'
        },
        'fire_accident': {
            displayName: 'Fire Accident',
            color: '#d9534f',
            bgColor: '#f8d7da'
        },
        'cultism': {
            displayName: 'Cultism',
            color: '#5cb85c',
            bgColor: '#d4edda'
        },
        'assault': {
            displayName: 'Assault',
            color: '#d9534f',
            bgColor: '#f8d7da'
        },
        'kidnapping': {
            displayName: 'Kidnapping',
            color: '#d9534f',
            bgColor: '#f8d7da'
        },
        'vandalism': {
            displayName: 'Vandalism',
            color: '#5bc0de',
            bgColor: '#d1ecf1'
        },
        'domestic_violence': {
            displayName: 'Domestic Violence',
            color: '#d9534f',
            bgColor: '#f8d7da'
        },
        'sexual_assault': {
            displayName: 'Sexual Assault',
            color: '#6f42c1',
            bgColor: '#f3e8ff'
        },
        'child_sexual_abuse': {
            displayName: 'Child Sexual Abuse',
            color: '#e83e8c',
            bgColor: '#ffe6f0'
        },
        'armed_attack': {
            displayName: 'Armed Attack',
            color: '#d9534f',
            bgColor: '#f8d7da'
        },
        'shooting': {
            displayName: 'Shooting',
            color: '#d9534f',
            bgColor: '#f8d7da'
        },
        'other': {
            displayName: 'Other',
            color: '#6c757d',
            bgColor: '#e2e3e5'
        }
    };
    
    // Debounce timer for API calls
    var categorizationTimer = null;
    var lastCategorizedText = '';
    
    // Function to get category info (handles both predefined and dynamic categories)
    function getCategoryInfo(categoryName) {
        // Check if it's a predefined category
        if (issueCategories[categoryName]) {
            return issueCategories[categoryName];
        }
        
        // It's a dynamic category - create info for it
        // Use a default color scheme for new categories
        return {
            displayName: formatCategoryName(categoryName),
            color: '#6c757d',
            bgColor: '#e2e3e5'
        };
    }
    
    // Function to format category name (convert snake_case to Title Case)
    function formatCategoryName(category) {
        return category.split('_').map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }
    
    // Initialize Typo.js spell checker instance
    var typoChecker = null;
    
    // Initialize spell checker on document ready
    function initializeSpellChecker() {
        // Using dictionary-based corrections instead of Typo.js
        console.log('Spell checker initialized with dictionary-based corrections');
    }
    
    // Function to get best correction suggestion for a misspelled word
    function getBestCorrection(word) {
        if (!word || word.length < 2) {
            return null;
        }
        
        // Preserve original case
        var isCapitalized = word.charAt(0) === word.charAt(0).toUpperCase();
        var lowerWord = word.toLowerCase();
        
        if (typoChecker && typeof typoChecker.check === 'function') {
            try {
                // Check if word is correctly spelled
                if (typoChecker.check(lowerWord)) {
                    return null; // Word is correct
                }
                
                // Get suggestions
                var suggestions = typoChecker.suggest(lowerWord, 1); // Get top suggestion
                
                if (suggestions && suggestions.length > 0) {
                    var suggestion = suggestions[0];
                    
                    // Preserve original case
                    if (isCapitalized && suggestion.length > 0) {
                        suggestion = suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
                    }
                    
                    return suggestion;
                }
            } catch (e) {
                console.warn('Error checking spelling:', e);
            }
        }
        
        return null;
    }
    
    // Enhanced function to autocorrect misspelled English words in text
    function autocorrectText(text) {
        if (!text || text.trim().length === 0) {
            return text;
        }
        
        var correctedText = text;
        
        // Comprehensive dictionary of common misspellings and corrections
        var corrections = [
            // Protest related
            { wrong: /\bprotestin\b/gi, correct: 'protesting' },
            { wrong: /\bprotestor\b/gi, correct: 'protesters' },
            { wrong: /\bprotestrs\b/gi, correct: 'protesters' },
            { wrong: /\bdemonstratin\b/gi, correct: 'demonstrating' },
            { wrong: /\broad\s+blok\b/gi, correct: 'road block' },
            { wrong: /\broad\s+bloc\b/gi, correct: 'road block' },
            
            // Suicide related
            { wrong: /\bsuicid\b/gi, correct: 'suicide' },
            { wrong: /\bsuicde\b/gi, correct: 'suicide' },
            { wrong: /\bcommited\b/gi, correct: 'committed' },
            
            // Accident related
            { wrong: /\baccidnt\b/gi, correct: 'accident' },
            { wrong: /\baccidnet\b/gi, correct: 'accident' },
            { wrong: /\bacident\b/gi, correct: 'accident' },
            { wrong: /\bcollison\b/gi, correct: 'collision' },
            { wrong: /\bcollision\b/gi, correct: 'collision' },
            
            // Medical related
            { wrong: /\bunconsious\b/gi, correct: 'unconscious' },
            { wrong: /\bunconcious\b/gi, correct: 'unconscious' },
            { wrong: /\bbleeding\b/gi, correct: 'bleeding' },
            { wrong: /\bseizure\b/gi, correct: 'seizure' },
            
            // Kidnapping related
            { wrong: /\bkidnapin\b/gi, correct: 'kidnapping' },
            { wrong: /\bkidnaping\b/gi, correct: 'kidnapping' },
            { wrong: /\bkidnapped\b/gi, correct: 'kidnapped' },
            
            // Missing person related
            { wrong: /\bdisapeared\b/gi, correct: 'disappeared' },
            { wrong: /\bdisappeared\b/gi, correct: 'disappeared' },
            
            // Common misspellings
            { wrong: /\bthier\b/gi, correct: 'their' },
            { wrong: /\brecieve\b/gi, correct: 'receive' },
            { wrong: /\boccured\b/gi, correct: 'occurred' },
            { wrong: /\boccuring\b/gi, correct: 'occurring' },
            { wrong: /\boccassion\b/gi, correct: 'occasion' },
            { wrong: /\boccassional\b/gi, correct: 'occasional' },
            { wrong: /\barent\b/gi, correct: 'aren\'t' },
            { wrong: /\bdont\b/gi, correct: 'don\'t' },
            { wrong: /\bwont\b/gi, correct: 'won\'t' },
            { wrong: /\bcant\b/gi, correct: 'can\'t' },
            { wrong: /\bisnt\b/gi, correct: 'isn\'t' },
            { wrong: /\bhasnt\b/gi, correct: 'hasn\'t' },
            { wrong: /\bhavent\b/gi, correct: 'haven\'t' },
            { wrong: /\bwoudl\b/gi, correct: 'would' },
            { wrong: /\bshoudl\b/gi, correct: 'should' },
            { wrong: /\bcoudl\b/gi, correct: 'could' },
            { wrong: /\boccuring\b/gi, correct: 'occurring' },
            { wrong: /\bseperate\b/gi, correct: 'separate' },
            { wrong: /\bdefinately\b/gi, correct: 'definitely' },
            { wrong: /\bdefinite\b/gi, correct: 'definite' },
            { wrong: /\bdisapear\b/gi, correct: 'disappear' },
            { wrong: /\bneccessary\b/gi, correct: 'necessary' },
            { wrong: /\bneccessarily\b/gi, correct: 'necessarily' },
            { wrong: /\balot\b/gi, correct: 'a lot' },
            { wrong: /\bwierd\b/gi, correct: 'weird' },
            { wrong: /\bgoverment\b/gi, correct: 'government' },
            { wrong: /\benvirment\b/gi, correct: 'environment' },
            { wrong: /\bcivillian\b/gi, correct: 'civilian' },
            { wrong: /\bcivilan\b/gi, correct: 'civilian' },
            { wrong: /\bsuspicious\b/gi, correct: 'suspicious' },
            { wrong: /\bsuspision\b/gi, correct: 'suspicion' },
            { wrong: /\bterorist\b/gi, correct: 'terrorist' },
            { wrong: /\bterroism\b/gi, correct: 'terrorism' },
            { wrong: /\brob\b/gi, correct: 'rob' },
            { wrong: /\brobery\b/gi, correct: 'robbery' },
            { wrong: /\bvandal\b/gi, correct: 'vandal' },
            { wrong: /\bvandelism\b/gi, correct: 'vandalism' },
            { wrong: /\bassault\b/gi, correct: 'assault' },
            { wrong: /\bashamed\b/gi, correct: 'ashamed' },
            { wrong: /\bemphasize\b/gi, correct: 'emphasize' },
            { wrong: /\bemphasise\b/gi, correct: 'emphasise' },
            { wrong: /\bemergecy\b/gi, correct: 'emergency' },
            { wrong: /\bemergancy\b/gi, correct: 'emergency' },
            { wrong: /\bimmediately\b/gi, correct: 'immediately' },
            { wrong: /\bimmidiate\b/gi, correct: 'immediate' },
            { wrong: /\bimmidiatly\b/gi, correct: 'immediately' }
        ];
        
        // Apply all corrections
        for (var i = 0; i < corrections.length; i++) {
            correctedText = correctedText.replace(corrections[i].wrong, corrections[i].correct);
        }
        
        return correctedText;
    }
    
    // Function to categorize text using OpenAI
    function categorizeWithOpenAI(text, callback) {
        if (!text || text.trim().length < 10) {
            callback(null, null);
            return;
        }
        
        // Autocorrect misspellings before categorization
        text = autocorrectText(text);
        
        // Don't categorize if text hasn't changed
        if (text.trim() === lastCategorizedText) {
            return;
        }
        
        if (!OPENAI_API_KEY || OPENAI_API_KEY === '') {
            // Fallback to keyword-based categorization if no API key
            var category = categorizeByKeywords(text);
            if (category) {
                callback(category, null, 'keyword-match');
            } else {
                // If no keyword match, analyze text more deeply to suggest appropriate category
                var lowerText = text.toLowerCase();
                var suggestedCategory = null;
                
                // Suicide detection
                if (lowerText.indexOf('suicide') !== -1 || lowerText.indexOf('killed himself') !== -1 || lowerText.indexOf('killed herself') !== -1 || 
                    lowerText.indexOf('took his life') !== -1 || lowerText.indexOf('took her life') !== -1 || 
                    lowerText.indexOf('committed suicide') !== -1 || lowerText.indexOf('hanging') !== -1 || 
                    lowerText.indexOf('hanged') !== -1) {
                    suggestedCategory = 'suicide';
                }
                // Protest/Demonstration detection - check before traffic
                else if (lowerText.indexOf('protest') !== -1 || lowerText.indexOf('protesting') !== -1 || 
                    lowerText.indexOf('demonstration') !== -1 || lowerText.indexOf('demonstrating') !== -1 ||
                    lowerText.indexOf('rally') !== -1 || lowerText.indexOf('march') !== -1 ||
                    ((lowerText.indexOf('roadblock') !== -1 || lowerText.indexOf('road block') !== -1) && 
                     (lowerText.indexOf('people') !== -1 || lowerText.indexOf('protest') !== -1))) {
                    suggestedCategory = 'protest';
                }
                // Traffic congestion
                else if (lowerText.indexOf('traffic') !== -1 && (lowerText.indexOf('slow') !== -1 || lowerText.indexOf('congestion') !== -1 || lowerText.indexOf('heavy') !== -1 || lowerText.indexOf('jam') !== -1)) {
                    suggestedCategory = 'traffic_congestion';
                }
                // Medical emergency
                else if (lowerText.indexOf('medical') !== -1 || lowerText.indexOf('hospital') !== -1 || lowerText.indexOf('ambulance') !== -1 ||
                         lowerText.indexOf('heart attack') !== -1 || lowerText.indexOf('stroke') !== -1 || lowerText.indexOf('unconscious') !== -1 ||
                         lowerText.indexOf('bleeding') !== -1 || lowerText.indexOf('seizure') !== -1) {
                    suggestedCategory = 'medical_emergency';
                }
                // Natural disaster
                else if (lowerText.indexOf('flood') !== -1 || lowerText.indexOf('storm') !== -1 || lowerText.indexOf('earthquake') !== -1 ||
                         lowerText.indexOf('landslide') !== -1 || lowerText.indexOf('wildfire') !== -1) {
                    suggestedCategory = 'natural_disaster';
                }
                // Building collapse
                else if (lowerText.indexOf('building') !== -1 && (lowerText.indexOf('collapse') !== -1 || lowerText.indexOf('fell') !== -1 || lowerText.indexOf('collapsed') !== -1)) {
                    suggestedCategory = 'building_collapse';
                }
                // Missing person
                else if (lowerText.indexOf('missing') !== -1 || lowerText.indexOf('disappeared') !== -1 || lowerText.indexOf('lost') !== -1) {
                    suggestedCategory = 'missing_person';
                }
                // Drug related
                else if (lowerText.indexOf('drug') !== -1 || lowerText.indexOf('overdose') !== -1) {
                    suggestedCategory = 'drug_related';
                }
                // Threat or danger
                else if (lowerText.indexOf('danger') !== -1 || lowerText.indexOf('threat') !== -1 || lowerText.indexOf('threatening') !== -1) {
                    suggestedCategory = 'threat';
                }
                // Suspicious activity
                else if (lowerText.indexOf('suspicious') !== -1 || lowerText.indexOf('suspected') !== -1) {
                    suggestedCategory = 'suspicious_activity';
                }
                // Urgent help
                else if (lowerText.indexOf('help') !== -1 || lowerText.indexOf('urgent') !== -1) {
                    suggestedCategory = 'urgent_help';
                }
                
                // If we found a specific category, use it; otherwise analyze text to create one
                    if (suggestedCategory) {
                        callback(suggestedCategory, suggestedCategory, 'heuristic-match');
                    } else {
                        // Analyze text to derive a meaningful category
                        var derivedCategory = deriveCategoryFromText(text);
                        callback(derivedCategory, derivedCategory, 'derived-heuristic');
                    }
            }
            return;
        }
        
        var categoryList = Object.keys(issueCategories).join(', ');
        
    var prompt = 'You are an expert emergency report analyzer. Your task is to read the following text and determine the SINGLE BEST category that most accurately describes what happened. ' +
                    '\n\nANALYSIS PROCESS:' +
                    '\n1. Read the ENTIRE text carefully and understand the FULL CONTEXT.' +
                    '\n2. Identify the PRIMARY incident or event being reported.' +
                    '\n3. Determine what TYPE of emergency or incident this is.' +
                    '\n4. Choose the MOST SPECIFIC and ACCURATE category name.' +
                    '\n\nIMPORTANT RULES:' +
                    '\n- Protests, demonstrations, rallies, roadblocks with people protesting = "protest" (NOT road_incident or traffic_congestion)' +
                    '\n- Traffic congestion, slow traffic, or heavy traffic = "traffic_congestion" (NOT road_accident)' +
                    '\n- Road accident requires actual collision, crash, injury, or vehicle damage' +
                    '\n- Roadblock with protesting people = "protest" (NOT road_incident)' +
                    '\n- Suicide or self-inflicted death = "suicide"' +
                    '\n- Murder or homicide = "homicide" or "murder"' +
                    '\n- Medical issues (heart attack, stroke, unconscious, bleeding) = "medical_emergency"' +
                    '\n- Natural disasters (flood, storm, earthquake) = "natural_disaster"' +
                    '\n- Building/structure collapse = "building_collapse"' +
                    '\n- Missing person = "missing_person"' +
                    '\n- Theft, robbery, burglary = "robbery"' +
                    '\n- Fire = "fire_accident"' +
                    '\n- Assault or physical attack = "assault"' +
                    '\n- Kidnapping = "kidnapping"' +
                    '\n- Vandalism = "vandalism"' +
                    '\n- Cultism or gang violence = "cultism"' +
                    '\n- Domestic violence = "domestic_violence"' +
                    '\n\nPREFERRED CATEGORIES (use if text matches): ' + categoryList +
                    '\n\nIf the text does NOT match any preferred category, create a NEW SPECIFIC category in snake_case format.' +
                    '\nExamples of good new categories: cyber_crime, power_outage, gas_leak, water_shortage, noise_pollution, animal_attack, etc.' +
                    '\n\nNEVER use generic categories like "emergency_report", "incident_report", or "reported_incident".' +
                    '\nALWAYS choose the MOST SPECIFIC category that best describes what happened.' +
                    '\nThink carefully about what the text is REALLY describing, not just individual words.' +
                    '\n\nText to analyze: "' + text + '"' +
                    '\n\nRespond with ONLY the category name in snake_case format, nothing else.';
        
        // Use CORS proxy if needed (OpenAI API may have CORS restrictions)
        var apiUrl = 'https://api.openai.com/v1/chat/completions';
        // Alternative: Use a CORS proxy if direct calls fail
        // var apiUrl = 'https://corsproxy.io/?https://api.openai.com/v1/chat/completions';
        
        // Prefer machine-parseable JSON output from the model to reduce misinterpretation
        var jsonPrompt = prompt + "\n\nIMPORTANT: Respond with a single valid JSON object ONLY (no additional text). The JSON must have these keys: \n{\n  \"category\": string,        // single best category in snake_case\n  \"confidence\": number,     // model confidence 0.0-1.0\n  \"reason\": string          // short plain-language explanation of why this category\n}\n\nRespond ONLY with the JSON object and nothing else.\n";

        $.ajax({
            url: apiUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + OPENAI_API_KEY
            },
            data: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert emergency report categorizer with deep understanding of incident types. Your goal is to identify the SINGLE BEST category that most accurately describes the reported incident. Read the ENTIRE text, understand the FULL CONTEXT, identify the PRIMARY incident, and choose the MOST SPECIFIC category. NEVER use generic categories. ALWAYS be specific and accurate. Consider the context, not just keywords. Examples: protest (for protests, demonstrations, roadblocks with people protesting), suicide (for self-inflicted death), homicide (for murder), medical_emergency (for health issues), traffic_congestion (for slow traffic, NOT accidents), road_accident (only for actual crashes/collisions), robbery (for theft), fire_accident (for fires), assault (for physical attacks), etc. Be intelligent, context-aware, and precise.\nIMPORTANT: return a single valid JSON object with keys category, confidence (0.0-1.0), and reason. Do not include any other text.'
                    },
                    {
                        role: 'user',
                        content: jsonPrompt
                    }
                ],
                max_tokens: 50,
                temperature: 0.2
            }),
            timeout: 10000,
            success: function(response) {
                if (response && response.choices && response.choices.length > 0) {
                    var raw = response.choices[0].message.content.trim();
                    var parsed = null;
                    try {
                        // Some models may include stray text; try to extract JSON from the reply
                        var firstBrace = raw.indexOf('{');
                        var lastBrace = raw.lastIndexOf('}');
                        if (firstBrace !== -1 && lastBrace !== -1) {
                            var jsonText = raw.substring(firstBrace, lastBrace + 1);
                            parsed = JSON.parse(jsonText);
                        } else {
                            parsed = JSON.parse(raw);
                        }
                    } catch (e) {
                        console.warn('OpenAI returned non-JSON or malformed JSON:', raw);
                    }

                    var category = null;
                    var confidence = 0.0;
                    var reason = '';
                    if (parsed && parsed.category) {
                        category = String(parsed.category).toLowerCase().trim();
                        confidence = parseFloat(parsed.confidence) || 0.0;
                        reason = String(parsed.reason || '');
                    }

                    // Post-processing safety checks: if the model output is missing or low-confidence, fallback to local heuristics
                    var lowerText = text.toLowerCase();
                    var highRiskKeywords = /\b(kill|murder|suicide|rape|rape(d)?|molest|molested|defile|defiled|child|boy|girl|baby|stab|shoot|gun|weapon)\b/i;
                    if (!category || category.length === 0 || confidence < 0.4) {
                        // If high-risk keywords exist, use local heuristics which are conservative
                        if (highRiskKeywords.test(lowerText)) {
                            var local = categorizeByKeywords(text);
                            if (local) {
                                category = local;
                            } else {
                                category = deriveCategoryFromText(text);
                            }
                        } else {
                            // Non high-risk: prefer derived category when AI is unsure
                            category = deriveCategoryFromText(text);
                        }
                    }

                    // Prevent generic categories
                    if (category === 'emergency_report' || category === 'incident_report' || category === 'reported_incident' || /\bincident\b/.test(category)) {
                        category = deriveCategoryFromText(text);
                    }
                    
                    // Ensure it's not a generic category
                    if (category === 'emergency_report' || category === 'incident_report' || category === 'reported_incident') {
                        // Fallback to intelligent text analysis
                        var derivedCategory = deriveCategoryFromText(text);
                        lastCategorizedText = text.trim();
                        callback(derivedCategory, derivedCategory);
                        return;
                    }
                    
                    // If category matches predefined one, use it
                    if (issueCategories[category]) {
                        lastCategorizedText = text.trim();
                        callback(category, null, reason);
                    } else {
                        // It's a new category suggested by OpenAI
                        lastCategorizedText = text.trim();
                        callback(category, category, reason); // Pass the category name as both parameters
                    }
                } else {
                    // Fallback to intelligent text analysis
                    var fallbackCategory = categorizeByKeywords(text);
                    if (fallbackCategory) {
                        callback(fallbackCategory, null, 'fallback-keyword');
                    } else {
                        var derivedCategory = deriveCategoryFromText(text);
                        callback(derivedCategory, derivedCategory, 'fallback-derived');
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('OpenAI API Error:', status, error, xhr.responseText);
                // Fallback to keyword-based categorization
                var fallbackCategory = categorizeByKeywords(text);
                if (fallbackCategory) {
                    callback(fallbackCategory, null, 'error-fallback-keyword');
                } else {
                    // If no keyword match and API fails, analyze text more deeply
                    var lowerText = text.toLowerCase();
                    var suggestedCategory = null;
                    
                    // Suicide detection
                    if (lowerText.indexOf('suicide') !== -1 || lowerText.indexOf('killed himself') !== -1 || lowerText.indexOf('killed herself') !== -1 || 
                        lowerText.indexOf('took his life') !== -1 || lowerText.indexOf('took her life') !== -1 || 
                        lowerText.indexOf('committed suicide') !== -1 || lowerText.indexOf('hanging') !== -1 || 
                        lowerText.indexOf('hanged') !== -1) {
                        suggestedCategory = 'suicide';
                    }
                    // Protest/Demonstration detection - check before traffic
                    else if (lowerText.indexOf('protest') !== -1 || lowerText.indexOf('protesting') !== -1 || 
                        lowerText.indexOf('demonstration') !== -1 || lowerText.indexOf('demonstrating') !== -1 ||
                        lowerText.indexOf('rally') !== -1 || lowerText.indexOf('march') !== -1 ||
                        ((lowerText.indexOf('roadblock') !== -1 || lowerText.indexOf('road block') !== -1) && 
                         (lowerText.indexOf('people') !== -1 || lowerText.indexOf('protest') !== -1))) {
                        suggestedCategory = 'protest';
                    }
                    // Traffic congestion
                    else if (lowerText.indexOf('traffic') !== -1 && (lowerText.indexOf('slow') !== -1 || lowerText.indexOf('congestion') !== -1 || lowerText.indexOf('heavy') !== -1 || lowerText.indexOf('jam') !== -1)) {
                        suggestedCategory = 'traffic_congestion';
                    }
                    // Medical emergency
                    else if (lowerText.indexOf('medical') !== -1 || lowerText.indexOf('hospital') !== -1 || lowerText.indexOf('ambulance') !== -1 ||
                             lowerText.indexOf('heart attack') !== -1 || lowerText.indexOf('stroke') !== -1 || lowerText.indexOf('unconscious') !== -1 ||
                             lowerText.indexOf('bleeding') !== -1 || lowerText.indexOf('seizure') !== -1) {
                        suggestedCategory = 'medical_emergency';
                    }
                    // Natural disaster
                    else if (lowerText.indexOf('flood') !== -1 || lowerText.indexOf('storm') !== -1 || lowerText.indexOf('earthquake') !== -1 ||
                             lowerText.indexOf('landslide') !== -1 || lowerText.indexOf('wildfire') !== -1) {
                        suggestedCategory = 'natural_disaster';
                    }
                    // Building collapse
                    else if (lowerText.indexOf('building') !== -1 && (lowerText.indexOf('collapse') !== -1 || lowerText.indexOf('fell') !== -1 || lowerText.indexOf('collapsed') !== -1)) {
                        suggestedCategory = 'building_collapse';
                    }
                    // Missing person
                    else if (lowerText.indexOf('missing') !== -1 || lowerText.indexOf('disappeared') !== -1 || lowerText.indexOf('lost') !== -1) {
                        suggestedCategory = 'missing_person';
                    }
                    // Drug related
                    else if (lowerText.indexOf('drug') !== -1 || lowerText.indexOf('overdose') !== -1) {
                        suggestedCategory = 'drug_related';
                    }
                    // Threat or danger
                    else if (lowerText.indexOf('danger') !== -1 || lowerText.indexOf('threat') !== -1 || lowerText.indexOf('threatening') !== -1) {
                        suggestedCategory = 'threat';
                    }
                    // Suspicious activity
                    else if (lowerText.indexOf('suspicious') !== -1 || lowerText.indexOf('suspected') !== -1) {
                        suggestedCategory = 'suspicious_activity';
                    }
                    // Urgent help
                    else if (lowerText.indexOf('help') !== -1 || lowerText.indexOf('urgent') !== -1) {
                        suggestedCategory = 'urgent_help';
                    }
                    
                    // If we found a specific category, use it; otherwise analyze text to create one
                    if (suggestedCategory) {
                        callback(suggestedCategory, suggestedCategory, 'error-heuristic');
                    } else {
                        // Analyze text to derive a meaningful category
                        var derivedCategory = deriveCategoryFromText(text);
                        callback(derivedCategory, derivedCategory, 'error-derived');
                    }
                }
            }
        });
    }
    
    // Intelligent function to derive the best category from text
    function deriveCategoryFromText(text) {
        // Autocorrect misspellings before analysis
        text = autocorrectText(text);
        var lowerText = text.toLowerCase().trim();
        var words = lowerText.split(/\s+/);
        
        // Priority-based pattern matching - check most specific patterns first
        var patterns = [
            // Suicide patterns
            { pattern: /\b(committed\s+suicide|killed\s+(himself|herself)|took\s+(his|her)\s+life|hanging|hanged\s+himself|hanged\s+herself)\b/i, category: 'suicide' },
            { pattern: /\bsuicide\b/i, category: 'suicide' },
            
            // Homicide/Murder patterns
            { pattern: /\b(murdered|killed\s+(a|the|someone)|homicide|assassination)\b/i, category: 'homicide' },
            { pattern: /\bmurder\b/i, category: 'homicide' },
            
            // Protest/Demonstration patterns - check before traffic patterns
            { pattern: /\b(protest|protesting|protesters|demonstration|demonstrating|demonstrators|rally|rallies|march|marching|roadblock|road\s+block|blocking\s+road|blocked\s+road|people\s+out\s+protesting|people\s+protesting|crowd\s+protesting)\b/i, category: 'protest' },
            { pattern: /\b(roadblock|road\s+block|blocking\s+the\s+road|blocked\s+the\s+road)\b/i, category: 'protest' },
            
            // Traffic patterns - must distinguish congestion from accident
            { pattern: /\b(traffic\s+(slow|heavy|congestion|jam)|slow\s+traffic|heavy\s+traffic|traffic\s+congestion)\b/i, category: 'traffic_congestion' },
            { pattern: /\b(road\s+accident|car\s+crash|vehicle\s+crash|collision|vehicles?\s+collided|car\s+crashed)\b/i, category: 'road_accident' },
            { pattern: /\b(accident|crash|crashed)\b/i, category: 'road_accident' },
            
            // Medical emergency patterns
            { pattern: /\b(heart\s+attack|stroke|seizure|unconscious|passed\s+out|fainted|bleeding|severe\s+pain|chest\s+pain|can't\s+breathe|choking|allergic\s+reaction)\b/i, category: 'medical_emergency' },
            { pattern: /\b(medical\s+emergency|hospital|ambulance|injury|injured)\b/i, category: 'medical_emergency' },
            
            // Fire patterns
            { pattern: /\b(fire|burning|burned|burnt|flame|flames|smoke|blaze|explosion|exploded|inferno|arson)\b/i, category: 'fire_accident' },
            
            // Robbery/Theft patterns
            { pattern: /\b(robbery|robbed|stolen|theft|thief|thieves|steal|stealing|burglary|burglar|mugging|mugged|snatch|snatched|pickpocket|armed\s+robbery|break\s+in|break-in|stole|loot|looting)\b/i, category: 'robbery' },
            
            // Assault patterns
            { pattern: /\b(assault|attacked|beating|beaten|battery|physical\s+attack|violence|violent|harm|harmed|hurt|hurting)\b/i, category: 'assault' },
            
            // Kidnapping patterns
            { pattern: /\b(kidnap|kidnapping|kidnapped|abduct|abducted|abduction|hostage|hostages|ransom|taken)\b/i, category: 'kidnapping' },
            
            // Missing person patterns
            { pattern: /\b(missing\s+(person|child|people)|disappeared|lost|can't\s+find|haven't\s+seen|last\s+seen)\b/i, category: 'missing_person' },
            
            // Vandalism patterns
            { pattern: /\b(vandalism|vandalize|vandalized|destruction|destroyed|damage|damaged|graffiti|defaced|property\s+damage)\b/i, category: 'vandalism' },
            
            // Domestic violence patterns
            { pattern: /\b(domestic\s+violence|domestic\s+abuse|spouse|partner|wife|husband|family\s+violence|home\s+violence|intimate\s+partner)\b/i, category: 'domestic_violence' },
            
            // Cultism patterns
            { pattern: /\b(cult|cultism|cultist|cultists|gang|gangs|gangster|gangsters|secret\s+society|fraternity)\b/i, category: 'cultism' },
            
            // Natural disaster patterns
            { pattern: /\b(flood|flooding|flooded|storm|hurricane|tornado|earthquake|landslide|mudslide|tsunami|wildfire|drought|avalanche)\b/i, category: 'natural_disaster' },
            
            // Building collapse patterns
            { pattern: /\b(building\s+collapse|building\s+collapsed|structure\s+collapse|roof\s+collapse|wall\s+collapse|building\s+fell|structure\s+fell|construction\s+accident)\b/i, category: 'building_collapse' },
            
            // Drug related patterns
            { pattern: /\b(drug|drugs|overdose|overdosed|drug\s+dealer|drug\s+dealing|substance\s+abuse|narcotics|illegal\s+drugs|drug\s+trafficking)\b/i, category: 'drug_related' },
            
            // Shooting/armed attack patterns - check before generic weapon
            { pattern: /\b(shooting|shoot|shot|gunfire|gun\s+fire|firing|shooter)\b/i, category: 'shooting' },
            { pattern: /\b(armed|weapon|gun|knife|pistol|rifle|machete|stab|stabbing|stabbed|blade)\b/i, category: 'armed_attack' },
            
            // Explosion/Bomb patterns
            { pattern: /\b(bomb|explosion|exploded|explosive|bomb\s+threat)\b/i, category: 'bomb_threat' },
            
            // Fight patterns
            { pattern: /\b(fight|fighting|fought|brawl|brawling|conflict|confrontation)\b/i, category: 'fight' },
            
            // Public disturbance patterns
            { pattern: /\b(public\s+disturbance|disturbance|noise|noise\s+disturbance|trespass|trespassing)\b/i, category: 'public_disturbance' },
            
            // Threat patterns
            { pattern: /\b(threat|threatening|danger|dangerous|risk)\b/i, category: 'threat' },
            
            // Suspicious activity patterns
            { pattern: /\b(suspicious|suspected|suspicion)\b/i, category: 'suspicious_activity' }
        ];

        // High-priority sexual assault detection (before other patterns)
        if (/\b(rape|raped|sexual assault|sexually assaulted|forced to have sex|forcefully slept with|molest|molested|molestation|sexual abuse|sex abuse|defile|defiled)\b/i.test(lowerText)) {
            var ageMatch = lowerText.match(/(\b(\d{1,2})\s*(years|yrs|year|y|months|mos)\b)/i);
            if (ageMatch && parseInt(ageMatch[2], 10) <= 16) {
                return 'child_sexual_abuse';
            }
            return 'sexual_assault';
        }
        
        // Check patterns and collect ALL matches (for multi-category support)
        var matchedCategories = [];
        for (var i = 0; i < patterns.length; i++) {
            if (patterns[i].pattern.test(lowerText)) {
                if (!matchedCategories.includes(patterns[i].category)) {
                    matchedCategories.push(patterns[i].category);
                }
            }
        }

        // Post-check: detect attempts or threats mentioning someone (e.g., "trying to kill himself", "trying to kill someone")
        // Stronger suicidal attempt patterns
        var suicideAttemptPatterns = [
            /\b(trying\s+to\s+kill\s+(himself|herself|themselves|him|her))\b/i,
            /\b(attempted\s+suicide|attempting\s+suicide|attempts?\s+suicide)\b/i,
            /\b(trying\s+to\s+kill\s+him|trying\s+to\s+kill\s+her)\b/i,
            /\b(kill\s+himself|kill\s+herself|kill\s+themselves|kill\s+myself|kill\s+yourself)\b/i
        ];
        for (var s = 0; s < suicideAttemptPatterns.length; s++) {
            if (suicideAttemptPatterns[s].test(lowerText)) {
                if (!matchedCategories.includes('suicide')) {
                    matchedCategories.push('suicide');
                }
            }
        }

        // Stronger homicide/threat patterns
        var homicidePatterns = [
            /\b(trying\s+to\s+kill\b|trying\s+to\s+murder\b|planning\s+to\s+kill\b|threaten(ed)?\s+to\s+kill)\b/i,
            /\b(kill\s+him|kill\s+her|kill\s+himself|kill\s+herself|murdered|murder)\b/i
        ];
        for (var h = 0; h < homicidePatterns.length; h++) {
            if (homicidePatterns[h].test(lowerText)) {
                // Differentiate self-harm from homicide — some patterns above overlap
                if (/\b(himself|herself|myself|yourself|themselves)\b/i.test(lowerText)) {
                    if (!matchedCategories.includes('suicide')) {
                        matchedCategories.push('suicide');
                    }
                } else {
                    if (!matchedCategories.includes('homicide')) {
                        matchedCategories.push('homicide');
                    }
                }
            }
        }

        // If we found multiple matches, return them comma-separated
        if (matchedCategories.length > 0) {
            return matchedCategories.join(', ');
        }
        
        // Advanced pattern extraction for complex sentences
        var advancedPatterns = [
            // "a man just committed X" or "X just happened"
            /(?:a|an|the)\s+(\w+)\s+(?:just|recently|has|have|had)?\s*(?:committed|did|happened|occurred|going\s+on)/i,
            // "there is X" or "there was X"
            /(?:there\s+is|there\s+are|there\s+was|there\s+were)\s+(?:a|an|the)?\s*(\w+)/i,
            // "I saw X" or "we noticed X"
            /(?:i|we|they)\s+(?:saw|see|seen|noticed|witnessed|reported)\s+(?:a|an|the)?\s*(\w+)/i,
            // "X in my area/street"
            /(\w+)\s+(?:in|on|at)\s+(?:my|the|this|that)\s+(?:area|street|road|neighborhood|place)/i
        ];
        
        for (var p = 0; p < advancedPatterns.length; p++) {
            var match = lowerText.match(advancedPatterns[p]);
            if (match && match[1]) {
                var incidentWord = match[1].toLowerCase();
                // Filter out common words and check if it's meaningful
                if (incidentWord.length > 3 && 
                    !['this', 'that', 'what', 'when', 'where', 'which', 'there', 'here', 'some', 'many', 'most', 'just', 'very', 'really'].includes(incidentWord)) {
                    // Check if it's already a known category word
                    for (var j = 0; j < patterns.length; j++) {
                        if (lowerText.indexOf(patterns[j].category.replace('_', ' ')) !== -1 || 
                            lowerText.indexOf(patterns[j].category) !== -1) {
                            return patterns[j].category;
                        }
                    }
                    // If incidentWord looks like a person's name (capitalized in original text or short), avoid returning 'name_incident'
                    var originalMatch = text.match(new RegExp('\\b' + match[1] + '\\b'));
                    var looksLikeName = false;
                    if (originalMatch) {
                        var origToken = originalMatch[0];
                        // crude check: contains a capital letter in original text or is a single proper noun
                        if (/[A-Z]/.test(origToken.charAt(0))) {
                            looksLikeName = true;
                        }
                    }

                    if (looksLikeName) {
                        // Look for verbs indicating self-harm or violence to decide category
                        if (/\b(kill|kill(ed)?|murder|murdered|suicide|attempt(ed)?|trying\s+to\s+kill|trying\s+to\s+murder|attack|stab|shoot)\b/i.test(lowerText)) {
                            // prioritize suicide if self-harm pronouns present
                            if (/\b(himself|herself|myself|yourself|themselves)\b/i.test(lowerText)) {
                                return 'suicide';
                            }
                            // otherwise treat as homicide/threat
                            return 'homicide';
                        }

                        // If no violence/self-harm verbs, avoid fabricating a 'name_incident' category
                        // Fall through to other heuristics
                    }

                    // Generate meaningful category combining verb + noun: e.g., "stabbing_emergency", "shooting_attack"
                    var actionMatch = lowerText.match(/\b(stabbing|stabbed|shooting|shot|hitting|hit|burning|burned|attacking|attacked|robbing|robbed|stealing|stolen|fighting|fought)\b/i);
                    if (actionMatch) {
                        return actionMatch[1].toLowerCase() + '_' + incidentWord;
                    }

                    return incidentWord + '_emergency';
                }
            }
        }
        
        // Extract meaningful nouns/verbs (filter out stop words)
        var stopWords = ['there', 'this', 'that', 'what', 'when', 'where', 'which', 'about', 
                         'after', 'before', 'during', 'their', 'there', 'these', 'those',
                         'could', 'would', 'should', 'might', 'may', 'must', 'have', 'has',
                         'been', 'being', 'were', 'was', 'are', 'is', 'am', 'just', 'very',
                         'really', 'quite', 'some', 'many', 'most', 'more', 'much', 'very',
                         'also', 'still', 'even', 'only', 'just', 'now', 'then', 'here'];
        
        var importantWords = words.filter(function(word) {
            word = word.replace(/[^a-z]/g, '');
            return word.length > 4 && !stopWords.includes(word);
        });
        
        if (importantWords.length > 0) {
            // Prioritize action words (verbs) over nouns
            var actionWords = ['happened', 'occurred', 'committed', 'reported', 'witnessed', 
                              'noticed', 'seen', 'going', 'taking', 'causing', 'creating'];
            
            for (var a = 0; a < importantWords.length; a++) {
                if (actionWords.includes(importantWords[a])) {
                    // Look for the noun before or after the action word
                    if (a > 0) {
                        var categoryWord = importantWords[a - 1].replace(/[^a-z]/g, '');
                        if (categoryWord.length > 3) {
                            // If categoryWord is generic like 'block' or 'road', decide between protest and traffic
                            if (/\b(block|road|roadblock|blocking|blocked)\b/i.test(categoryWord)) {
                                // If text mentions people/protest keywords, use protest
                                if (/\b(people|protest|protesting|demonstration|crowd|rally|march)\b/i.test(lowerText)) {
                                    return 'protest';
                                }
                                // If text mentions traffic-related words, use traffic_congestion
                                if (/\b(traffic|congestion|heavy|jam|slow)\b/i.test(lowerText)) {
                                    return 'traffic_congestion';
                                }
                                // Default to protest because 'blocking the road' often implies protest
                                return 'protest';
                            }

                            // Generate meaningful category from action + noun: e.g., "stabbing_attack", "vehicle_accident"
                            var actionWord = importantWords[a].replace(/[^a-z]/g, '');
                            return actionWord + '_' + categoryWord;
                        }
                    }
                }
            }
            
            // Use the most significant word (usually first meaningful word)
            var categoryWord = importantWords[0].replace(/[^a-z]/g, '');
            if (categoryWord.length > 3) {
                // Handle generic words like 'block' specially
                if (/\b(block|road|roadblock|blocking|blocked)\b/i.test(categoryWord)) {
                    if (/\b(people|protest|protesting|demonstration|crowd|rally|march)\b/i.test(lowerText)) {
                        return 'protest';
                    }
                    if (/\b(traffic|congestion|heavy|jam|slow)\b/i.test(lowerText)) {
                        return 'traffic_congestion';
                    }
                    return 'protest';
                }

                // Look for nearby verbs to create descriptive category
                var nearbyVerbs = /\b(stabbing|stabbed|shooting|shot|hitting|hit|burning|burned|attacking|attacked|robbing|robbed|stealing|stolen|fighting|fought)\b/i.exec(lowerText);
                if (nearbyVerbs) {
                    return nearbyVerbs[1].toLowerCase() + '_' + categoryWord;
                }

                // Create category from meaningful word + context clues
                return categoryWord + '_emergency';
            }
        }
        
        // Last resort - extract meaningful action-based category from text
        var lastResortMatch = lowerText.match(/\b(stabbing|shooting|hitting|burning|attacking|robbery|theft|assault|threat|emergency|danger|crisis)\b/i);
        if (lastResortMatch) {
            return lastResortMatch[1].toLowerCase() + '_emergency';
        }
        
        // Final fallback - extract first meaningful descriptive word
        for (var w = 0; w < words.length; w++) {
            var word = words[w].replace(/[^a-z]/g, '');
            if (word.length > 4 && !stopWords.includes(word)) {
                return word + '_emergency';
            }
        }
        
        // Should never reach here, but provide a meaningful fallback
        return 'emergency_report';
    }
    
    // Fallback keyword-based categorization
    function categorizeByKeywords(text) {
        // Autocorrect misspellings before keyword matching
        text = autocorrectText(text);
        var lowerText = text.toLowerCase();
        
        // Robbery keywords - must indicate actual theft/robbery
        if (/\b(robbery|rob|robbed|stolen|theft|thief|thieves|steal|stealing|burglary|burglar|mugging|mugged|snatch|snatched|pickpocket|armed robbery|break in|break-in|stole|loot|looting)\b/i.test(lowerText)) {
            return 'robbery';
        }
        
        // Road accident keywords - must indicate actual accident/crash, not just traffic
        // Require accident-related words, not just traffic/road words
        if (/\b(accident|crash|crashed|collision|collided|hit by|hit a|hitting a|hitting the|vehicle crash|car crash|truck crash|bus crash|motorcycle crash|bike crash|road accident|highway accident|injured in|injury from|fatal accident|casualty|casualties|ambulance|wreck|wrecked|overturned|overturn|vehicles collided|cars collided|collision between)\b/i.test(lowerText)) {
            return 'road_accident';
        }
        
        // Fire accident keywords
        if (/\b(fire|burning|burned|burnt|flame|flames|smoke|smoking|blaze|blazing|explosion|explode|exploded|burn|inferno|arson|ignite|ignited|combustion|firefighter|fire fighter|fire department)\b/i.test(lowerText)) {
            return 'fire_accident';
        }
        
        // Cultism keywords
        if (/\b(cult|cultism|cultist|cultists|gang|gangs|gangster|gangsters|violence|violent|attack|attacked|assault|assaulted|fight|fighting|fought|conflict|confrontation|rival|rivals|secret society|fraternity)\b/i.test(lowerText)) {
            return 'cultism';
        }
        
        // Assault keywords
        if (/\b(assault|attacked|beating|beaten|battery|physical attack|violence|violent|harm|harmed|hurt|hurting)\b/i.test(lowerText)) {
            return 'assault';
        }
        
        // Kidnapping keywords
        if (/\b(kidnap|kidnapping|kidnapped|abduct|abducted|abduction|hostage|hostages|ransom|taken|missing person)\b/i.test(lowerText)) {
            return 'kidnapping';
        }
        
        // Vandalism keywords
        if (/\b(vandalism|vandalize|vandalized|destruction|destroyed|damage|damaged|graffiti|defaced|property damage)\b/i.test(lowerText)) {
            return 'vandalism';
        }
        
        // Domestic violence keywords
        if (/\b(domestic violence|domestic abuse|spouse|partner|wife|husband|family violence|home violence|intimate partner)\b/i.test(lowerText)) {
            return 'domestic_violence';
        }
        
        // Suicide keywords
        if (/\b(suicide|suicidal|killed himself|killed herself|took his life|took her life|committed suicide|self harm|self-harm|hanging|hanged|overdose|overdosed|jumped|jumping)\b/i.test(lowerText)) {
            return 'suicide';
        }

        // Sexual assault / child sexual abuse keywords
        if (/\b(rape|raped|sexual assault|sexually assaulted|forced to have sex|forcefully slept with|molest|molested|molestation|sexual abuse|sex abuse|defile|defiled)\b/i.test(lowerText)) {
            // detect age mentions near the sexual terms
            var ageMatch = lowerText.match(/(\b(\d{1,2})\s*(years|yrs|year|y|months|mos)\b)/i);
            if (ageMatch && parseInt(ageMatch[2], 10) <= 16) {
                return 'child_sexual_abuse';
            }
            return 'sexual_assault';
        }
        
        // Medical emergency keywords
        if (/\b(medical emergency|heart attack|stroke|seizure|unconscious|passed out|fainted|bleeding|severe pain|chest pain|difficulty breathing|can't breathe|choking|allergic reaction|diabetic|epilepsy|convulsion)\b/i.test(lowerText)) {
            return 'medical_emergency';
        }
        
        // Natural disaster keywords
        if (/\b(flood|flooding|flooded|storm|hurricane|tornado|earthquake|landslide|mudslide|tsunami|wildfire|drought|avalanche)\b/i.test(lowerText)) {
            return 'natural_disaster';
        }
        
        // Building/structure collapse keywords
        if (/\b(building collapse|building collapsed|structure collapse|roof collapse|wall collapse|building fell|structure fell|construction accident)\b/i.test(lowerText)) {
            return 'building_collapse';
        }
        
        // Missing person keywords
        if (/\b(missing person|missing child|missing|disappeared|lost|can't find|haven't seen|last seen)\b/i.test(lowerText)) {
            return 'missing_person';
        }
        
        // Drug-related keywords
        if (/\b(drug|drugs|overdose|overdosed|drug dealer|drug dealing|substance abuse|narcotics|illegal drugs|drug trafficking)\b/i.test(lowerText)) {
            return 'drug_related';
        }
        
        // Shooting/armed attack keywords
        if (/\b(shooting|shoot|shot|gunfire|gun\s+fire|firing|shooter)\b/i.test(lowerText)) {
            return 'shooting';
        }
        
        if (/\b(armed|weapon|gun|knife|pistol|rifle|machete|stab|stabbing|stabbed|blade|armed robbery|armed attack)\b/i.test(lowerText)) {
            return 'armed_attack';
        }
        
        // If no specific category found, return null to let OpenAI suggest a new category
        return null;
    }
    
    // Auto-categorize textarea input with debouncing
    $(document).ready(function() {
        console.log('Document ready - setting up textarea autocorrection');
        
        // Initialize spell checker for comprehensive autocorrection
        initializeSpellChecker();
        
        // Ensure elements exist
        if ($('#urgentCaseTextarea').length === 0) {
            console.error('Textarea #urgentCaseTextarea not found');
            return;
        }
        if ($('#issueCategoryTag').length === 0) {
            console.error('Tag element #issueCategoryTag not found');
            return;
        }
        
        console.log('Elements found, attaching input and blur event listeners');

        $('#urgentCaseTextarea').on('input', function() {
            var text = $(this).val();
            var tagElement = $('#issueCategoryTag');
            var textarea = $(this);

            // DEBUG
            if (text && text.length > 0) {
                console.log('Input event fired. Text length:', text.length);
            }

            // Clear previous timer
            if (categorizationTimer) {
                clearTimeout(categorizationTimer);
            }

            // Hide tag if text is empty
            if (!text || text.trim().length === 0) {
                tagElement.css('display', 'none');
                lastCategorizedText = '';
                return;
            }

            // Show loading state when text is long enough
            if (text.trim().length >= 10) {
                tagElement.text('Analyzing...')
                          .css({
                              'display': 'inline-block',
                              'background': '#e2e3e5',
                              'color': '#6c757d'
                          });
            }

            // Debounce: treat user as finished after 1.5s of inactivity
            categorizationTimer = setTimeout(function() {
                var currentText = textarea.val();

                // Apply autocorrection once user finished typing
                var correctedText = autocorrectText(currentText);

                if (correctedText !== currentText) {
                    console.log('✓ AUTOCORRECTION APPLIED (on pause)');
                    console.log('  Original:', currentText);
                    console.log('  Corrected:', correctedText);
                    try {
                        // Update textarea and place cursor at end
                        textarea.val(correctedText);
                        var len = correctedText.length;
                        textarea[0].setSelectionRange(len, len);
                    } catch (e) {
                        console.warn('Could not update textarea selection after autocorrect');
                    }
                } else {
                    console.log('No corrections needed (on pause)');
                }

                // Now categorize the corrected text
                categorizeWithOpenAI(correctedText, function(category, dynamicCategory, reason) {
                    if (category) {
                        var categoryInfo = getCategoryInfo(category);
                        tagElement.text(categoryInfo.displayName)
                                  .attr('title', reason || '')
                                  .css({
                                      'display': 'inline-block',
                                      'background': categoryInfo.bgColor,
                                      'color': categoryInfo.color,
                                      'border-color': categoryInfo.color
                                  });
                    } else {
                        tagElement.css('display', 'none');
                    }
                });
            }, 1500); // Wait 1.5 seconds after user stops typing
        });

        // Also apply autocorrection immediately when the user leaves the textarea
        $('#urgentCaseTextarea').on('blur', function() {
            var textarea = $(this);
            var tagElement = $('#issueCategoryTag');
            var text = textarea.val();

            if (!text || text.trim().length === 0) {
                tagElement.css('display', 'none');
                return;
            }

            // Clear any pending debounce
            if (categorizationTimer) {
                clearTimeout(categorizationTimer);
                categorizationTimer = null;
            }

            // Apply autocorrect on blur
            var correctedText = autocorrectText(text);
            if (correctedText !== text) {
                console.log('✓ AUTOCORRECTION APPLIED (on blur)');
                console.log('  Original:', text);
                console.log('  Corrected:', correctedText);
                try {
                    textarea.val(correctedText);
                } catch (e) {
                    console.warn('Could not set textarea value after autocorrect on blur');
                }
            }

            // Immediately categorize the corrected text
            categorizeWithOpenAI(correctedText, function(category, dynamicCategory, reason) {
                if (category) {
                    var categoryInfo = getCategoryInfo(category);
                    tagElement.text(categoryInfo.displayName)
                              .attr('title', reason || '')
                              .css({
                                  'display': 'inline-block',
                                  'background': categoryInfo.bgColor,
                                  'color': categoryInfo.color,
                                  'border-color': categoryInfo.color
                              });
                } else {
                    tagElement.css('display', 'none');
                }
            });
        });
    });
    
    // State to LGA mapping
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
    
    // Populate LGA dropdown based on selected state
    $('#stateSelect').on('change', function() {
        var selectedState = $(this).val();
        var lgaSelect = $('#lgaSelect');
        
        // Clear existing options except the first one
        lgaSelect.find('option:not(:first)').remove();
        
        // If a state is selected, populate LGAs
        if (selectedState && stateLGAs[selectedState]) {
            var lgas = stateLGAs[selectedState];
            lgas.forEach(function(lga) {
                lgaSelect.append($('<option></option>')
                    .attr('value', lga.toLowerCase().replace(/\s+/g, '_'))
                    .text(lga)
                    .css('color', 'black'));
            });
        }
    });
    
    // State name mapping for geocoding responses - expanded with more variations
    var stateNameMapping = {
        'abia': ['abia', 'abia state'],
        'adamawa': ['adamawa', 'adamawa state'],
        'akwa_ibom': ['akwa ibom', 'akwa-ibom', 'akwa ibom state'],
        'anambra': ['anambra', 'anambra state'],
        'bauchi': ['bauchi', 'bauchi state'],
        'bayelsa': ['bayelsa', 'bayelsa state'],
        'benue': ['benue', 'benue state'],
        'borno': ['borno', 'borno state'],
        'cross_river': ['cross river', 'cross-river', 'cross river state'],
        'delta': ['delta', 'delta state'],
        'ebonyi': ['ebonyi', 'ebonyi state'],
        'edo': ['edo', 'edo state'],
        'ekiti': ['ekiti', 'ekiti state'],
        'enugu': ['enugu', 'enugu state'],
        'gombe': ['gombe', 'gombe state'],
        'imo': ['imo', 'imo state'],
        'jigawa': ['jigawa', 'jigawa state'],
        'kaduna': ['kaduna', 'kaduna state'],
        'kano': ['kano', 'kano state'],
        'katsina': ['katsina', 'katsina state'],
        'kebbi': ['kebbi', 'kebbi state'],
        'kogi': ['kogi', 'kogi state'],
        'kwara': ['kwara', 'kwara state'],
        'lagos': ['lagos', 'lagos state'],
        'nasarawa': ['nasarawa', 'nasarawa state'],
        'niger': ['niger', 'niger state'],
        'ogun': ['ogun', 'ogun state'],
        'ondo': ['ondo', 'ondo state'],
        'osun': ['osun', 'osun state'],
        'oyo': ['oyo', 'oyo state'],
        'plateau': ['plateau', 'plateau state'],
        'rivers': ['rivers', 'rivers state'],
        'sokoto': ['sokoto', 'sokoto state'],
        'taraba': ['taraba', 'taraba state'],
        'yobe': ['yobe', 'yobe state'],
        'zamfara': ['zamfara', 'zamfara state'],
        'fct': ['fct', 'federal capital territory', 'abuja', 'federal capital', 'abuja fct']
    };
    
    // Major cities and their states - helps with accurate detection
    var cityToStateMapping = {
        'akure': 'ondo',
        'ondo': 'ondo',
        'owo': 'ondo',
        'ado ekiti': 'ekiti',
        'ado-ekiti': 'ekiti',
        'ikere': 'ekiti',
        'abeokuta': 'ogun',
        'ijebu ode': 'ogun',
        'ibadan': 'oyo',
        'ogbomoso': 'oyo',
        'oyo': 'oyo',
        'osogbo': 'osun',
        'ile-ife': 'osun',
        'ife': 'osun',
        'ilesa': 'osun',
        'lagos': 'lagos',
        'ikeja': 'lagos',
        'abuja': 'fct',
        'gwagwalada': 'fct',
        'kano': 'kano',
        'kaduna': 'kaduna',
        'port harcourt': 'rivers',
        'benin city': 'edo',
        'benin': 'edo',
        'enugu': 'enugu',
        'onitsha': 'anambra',
        'awka': 'anambra',
        'nnewi': 'anambra',
        'calabar': 'cross_river',
        'uyo': 'akwa_ibom',
        'owerri': 'imo',
        'aba': 'abia',
        'umuahia': 'abia',
        'makurdi': 'benue',
        'jos': 'plateau',
        'minna': 'niger',
        'lokoja': 'kogi',
        'ilorin': 'kwara',
        'jalingo': 'taraba',
        'yola': 'adamawa',
        'maiduguri': 'borno',
        'gombe': 'gombe',
        'bauchi': 'bauchi',
        'sokoto': 'sokoto',
        'birnin kebbi': 'kebbi',
        'gusau': 'zamfara',
        'damaturu': 'yobe',
        'dutse': 'jigawa',
        'katsina': 'katsina',
        'asaba': 'delta',
        'warri': 'delta',
        'yenagoa': 'bayelsa',
        'abakaliki': 'ebonyi'
    };
    
    // Function to get state from coordinates (approximate boundaries)
    function getStateFromCoordinates(lat, lon) {
        // Approximate bounding boxes for Nigerian states
        // Format: [minLat, maxLat, minLon, maxLon]
        var stateBoundaries = {
            'ondo': [5.9, 7.9, 4.5, 6.1],      // Akure is at ~7.25°N, 5.2°E
            'ekiti': [7.2, 8.1, 4.8, 5.9],    // Ado-Ekiti is at ~7.6°N, 5.2°E
            'osun': [7.2, 8.2, 4.0, 5.0],     // Osogbo is at ~7.8°N, 4.6°E
            'oyo': [7.2, 9.1, 2.7, 4.6],
            'ogun': [6.4, 7.8, 2.7, 4.3],
            'lagos': [6.4, 6.7, 2.7, 4.3],
            'fct': [8.6, 9.3, 6.7, 7.8],       // FCT/Abuja
            'plateau': [8.6, 10.0, 8.5, 9.9],
            'nasarawa': [7.5, 9.5, 7.0, 9.0],
            'kogi': [6.7, 8.8, 5.5, 7.9],
            'benue': [6.5, 8.1, 7.3, 9.6],
            'niger': [8.2, 11.0, 3.5, 7.7],
            'kwara': [7.7, 9.6, 2.7, 6.0],
            'kaduna': [9.0, 11.3, 6.2, 8.5],
            'kano': [10.5, 13.0, 7.6, 9.5],
            'jigawa': [11.0, 13.5, 8.5, 10.5],
            'katsina': [11.5, 13.5, 6.9, 9.0],
            'sokoto': [11.5, 13.9, 4.0, 6.9],
            'zamfara': [11.0, 13.2, 5.2, 7.2],
            'kebbi': [10.5, 13.0, 3.5, 5.5],
            'rivers': [4.4, 5.3, 6.4, 7.6],
            'bayelsa': [4.4, 5.5, 5.5, 6.8],
            'delta': [5.0, 6.5, 5.2, 6.9],
            'edo': [5.8, 7.7, 5.4, 6.8],
            'anambra': [5.6, 6.9, 6.6, 7.3],
            'enugu': [5.9, 7.3, 6.9, 7.9],
            'ebonyi': [5.7, 6.9, 7.7, 8.5],
            'abia': [4.8, 6.1, 7.2, 8.1],
            'imo': [4.9, 6.1, 6.6, 7.6],
            'akwa_ibom': [4.3, 5.6, 7.3, 8.4],
            'cross_river': [4.3, 6.9, 7.7, 9.4],
            'adamawa': [7.2, 11.0, 11.0, 14.0],
            'taraba': [6.4, 9.3, 9.3, 12.0],
            'gombe': [9.3, 11.2, 10.2, 12.0],
            'bauchi': [9.8, 12.3, 9.0, 11.0],
            'yobe': [11.0, 13.5, 10.5, 13.0],
            'borno': [10.5, 13.9, 11.0, 14.5]
        };
        
        // Find which state the coordinates fall into
        for (var state in stateBoundaries) {
            var bounds = stateBoundaries[state];
            if (lat >= bounds[0] && lat <= bounds[1] && lon >= bounds[2] && lon <= bounds[3]) {
                return state;
            }
        }
        
        return null;
    }
    
    // Function to validate detected state against coordinates
    function validateStateByCoordinates(lat, lon, detectedState, displayName) {
        var coordState = getStateFromCoordinates(lat, lon);
        
        if (!coordState) {
            return detectedState; // Keep original if no coordinate match
        }
        
        // If coordinate state differs from detected state, use coordinate state
        if (coordState !== detectedState) {
            // Additional verification using display name
            var displayLower = (displayName || '').toLowerCase();
            
            // Get state names for both states
            var coordStateNames = stateNameMapping[coordState] || [];
            var detectedStateNames = stateNameMapping[detectedState] || [];
            
            // Check if display name strongly suggests detected state
            var strongMatch = false;
            for (var i = 0; i < detectedStateNames.length; i++) {
                var stateName = detectedStateNames[i];
                if (stateName.length > 3) {
                    var regex = new RegExp('\\b' + stateName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
                    if (regex.test(displayLower)) {
                        strongMatch = true;
                        break;
                    }
                }
            }
            
            // Check if display name mentions coordinate state
            var coordMatch = false;
            for (var i = 0; i < coordStateNames.length; i++) {
                var stateName = coordStateNames[i];
                if (stateName.length > 3) {
                    var regex = new RegExp('\\b' + stateName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
                    if (regex.test(displayLower)) {
                        coordMatch = true;
                        break;
                    }
                }
            }
            
            // Priority: coordinates > display name
            // If coordinates say Ondo but API says FCT, trust coordinates unless display strongly suggests FCT
            if (coordMatch || (!strongMatch && coordState)) {
                return coordState;
            }
        }
        
        return detectedState;
    }
    
    // Function to find state from city name
    function findStateFromCity(cityName) {
        if (!cityName) return null;
        var lowerCityName = cityName.toLowerCase().trim();
        
        // Direct match
        if (cityToStateMapping[lowerCityName]) {
            return cityToStateMapping[lowerCityName];
        }
        
        // Partial match
        for (var city in cityToStateMapping) {
            if (lowerCityName.indexOf(city) !== -1 || city.indexOf(lowerCityName) !== -1) {
                return cityToStateMapping[city];
            }
        }
        
        return null;
    }
    
    // Function to find state value from state name with fuzzy matching
    function findStateValue(stateName) {
        if (!stateName) return null;
        var lowerStateName = stateName.toLowerCase().trim();
        
        // Direct match
        for (var key in stateNameMapping) {
            if (stateNameMapping[key].indexOf(lowerStateName) !== -1) {
                return key;
            }
        }
        
        // Fuzzy match - check if state name contains any of our state names
        for (var key in stateNameMapping) {
            for (var i = 0; i < stateNameMapping[key].length; i++) {
                if (lowerStateName.indexOf(stateNameMapping[key][i]) !== -1 || 
                    stateNameMapping[key][i].indexOf(lowerStateName) !== -1) {
                    return key;
                }
            }
        }
        
        return null;
    }
    
    // Function to find LGA from address components - improved with multiple checks
    function findLGAFromAddress(addressData, stateValue) {
        if (!stateValue || !stateLGAs[stateValue]) return null;
        
        var lgas = stateLGAs[stateValue];
        var searchText = '';
        
        // Build search text from multiple address fields
        if (typeof addressData === 'string') {
            searchText = addressData.toLowerCase();
        } else if (typeof addressData === 'object') {
            // Check multiple fields in order of preference
            var fields = ['city', 'town', 'municipality', 'county', 'suburb', 'village', 'district', 'local_government', 'lga'];
            var addressLower = '';
            
            // Get display name if available
            if (addressData.display_name) {
                addressLower += ' ' + addressData.display_name.toLowerCase();
            }
            
            // Check address object fields
            if (addressData.address) {
                for (var f = 0; f < fields.length; f++) {
                    if (addressData.address[fields[f]]) {
                        addressLower += ' ' + addressData.address[fields[f]].toLowerCase();
                    }
                }
                // Also check other common fields
                if (addressData.address.city_district) {
                    addressLower += ' ' + addressData.address.city_district.toLowerCase();
                }
                if (addressData.address.state_district) {
                    addressLower += ' ' + addressData.address.state_district.toLowerCase();
                }
            }
            
            searchText = addressLower;
        }
        
        // Try exact match first
        for (var i = 0; i < lgas.length; i++) {
            var lgaLower = lgas[i].toLowerCase();
            // Exact match
            if (searchText.indexOf(lgaLower) !== -1) {
                return lgas[i];
            }
        }
        
        // Try partial match (for cases like "Ikeja" matching "Ikeja LGA" or similar)
        for (var i = 0; i < lgas.length; i++) {
            var lgaLower = lgas[i].toLowerCase();
            var lgaWords = lgaLower.split(/\s+/);
            
            // Check if all significant words of LGA are in the search text
            var allWordsFound = true;
            for (var w = 0; w < lgaWords.length; w++) {
                if (lgaWords[w].length > 2) { // Skip short words like "of", "the", etc.
                    if (searchText.indexOf(lgaWords[w]) === -1) {
                        allWordsFound = false;
                        break;
                    }
                }
            }
            if (allWordsFound && lgaWords.length > 0) {
                return lgas[i];
            }
        }
        
        // Try matching first word of LGA (for cases where city name matches LGA name)
        // e.g., "Ikeja" city matching "Ikeja" LGA
        for (var i = 0; i < lgas.length; i++) {
            var lgaLower = lgas[i].toLowerCase();
            var firstWord = lgaLower.split(/\s+/)[0];
            if (firstWord.length > 3 && searchText.indexOf(firstWord) !== -1) {
                // Check if it's a standalone word (not part of another word)
                var regex = new RegExp('\\b' + firstWord + '\\b', 'i');
                if (regex.test(searchText)) {
                    return lgas[i];
                }
            }
        }
        
        return null;
    }
    
    // Autodetect location functionality using free OpenStreetMap Nominatim
    $('#autodetectLink').on('click', function(e) {
        e.preventDefault();
        
        var link = $(this);
        var originalText = link.text();
        var geolocationTimeout;
        var watchId;
        
        // Update link text to show loading
        link.text('Detecting location...').css('pointer-events', 'none');
        
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            link.text(originalText).css('pointer-events', 'auto');
            return;
        }
        
        // Function to process geocoding response from OpenStreetMap
        function processGeocodingResponse(data, lat, lon) {
            if (data) {
                var address = data.address || {};
                var displayName = data.display_name || '';
                
                // Set address
                $('#addressInput').val(displayName);
                
                var stateValue = null;
                
                // Priority 1: Check city/town name first (most reliable for major cities like Akure)
                var cityName = address.city || 
                              address.town || 
                              address.municipality ||
                              address.village ||
                              address.suburb || '';
                
                if (cityName) {
                    stateValue = findStateFromCity(cityName);
                }
                
                // Priority 2: Check state field directly from API
                if (!stateValue) {
                    var stateName = address.state || 
                                   address.region || 
                                   address.province || 
                                   address.state_district ||
                                   address.county || '';
                    
                    if (stateName) {
                        stateValue = findStateValue(stateName);
                    }
                }
                
                // Priority 3: Get state from coordinates (fallback)
                if (!stateValue) {
                    var coordState = getStateFromCoordinates(lat, lon);
                    if (coordState) {
                        stateValue = coordState;
                    }
                }
                
                // Priority 4: Search in display name for state (last resort)
                if (!stateValue && displayName) {
                    var displayLower = displayName.toLowerCase();
                    
                    // First check for city names in display name
                    for (var city in cityToStateMapping) {
                        if (displayLower.indexOf(city) !== -1) {
                            var cityState = cityToStateMapping[city];
                            // Validate against coordinates
                            if (coordState && coordState !== cityState) {
                                stateValue = coordState;
                            } else {
                                stateValue = cityState;
                            }
                            break;
                        }
                    }
                    
                    // If no city found, search for state names
                    if (!stateValue) {
                        for (var key in stateNameMapping) {
                            var stateNames = stateNameMapping[key];
                            for (var j = 0; j < stateNames.length; j++) {
                                if (displayLower.indexOf(stateNames[j]) !== -1) {
                                    var statePattern = stateNames[j];
                                    if (statePattern.length >= 4) {
                                        var regex = new RegExp('\\b' + statePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
                                        if (regex.test(displayLower)) {
                                            // Validate against coordinates
                                            if (coordState && coordState !== key) {
                                                stateValue = coordState;
                                            } else {
                                                stateValue = key;
                                            }
                                            break;
                                        }
                                    } else if (displayLower.indexOf(statePattern) !== -1) {
                                        if (coordState && coordState !== key) {
                                            stateValue = coordState;
                                        } else {
                                            stateValue = key;
                                        }
                                        break;
                                    }
                                }
                            }
                            if (stateValue) break;
                        }
                    }
                    
                    // Final fallback to coordinates
                    if (!stateValue && coordState) {
                        stateValue = coordState;
                    }
                }
                
                if (stateValue) {
                    // Set state dropdown
                    $('#stateSelect').val(stateValue).trigger('change');
                    
                    // Try to find LGA - pass the entire data object for better matching
                    var lgaName = findLGAFromAddress(data, stateValue);
                    
                    if (lgaName) {
                        // Wait a bit for LGA dropdown to populate
                        setTimeout(function() {
                            var lgaValue = lgaName.toLowerCase().replace(/\s+/g, '_');
                            var lgaSelect = $('#lgaSelect');
                            
                            // Try to set the value
                            if (lgaSelect.find('option[value="' + lgaValue + '"]').length > 0) {
                                lgaSelect.val(lgaValue);
                            } else {
                                // Try matching by text
                                lgaSelect.find('option').each(function() {
                                    if ($(this).text().toLowerCase() === lgaName.toLowerCase()) {
                                        lgaSelect.val($(this).val());
                                        return false;
                                    }
                                });
                            }
                        }, 500);
                    }
                    
                    link.text(originalText).css('pointer-events', 'auto');
                } else {
                    // State not found - still set GPS coordinates
                    alert('State could not be automatically detected. Please select your state manually. GPS coordinates have been set.');
                    link.text(originalText).css('pointer-events', 'auto');
                }
            } else {
                alert('Could not retrieve address information. GPS coordinates have been set.');
                link.text(originalText).css('pointer-events', 'auto');
            }
        }
        
        // Function to reverse geocode using free OpenStreetMap Nominatim
        function reverseGeocode(lat, lon, attempt) {
            attempt = attempt || 1;
            link.text('Getting address... (' + attempt + '/2)');
            
            // Use OpenStreetMap Nominatim - completely free, no API key needed
            // Try multiple proxy services for better reliability
            var services = [
                // Service 1: AllOrigins proxy (most reliable and fastest)
                'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=16&addressdetails=1&countrycodes=ng&accept-language=en'),
                // Service 2: CORS Proxy alternative
                'https://corsproxy.io/?https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=16&addressdetails=1&countrycodes=ng&accept-language=en'
            ];
            
            var serviceIndex = Math.min(attempt - 1, services.length - 1);
            var serviceUrl = services[serviceIndex];
            
            $.ajax({
                url: serviceUrl,
                method: 'GET',
                dataType: 'json',
                timeout: 10000, // 10 second timeout (reduced for faster response)
                headers: {},
                success: function(data) {
                    if (data && (data.address || data.display_name)) {
                        processGeocodingResponse(data, lat, lon);
                    } else if (attempt < 2) {
                        // Retry with next service
                        setTimeout(function() {
                            reverseGeocode(lat, lon, attempt + 1);
                        }, 1000);
                    } else {
                        alert('Could not retrieve address information. GPS coordinates have been set. Please fill in the location details manually.');
                        link.text(originalText).css('pointer-events', 'auto');
                    }
                },
                error: function(xhr, status, error) {
                    if (status === 'timeout') {
                        link.text('Request timed out, retrying...');
                    }
                    
                    if (attempt < 2) {
                        // Retry with next service
                        setTimeout(function() {
                            reverseGeocode(lat, lon, attempt + 1);
                        }, 1000);
                    } else {
                        alert('Error retrieving address information. GPS coordinates have been set. Please fill in the location details manually.');
                        link.text(originalText).css('pointer-events', 'auto');
                    }
                }
            });
        }
        
        // Function to handle successful geolocation
        function handleGeolocationSuccess(position) {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
            if (geolocationTimeout) {
                clearTimeout(geolocationTimeout);
            }
            
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            
            // Set GPS coordinates immediately
            $('#gpsInput').val(lat + ', ' + lon);
            
            // Start reverse geocoding
            reverseGeocode(lat, lon, 1);
        }
        
        // Function to handle geolocation error
        function handleGeolocationError(error) {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
            if (geolocationTimeout) {
                clearTimeout(geolocationTimeout);
            }
            
            var errorMsg = 'Error getting location: ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMsg += 'Please allow location access in your browser settings.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMsg += 'Location information is unavailable. Please check your GPS/network connection.';
                    break;
                case error.TIMEOUT:
                    errorMsg += 'Location request timed out. Please try again or check your GPS/network connection.';
                    break;
                default:
                    errorMsg += 'An unknown error occurred. Please try again.';
                    break;
            }
            alert(errorMsg);
            link.text(originalText).css('pointer-events', 'auto');
        }
        
        // Geolocation options optimized for speed and accuracy
        var geolocationOptions = {
            enableHighAccuracy: true, // Use GPS if available for better accuracy
            timeout: 15000, // 15 seconds timeout (reduced for faster response)
            maximumAge: 60000 // Accept cached position up to 1 minute old (faster response)
        };
        
        // Try getCurrentPosition first
        navigator.geolocation.getCurrentPosition(
            handleGeolocationSuccess,
            function(error) {
                // If getCurrentPosition fails, try watchPosition as fallback
                link.text('Getting accurate location...');
                watchId = navigator.geolocation.watchPosition(
                    handleGeolocationSuccess,
                    handleGeolocationError,
                    geolocationOptions
                );
                
                // Set a timeout for watchPosition
                geolocationTimeout = setTimeout(function() {
                    if (watchId) {
                        navigator.geolocation.clearWatch(watchId);
                    }
                    var timeoutError = { code: 3 }; // TIMEOUT error code
                    handleGeolocationError(timeoutError);
                }, 15000);
            },
            geolocationOptions
        );
    });
    
})(jQuery);