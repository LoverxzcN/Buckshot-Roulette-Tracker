document.addEventListener('DOMContentLoaded', function () {
    const startGameButton = document.getElementById('start-game');
    const trackerSection = document.getElementById('tracker-section');
    const initSection = document.getElementById('init-section');
    const liveShotButton = document.getElementById('live-shot');
    const blankShotButton = document.getElementById('blank-shot');
    const resetGameButton = document.getElementById('reset-game');
    const bulletsDisplay = document.getElementById('bullets-display');
    const chanceDisplay = document.getElementById('chance-display');
    const liveBulletCount = document.getElementById('live-bullet-count');
    const blankBulletCount = document.getElementById('blank-bullet-count');
    const liveBulletButtons = document.getElementById('live-bullet-buttons');
    const blankBulletButtons = document.getElementById('blank-bullet-buttons');
    const setLiveCurrentBtn = document.getElementById('set-live-current');
    const setBlankCurrentBtn = document.getElementById('set-blank-current');
    const phonePositionInput = document.getElementById('phone-position');
    const addPhoneLiveBtn = document.getElementById('add-phone-live');
    const addPhoneBlankBtn = document.getElementById('add-phone-blank');
    const predictionsList = document.getElementById('predictions-list');
    const knownBulletsDisplay = document.getElementById('known-bullets-display');
    const invertCurrentBtn = document.getElementById('invert-current');
    const languageSelect = document.getElementById('language-select');
    const tutorialModal = document.getElementById('tutorial-modal');
    const showTutorialBtn = document.getElementById('show-tutorial');
    const closeButton = document.querySelector('.close-button');

    let gameState = {
        liveBullets: 0,
        blankBullets: 0,
        isGameActive: false,
        shotsFired: 0,
        knownSequence: [],
        predictions: [],
        initialTotalBullets: 0,
        invertedBullets: []
    };

    let isAnimating = false;
    
    const translations = {
        ru: {
            title: 'Buckshot Roulette Tracker',
            gameStart: 'Начало игры',
            setupTitle: 'Настройка через кнопки',
            liveBullets: 'Боевых патронов',
            blankBullets: 'Холостых патронов',
            add: 'Добавить',
            remove: 'Убрать',
            start: 'Начать',
            bulletCounter: 'Счетчик патронов',
            totalBullets: 'Всего патронов',
            totalBulletsCount: 'Всего патронов: ',
            knownSequence: 'Известная последовательность',
            live: 'Боевой',
            blank: 'Холостой',
            items: 'Предметы',
            magnifier: 'Лупа',
            inverter: 'Инвертор',
            invertCurrent: 'Инвертировать текущий патрон',
            phone: 'Телефон',
            bulletNumber: 'Номер патрона',
            predictions: 'Предсказания телефона',
            reset: 'Сбросить',
            noAmmo: 'Патроны закончились!',
            currentBulletIs: 'Текущий патрон',
            shootEnemy: 'Лучше всего стрелять в противника',
            shootSelf: 'Лучше всего стрелять в себя',
            chanceEqual: 'Шансы равны',
            knownFuture: 'Известно в будущем',
            liveBullet: 'боевой',
            blankBullet: 'холостой',
            bulletNth: '-й патрон',
            definitelyLive: 'Текущий патрон точно боевой',
            definitelyBlank: 'Текущий патрон точно холостой',
            enterValidBulletNumber: 'Пожалуйста, введите корректный номер патрона',
            positionOutOfRange: 'Указанная позиция находится за пределами текущей последовательности',
            bulletImageError: 'Ошибка загрузки изображения патрона',
            unknownBullet: 'Неизвестный патрон'
        },
        en: {
            title: 'Buckshot Roulette Tracker',
            gameStart: 'Game Start',
            setupTitle: 'Setup with buttons',
            liveBullets: 'Live Bullets',
            blankBullets: 'Blank Bullets',
            add: 'Add',
            remove: 'Remove',
            start: 'Start',
            bulletCounter: 'Bullet Counter',
            totalBullets: 'Total Bullets',
            totalBulletsCount: 'Total bullets: ',
            knownSequence: 'Known Sequence',
            live: 'Live',
            blank: 'Blank',
            items: 'Items',
            magnifier: 'Magnifier',
            inverter: 'Inverter',
            invertCurrent: 'Invert Current Bullet',
            phone: 'Phone',
            bulletNumber: 'Bullet Number',
            predictions: 'Phone Predictions',
            reset: 'Reset',
            noAmmo: 'No ammo left!',
            currentBulletIs: 'Current bullet is',
            shootEnemy: 'Best to shoot the enemy',
            shootSelf: 'Best to shoot yourself',
            chanceEqual: 'Chances are equal',
            knownFuture: 'Known in future',
            liveBullet: 'live',
            blankBullet: 'blank',
            bulletNth: 'th bullet',
            definitelyLive: 'Current bullet is definitely live',
            definitelyBlank: 'Current bullet is definitely blank',
            enterValidBulletNumber: 'Please enter a valid bullet number',
            positionOutOfRange: 'The specified position is out of range',
            bulletImageError: 'Failed to load bullet image',
            unknownBullet: 'Unknown bullet'
        }
    };

    let currentLanguage = 'en';
    updateLanguage('en')

    function updateLanguage(lang) {
        currentLanguage = lang;
        const t = translations[lang];

        document.querySelector('h1').textContent = t.title;
        document.querySelector('#init-section h2').textContent = t.gameStart;
        document.querySelector('#button-input h3').textContent = t.setupTitle;
        document.querySelector('#start-game').textContent = t.start;

        const bulletCount = document.getElementById('total-bullet-count').textContent;
        document.querySelector('.bullet-limit').innerHTML = `${t.totalBulletsCount}<span id="total-bullet-count">${bulletCount}</span>/10`;

        document.querySelectorAll('.bullet-setup label').forEach(label => {
            if (label.querySelector('img[src="live.png"]')) {
                label.innerHTML = `<img src="live.png" class="icon">${t.liveBullets}:`;
            } else {
                label.innerHTML = `<img src="blank.png" class="icon">${t.blankBullets}:`;
            }
        });

        document.querySelectorAll('[data-action="increase"][data-target="live"]').forEach(btn => 
            btn.innerHTML = `<img src="live.png" class="icon">${t.add}`);
        document.querySelectorAll('[data-action="decrease"][data-target="live"]').forEach(btn => 
            btn.innerHTML = `<img src="live.png" class="icon">${t.remove}`);
        document.querySelectorAll('[data-action="increase"][data-target="blank"]').forEach(btn => 
            btn.innerHTML = `<img src="blank.png" class="icon">${t.add}`);
        document.querySelectorAll('[data-action="decrease"][data-target="blank"]').forEach(btn => 
            btn.innerHTML = `<img src="blank.png" class="icon">${t.remove}`);

        document.querySelector('.game-column h2').textContent = t.bulletCounter;
        document.querySelector('#known-sequence h3').textContent = t.knownSequence;
        
        document.querySelector('#live-shot').innerHTML = `<img src="live.png" class="icon">${t.live}`;
        document.querySelector('#blank-shot').innerHTML = `<img src="blank.png" class="icon">${t.blank}`;
        
        document.querySelector('.items-section h3').textContent = t.items;
        
        document.querySelector('.magnifier-controls p').textContent = t.magnifier + ':';
        document.querySelector('#set-live-current').innerHTML = `<img src="live.png" class="icon">${t.live}`;
        document.querySelector('#set-blank-current').innerHTML = `<img src="blank.png" class="icon">${t.blank}`;
        
        document.querySelector('.inverter-controls p').textContent = t.inverter + ':';
        document.querySelector('#invert-current').textContent = t.invertCurrent;
        
        document.querySelector('.phone-controls p').textContent = t.phone + ':';
        document.querySelector('#phone-position').placeholder = t.bulletNumber;
        document.querySelector('#add-phone-live').innerHTML = `<img src="live.png" class="icon">${t.live}`;
        document.querySelector('#add-phone-blank').innerHTML = `<img src="blank.png" class="icon">${t.blank}`;
        document.querySelector('#phone-predictions h4').textContent = t.predictions + ':';
        
        document.querySelector('#reset-game').textContent = t.reset;

        updateChanceDisplay();
        updatePredictionsList();
        updateKnownSequence();

        // Update tutorial button text
        showTutorialBtn.textContent = lang === 'ru' ? 'Как использовать' : 'How to use';

        // Update tutorial visibility
        if (tutorialModal.style.display === 'block') {
            document.getElementById('tutorial-ru').style.display = lang === 'ru' ? 'block' : 'none';
            document.getElementById('tutorial-en').style.display = lang === 'ru' ? 'none' : 'block';
        }
    }

    function loadGameState() {
        const savedState = localStorage.getItem('buckshotGameState');
        if (savedState) {
            gameState = JSON.parse(savedState);
            updateDisplay();
            if (gameState.isGameActive) {
                showGameSection();
                createBulletVisuals();
            }
        }
    }

    function saveGameState() {
        localStorage.setItem('buckshotGameState', JSON.stringify(gameState));
    }

     function updateChanceDisplay() {
        const t = translations[currentLanguage];
        const totalBullets = gameState.liveBullets + gameState.blankBullets;
        
        if (totalBullets === 0) {
            chanceDisplay.textContent = t.noAmmo;
            return;
        }

        const currentBulletType = gameState.knownSequence[gameState.shotsFired];
        const isCurrentInverted = gameState.invertedBullets[gameState.shotsFired];
        
        if (currentBulletType) {
            const effectiveType = isCurrentInverted ? 
                (currentBulletType === 'live' ? 'blank' : 'live') : 
                currentBulletType;
                
            chanceDisplay.textContent = `${t.currentBulletIs} ${effectiveType === 'live' ? t.liveBullet : t.blankBullet}`;
            return;
        }

        let knownLive = 0;
        let knownBlank = 0;
        let unknownBullets = totalBullets;

        for (let i = gameState.shotsFired + 1; i < gameState.knownSequence.length; i++) {
            const bulletType = gameState.knownSequence[i];
            const isInverted = gameState.invertedBullets[i];
            
            if (bulletType) {
                const effectiveType = isInverted ? 
                    (bulletType === 'live' ? 'blank' : 'live') : 
                    bulletType;
                    
                if (effectiveType === 'live') {
                    knownLive++;
            } else {
                    knownBlank++;
                }
                unknownBullets--;
            }
        }

        const remainingLive = gameState.liveBullets - knownLive;
        const remainingBlank = gameState.blankBullets - knownBlank;

        if (unknownBullets === 1) {
            const mustBeLive = remainingLive === 1;
            const mustBeBlank = remainingBlank === 1;
            if (mustBeLive) {
                chanceDisplay.textContent = t.definitelyLive;
            } else if (mustBeBlank) {
                chanceDisplay.textContent = t.definitelyBlank;
            }
            return;
        }

        const liveChance = ((remainingLive / unknownBullets) * 100).toFixed(0);
        const blankChance = ((remainingBlank / unknownBullets) * 100).toFixed(0);

        let message = '';
        if (liveChance > blankChance) {
            message = `${t.shootEnemy} (${liveChance}% ${t.liveBullet})`;
        } else if (blankChance > liveChance) {
            message = `${t.shootSelf} (${blankChance}% ${t.blankBullet})`;
        } else {
            message = `${t.chanceEqual}: ${liveChance}% ${t.liveBullet}/${t.blankBullet}`;
        }

        if (knownLive > 0 || knownBlank > 0) {
            message += `\n${t.knownFuture}: ${knownLive} ${t.liveBullet}, ${knownBlank} ${t.blankBullet}`;
        }

        chanceDisplay.textContent = message;
    }

    function updateDisplay() {
        const totalBullets = gameState.liveBullets + gameState.blankBullets;
        liveBulletCount.textContent = gameState.liveBullets;
        blankBulletCount.textContent = gameState.blankBullets;
        
        const totalBulletCount = document.getElementById('total-bullet-count');
        if (totalBulletCount) {
            totalBulletCount.textContent = totalBullets;
        }
        
        updateButtonStates();
        updateChanceDisplay();
        saveGameState();
        
        requestAnimationFrame(() => {
            liveShotButton.disabled = liveShotButton.disabled;
            blankShotButton.disabled = blankShotButton.disabled;
        });
    }

    function updateButtonStates() {
        const currentIndex = gameState.shotsFired;
        const isInverted = gameState.invertedBullets[currentIndex];
        const totalBullets = gameState.liveBullets + gameState.blankBullets;

        if (totalBullets === 0) {
            liveShotButton.disabled = true;
            blankShotButton.disabled = true;
            return;
        }

        if (isInverted) {
            liveShotButton.disabled = false;
            blankShotButton.disabled = false;
            return;
        }

        liveShotButton.disabled = gameState.liveBullets === 0;
        blankShotButton.disabled = gameState.blankBullets === 0;
    }

    function createBulletVisuals() {
        const t = translations[currentLanguage];
        bulletsDisplay.innerHTML = '';
        const totalBullets = gameState.liveBullets + gameState.blankBullets;
        
        const indices = Array.from({ length: totalBullets }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        indices.forEach((_, index) => {
            const bulletImg = document.createElement('img');
            bulletImg.onerror = () => {
                bulletImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
                console.error(t.bulletImageError);
            };
            
            if (index < gameState.liveBullets) {
                bulletImg.src = 'live.png';
                bulletImg.alt = t.liveBullet;
            } else {
                bulletImg.src = 'blank.png';
                bulletImg.alt = t.blankBullet;
            }
            
            bulletsDisplay.appendChild(bulletImg);
        });

        gameState.initialTotalBullets = totalBullets;

        if (gameState.knownSequence.length === 0) {
            gameState.knownSequence = new Array(totalBullets).fill(null);
        }
        updateKnownSequence();
    }

    function updateKnownSequence() {
        const t = translations[currentLanguage];
        knownBulletsDisplay.innerHTML = '';
        
        for (let i = 0; i < gameState.initialTotalBullets; i++) {
            const bulletWrapper = document.createElement('div');
            bulletWrapper.className = 'bullet-wrapper';
            
            const bulletImg = document.createElement('img');
            bulletImg.onerror = () => {
                bulletImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
            };
            
            const knownType = gameState.knownSequence[i];
            const isInverted = gameState.invertedBullets[i];
            
            if (knownType) {
                const effectiveType = isInverted ? 
                    (knownType === 'live' ? 'blank' : 'live') : 
                    knownType;
                
                bulletImg.src = effectiveType + '.png';
                bulletImg.alt = effectiveType === 'live' ? t.liveBullet : t.blankBullet;
            } else {
                bulletImg.src = 'unknown.png';
                bulletImg.alt = t.unknownBullet;
            }

            if (i === gameState.shotsFired) {
                setTimeout(() => {
                    bulletWrapper.classList.add('current');
                }, 50);
            }
            
            if (isInverted) {
                const invertedImg = document.createElement('img');
                invertedImg.src = 'inverted.png';
                invertedImg.alt = 'inverted';
                invertedImg.style.position = 'absolute';
                invertedImg.style.top = '0';
                invertedImg.style.left = '0';
                invertedImg.style.width = '100%';
                invertedImg.style.height = '100%';
                bulletWrapper.appendChild(invertedImg);
            }
            
            bulletWrapper.appendChild(bulletImg);
            knownBulletsDisplay.appendChild(bulletWrapper);
        }
    }

    function updatePredictionsList() {
        const t = translations[currentLanguage];
        predictionsList.innerHTML = '';
        gameState.predictions.forEach((pred, index) => {
            const li = document.createElement('li');
            const text = document.createElement('span');
            const relativePosition = pred.position - gameState.shotsFired;
            text.textContent = `${relativePosition}${t.bulletNth}... ${pred.type === 'live' ? t.liveBullet : t.blankBullet}...`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '✕';
            deleteBtn.onclick = () => {
                gameState.knownSequence[pred.position - 1] = null;
                gameState.predictions.splice(index, 1);
                updatePredictionsList();
                updateKnownSequence();
                updateChanceDisplay();
                saveGameState();
            };
            
            li.appendChild(text);
            li.appendChild(deleteBtn);
            predictionsList.appendChild(li);
        });
    }

    function setCurrentBullet(type) {
        const currentIndex = gameState.shotsFired;
        const isInverted = gameState.invertedBullets[currentIndex];
        
        const effectiveType = isInverted ? (type === 'live' ? 'blank' : 'live') : type;
        
        gameState.knownSequence[currentIndex] = effectiveType;
        updateKnownSequence();
        updateChanceDisplay();
        saveGameState();
    }

    function addPhonePrediction(type) {
        const t = translations[currentLanguage];
        const position = parseInt(phonePositionInput.value);
        if (isNaN(position) || position < 1) {
            alert(t.enterValidBulletNumber);
            return;
        }

        if (position > gameState.initialTotalBullets - gameState.shotsFired) {
            alert(t.positionOutOfRange);
            return;
        }

        const absolutePosition = position + gameState.shotsFired;
        const isInverted = gameState.invertedBullets[absolutePosition - 1];
        
        const effectiveType = isInverted ? (type === 'live' ? 'blank' : 'live') : type;
        
        gameState.predictions.push({
            position: absolutePosition,
            type: effectiveType
        });

        if (gameState.knownSequence.length === 0) {
            gameState.knownSequence = new Array(gameState.initialTotalBullets).fill(null);
        }
        gameState.knownSequence[absolutePosition - 1] = effectiveType;

        phonePositionInput.value = '';
        updatePredictionsList();
        updateKnownSequence();
        updateChanceDisplay();
        saveGameState();
    }

    async function removeBulletVisual(type) {
        const bullets = Array.from(bulletsDisplay.getElementsByTagName('img'));
        const bulletToRemove = bullets.reverse().find(img => 
            !img.classList.contains('animating') && 
            ((type === 'live' && img.src.includes('live.png')) || 
            (type === 'blank' && img.src.includes('blank.png')))
        );
        
        if (bulletToRemove) {
            bulletsDisplay.classList.add('reflow');
            
            await animateBullet(bulletToRemove, type);
            
            bullets.forEach(bullet => {
                if (bullet !== bulletToRemove && !bullet.classList.contains('animating')) {
                    bullet.style.position = 'relative';
                    const rect = bullet.getBoundingClientRect();
                    bullet.dataset.startX = rect.left;
                    bullet.dataset.startY = rect.top;
                }
            });
            
            await new Promise(resolve => setTimeout(resolve, 300));
            bullets.forEach(bullet => {
                if (bullet !== bulletToRemove && !bullet.classList.contains('animating')) {
                    bullet.style.position = '';
                }
            });
            bulletsDisplay.classList.remove('reflow');
        }
    }

    function animateBullet(bulletImg, type) {
        return new Promise((resolve) => {
            const container = bulletsDisplay.getBoundingClientRect();
            const rect = bulletImg.getBoundingClientRect();
            
            const startX = rect.left - container.left;
            const startY = rect.top - container.top;
            
            bulletImg.style.position = 'absolute';
            bulletImg.style.left = startX + 'px';
            bulletImg.style.top = startY + 'px';
            bulletImg.classList.add('animating');
            
            const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
            const speed = 15 + Math.random() * 5;
            const gravity = 0.8;
            
            let velocityX = Math.sin(angle) * speed * (type === 'live' ? -1 : 1);
            let velocityY = -Math.cos(angle) * speed;
            let posX = startX;
            let posY = startY;
            let rotation = 0;
            const rotationSpeed = (Math.random() - 0.5) * 20;
            
            function animate() {
                velocityY += gravity;
                posX += velocityX;
                posY += velocityY;
                rotation += rotationSpeed;
                
                bulletImg.style.transform = `translate(${posX - startX}px, ${posY - startY}px) rotate(${rotation}deg)`;
                
                if (posY < window.innerHeight && posX > -100 && posX < window.innerWidth + 100) {
                    requestAnimationFrame(animate);
                } else {
                    bulletImg.remove();
                    resolve();
                }
            }
            
            requestAnimationFrame(animate);
        });
    }

    function showGameSection() {
        gameState.isGameActive = true;
        initSection.style.display = 'none';
        trackerSection.style.display = 'block';
        saveGameState();
    }

    function showInitSection() {
        gameState.isGameActive = false;
        initSection.style.display = 'block';
        trackerSection.style.display = 'none';
        saveGameState();
    }

    liveBulletButtons.addEventListener('click', function(event) {
        const button = event.target.closest('button');
        if (!button) return;
        
        const action = button.dataset.action;
        const currentIndex = gameState.shotsFired;
        const isInverted = gameState.invertedBullets[currentIndex];
        const totalBullets = gameState.liveBullets + gameState.blankBullets;

        if (action === 'increase') {
            if (totalBullets < 10) {
                gameState.liveBullets++;
            }
        } else if (action === 'decrease') {
            if (isInverted ? gameState.blankBullets > 0 : gameState.liveBullets > 0) {
                if (isInverted) {
                    gameState.blankBullets--;
                } else {
                    gameState.liveBullets--;
                }
            }
        }
        
        updateDisplay();
    });

    blankBulletButtons.addEventListener('click', function(event) {
        const button = event.target.closest('button');
        if (!button) return;
        
        const action = button.dataset.action;
        const currentIndex = gameState.shotsFired;
        const isInverted = gameState.invertedBullets[currentIndex];
        const totalBullets = gameState.liveBullets + gameState.blankBullets;

        if (action === 'increase') {
            if (totalBullets < 10) {
                gameState.blankBullets++;
            }
        } else if (action === 'decrease') {
            if (isInverted ? gameState.liveBullets > 0 : gameState.blankBullets > 0) {
                if (isInverted) {
                    gameState.liveBullets--;
                } else {
                    gameState.blankBullets--;
                }
            }
        }
        
         updateDisplay();
    });

    startGameButton.addEventListener('click', function() {
        showGameSection();
        createBulletVisuals();
        updateDisplay();
    });

    liveShotButton.addEventListener('click', async function() {
        const currentIndex = gameState.shotsFired;
        const isInverted = gameState.invertedBullets[currentIndex];
        const totalBullets = gameState.liveBullets + gameState.blankBullets;

        if (totalBullets > 0 && (isInverted || gameState.liveBullets > 0)) {
            gameState.knownSequence[currentIndex] = isInverted ? 'blank' : 'live';
            
            if (isInverted) {
                gameState.blankBullets--;
            } else {
                gameState.liveBullets--;
            }
            
            gameState.shotsFired++;
            updateDisplay();
            updateKnownSequence();
            saveGameState();

            if (isInverted) {
                await removeBulletVisual('blank');
            } else {
                await removeBulletVisual('live');
            }
        }
    });

    blankShotButton.addEventListener('click', async function() {
        const currentIndex = gameState.shotsFired;
        const isInverted = gameState.invertedBullets[currentIndex];
        const totalBullets = gameState.liveBullets + gameState.blankBullets;

        if (totalBullets > 0 && (isInverted || gameState.blankBullets > 0)) {
            gameState.knownSequence[currentIndex] = isInverted ? 'live' : 'blank';
            
            if (isInverted) {
                gameState.liveBullets--;
            } else {
                gameState.blankBullets--;
            }
            
            gameState.shotsFired++;
            updateDisplay();
            updateKnownSequence();
            saveGameState();

            if (isInverted) {
                await removeBulletVisual('live');
            } else {
                await removeBulletVisual('blank');
            }
        }
    });

    resetGameButton.addEventListener('click', function() {
        gameState = {
            liveBullets: 0,
            blankBullets: 0,
            isGameActive: false,
            shotsFired: 0,
            knownSequence: [],
            predictions: [],
            initialTotalBullets: 0,
            invertedBullets: []
        };
        
        showInitSection();
        bulletsDisplay.innerHTML = '';
        knownBulletsDisplay.innerHTML = '';
        predictionsList.innerHTML = '';
        phonePositionInput.value = '';
        updateDisplay();
    });

    setLiveCurrentBtn.addEventListener('click', () => setCurrentBullet('live'));
    setBlankCurrentBtn.addEventListener('click', () => setCurrentBullet('blank'));
    addPhoneLiveBtn.addEventListener('click', () => addPhonePrediction('live'));
    addPhoneBlankBtn.addEventListener('click', () => addPhonePrediction('blank'));
    invertCurrentBtn.addEventListener('click', invertCurrentBullet);

    languageSelect.addEventListener('change', function() {
        updateLanguage(this.value);
    });

    loadGameState();
    if (!gameState.isGameActive) {
        resetGameButton.click();
    }

    function invertCurrentBullet() {
        const currentIndex = gameState.shotsFired;
        
        gameState.invertedBullets[currentIndex] = !gameState.invertedBullets[currentIndex];

        updateButtonStates();
        updateKnownSequence();
        updateChanceDisplay();
        saveGameState();
        
        requestAnimationFrame(() => {
            liveShotButton.disabled = liveShotButton.disabled;
            blankShotButton.disabled = blankShotButton.disabled;
        });
    }

    // Tutorial modal controls
    showTutorialBtn.addEventListener('click', () => {
        tutorialModal.style.display = 'block';
        document.getElementById('tutorial-ru').style.display = currentLanguage === 'ru' ? 'block' : 'none';
        document.getElementById('tutorial-en').style.display = currentLanguage === 'ru' ? 'none' : 'block';
    });

    closeButton.addEventListener('click', () => {
        tutorialModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === tutorialModal) {
            tutorialModal.style.display = 'none';
        }
    });

    updateLanguage(currentLanguage);
});
