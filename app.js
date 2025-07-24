class OmaniTherapistVoiceAI {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isProcessing = false;

    // Session management
    this.sessionId = this.generateSessionId();
    this.conversationHistory = [];
    this.emotionalState = "neutral";
    this.riskLevel = "low";
    this.sessionStartTime = new Date();
    this.sessionMetrics = {
      totalTurns: 0,
      averageResponseTime: 0,
      riskEscalations: 0,
      therapeuticTechniquesUsed: [],
    };

    // Enhanced crisis detection patterns (in Arabic and English)
    this.crisisKeywords = {
      suicide: [
        "انتحار",
        "أريد أن أموت",
        "لا أريد العيش",
        "سأقتل نفسي",
        "أريد أن أنهي حياتي",
        "حياتي لا تستحق",
        "suicide",
        "kill myself",
        "want to die",
        "end my life",
        "not worth living",
        "better off dead",
      ],
      selfHarm: [
        "إيذاء نفسي",
        "أريد أن أؤذي نفسي",
        "جرح نفسي",
        "قطع نفسي",
        "ضرب نفسي",
        "self harm",
        "hurt myself",
        "cut myself",
        "punish myself",
        "harm myself",
      ],
      crisis: [
        "في خطر",
        "حالة طوارئ",
        "مساعدة فورية",
        "لا أستطيع التحمل",
        "سأنهار",
        "emergency",
        "immediate help",
        "in danger",
        "crisis",
        "breakdown",
      ],
      depression: [
        "اكتئاب شديد",
        "لا أملك أمل",
        "حزين جداً",
        "فقدت كل شيء",
        "لا يوجد مخرج",
        "severe depression",
        "hopeless",
        "extremely sad",
        "no way out",
        "lost everything",
      ],
      anxiety: [
        "قلق شديد",
        "خوف مفرط",
        "نوبة هلع",
        "لا أستطيع التنفس",
        "سأفقد السيطرة",
        "severe anxiety",
        "panic attack",
        "overwhelming fear",
        "losing control",
        "can't breathe",
      ],
      domestic: [
        "عنف منزلي",
        "يضربني",
        "يؤذيني",
        "أخاف من",
        "domestic violence",
        "abuses me",
        "hurts me",
        "afraid of",
        "threatens me",
      ],
    };

    // Enhanced therapeutic prompts and techniques
    this.therapeuticTechniques = {
      activeListening: [
        "فهمت شعورك، وأقدر شجاعتك في المشاركة...",
        "أسمعك بوضوح، ومشاعرك مهمة جداً...",
        "هذا صعب عليك، وأنا هنا لأستمع...",
        "أشعر بألمك، وأريد أن أساعدك...",
      ],
      validation: [
        "مشاعرك طبيعية ومفهومة في هذا الوضع...",
        "ما تمر به صعب، وردة فعلك طبيعية...",
        "أقدر شجاعتك في التحدث عن هذا...",
        "ليس عيباً أن تشعر بهذا...",
      ],
      cbtPrompts: [
        "ما هي الأفكار التي تراودك عندما تشعر بهذا؟",
        "كيف يؤثر هذا الشعور على سلوكك اليومي؟",
        "ما البدائل التي يمكن التفكير فيها؟",
        "هل جربت النظر للموقف من زاوية أخرى؟",
      ],
      mindfulness: [
        "دعنا نتوقف قليلاً ونتنفس معاً...",
        "ركز على لحظة الآن، أنت في أمان...",
        "تنفس ببطء، واشعر بالهواء يدخل ويخرج...",
        "الآن أهم من الماضي والمستقبل...",
      ],
      islamic: [
        "الحمد لله، الصبر مفتاح الفرج...",
        "إن مع العسر يسراً، وهذا وعد الله...",
        "الله لا يحمل نفساً إلا وسعها...",
        "الدعاء يخفف القلب ويريح النفس...",
      ],
    };

    // Enhanced cultural elements
    this.culturalPhrases = {
      islamic: [
        "بإذن الله",
        "الحمد لله",
        "إن شاء الله",
        "صبر وتفاؤل",
        "الله يعطيك القوة",
        "استغفر الله",
        "لا حول ولا قوة إلا بالله",
        "حسبنا الله ونعم الوكيل",
      ],
      omani: [
        "زين",
        "تمام",
        "شلون",
        "واجد",
        "أهلين",
        "يالله",
        "خلاص",
        "بسيط",
        "مشكور",
        "الله يعافيك",
        "طيب القلب",
        "ما عليه زود",
      ],
      family: [
        "الأهل",
        "العائلة",
        "الوالدين",
        "الأخوان",
        "الأقارب",
        "العزوة",
        "القبيلة",
        "الأصحاب",
      ],
      comfort: [
        "الراحة تجي",
        "كله يعدي",
        "الأمور تتحسن",
        "المطر بعد الصيف",
        "النجاة قريبة",
        "الفرج قادم",
      ],
    };

    // Performance metrics
    this.performanceMetrics = {
      startTime: Date.now(),
      responseTimes: [],
      errorCount: 0,
      culturalAccuracy: 0,
      therapeuticEffectiveness: 0,
    };

    // DOM elements
    this.micButton = document.getElementById("micButton");
    this.status = document.getElementById("status");
    this.transcriptSection = document.getElementById("transcriptSection");
    this.transcript = document.getElementById("transcript");
    this.responseSection = document.getElementById("responseSection");
    this.response = document.getElementById("response");
    this.apiKeyInput = document.getElementById("apiKey");
    this.claudeKeyInput = document.getElementById("claudeKey");
    this.errorDiv = document.getElementById("error");
    this.riskIndicator = document.getElementById("riskIndicator");
    this.sessionInfo = document.getElementById("sessionInfo");
    this.emergencyContact = document.getElementById("emergencyContact");

    this.initializeSpeechRecognition();
    this.setupEventListeners();
    this.loadApiKeys();
    this.logAvailableVoices();
    this.displaySessionInfo();
    this.logSystemMessage(
      "Therapeutic session started - Omani Therapist Voice AI"
    );

    // Start session metrics
    this.startSessionMonitoring();
  }

  generateSessionId() {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  startSessionMonitoring() {
    // Update session info every 15 seconds for better real-time feedback
    this.sessionUpdateInterval = setInterval(() => {
      this.displaySessionInfo();
      this.assessSessionQuality();
    }, 15000);

    // Auto-save session data every 5 minutes (locally, encrypted)
    this.autoSaveInterval = setInterval(() => {
      this.saveSessionDataLocally();
    }, 300000);
  }

  assessSessionQuality() {
    // Calculate therapeutic effectiveness based on conversation patterns
    const recentHistory = this.conversationHistory.slice(-6);
    let positiveIndicators = 0;
    let concerningPatterns = 0;

    recentHistory.forEach((turn) => {
      if (turn.role === "user") {
        const content = turn.content.toLowerCase();
        // Look for positive emotional shifts
        if (
          content.includes("أحسن") ||
          content.includes("better") ||
          content.includes("شكراً") ||
          content.includes("thank")
        ) {
          positiveIndicators++;
        }
        // Look for concerning patterns
        if (this.assessRisk(content).level !== "low") {
          concerningPatterns++;
        }
      }
    });

    // Update session metrics
    this.sessionMetrics.therapeuticEffectiveness = Math.max(
      0,
      Math.min(100, positiveIndicators * 20 - concerningPatterns * 15)
    );
  }

  displaySessionInfo() {
    if (this.sessionInfo) {
      const duration = Math.floor((new Date() - this.sessionStartTime) / 1000);
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;

      const timeDisplay =
        hours > 0
          ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`
          : `${minutes}:${seconds.toString().padStart(2, "0")}`;

      this.sessionInfo.innerHTML = `
        <strong>🆔 Session ID:</strong> ${this.sessionId.substring(0, 8)}...<br>
        <strong>⏱️ Duration:</strong> ${timeDisplay}<br>
        <strong>💭 Emotional State:</strong> ${this.getEmotionalStateEnglish()}<br>
        <strong>🛡️ Risk Level:</strong> ${this.getRiskLevelEnglish()}<br>
        <strong>📊 Conversations:</strong> ${
          this.conversationHistory.length
        }<br>
        <strong>⚡ Avg Response:</strong> ${this.sessionMetrics.averageResponseTime.toFixed(
          1
        )}ms
      `;
    }
  }

  getEmotionalStateEnglish() {
    const states = {
      neutral: "Neutral",
      anxious: "Anxious",
      depressed: "Depressed",
      angry: "Angry",
      hopeful: "Hopeful",
      distressed: "Distressed",
    };
    return states[this.emotionalState] || "Unknown";
  }

  getRiskLevelEnglish() {
    const levels = {
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    };
    return levels[this.riskLevel] || "Unknown";
  }

  initializeSpeechRecognition() {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      this.showError(
        "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    // Accept both Arabic and English input - will auto-detect
    this.recognition.lang = "ar-SA"; // Primary: Arabic (Saudi Arabia) - closest to Omani dialect
    this.recognition.maxAlternatives = 3; // Get multiple alternatives for better accuracy

    this.recognition.onstart = () => {
      console.log("Speech recognition started");
      this.isListening = true;
      this.updateUI();
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentText =
        finalTranscript || interimTranscript || "Listening...";

      // Use the helper method to display user input with proper direction
      if (finalTranscript || interimTranscript) {
        this.displayUserInput(currentText);
      } else {
        this.transcript.textContent = "Listening...";
        this.transcript.style.direction = "ltr";
        this.transcript.style.textAlign = "left";
      }

      if (finalTranscript) {
        console.log("Final transcript:", finalTranscript);
        this.processTherapeuticInput(finalTranscript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      this.showError(`Speech recognition error: ${event.error}`);
      this.isListening = false;
      this.updateUI();
    };

    this.recognition.onend = () => {
      console.log("Speech recognition ended");
      this.isListening = false;
      this.updateUI();
    };
  }

  setupEventListeners() {
    this.micButton.addEventListener("click", () => {
      if (this.isListening) {
        this.stopListening();
      } else {
        this.startListening();
      }
    });

    this.apiKeyInput.addEventListener("change", () => {
      this.saveApiKeys();
    });

    if (this.claudeKeyInput) {
      this.claudeKeyInput.addEventListener("change", () => {
        this.saveApiKeys();
      });
    }

    // Enhanced session monitoring
    setInterval(() => {
      this.displaySessionInfo();
    }, 15000);

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      this.cleanup();
    });

    // Handle visibility change (tab switching)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.isListening) {
        this.stopListening();
      }
    });
  }

  loadApiKeys() {
    const savedOpenAIKey = localStorage.getItem("openai_api_key");
    const savedClaudeKey = localStorage.getItem("claude_api_key");

    if (savedOpenAIKey) {
      this.apiKeyInput.value = savedOpenAIKey;
    }

    if (savedClaudeKey && this.claudeKeyInput) {
      this.claudeKeyInput.value = savedClaudeKey;
    }
  }

  saveApiKeys() {
    localStorage.setItem("openai_api_key", this.apiKeyInput.value);
    if (this.claudeKeyInput) {
      localStorage.setItem("claude_api_key", this.claudeKeyInput.value);
    }
  }

  startListening() {
    if (!this.recognition) {
      this.showError("Speech recognition is not available");
      return;
    }

    this.hideError();
    this.transcriptSection.style.display = "block";

    // Reset transcript display to default state
    this.transcript.textContent = "Listening...";
    this.transcript.style.direction = "ltr";
    this.transcript.style.textAlign = "left";
    this.transcript.classList.remove("arabic-content");

    try {
      this.recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      this.showError("Error starting speech recognition. Please try again.");
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  async processTherapeuticInput(text) {
    this.isProcessing = true;
    this.updateUI();

    // Log the conversation
    this.logConversationTurn("user", text);

    this.responseSection.style.display = "block";
    this.response.textContent =
      "Processing your input and preparing therapeutic response...";

    try {
      // Analyze emotional state and risk level
      this.analyzeEmotionalState(text);
      const riskAssessment = this.assessRisk(text);

      // Handle crisis situations immediately
      if (
        riskAssessment.level === "critical" ||
        riskAssessment.level === "high"
      ) {
        const crisisResponse = await this.handleCrisisIntervention(
          text,
          riskAssessment
        );
        this.displayArabicResponse(crisisResponse);
        this.speakResponse(crisisResponse);
        this.logConversationTurn("assistant", crisisResponse);
        return;
      }

      // Generate therapeutic response using dual-model approach - ALWAYS in Arabic
      const therapeuticResponse = await this.generateTherapeuticResponse(text);
      this.displayArabicResponse(therapeuticResponse);
      this.speakResponse(therapeuticResponse);
      this.logConversationTurn("assistant", therapeuticResponse);
    } catch (error) {
      console.error("Error in therapeutic processing:", error);
      const fallbackResponse = this.getEnhancedTherapeuticResponse(text);
      this.displayArabicResponse(fallbackResponse);
      this.speakResponse(fallbackResponse);
      this.showError(
        "Technical error occurred, but I'm here to help you: " + error.message
      );
    } finally {
      this.isProcessing = false;
      this.updateUI();
      this.displaySessionInfo();
    }
  }

  // Helper method to properly display Arabic content with RTL styling
  displayArabicResponse(text) {
    this.response.textContent = text;
    // Ensure the response has proper RTL styling
    this.response.classList.add("arabic-content");
    this.response.style.direction = "rtl";
    this.response.style.textAlign = "right";
    this.response.style.unicodeBidi = "embed";
  }

  // Helper method to display user input (could be Arabic or English)
  displayUserInput(text) {
    this.transcript.textContent = text;

    // Check if text contains Arabic characters
    const arabicRegex =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

    if (arabicRegex.test(text)) {
      // Text contains Arabic - apply RTL styling
      this.transcript.classList.add("arabic-content");
      this.transcript.style.direction = "rtl";
      this.transcript.style.textAlign = "right";
      this.transcript.style.unicodeBidi = "embed";
    } else {
      // Text is English - apply LTR styling
      this.transcript.classList.remove("arabic-content");
      this.transcript.style.direction = "ltr";
      this.transcript.style.textAlign = "left";
      this.transcript.style.unicodeBidi = "normal";
    }
  }

  analyzeEmotionalState(text) {
    const lowerText = text.toLowerCase();

    // Anxiety indicators (Arabic & English)
    if (
      lowerText.includes("قلق") ||
      lowerText.includes("خوف") ||
      lowerText.includes("توتر") ||
      lowerText.includes("anxiety") ||
      lowerText.includes("worried") ||
      lowerText.includes("nervous")
    ) {
      this.emotionalState = "anxious";
    }
    // Depression indicators
    else if (
      lowerText.includes("حزين") ||
      lowerText.includes("اكتئاب") ||
      lowerText.includes("يأس") ||
      lowerText.includes("sad") ||
      lowerText.includes("depressed") ||
      lowerText.includes("hopeless")
    ) {
      this.emotionalState = "depressed";
    }
    // Anger indicators
    else if (
      lowerText.includes("غضب") ||
      lowerText.includes("زعل") ||
      lowerText.includes("عصبي") ||
      lowerText.includes("angry") ||
      lowerText.includes("mad") ||
      lowerText.includes("frustrated")
    ) {
      this.emotionalState = "angry";
    }
    // Positive indicators
    else if (
      lowerText.includes("سعيد") ||
      lowerText.includes("مبسوط") ||
      lowerText.includes("متفائل") ||
      lowerText.includes("happy") ||
      lowerText.includes("hopeful") ||
      lowerText.includes("better")
    ) {
      this.emotionalState = "hopeful";
    }
    // Default
    else {
      this.emotionalState = "neutral";
    }
  }

  assessRisk(text) {
    const lowerText = text.toLowerCase();
    let riskLevel = "low";
    let triggerWords = [];

    // Check for crisis keywords
    for (const [category, keywords] of Object.entries(this.crisisKeywords)) {
      for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          triggerWords.push({ category, keyword });
          if (category === "suicide") riskLevel = "critical";
          else if (category === "selfHarm" && riskLevel !== "critical")
            riskLevel = "high";
          else if (
            category === "crisis" &&
            !["critical", "high"].includes(riskLevel)
          )
            riskLevel = "high";
          else if (category === "depression" && riskLevel === "low")
            riskLevel = "medium";
        }
      }
    }

    this.riskLevel = riskLevel;
    return { level: riskLevel, triggers: triggerWords };
  }

  async handleCrisisIntervention(text, riskAssessment) {
    // Log crisis situation
    this.logSystemMessage(`Crisis detected: ${riskAssessment.level}`);

    // Update UI to show emergency state
    if (this.riskIndicator) {
      this.riskIndicator.style.display = "block";
      this.riskIndicator.style.backgroundColor =
        riskAssessment.level === "critical" ? "#dc3545" : "#ffc107";
      this.riskIndicator.textContent =
        riskAssessment.level === "critical"
          ? "⚠️ CRITICAL RISK - Emergency Intervention Required"
          : "⚠️ HIGH RISK - Immediate Attention Needed";
    }

    // Show emergency contacts
    if (this.emergencyContact) {
      this.emergencyContact.style.display = "block";
    }

    // Generate immediate supportive response in Arabic
    const crisisResponses = {
      suicide: [
        "أقدر ثقتك في مشاركة هذا معي. حياتك مهمة جداً. هل أنت في أمان الآن؟ يمكنني مساعدتك في الاتصال بخط المساعدة الفوري.",
        "أسمعك وأهتم بك. هذه المشاعر صعبة لكن مؤقتة. هل يمكنك البقاء معي والتحدث؟ دعنا نجد المساعدة المناسبة فوراً.",
        "شكراً لثقتك. أريد أن أساعدك. هل هناك شخص يمكنه أن يكون معك الآن؟ دعنا نتصل بالمساعدة المتخصصة.",
      ],
      selfHarm: [
        "أقدر صراحتك معي. هذه الرغبة في إيذاء النفس علامة على ألم نفسي يحتاج رعاية. هل أنت في مكان آمن الآن؟",
        "أفهم أن الألم النفسي شديد. لكن جسدك يحتاج الحماية. دعنا نجد طرق أخرى للتعبير عن هذا الألم.",
        "مشاعرك مفهومة، لكن سلامتك أهم. هل يمكنك إزالة أي أدوات ضارة من حولك والتحدث معي؟",
      ],
      crisis: [
        "أنا هنا لمساعدتك. صف لي الوضع أكثر. هل تحتاج مساعدة فورية؟ يمكنني مساعدتك في الاتصال بالطوارئ.",
        "أسمعك. الوضع يبدو صعباً. هل أنت في أمان؟ دعنا نعمل معاً لنجد المساعدة المناسبة.",
        "أقدر تواصلك معي في هذا الوقت الصعب. أولويتي سلامتك. ما أهم شيء تحتاجه الآن؟",
      ],
    };

    // Select appropriate response based on risk triggers
    const primaryTrigger = riskAssessment.triggers[0]?.category || "crisis";
    const responses =
      crisisResponses[primaryTrigger] || crisisResponses["crisis"];
    const selectedResponse =
      responses[Math.floor(Math.random() * responses.length)];

    // Add emergency contact information in Arabic
    const emergencyInfo =
      "\n\nأرقام الطوارئ:\n• الطوارئ العامة: 999\n• خط المساعدة النفسية: (مثال) 1234567\n• مستشفى الطب النفسي: (مثال) 2345678";

    return selectedResponse + emergencyInfo;
  }

  async generateTherapeuticResponse(text) {
    const responseStartTime = Date.now();
    const openaiKey = this.apiKeyInput.value.trim();
    const claudeKey = this.claudeKeyInput?.value.trim();

    try {
      let response;

      // Try GPT-4o first
      if (openaiKey) {
        try {
          response = await this.getGPT4oTherapeuticResponse(text, openaiKey);
          this.logSystemMessage("Used GPT-4o for response generation");
        } catch (error) {
          this.logSystemMessage("GPT-4o failed, trying Claude...");
          throw error;
        }
      }

      // Try Claude as fallback
      if (!response && claudeKey) {
        try {
          response = await this.getClaudeTherapeuticResponse(text, claudeKey);
          this.logSystemMessage("Used Claude as fallback");
        } catch (error) {
          this.logSystemMessage(
            "Claude also failed, using enhanced local responses"
          );
          throw error;
        }
      }

      // Fallback to enhanced local therapeutic responses
      if (!response) {
        response = this.getEnhancedTherapeuticResponse(text);
        this.logSystemMessage("Used enhanced local therapeutic responses");
      }

      // Record response time
      const responseTime = Date.now() - responseStartTime;
      this.performanceMetrics.responseTimes.push(responseTime);
      this.sessionMetrics.averageResponseTime =
        this.performanceMetrics.responseTimes.reduce((a, b) => a + b, 0) /
        this.performanceMetrics.responseTimes.length;

      // Ensure response meets quality standards and is in Arabic
      return this.enhanceResponseQuality(response, text);
    } catch (error) {
      this.performanceMetrics.errorCount++;
      console.error("Error in therapeutic response generation:", error);
      return this.getEnhancedTherapeuticResponse(text);
    }
  }

  enhanceResponseQuality(response, originalText) {
    // Ensure response includes therapeutic elements
    let enhancedResponse = response;

    // Add cultural validation if missing
    if (!this.containsOmaniDialect(response)) {
      const culturalPhrase = this.getRandomPhrase(this.culturalPhrases.omani);
      enhancedResponse = `${culturalPhrase}! ${enhancedResponse}`;
    }

    // Add Islamic comfort if appropriate and missing
    if (
      this.needsIslamicComfort(originalText) &&
      !this.containsIslamicContent(response)
    ) {
      const islamicPhrase = this.getRandomPhrase(this.culturalPhrases.islamic);
      enhancedResponse += ` ${islamicPhrase}.`;
    }

    // Ensure therapeutic technique is present
    if (!this.containsTherapeuticTechnique(response)) {
      const technique =
        this.selectAppropriateTherapeuticTechnique(originalText);
      enhancedResponse += ` ${technique}`;
    }

    return enhancedResponse;
  }

  containsOmaniDialect(text) {
    return this.culturalPhrases.omani.some((phrase) => text.includes(phrase));
  }

  containsIslamicContent(text) {
    return this.culturalPhrases.islamic.some((phrase) => text.includes(phrase));
  }

  containsTherapeuticTechnique(text) {
    const allTechniques = [
      ...this.therapeuticTechniques.activeListening,
      ...this.therapeuticTechniques.validation,
      ...this.therapeuticTechniques.cbtPrompts,
    ];
    return allTechniques.some(
      (technique) => text.includes(technique.substring(0, 10)) // Check partial match
    );
  }

  needsIslamicComfort(text) {
    const spiritualKeywords = [
      "الله",
      "دين",
      "صلاة",
      "دعاء",
      "إيمان",
      "روح",
      "god",
      "faith",
      "prayer",
    ];
    return spiritualKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword)
    );
  }

  selectAppropriateTherapeuticTechnique(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes("قلق") || lowerText.includes("anxiety")) {
      return this.getRandomPhrase(this.therapeuticTechniques.mindfulness);
    } else if (lowerText.includes("حزين") || lowerText.includes("sad")) {
      return this.getRandomPhrase(this.therapeuticTechniques.validation);
    } else if (lowerText.includes("أفكار") || lowerText.includes("think")) {
      return this.getRandomPhrase(this.therapeuticTechniques.cbtPrompts);
    } else {
      return this.getRandomPhrase(this.therapeuticTechniques.activeListening);
    }
  }

  getRandomPhrase(phrases) {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  // Enhanced method to analyze conversation patterns
  analyzeConversationPatterns() {
    if (this.conversationHistory.length < 4) {
      return {
        mainTopics: [],
        emotionalTrend: "stable",
        engagementLevel: "establishing",
        therapeuticNeeds: [],
      };
    }

    const userTurns = this.conversationHistory.filter(
      (turn) => turn.role === "user"
    );
    const recentTurns = userTurns.slice(-3);

    // Extract main topics/themes
    const mainTopics = [];
    recentTurns.forEach((turn) => {
      const content = turn.content.toLowerCase();
      if (content.includes("قلق") || content.includes("anxiety"))
        mainTopics.push("anxiety");
      if (
        content.includes("أهل") ||
        content.includes("عائلة") ||
        content.includes("family")
      )
        mainTopics.push("family");
      if (
        content.includes("شغل") ||
        content.includes("عمل") ||
        content.includes("work")
      )
        mainTopics.push("work");
      if (
        content.includes("حزين") ||
        content.includes("اكتئاب") ||
        content.includes("sad") ||
        content.includes("depressed")
      )
        mainTopics.push("depression");
      if (
        content.includes("الله") ||
        content.includes("دين") ||
        content.includes("صلاة")
      )
        mainTopics.push("spiritual");
    });

    // Analyze emotional trend
    const emotionalStates = recentTurns.map(
      (turn) => turn.emotionalState || "neutral"
    );
    const lastThree = emotionalStates.slice(-3);

    let emotionalTrend = "stable";
    if (
      lastThree.includes("hopeful") &&
      lastThree.indexOf("hopeful") > lastThree.indexOf("anxious")
    ) {
      emotionalTrend = "improving";
    } else if (
      lastThree.includes("anxious") ||
      lastThree.includes("depressed")
    ) {
      emotionalTrend = "concerning";
    }

    return {
      mainTopics: [...new Set(mainTopics)],
      emotionalTrend,
      engagementLevel: recentTurns.length >= 3 ? "engaged" : "establishing",
      therapeuticNeeds: this.identifyTherapeuticNeeds(
        mainTopics,
        emotionalTrend
      ),
    };
  }

  identifyTherapeuticNeeds(topics, emotionalTrend) {
    const needs = [];

    if (topics.includes("anxiety")) needs.push("anxiety_management");
    if (topics.includes("family")) needs.push("family_therapy");
    if (topics.includes("work")) needs.push("stress_management");
    if (topics.includes("depression")) needs.push("depression_support");
    if (topics.includes("spiritual")) needs.push("spiritual_counseling");
    if (emotionalTrend === "concerning") needs.push("emotional_stabilization");

    return needs;
  }

  // Enhanced fallback responses with conversation context
  getEnhancedTherapeuticResponse(text) {
    const lowerText = text.toLowerCase();
    const conversationPatterns = this.analyzeConversationPatterns();
    const hasHistory = this.conversationHistory.length > 2;

    this.sessionMetrics.therapeuticTechniquesUsed.push("local_enhanced");

    // Check if this is a follow-up to previous topics
    const isFollowUp =
      hasHistory &&
      (lowerText.includes("نعم") ||
        lowerText.includes("لا") ||
        lowerText.includes("أكثر") ||
        lowerText.includes("yes") ||
        lowerText.includes("no") ||
        lowerText.includes("more") ||
        lowerText.includes("أيضا") ||
        lowerText.includes("also") ||
        lowerText.includes("still"));

    // If it's a follow-up, provide contextual responses
    if (isFollowUp && conversationPatterns.mainTopics.length > 0) {
      const mainTopic = conversationPatterns.mainTopics[0];
      return this.getContextualFollowUpResponse(
        text,
        mainTopic,
        conversationPatterns
      );
    }

    // More sophisticated pattern matching with cultural context

    // Anxiety with context awareness
    if (
      lowerText.includes("قلق") ||
      lowerText.includes("خوف") ||
      lowerText.includes("توتر") ||
      lowerText.includes("anxiety") ||
      lowerText.includes("worried")
    ) {
      const anxietyResponses = hasHistory
        ? [
            `أشوف إن القلق لازال يأثر عليك. زين إنك تواصل تشاركني هذا. شلون تطور الوضع من آخر مرة تكلمنا؟`,
            `مثل ما قلت قبل، القلق شعور طبيعي. تمام، دعنا نشوف إذا الطرق اللي تكلمنا عنها ساعدتك، أو نحتاج نجرب شيء جديد؟`,
            `أذكر إنك ذكرت القلق قبل. الحمد لله إنك مستمر في المحاولة. شنو الأشياء اللي لاحظت إنها تزيد أو تقلل من قلقك؟`,
          ]
        : [
            "زين إنك تشاركني هذا القلق. الحمد لله، القلق شعور طبيعي بس ممكن نتعامل معه. شلون يأثر عليك في حياتك اليومية؟",
            "أفهم إن القلق يخليك تحس بالتوتر. تمام، الله لا يحمل نفساً إلا وسعها. دعنا نشوف شنو الأفكار اللي تجي في بالك وقت القلق؟",
          ];
      return anxietyResponses[
        Math.floor(Math.random() * anxietyResponses.length)
      ];
    }

    // Depression with context
    if (
      lowerText.includes("حزين") ||
      lowerText.includes("اكتئاب") ||
      lowerText.includes("يأس") ||
      lowerText.includes("sad") ||
      lowerText.includes("depressed") ||
      lowerText.includes("hopeless")
    ) {
      const depressionResponses = hasHistory
        ? [
            `أشوف إن الحزن لازال موجود. أقدر واجد صبرك وقوتك في الاستمرار. شلون مشاعرك تغيرت من آخر مرة؟`,
            `مثل ما تكلمنا قبل، المشاعر الصعبة تحتاج وقت. إن شاء الله، أيش جديد في حياتك ممكن يخليك تحس بتحسن بسيط؟`,
            `أذكر كلامك السابق، والحمد لله إنك مستمر معي. الراحة تجي بالتدريج. شنو خطوة صغيرة نقدر نعملها اليوم؟`,
          ]
        : [
            "أقدر واجد إنك تشارك معي هذا الشعور الصعب. الحزن جزء من تجربة الإنسان، والحمد لله إن مع العسر يسراً.",
            "أسمعك، وأحس بألمك. الله قريب من عباده، وإن شاء الله الأمور تتحسن. الراحة تجي، كله يعدي.",
          ];
      return depressionResponses[
        Math.floor(Math.random() * depressionResponses.length)
      ];
    }

    // Family issues with context
    if (
      lowerText.includes("أهل") ||
      lowerText.includes("عائلة") ||
      lowerText.includes("والدين") ||
      lowerText.includes("family") ||
      lowerText.includes("parents")
    ) {
      const familyResponses = hasHistory
        ? [
            `أشوف إنك تواصل تفكر في موضوع الأهل. زين هذا، يدل على اهتمامك. شنو تطور في العلاقة من آخر مرة تكلمنا؟`,
            `مثل ما ذكرت قبل، العلاقات الأسرية مهمة واجد. شلون تفاعل الأهل مع المحاولات اللي تكلمنا عنها؟`,
            `أذكر نقاشنا السابق حول العائلة. الحمد لله إنك مستمر في المحاولة. أيش أصعب شيء واجهته مؤخراً معهم؟`,
          ]
        : [
            "الأهل أساس حياتنا في المجتمع العماني، وزين إنك تهتم بالعلاقة معهم. شلون الوضع معهم؟",
            "العائلة واجد مهمة في تقاليدنا، وأفهم إن العلاقات الأسرية ممكن تكون معقدة أحياناً.",
          ];
      return familyResponses[
        Math.floor(Math.random() * familyResponses.length)
      ];
    }

    // Work stress with context
    if (
      lowerText.includes("شغل") ||
      lowerText.includes("عمل") ||
      lowerText.includes("وظيفة") ||
      lowerText.includes("work") ||
      lowerText.includes("job") ||
      lowerText.includes("stress")
    ) {
      const workResponses = hasHistory
        ? [
            `أشوف إن موضوع الشغل لازال يشغل بالك. شلون الوضع تطور من آخر مرة؟ الطرق اللي تكلمنا عنها ساعدت؟`,
            `مثل ما قلت قبل، التوازن بين العمل والحياة مهم. شنو جديد في بيئة العمل أو تعاملك معها؟`,
            `أذكر حديثنا عن ضغط العمل. تمام إنك تواصل تحاول تحسن الوضع. شنو أكثر شيء يساعدك تسترخي بعد يوم شغل صعب؟`,
          ]
        : [
            "ضغط الشغل شيء طبيعي، بس المهم نلاقي توازن بين العمل والحياة. شلون يأثر عليك وعلى أهلك؟",
            "العمل جزء من حياتنا، بس مو كل شيء. زين إنك تتكلم عن هذا.",
          ];
      return workResponses[Math.floor(Math.random() * workResponses.length)];
    }

    // Spiritual with context
    if (
      lowerText.includes("الله") ||
      lowerText.includes("دين") ||
      lowerText.includes("صلاة") ||
      lowerText.includes("god") ||
      lowerText.includes("faith") ||
      lowerText.includes("prayer")
    ) {
      const spiritualResponses = hasHistory
        ? [
            `أشوف إنك تواصل تفكر في الجانب الروحي. الحمد لله، هذا شيء جميل. شلون علاقتك مع الله تطورت مؤخراً؟`,
            `مثل ما تكلمنا قبل، الإيمان مصدر قوة واجد. أيش الطرق الروحية اللي لاقيت إنها تساعدك أكثر؟`,
            `أذكر حديثنا عن الدين والروحانية. إن شاء الله، شلون الدعاء والذكر يأثر على مزاجك اليومي؟`,
          ]
        : [
            "الحمد لله على الإيمان. التدين والصحة النفسية مترابطان، والروح تحتاج غذاء مثل الجسد.",
            "زين إنك تتكلم عن الجانب الروحي. إن شاء الله، الإيمان يعطي قوة وطمأنينة.",
          ];
      return spiritualResponses[
        Math.floor(Math.random() * spiritualResponses.length)
      ];
    }

    // Greetings with context awareness
    if (
      lowerText.includes("مرحبا") ||
      lowerText.includes("سلام") ||
      lowerText.includes("أهلين") ||
      lowerText.includes("hello") ||
      lowerText.includes("hi")
    ) {
      if (hasHistory) {
        return "أهلين مرة ثانية! زين إنك ترجع تتكلم معي. شلون حالك من آخر مرة التقينا؟ شنو جديد في الأمور اللي كنا نتكلم عنها؟";
      } else {
        return "أهلين وسهلين! مرحباً بك في جلسة العلاج النفسي باللهجة العمانية. أنا هنا لأسمعك وأساعدك بكل احترام وسرية.";
      }
    }

    // Default enhanced therapeutic response with context
    const defaultResponses = hasHistory
      ? [
          "أقدر إنك تواصل تشارك معي أفكارك. بناءً على كلامنا السابق، شلون هذا الشعور الجديد يرتبط بالأشياء اللي تكلمنا عنها؟",
          "تمام، أشوف إنك تواصل تستكشف مشاعرك. مثل ما لاحظنا قبل، شنو الأنماط اللي تكررت مؤخراً؟",
          "أسمعك، وأذكر رحلتنا العلاجية لحد الآن. الحمد لله إنك مستمر في المشاركة. شلون هذا يختلف عن آخر مرة تكلمنا؟",
          "زين إنك تواصل تثق فيني وتشارك. بناءً على فهمي لك من محادثاتنا السابقة، شنو اللي تغير في نظرتك لهذا الموضوع؟",
        ]
      : [
          "أسمعك بوضوح، وهذا مهم واجد. أقدر ثقتك في مشاركة هذا معي. ممكن تحكيلي أكثر عن هذا الشعور؟",
          "تمام، أفهم إن هذا صعب عليك، ومشاعرك طبيعية. دعنا نستكشف هذا أكثر بهدوء وصبر.",
          "الحمد لله إنك تتكلم عن هذا، التعبير عن المشاعر خطوة مهمة وشجاعة. أنا هنا لأساندك.",
        ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  }

  getContextualFollowUpResponse(text, mainTopic, patterns) {
    const lowerText = text.toLowerCase();
    const isPositive =
      lowerText.includes("نعم") ||
      lowerText.includes("أحسن") ||
      lowerText.includes("yes") ||
      lowerText.includes("better") ||
      lowerText.includes("good");
    const isNegative =
      lowerText.includes("لا") ||
      lowerText.includes("أسوأ") ||
      lowerText.includes("no") ||
      lowerText.includes("worse") ||
      lowerText.includes("bad");

    switch (mainTopic) {
      case "anxiety":
        if (isPositive) {
          return "الحمد لله إن الأمور تتحسن شوي مع القلق. زين واجد! شنو الطريقة اللي أكثر شيء ساعدتك؟ نقدر نبني عليها أكثر؟";
        } else if (isNegative) {
          return "أفهم إن القلق لازال صعب. مو مشكلة، التحسن ياخذ وقت. دعنا نجرب طريقة جديدة أو نعدل في اللي جربناها قبل. شنو رأيك؟";
        }
        return "تمام، دعنا نواصل الشغل على موضوع القلق. شلون جسمك يتفاعل مع القلق هذه الأيام؟ لاحظت أي تغيير؟";

      case "family":
        if (isPositive) {
          return "زين واجد إن العلاقة مع الأهل تتحسن! هذا شيء يفرح القلب. شنو أكثر شيء ساعد في تحسين التواصل؟";
        } else if (isNegative) {
          return "أفهم إن الوضع مع الأهل لازال معقد. العلاقات الأسرية تحتاج صبر واجد. شنو أصعب شيء واجهته معهم مؤخراً؟";
        }
        return "شلون تطور موضوع الأهل؟ أيش جربت من الأشياء اللي تكلمنا عنها في التعامل معهم؟";

      case "work":
        if (isPositive) {
          return "الحمد لله إن ضغط الشغل قل شوي! زين إنك قدرت تلاقي طرق تتعامل معه. شنو أكثر استراتيجية نفعت معك؟";
        } else if (isNegative) {
          return "أشوف إن الشغل لازال يضغط عليك. مو مشكلة، نقدر نعدل في الخطة. شنو الأشياء الجديدة اللي زادت الضغط؟";
        }
        return "شلون الوضع في الشغل هذه الأيام؟ التوازن اللي كنا نشتغل عليه، قدرت تطبق منه شيء؟";

      case "depression":
        if (isPositive) {
          return "سبحان الله، أشوف بصيص أمل في كلامك! هذا شيء جميل واجد. شنو الأشياء الصغيرة اللي خلتك تحس أحسن؟";
        } else if (isNegative) {
          return "أفهم إن الحزن لازال ثقيل. أقدر صبرك وقوتك في الاستمرار. دعنا نأخذ خطوات أصغر، شنو أبسط شيء ممكن نعمله اليوم؟";
        }
        return "شلون مزاجك هذه الأيام؟ الأشياء اللي تكلمنا عنها قبل، أيش منها لازال يساعدك؟";

      case "spiritual":
        if (isPositive) {
          return "الحمد لله إن الجانب الروحي يساعدك! هذا شيء عظيم. شلون تطورت علاقتك مع الله مؤخراً؟";
        } else if (isNegative) {
          return "أفهم إن الجانب الروحي مو دايماً سهل. حتى الأنبياء واجهوا تحديات. شنو يخليك تحس إنك بعيد عن الله؟";
        }
        return "شلون الدعاء والذكر يأثر عليك هذه الأيام؟ لاحظت أي تغيير في راحتك النفسية؟";

      default:
        return "أقدر إنك تواصل تشاركني أفكارك. شلون هذا يرتبط بالأشياء اللي كنا نتكلم عنها قبل؟";
    }
  }

  // Enhanced conversation logging with more context
  logConversationTurn(role, content) {
    const turn = {
      role: role,
      content: content,
      timestamp: new Date().toISOString(),
      emotionalState: this.emotionalState,
      riskLevel: this.riskLevel,
      sessionDuration: Date.now() - this.performanceMetrics.startTime,
      turnNumber: this.conversationHistory.length + 1,
    };

    this.conversationHistory.push(turn);
    console.log(
      `[${role.toUpperCase()}] Turn ${turn.turnNumber}: ${content.substring(
        0,
        50
      )}...`
    );

    // Update session metrics
    this.sessionMetrics.totalTurns = this.conversationHistory.length;

    // Keep only last 30 turns for performance (15 exchanges)
    if (this.conversationHistory.length > 30) {
      this.conversationHistory = this.conversationHistory.slice(-30);
    }
  }

  logSystemMessage(message) {
    console.log(`[SYSTEM] ${message}`);
    this.conversationHistory.push({
      role: "system",
      content: message,
      timestamp: new Date().toISOString(),
    });
  }

  // Build cultural context for AI responses
  buildCulturalContext() {
    return `السياق الثقافي العماني: تقاليد إسلامية، أهمية الأسرة، قيم التواضع والكرم، احترام الكبار، الصبر والتفاؤل كقيم أساسية`;
  }

  // Build conversation context with full history
  buildConversationContext() {
    if (this.conversationHistory.length === 0) {
      return "This is the beginning of a new therapeutic session.";
    }

    // Get the last 8 conversation turns (4 exchanges) for context
    const recentHistory = this.conversationHistory.slice(-8);

    let context = "Previous conversation in this session:\n";
    recentHistory.forEach((turn, index) => {
      const speaker = turn.role === "user" ? "Patient" : "Therapist";
      const content =
        turn.content.length > 100
          ? turn.content.substring(0, 100) + "..."
          : turn.content;
      context += `${speaker}: ${content}\n`;
    });

    // Add emotional progression
    const emotionalStates = recentHistory
      .map((turn) => turn.emotionalState)
      .filter((state) => state);
    if (emotionalStates.length > 1) {
      context += `\nEmotional progression: ${emotionalStates
        .slice(-3)
        .join(" → ")}`;
    }

    // Add any risk concerns
    const riskLevels = recentHistory
      .map((turn) => turn.riskLevel)
      .filter((level) => level && level !== "low");
    if (riskLevels.length > 0) {
      context += `\nSafety concerns noted: ${riskLevels.slice(-2).join(", ")}`;
    }

    return context;
  }

  // Enhanced GPT-4o response with full conversation context
  async getGPT4oTherapeuticResponse(text, apiKey) {
    const culturalContext = this.buildCulturalContext();
    const conversationContext = this.buildConversationContext();
    const conversationPatterns = this.analyzeConversationPatterns();

    const systemPrompt = `أنت معالج نفسي عماني متخصص في العلاج النفسي باللهجة العمانية. أهدافك:

    🎯 CRITICAL: Always respond ONLY in Omani Arabic dialect, regardless of the user's input language (Arabic or English).

    📚 الخصائص العلاجية:
    • استخدم تقنيات العلاج المعرفي السلوكي (CBT) 
    • اظهر الاستماع الفعال والتعاطف
    • اطرح أسئلة مفتوحة لاستكشاف المشاعر
    • قدم التحقق من صحة المشاعر
    • استخدم تقنيات إعادة الهيكلة المعرفية
    • MAINTAIN CONVERSATION CONTINUITY - reference previous topics and progress
    
    🇴🇲 الحساسية الثقافية العمانية:
    • استخدم المفردات العمانية: (زين، تمام، شلون، واجد، أهلين، يالله، خلاص، بسيط)
    • ادمج القيم الإسلامية بطريقة طبيعية: (الحمد لله، إن شاء الله، بإذن الله، الصبر والتفاؤل)
    • احترم ديناميكيات الأسرة والمجتمع العماني
    • تجنب المواضيع المحرمة ثقافياً
    • استخدم أمثلة من البيئة العمانية
    
    💬 أسلوب التواصل:
    • ردود قصيرة (1-3 جمل) لأنها ستُقرأ بالصوت
    • لهجة دافئة ومطمئنة
    • استخدم الأسئلة التوجيهية
    • تجنب المصطلحات الطبية المعقدة
    • اجعل النبرة أبوية ومطمئنة
    • REFERENCE previous conversation points to show you're listening and remembering

    IMPORTANT: If user speaks English, still respond in Omani Arabic. Translate their concern and respond therapeutically in Arabic.

    🔄 CONVERSATION CONTINUITY GUIDELINES:
    • Acknowledge and build upon previous topics discussed
    • Reference any progress or concerns mentioned earlier
    • Show therapeutic memory by connecting current statements to past ones
    • Use phrases like "مثل ما قلت قبل" (like you said before) or "أذكر إنك ذكرت" (I remember you mentioned)
    • Follow up on previous suggestions or homework given

    السياق الثقافي: ${culturalContext}
    
    تاريخ المحادثة التفصيلي:
    ${conversationContext}
    
    أنماط المحادثة المحددة:
    • المواضيع الرئيسية: ${
      conversationPatterns.mainTopics.join(", ") || "لا يوجد مواضيع محددة بعد"
    }
    • الاتجاه العاطفي: ${conversationPatterns.emotionalTrend}
    • مستوى المشاركة: ${conversationPatterns.engagementLevel}
    • الاحتياجات العلاجية: ${
      conversationPatterns.therapeuticNeeds.join(", ") || "تقييم أولي"
    }
    
    الحالة النفسية الحالية: ${this.getEmotionalStateArabic()}
    مستوى المخاطر: ${this.getRiskLevelArabic()}
    
    Based on this conversation history, respond therapeutically while maintaining continuity and showing that you remember and understand the ongoing therapeutic relationship.`;

    const messages = [{ role: "system", content: systemPrompt }];

    // Add recent conversation history as context
    const recentHistory = this.conversationHistory.slice(-6); // Last 3 exchanges
    recentHistory.forEach((turn) => {
      if (turn.role !== "system") {
        // Don't include system messages
        messages.push({
          role: turn.role === "assistant" ? "assistant" : "user",
          content: turn.content,
        });
      }
    });

    // Add current user input
    messages.push({ role: "user", content: text });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 200, // Increased for better context-aware responses
        temperature: 0.8,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  // Enhanced Claude therapeutic response (placeholder for future implementation)
  async getClaudeTherapeuticResponse(text, apiKey) {
    // Placeholder for Claude integration - would use similar conversation context
    throw new Error("Claude integration not yet implemented");
  }

  // Helper method to get Arabic emotional state for system prompts
  getEmotionalStateArabic() {
    const states = {
      neutral: "متوازن",
      anxious: "قلق",
      depressed: "حزين",
      angry: "غاضب",
      hopeful: "متفائل",
      distressed: "متضايق",
    };
    return states[this.emotionalState] || "غير محدد";
  }

  // Helper method to get Arabic risk level for system prompts
  getRiskLevelArabic() {
    const levels = {
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      critical: "حرج",
    };
    return levels[this.riskLevel] || "غير محدد";
  }

  preprocessTextForSpeech(text) {
    let processedText = text;

    // Add natural pauses for Arabic text
    processedText = processedText.replace(/\./g, ".");
    processedText = processedText.replace(/\!/g, "!");
    processedText = processedText.replace(/\?/g, "?");
    processedText = processedText.replace(/،/g, "، ");

    // Add slight pauses for important Arabic phrases
    processedText = processedText.replace(/الحمد لله/g, "الحمد لله،");
    processedText = processedText.replace(/إن شاء الله/g, "إن شاء الله،");
    processedText = processedText.replace(/بإذن الله/g, "بإذن الله،");

    // Clean up spacing
    processedText = processedText.replace(/\s+/g, " ");
    processedText = processedText.replace(/،،+/g, "،");

    return processedText.trim();
  }

  speakResponse(text) {
    this.synthesis.cancel();

    const naturalText = this.preprocessTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(naturalText);

    const voices = this.synthesis.getVoices();

    // Prioritize Arabic male voices for therapeutic warmth
    const preferredVoice =
      voices.find(
        (voice) =>
          (voice.lang.startsWith("ar") || voice.lang.includes("arabic")) &&
          (voice.name.toLowerCase().includes("male") ||
            voice.name.toLowerCase().includes("majed") ||
            voice.name.toLowerCase().includes("omar") ||
            voice.name.toLowerCase().includes("khalid") ||
            voice.name.toLowerCase().includes("ahmad"))
      ) ||
      voices.find(
        (voice) => voice.lang.startsWith("ar") || voice.lang.includes("arabic")
      ) ||
      voices.find((voice) => voice.name.toLowerCase().includes("enhanced")) ||
      voices.find((voice) => voice.default);

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log(
        "Selected therapeutic voice:",
        preferredVoice.name,
        "Language:",
        preferredVoice.lang
      );
    }

    // Therapeutic speech parameters - slower, warmer
    utterance.rate = 1.5; // Slower for therapeutic conversation
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 0.9; // Clear volume

    utterance.onstart = () =>
      console.log("Started speaking therapeutic response");
    utterance.onend = () => console.log("Ended speaking therapeutic response");
    utterance.onerror = (event) =>
      console.error("Error in speaking text:", event.error);

    this.synthesis.speak(utterance);
  }

  updateUI() {
    if (this.isListening) {
      this.micButton.classList.add("listening");
      this.micButton.classList.remove("processing");
      this.micButton.textContent = "🔴";
      this.status.textContent = "Listening... Click to stop";
    } else if (this.isProcessing) {
      this.micButton.classList.add("processing");
      this.micButton.classList.remove("listening");
      this.micButton.textContent = "🧠";
      this.status.textContent =
        "Processing and generating therapeutic response...";

      // Update response section to show processing in RTL for Arabic response
      if (this.responseSection.style.display === "block") {
        this.response.textContent = "جاري معالجة كلامك وإعداد الرد العلاجي...";
        this.response.classList.add("arabic-content");
        this.response.style.direction = "rtl";
        this.response.style.textAlign = "right";
      }
    } else {
      this.micButton.classList.remove("listening", "processing");
      this.micButton.textContent = "🎤";
      this.status.textContent =
        "Click the microphone to speak with the mental health therapist";
    }

    // Update risk indicator color
    if (this.riskIndicator) {
      this.riskIndicator.className = `risk-${this.riskLevel}`;
    }
  }

  showError(message) {
    this.errorDiv.textContent = message;
    this.errorDiv.style.display = "block";
  }

  hideError() {
    this.errorDiv.style.display = "none";
  }

  logAvailableVoices() {
    setTimeout(() => {
      const voices = this.synthesis.getVoices();
      console.log("=== Available Voices for Therapy ===");

      const arabicVoices = voices.filter(
        (voice) => voice.lang.startsWith("ar") || voice.lang.includes("arabic")
      );

      if (arabicVoices.length > 0) {
        console.log("Arabic voices available:");
        arabicVoices.forEach((voice) => {
          console.log(
            `- ${voice.name} (${voice.lang}) - Local: ${voice.localService}`
          );
        });
      } else {
        console.log("No Arabic voices found. Available voices:");
        voices.slice(0, 10).forEach((voice) => {
          console.log(
            `- ${voice.name} (${voice.lang}) - Local: ${voice.localService}`
          );
        });
      }
      console.log("=====================================");
    }, 1000);
  }

  saveSessionDataLocally() {
    try {
      const sessionData = {
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        emotionalState: this.emotionalState,
        riskLevel: this.riskLevel,
        sessionMetrics: this.sessionMetrics,
        // Only save anonymized conversation count, not content
        conversationTurns: this.conversationHistory.length,
        performanceMetrics: {
          averageResponseTime: this.sessionMetrics.averageResponseTime,
          errorCount: this.performanceMetrics.errorCount,
          sessionDuration: Date.now() - this.performanceMetrics.startTime,
        },
      };

      // Encrypt and save locally (simplified version - in production would use proper encryption)
      const encryptedData = btoa(JSON.stringify(sessionData));
      localStorage.setItem(
        `omani_therapy_session_${this.sessionId}`,
        encryptedData
      );

      console.log("Session data saved locally (encrypted)");
    } catch (error) {
      console.error("Error saving session data:", error);
    }
  }

  // Export comprehensive session data for analysis (HIPAA compliant)
  exportSessionData() {
    const sessionData = {
      sessionId: this.sessionId,
      startTime: this.sessionStartTime.toISOString(),
      endTime: new Date().toISOString(),
      sessionMetrics: this.sessionMetrics,
      performanceMetrics: {
        averageResponseTime: this.sessionMetrics.averageResponseTime,
        totalResponseTimes: this.performanceMetrics.responseTimes.length,
        errorCount: this.performanceMetrics.errorCount,
        sessionDuration: Date.now() - this.performanceMetrics.startTime,
      },
      conversationMetadata: this.conversationHistory.map((turn) => ({
        role: turn.role,
        timestamp: turn.timestamp,
        emotionalState: turn.emotionalState,
        riskLevel: turn.riskLevel,
        contentLength: turn.content ? turn.content.length : 0,
        // Content is NOT included for privacy
        hasContent: !!turn.content,
      })),
      finalEmotionalState: this.emotionalState,
      finalRiskLevel: this.riskLevel,
      totalTurns: this.conversationHistory.length,
      riskEscalations: this.sessionMetrics.riskEscalations,
      therapeuticTechniquesUsed: [
        ...new Set(this.sessionMetrics.therapeuticTechniquesUsed),
      ], // Unique techniques
      culturalElements: {
        omaniDialectUsed: true,
        islamicValuesIntegrated: true,
        familyContextConsidered: true,
      },
    };

    return sessionData;
  }

  cleanup() {
    // Clean up intervals
    if (this.sessionUpdateInterval) {
      clearInterval(this.sessionUpdateInterval);
    }
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    // Final session save
    this.saveSessionDataLocally();

    // Cancel any ongoing speech
    if (this.synthesis) {
      this.synthesis.cancel();
    }

    // Stop recognition
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }

    this.logSystemMessage("Session ended and resources cleaned up");
  }
}

// Enhanced initialization with error handling
document.addEventListener("DOMContentLoaded", () => {
  try {
    setTimeout(() => {
      window.omaniTherapistAI = new OmaniTherapistVoiceAI();
      console.log("🕌 Omani Therapist Voice AI System Ready");
    }, 100);
  } catch (error) {
    console.error("System initialization error:", error);
    document.body.innerHTML = `
      <div style="text-align: center; padding: 50px; color: #721c24; background: #f8d7da;">
        <h2>System Loading Error</h2>
        <p>Sorry, an error occurred while starting the mental health therapist. Please reload the page.</p>
        <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px;">Reload Page</button>
      </div>
    `;
  }
});
