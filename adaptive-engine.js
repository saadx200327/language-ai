(function() {
    'use strict';

    const ADAPTIVE_KEY = 'language_ai_adaptive_v1';

    function getAdaptiveState() {
        const data = localStorage.getItem(ADAPTIVE_KEY);
        return data ? JSON.parse(data) : { attempts: [], mastery: {} };
    }

    function saveAdaptiveState(state) {
        localStorage.setItem(ADAPTIVE_KEY, JSON.stringify(state));
        syncFallback(state);
    }

    function syncFallback(state) {
        const bridges = [
            window.LanguageAiFirebase,
            window.firebaseBackend,
            window.LanguageAiCloud,
            window.LanguageAiSync,
            window.appFirebase
        ];
        bridges.forEach(bridge => {
            if (bridge && (bridge.saveProgress || bridge.syncProgress || bridge.saveAdaptiveProgress)) {
                const fn = bridge.saveAdaptiveProgress || bridge.syncProgress || bridge.saveProgress;
                if (typeof fn === 'function') fn.call(bridge, state);
            }
        });
    }

    function recordAdaptiveAttempt(attempt) {
        const state = getAdaptiveState();
        const fullAttempt = {
            courseId: attempt.courseId || 'default',
            lessonId: attempt.lessonId || 'default',
            itemId: attempt.itemId || 'unknown',
            promptText: attempt.promptText || '',
            correctAnswer: attempt.correctAnswer || '',
            userAnswer: attempt.userAnswer || '',
            activityType: attempt.activityType || 'unknown',
            correct: !!attempt.correct,
            responseMs: attempt.responseMs || 0,
            hintUsed: !!attempt.hintUsed,
            timestamp: Date.now()
        };
        state.attempts.push(fullAttempt);
        updateItemMastery(fullAttempt, state);
        saveAdaptiveState(state);
    }

    function updateItemMastery(attempt, state) {
        const { courseId, itemId, correct } = attempt;
        const key = `${courseId}_${itemId}`;
        let m = state.mastery[key] || {
            seenCount: 0,
            correctCount: 0,
            wrongCount: 0,
            currentStreak: 0,
            lastSeenAt: 0,
            mastery: 0.25,
            dueAt: 0,
            difficulty: 'weak'
        };

        m.seenCount++;
        m.lastSeenAt = Date.now();

        if (correct) {
            m.correctCount++;
            m.currentStreak++;
            const streakBonus = Math.min(0.05, m.currentStreak * 0.01);
            m.mastery = Math.min(1, m.mastery + 0.10 + streakBonus);
        } else {
            m.wrongCount++;
            m.currentStreak = 0;
            m.mastery = Math.max(0, m.mastery - 0.16);
        }

        if (m.mastery < 0.30) m.difficulty = 'weak';
        else if (m.mastery < 0.50) m.difficulty = 'learning';
        else if (m.mastery < 0.75) m.difficulty = 'solid';
        else m.difficulty = 'mastered';

        let delay = 0;
        if (!correct) delay = 10 * 60 * 1000;
        else if (m.difficulty === 'learning') delay = 24 * 60 * 60 * 1000;
        else if (m.difficulty === 'solid') delay = 3 * 24 * 60 * 60 * 1000;
        else if (m.difficulty === 'mastered') delay = 7 * 24 * 60 * 60 * 1000;
        
        m.dueAt = Date.now() + delay;
        state.mastery[key] = m;
    }

    function getWeakItems(courseId, limit = 5) {
        const state = getAdaptiveState();
        return Object.values(state.mastery)
            .filter(m => !courseId || m.courseId === courseId)
            .sort((a, b) => a.mastery - b.mastery)
            .slice(0, limit);
    }

    function getDueReviewItems(courseId, limit = 10) {
        const state = getAdaptiveState();
        const now = Date.now();
        return Object.values(state.mastery)
            .filter(m => (!courseId || m.courseId === courseId) && m.dueAt <= now)
            .sort((a, b) => a.dueAt - b.dueAt)
            .slice(0, limit);
    }

    function getSmartLessonMix(courseId, currentLessonId) {
        return {
            reviewItems: getDueReviewItems(courseId, 3),
            lessonId: currentLessonId
        };
    }

    function getSmartPlanMessage(courseId) {
        const state = getAdaptiveState();
        const weakCount = Object.values(state.mastery).filter(m => m.difficulty === 'weak').length;
        if (weakCount > 5) {
            return {
                bn: "আজ একটু ধীরে চলি। আমরা আবার প্র্যাকটিস করবো যেগুলোতে আপনার সমস্যা হচ্ছে।",
                en: "Let’s slow down today. Review these first..."
            };
        }
        return {
            bn: "আপনি দারুণ করছেন! নতুন কিছু শেখা যাক।",
            en: "You are doing great! Let's learn something new."
        };
    }

    window.LanguageAiAdaptive = {
        getAdaptiveState, saveAdaptiveState, recordAdaptiveAttempt,
        updateItemMastery: (attempt) => { const s = getAdaptiveState(); updateItemMastery(attempt, s); saveAdaptiveState(s); },
        getWeakItems, getDueReviewItems, getSmartLessonMix, getSmartPlanMessage
    };

    document.addEventListener('click', (e) => {
        const screen = document.querySelector('#screen');
        if (!screen || !screen.contains(e.target)) return;
        if (e.target.closest('.bottom-nav, .drawer, .topbar, .adaptive-card-btn')) return;

        let correct = null;
        const target = e.target.closest('[data-correct], [data-answer], .correct, .wrong, .success, .error');
        if (target) {
            if (target.dataset.correct === 'true' || target.classList.contains('correct') || target.classList.contains('success')) correct = true;
            else if (target.dataset.correct === 'false' || target.classList.contains('wrong') || target.classList.contains('error')) correct = false;
        }

        if (correct === null) {
            const feedback = document.body.innerText.toLowerCase();
            if (['correct', 'success', 'সঠিক', 'ভালো'].some(w => feedback.includes(w))) correct = true;
            else if (['wrong', 'try again', 'ভুল', 'আবার চেষ্টা'].some(w => feedback.includes(w))) correct = false;
        }

        if (correct !== null) {
            const item = e.target.closest('[data-item-id]') || { dataset: {} };
            recordAdaptiveAttempt({
                courseId: item.dataset.courseId,
                lessonId: item.dataset.lessonId,
                itemId: item.dataset.itemId,
                correct: correct,
                activityType: 'click'
            });
        }
    }, true);

    function injectUI() {
        const screen = document.querySelector('#screen');
        if (!screen) return;
        const view = document.body.dataset.view || '';
        if (view === 'home' && !screen.querySelector('.smart-plan')) {
            const plan = getSmartPlanMessage();
            const card = document.createElement('div');
            card.className = 'adaptive-card smart-plan glass';
            card.style = 'margin: 10px; padding: 15px; border-radius: 15px; background: rgba(255,255,255,0.8); box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
            card.innerHTML = `<strong>Today's Smart Plan</strong><p style="margin:5px 0;">${plan.bn}</p><small style="color:#666;">${plan.en}</small>`;
            screen.prepend(card);
        }
        if (view === 'review' && !screen.querySelector('.weak-words')) {
            const weak = getWeakItems();
            if (weak.length > 0) {
                const card = document.createElement('div');
                card.className = 'adaptive-card weak-words glass';
                card.style = 'margin: 10px; padding: 15px; border-radius: 15px; background: rgba(255,255,255,0.8);';
                card.innerHTML = '<h3 style="margin-top:0;">Weak Items</h3>' + weak.map(i => `
                    <div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0;padding:8px;background:#fff;border-radius:10px;">
                        <span>${i.itemId}</span>
                        <button class="adaptive-card-btn" style="border:none;background:none;font-size:20px;cursor:pointer;padding:5px;">🔊</button>
                    </div>
                `).join('');
                screen.appendChild(card);
            }
        }
    }
    const observer = new MutationObserver(() => injectUI());
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-view'] });
    setInterval(injectUI, 3000);
})();
