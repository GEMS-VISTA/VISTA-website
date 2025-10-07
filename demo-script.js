// Enhanced Demo Page Functionality
class VirtualLab {
    constructor() {
        this.state = {
            currentEquipment: 'power-supply',
            voltage: 5.0,
            currentLimit: 1.0,
            outputEnabled: false,
            recording: false,
            recordingTime: 0,
            sampleCount: 0,
            experimentRunning: false,
            videoFeedVisible: false,
            currentView: 'waveform',
            currentHelpPanel: 'getting-started'
        };
        
        this.intervals = new Map();
        this.canvases = new Map();
        this.measurements = {
            voltage: 0,
            current: 0,
            power: 0,
            frequency: 1000,
            amplitude: 5.0
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing VISTA Virtual Lab...');
        this.initializeEventListeners();
        this.initializeCanvases();
        this.updateDisplays();
        this.startSimulations();
        this.initializePowerSupplyControls();
        console.log('VISTA Virtual Lab initialized successfully');
    }
    
    initializeEventListeners() {
        // Equipment selection
        document.querySelectorAll('.equipment-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectEquipment(card.dataset.equipment);
            });
        });
        
        // Equipment tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchEquipmentTab(btn.dataset.tab);
            });
        });
        
        // Experiment selection
        const experimentSelect = document.getElementById('experimentSelect');
        const loadExperimentBtn = document.getElementById('loadExperiment');
        if (loadExperimentBtn) {
            loadExperimentBtn.addEventListener('click', () => {
                this.loadExperiment(experimentSelect?.value);
            });
        }
        
        // Video feed toggle
        const videoToggle = document.getElementById('toggleVideoFeed');
        if (videoToggle) {
            videoToggle.addEventListener('click', () => {
                this.toggleVideoFeed();
            });
        }
        
        // Action buttons
        const startBtn = document.getElementById('startExperiment');
        const pauseBtn = document.getElementById('pauseExperiment');
        const downloadBtn = document.getElementById('downloadData');
        const shareBtn = document.getElementById('shareResults');
        const shareSessionBtn = document.getElementById('shareSession');
        
        if (startBtn) startBtn.addEventListener('click', () => this.toggleExperiment());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pauseExperiment());
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadData());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareResults());
        if (shareSessionBtn) shareSessionBtn.addEventListener('click', () => this.shareSession());
        
        // Visualization controls
        document.querySelectorAll('.viz-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchVisualization(btn.dataset.view);
            });
        });
        
        // Help system
        document.querySelectorAll('.help-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchHelpPanel(tab.dataset.help);
            });
        });
        
        // Circuit tools
        document.querySelectorAll('.tool-btn').forEach(tool => {
            tool.addEventListener('click', () => {
                this.selectCircuitTool(tool.dataset.tool);
            });
        });
        
        // Video controls
        const videoControls = ['zoomIn', 'zoomOut', 'panLeft', 'panRight'];
        videoControls.forEach(control => {
            const btn = document.getElementById(control);
            if (btn) {
                btn.addEventListener('click', () => this.handleVideoControl(control));
            }
        });
        
        // Oscilloscope controls
        const scopeControls = document.querySelectorAll('.scope-btn');
        scopeControls.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleScopeControl(btn.textContent.trim());
            });
        });
        
        // Oscilloscope sliders
        const ch1Scale = document.getElementById('ch1Scale');
        const timeBase = document.getElementById('timeBase');
        const triggerLevel = document.getElementById('triggerLevel');
        
        if (ch1Scale) {
            ch1Scale.addEventListener('input', (e) => {
                this.updateScopeControl('ch1Scale', e.target.value);
            });
        }
        if (timeBase) {
            timeBase.addEventListener('input', (e) => {
                this.updateScopeControl('timeBase', e.target.value);
            });
        }
        if (triggerLevel) {
            triggerLevel.addEventListener('input', (e) => {
                this.updateScopeControl('triggerLevel', e.target.value);
            });
        }
        
        // Multimeter controls
        const meterFunction = document.getElementById('meterFunction');
        if (meterFunction) {
            meterFunction.addEventListener('change', (e) => {
                this.changeMeterFunction(e.target.value);
            });
        }
        
        const meterButtons = document.querySelectorAll('.meter-btn');
        meterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleMeterButton(btn.textContent.trim());
            });
        });
        
        // Signal generator controls
        const waveformType = document.getElementById('waveformType');
        const genFrequency = document.getElementById('genFrequency');
        const genAmplitude = document.getElementById('genAmplitude');
        const genOffset = document.getElementById('genOffset');
        const outputEnable = document.getElementById('outputEnable');
        
        if (waveformType) {
            waveformType.addEventListener('change', (e) => {
                this.updateSignalGenerator();
            });
        }
        if (genFrequency) {
            genFrequency.addEventListener('input', (e) => {
                this.measurements.frequency = parseFloat(e.target.value);
                this.updateSignalGenerator();
            });
        }
        if (genAmplitude) {
            genAmplitude.addEventListener('input', (e) => {
                this.measurements.amplitude = parseFloat(e.target.value);
                this.updateSignalGenerator();
            });
        }
        if (genOffset) {
            genOffset.addEventListener('input', (e) => {
                this.updateSignalGenerator();
            });
        }
        if (outputEnable) {
            outputEnable.addEventListener('click', () => {
                this.toggleSignalOutput();
            });
        }
        
        const genButtons = document.querySelectorAll('.gen-btn');
        genButtons.forEach(btn => {
            if (btn.id !== 'outputEnable') {
                btn.addEventListener('click', () => {
                    this.handleGenButton(btn.textContent.trim());
                });
            }
        });
        
        // Mobile navigation
        this.initializeMobileNavigation();
    }
    
    initializePowerSupplyControls() {
        // Voltage control
        const voltageSlider = document.getElementById('voltage');
        const voltageDisplay = document.getElementById('voltageDisplay');
        
        if (voltageSlider) {
            voltageSlider.addEventListener('input', (e) => {
                this.state.voltage = parseFloat(e.target.value);
                if (voltageDisplay) {
                    voltageDisplay.textContent = this.state.voltage.toFixed(1) + ' V';
                }
                this.updateMeasurements();
                this.updateCircuitSimulation();
            });
        }
        
        // Current control
        const currentSlider = document.getElementById('current');
        const currentDisplay = document.getElementById('currentDisplay');
        
        if (currentSlider) {
            currentSlider.addEventListener('input', (e) => {
                this.state.currentLimit = parseFloat(e.target.value);
                if (currentDisplay) {
                    currentDisplay.textContent = this.state.currentLimit.toFixed(1) + ' A';
                }
                this.updateMeasurements();
            });
        }
        
        // Output toggle
        const outputToggle = document.getElementById('outputToggle');
        if (outputToggle) {
            outputToggle.addEventListener('click', () => {
                this.toggleOutput();
            });
        }
        
        // Virtual knobs
        this.initializeVirtualKnobs();
    }
    
    initializeVirtualKnobs() {
        document.querySelectorAll('.virtual-knob').forEach(knob => {
            let isDragging = false;
            let startAngle = 0;
            let currentAngle = 0;
            
            knob.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = knob.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                const rect = knob.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                const deltaAngle = angle - startAngle;
                
                currentAngle += deltaAngle;
                currentAngle = Math.max(-Math.PI, Math.min(Math.PI, currentAngle));
                
                const indicator = knob.querySelector('.knob-indicator');
                if (indicator) {
                    indicator.style.transform = `translateX(-50%) rotate(${currentAngle * 180 / Math.PI}deg)`;
                }
                
                // Update corresponding control based on knob type
                const controlType = knob.dataset.control;
                if (controlType === 'voltage') {
                    const newVoltage = 15 + (currentAngle / Math.PI) * 15; // 0-30V range
                    this.state.voltage = Math.max(0, Math.min(30, newVoltage));
                    this.updateVoltageDisplay();
                } else if (controlType === 'current') {
                    const newCurrent = 2.5 + (currentAngle / Math.PI) * 2.5; // 0-5A range
                    this.state.currentLimit = Math.max(0, Math.min(5, newCurrent));
                    this.updateCurrentDisplay();
                }
                
                this.updateMeasurements();
                startAngle = angle;
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        });
    }
    
    updateVoltageDisplay() {
        const display = document.getElementById('voltageDisplay');
        const slider = document.getElementById('voltage');
        if (display) display.textContent = this.state.voltage.toFixed(1) + ' V';
        if (slider) slider.value = this.state.voltage;
    }
    
    updateCurrentDisplay() {
        const display = document.getElementById('currentDisplay');
        const slider = document.getElementById('current');
        if (display) display.textContent = this.state.currentLimit.toFixed(1) + ' A';
        if (slider) slider.value = this.state.currentLimit;
    }
    
    initializeCanvases() {
        // Waveform canvas
        const waveformCanvas = document.getElementById('waveformCanvas');
        if (waveformCanvas) {
            waveformCanvas.width = 800;
            waveformCanvas.height = 300;
            this.canvases.set('waveform', waveformCanvas.getContext('2d'));
        }
        
        // Trend canvas
        const trendCanvas = document.getElementById('trendCanvas');
        if (trendCanvas) {
            trendCanvas.width = 800;
            trendCanvas.height = 300;
            this.canvases.set('trend', trendCanvas.getContext('2d'));
        }
        
        // Histogram canvas
        const histogramCanvas = document.getElementById('histogramCanvas');
        if (histogramCanvas) {
            histogramCanvas.width = 800;
            histogramCanvas.height = 300;
            this.canvases.set('histogram', histogramCanvas.getContext('2d'));
        }
        
        // FFT canvas
        const fftCanvas = document.getElementById('fftCanvas');
        if (fftCanvas) {
            fftCanvas.width = 800;
            fftCanvas.height = 300;
            this.canvases.set('fft', fftCanvas.getContext('2d'));
        }
        
        // Oscilloscope canvas
        const scopeCanvas = document.getElementById('scopeCanvas');
        if (scopeCanvas) {
            scopeCanvas.width = 800;
            scopeCanvas.height = 400;
            this.canvases.set('scope', scopeCanvas.getContext('2d'));
        }
        
        // Waveform preview canvas
        const previewCanvas = document.getElementById('waveformPreview');
        if (previewCanvas) {
            previewCanvas.width = 200;
            previewCanvas.height = 100;
            this.canvases.set('preview', previewCanvas.getContext('2d'));
        }
        
        this.initializeCanvasGrids();
    }
    
    initializeCanvasGrids() {
        this.canvases.forEach((ctx, name) => {
            this.drawGrid(ctx, name);
        });
    }
    
    drawGrid(ctx, canvasName) {
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Grid styling
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Vertical lines
        const gridSpacing = canvasName === 'preview' ? 20 : 50;
        for (let x = 0; x <= canvas.width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= canvas.height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Center lines for scope displays
        if (canvasName === 'scope' || canvasName === 'waveform') {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            
            // Center horizontal line
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
            
            // Center vertical line
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
        }
    }
    
    selectEquipment(equipment) {
        // Update sidebar selection
        document.querySelectorAll('.equipment-card').forEach(card => {
            card.classList.remove('active');
        });
        const selectedCard = document.querySelector(`[data-equipment="${equipment}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }
        
        // Update main display
        this.switchEquipmentTab(equipment);
        this.state.currentEquipment = equipment;
        
        // Simulate equipment switching delay
        this.showNotification(`Switching to ${equipment.replace('-', ' ')}...`, 'info');
    }
    
    switchEquipmentTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const selectedTab = document.querySelector(`[data-tab="${tab}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Update interfaces
        document.querySelectorAll('.equipment-interface').forEach(iface => {
            iface.classList.remove('active');
        });
        const selectedInterface = document.getElementById(`${tab}-interface`);
        if (selectedInterface) {
            selectedInterface.classList.add('active');
        }
        
        this.state.currentEquipment = tab;
    }
    
    loadExperiment(experimentType) {
        if (!experimentType) {
            this.showNotification('Please select an experiment first', 'warning');
            return;
        }
        
        const experiments = {
            'ohms-law': {
                name: 'Ohm\'s Law Verification',
                voltage: 5.0,
                current: 1.0,
                instructions: 'Measure voltage and current across different resistors to verify V = IR'
            },
            'rc-circuit': {
                name: 'RC Time Constant',
                voltage: 3.3,
                current: 0.5,
                instructions: 'Observe capacitor charging/discharging behavior'
            },
            'diode-char': {
                name: 'Diode Characteristics',
                voltage: 2.0,
                current: 0.1,
                instructions: 'Plot I-V curve for forward and reverse bias'
            },
            'amplifier': {
                name: 'Op-Amp Basics',
                voltage: 9.0,
                current: 0.2,
                instructions: 'Explore operational amplifier gain and frequency response'
            }
        };
        
        const experiment = experiments[experimentType];
        if (experiment) {
            this.state.voltage = experiment.voltage;
            this.state.currentLimit = experiment.current;
            this.updateVoltageDisplay();
            this.updateCurrentDisplay();
            this.updateMeasurements();
            
            this.showNotification(`Loaded: ${experiment.name}`, 'success');
        }
    }
    
    toggleOutput() {
        this.state.outputEnabled = !this.state.outputEnabled;
        
        const outputToggle = document.getElementById('outputToggle');
        if (outputToggle) {
            outputToggle.textContent = `Output: ${this.state.outputEnabled ? 'ON' : 'OFF'}`;
            outputToggle.classList.toggle('active', this.state.outputEnabled);
        }
        
        // Update LED indicators
        this.updateLEDIndicators();
        this.updateMeasurements();
        
        if (this.state.outputEnabled) {
            this.startWaveformAnimation();
        } else {
            this.stopWaveformAnimation();
        }
    }
    
    updateLEDIndicators() {
        const powerLED = document.getElementById('powerLED');
        const outputLED = document.getElementById('outputLED');
        const limitLED = document.getElementById('limitLED');
        const remoteLED = document.getElementById('remoteLED');
        
        if (powerLED) powerLED.classList.add('active');
        if (outputLED) outputLED.classList.toggle('active', this.state.outputEnabled);
        if (remoteLED) remoteLED.classList.add('active');
        
        // Current limiting check
        if (limitLED) {
            const resistance = 1000; // 1kΩ
            const calculatedCurrent = this.state.voltage / resistance;
            const isLimited = calculatedCurrent > this.state.currentLimit;
            limitLED.classList.toggle('active', this.state.outputEnabled && isLimited);
        }
    }
    
    updateMeasurements() {
        const resistance = 1000; // 1kΩ load
        const calculatedCurrent = this.state.outputEnabled ? 
            Math.min(this.state.voltage / resistance, this.state.currentLimit) : 0;
        const power = this.state.voltage * calculatedCurrent;
        
        this.measurements.voltage = this.state.outputEnabled ? this.state.voltage : 0;
        this.measurements.current = calculatedCurrent;
        this.measurements.power = power;
        
        // Update display values
        const voltageReadout = document.getElementById('voltageReadout');
        const currentReadout = document.getElementById('currentReadout');
        const powerReadout = document.getElementById('powerReadout');
        const primaryReading = document.getElementById('primaryReading');
        
        if (voltageReadout) {
            voltageReadout.textContent = this.measurements.voltage.toFixed(2) + ' V';
        }
        if (currentReadout) {
            currentReadout.textContent = (this.measurements.current * 1000).toFixed(2) + ' mA';
        }
        if (powerReadout) {
            powerReadout.textContent = (this.measurements.power * 1000).toFixed(2) + ' mW';
        }
        if (primaryReading) {
            primaryReading.textContent = this.measurements.voltage.toFixed(3);
        }
        
        // Update circuit analysis
        this.updateCircuitAnalysis();
        this.updateLEDIndicators();
    }
    
    updateCircuitAnalysis() {
        const totalResistance = document.getElementById('totalResistance');
        const expectedCurrent = document.getElementById('expectedCurrent');
        const powerDissipation = document.getElementById('powerDissipation');
        
        if (totalResistance) totalResistance.textContent = '1.00 kΩ';
        if (expectedCurrent) {
            const current = this.state.voltage / 1000;
            expectedCurrent.textContent = (current * 1000).toFixed(2) + ' mA';
        }
        if (powerDissipation) {
            const power = Math.pow(this.state.voltage, 2) / 1000;
            powerDissipation.textContent = (power * 1000).toFixed(1) + ' mW';
        }
    }
    
    updateCircuitSimulation() {
        // Update LED glow in circuit
        const ledGlow = document.getElementById('ledGlow');
        if (ledGlow) {
            const brightness = this.state.outputEnabled ? (this.state.voltage / 30) : 0;
            ledGlow.setAttribute('opacity', brightness.toString());
        }
    }
    
    toggleExperiment() {
        this.state.experimentRunning = !this.state.experimentRunning;
        
        const startBtn = document.getElementById('startExperiment');
        if (startBtn) {
            if (this.state.experimentRunning) {
                startBtn.innerHTML = '<span class="btn-icon">Stop</span> Stop Experiment';
                this.startRecording();
                if (!this.state.outputEnabled) {
                    this.toggleOutput();
                }
            } else {
                startBtn.innerHTML = '<span class="btn-icon">Start</span> Start Experiment';
                this.stopRecording();
            }
        }
        
        this.showNotification(
            this.state.experimentRunning ? 'Experiment started' : 'Experiment stopped',
            this.state.experimentRunning ? 'success' : 'info'
        );
    }
    
    pauseExperiment() {
        this.state.recording = !this.state.recording;
        
        const pauseBtn = document.getElementById('pauseExperiment');
        if (pauseBtn) {
            pauseBtn.innerHTML = this.state.recording ? 
                '<span class="btn-icon">Pause</span> Pause' : 
                '<span class="btn-icon">Resume</span> Resume';
        }
        
        this.showNotification(
            this.state.recording ? 'Recording resumed' : 'Recording paused',
            'info'
        );
    }
    
    startRecording() {
        this.state.recording = true;
        this.state.recordingTime = 0;
        this.state.sampleCount = 0;
        
        const recordingInterval = setInterval(() => {
            if (!this.state.recording) return;
            
            this.state.recordingTime++;
            this.state.sampleCount += 60; // 60 samples per second
            
            this.updateRecordingStatus();
            
            if (!this.state.experimentRunning) {
                clearInterval(recordingInterval);
                this.intervals.delete('recording');
            }
        }, 1000);
        
        this.intervals.set('recording', recordingInterval);
    }
    
    stopRecording() {
        this.state.recording = false;
        this.state.experimentRunning = false;
        
        if (this.intervals.has('recording')) {
            clearInterval(this.intervals.get('recording'));
            this.intervals.delete('recording');
        }
    }
    
    updateRecordingStatus() {
        const recordingTime = document.getElementById('recordingTime');
        const sampleCount = document.getElementById('sampleCount');
        const recordingDuration = document.getElementById('recordingDuration');
        
        const minutes = Math.floor(this.state.recordingTime / 60);
        const seconds = this.state.recordingTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (recordingTime) recordingTime.textContent = timeString;
        if (sampleCount) sampleCount.textContent = this.state.sampleCount.toLocaleString();
        if (recordingDuration) recordingDuration.textContent = timeString;
    }
    
    downloadData() {
        const data = {
            timestamp: new Date().toISOString(),
            experiment: {
                type: this.state.currentEquipment,
                duration: this.state.recordingTime,
                samples: this.state.sampleCount
            },
            measurements: {
                voltage: this.measurements.voltage,
                current: this.measurements.current * 1000, // mA
                power: this.measurements.power * 1000, // mW
                frequency: this.measurements.frequency,
                amplitude: this.measurements.amplitude
            },
            settings: {
                voltageSet: this.state.voltage,
                currentLimit: this.state.currentLimit,
                outputEnabled: this.state.outputEnabled
            },
            metadata: {
                lab: 'VISTA Virtual Laboratory',
                equipment: this.getEquipmentInfo(),
                student: 'Demo User',
                session: 'demo-session-' + Date.now()
            }
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vista-lab-data-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully', 'success');
    }
    
    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'VISTA Lab Results',
                text: `Experiment results from VISTA Virtual Laboratory`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const shareText = `Check out my experiment results from VISTA Virtual Laboratory: ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Share link copied to clipboard', 'success');
            });
        }
    }
    
    shareSession() {
        alert('Session sharing feature: In the full VISTA system, this would generate a unique session link that allows other students and instructors to join your experiment in real-time for collaborative learning.');
    }
    
    handleVideoControl(control) {
        const actions = {
            'zoomIn': 'Zooming in on equipment',
            'zoomOut': 'Zooming out from equipment',
            'panLeft': 'Panning camera left',
            'panRight': 'Panning camera right'
        };
        
        this.showNotification(actions[control] || 'Camera control activated', 'info');
        
        // In full version, this would control the actual lab camera
        setTimeout(() => {
            this.showNotification('Camera control complete', 'success');
        }, 1000);
    }
    
    handleScopeControl(action) {
        const actions = {
            'Run/Stop': 'Oscilloscope acquisition toggled',
            'Single': 'Single trigger mode activated',
            'Auto': 'Auto trigger mode activated'
        };
        
        alert(`Oscilloscope Control: ${actions[action] || action}. In the full VISTA system, this would control the actual oscilloscope settings and trigger modes.`);
    }
    
    updateScopeControl(control, value) {
        const controlNames = {
            'ch1Scale': 'Channel 1 Scale',
            'timeBase': 'Time Base',
            'triggerLevel': 'Trigger Level'
        };
        
        const units = {
            'ch1Scale': 'V/div',
            'timeBase': 'ms/div',
            'triggerLevel': 'V'
        };
        
        // Update display
        const controlValueElement = control === 'ch1Scale' ? 
            document.querySelector('#ch1Scale').nextElementSibling :
            control === 'timeBase' ?
            document.querySelector('#timeBase').nextElementSibling :
            document.querySelector('#triggerLevel').nextElementSibling;
        
        if (controlValueElement) {
            controlValueElement.textContent = `${value}${units[control]}`;
        }
        
        this.showNotification(`${controlNames[control]} set to ${value}${units[control]}`, 'info');
    }
    
    changeMeterFunction(func) {
        const functions = {
            'vdc': 'DC Voltage',
            'vac': 'AC Voltage',
            'resistance': 'Resistance',
            'current': 'Current',
            'frequency': 'Frequency'
        };
        
        // Update primary reading based on function
        const primaryReading = document.getElementById('primaryReading');
        const primaryUnit = document.getElementById('primaryUnit');
        
        if (primaryReading && primaryUnit) {
            switch(func) {
                case 'vdc':
                    primaryReading.textContent = this.measurements.voltage.toFixed(3);
                    primaryUnit.textContent = 'V DC';
                    break;
                case 'vac':
                    primaryReading.textContent = (this.measurements.voltage * 0.707).toFixed(3);
                    primaryUnit.textContent = 'V AC';
                    break;
                case 'resistance':
                    primaryReading.textContent = '1.000';
                    primaryUnit.textContent = 'kΩ';
                    break;
                case 'current':
                    primaryReading.textContent = (this.measurements.current * 1000).toFixed(2);
                    primaryUnit.textContent = 'mA';
                    break;
                case 'frequency':
                    primaryReading.textContent = this.measurements.frequency.toFixed(0);
                    primaryUnit.textContent = 'Hz';
                    break;
            }
        }
        
        this.showNotification(`Multimeter function changed to ${functions[func]}`, 'info');
    }
    
    handleMeterButton(button) {
        const actions = {
            'HOLD': 'Reading held - display frozen',
            'MIN/MAX': 'Min/Max recording started',
            'REL': 'Relative mode activated - current reading set as reference'
        };
        
        alert(`Multimeter Function: ${actions[button] || button}. In the full VISTA system, this would control the actual multimeter measurement modes.`);
    }
    
    toggleSignalOutput() {
        const outputBtn = document.getElementById('outputEnable');
        const isActive = outputBtn.classList.contains('active');
        
        outputBtn.classList.toggle('active');
        outputBtn.textContent = isActive ? 'Output: OFF' : 'Output: ON';
        
        this.showNotification(
            isActive ? 'Signal generator output disabled' : 'Signal generator output enabled',
            'info'
        );
    }
    
    updateSignalGenerator() {
        this.updateSignalGeneratorPreview();
        this.showNotification('Signal generator parameters updated', 'info');
    }
    
    handleGenButton(button) {
        const actions = {
            'Sync': 'Sync output enabled',
            'Burst': 'Burst mode configuration opened'
        };
        
        alert(`Signal Generator: ${actions[button] || button}. In the full VISTA system, this would access advanced signal generator features and modulation settings.`);
    }
    
    getEquipmentInfo() {
        const equipmentModels = {
            'power-supply': 'Keysight E36312A Triple Output',
            'oscilloscope': 'Tektronix MSO58 - 1 GHz',
            'multimeter': 'Fluke 87V Industrial Multimeter',
            'signal-gen': 'Rigol DG4162 Function Generator'
        };
        
        return equipmentModels[this.state.currentEquipment] || 'Unknown Equipment';
    }
    
    toggleVideoFeed() {
        this.state.videoFeedVisible = !this.state.videoFeedVisible;
        
        const container = document.getElementById('videoFeedContainer');
        const button = document.getElementById('toggleVideoFeed');
        
        if (container) {
            container.classList.toggle('active', this.state.videoFeedVisible);
        }
        
        if (button) {
            button.textContent = this.state.videoFeedVisible ? 
                'Hide Equipment View' : 
                'Live Equipment View';
        }
        
        this.showNotification(
            this.state.videoFeedVisible ? 'Video feed enabled' : 'Video feed disabled',
            'info'
        );
    }
    
    switchVisualization(view) {
        // Update buttons
        document.querySelectorAll('.viz-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const selectedBtn = document.querySelector(`[data-view="${view}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        // Update panels
        document.querySelectorAll('.viz-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const selectedPanel = document.getElementById(`${view}Panel`);
        if (selectedPanel) {
            selectedPanel.classList.add('active');
        }
        
        this.state.currentView = view;
        this.updateVisualization();
    }
    
    updateVisualization() {
        switch (this.state.currentView) {
            case 'waveform':
                this.drawWaveform();
                break;
            case 'trend':
                this.drawTrend();
                break;
            case 'histogram':
                this.drawHistogram();
                break;
            case 'fft':
                this.drawFFT();
                break;
        }
    }
    
    drawWaveform() {
        const ctx = this.canvases.get('waveform');
        if (!ctx) return;
        
        this.drawGrid(ctx, 'waveform');
        
        if (!this.state.outputEnabled) return;
        
        const canvas = ctx.canvas;
        const amplitude = (this.state.voltage / 30) * (canvas.height / 2 - 20);
        const centerY = canvas.height / 2;
        
        ctx.strokeStyle = '#e21833';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x <= canvas.width; x += 2) {
            const y = centerY - amplitude + Math.sin(x * 0.02 + Date.now() * 0.001) * 10;
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Add measurement annotations
        ctx.fillStyle = '#333';
        ctx.font = '12px monospace';
        ctx.fillText(`Voltage: ${this.measurements.voltage.toFixed(2)}V`, 10, 20);
        ctx.fillText(`Current: ${(this.measurements.current * 1000).toFixed(2)}mA`, 10, 35);
        ctx.fillText(`Power: ${(this.measurements.power * 1000).toFixed(2)}mW`, 10, 50);
    }
    
    drawTrend() {
        const ctx = this.canvases.get('trend');
        if (!ctx) return;
        
        this.drawGrid(ctx, 'trend');
        
        // Simulate trend data
        const canvas = ctx.canvas;
        const dataPoints = 50;
        const timeStep = canvas.width / dataPoints;
        
        // Voltage trend (red)
        ctx.strokeStyle = '#e21833';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i <= dataPoints; i++) {
            const x = i * timeStep;
            const baseY = canvas.height - (this.measurements.voltage / 30) * canvas.height;
            const noise = (Math.random() - 0.5) * 5;
            const y = baseY + noise;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Current trend (blue)
        ctx.strokeStyle = '#2196f3';
        ctx.beginPath();
        
        for (let i = 0; i <= dataPoints; i++) {
            const x = i * timeStep;
            const baseY = canvas.height - (this.measurements.current * 1000 / 50) * canvas.height;
            const noise = (Math.random() - 0.5) * 3;
            const y = Math.max(0, Math.min(canvas.height, baseY + noise));
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Legend
        ctx.fillStyle = '#e21833';
        ctx.fillRect(10, 10, 15, 10);
        ctx.fillStyle = '#333';
        ctx.font = '12px monospace';
        ctx.fillText('Voltage', 30, 20);
        
        ctx.fillStyle = '#2196f3';
        ctx.fillRect(10, 25, 15, 10);
        ctx.fillStyle = '#333';
        ctx.fillText('Current', 30, 35);
    }
    
    drawHistogram() {
        const ctx = this.canvases.get('histogram');
        if (!ctx) return;
        
        this.drawGrid(ctx, 'histogram');
        
        // Simulate histogram data
        const canvas = ctx.canvas;
        const bins = 20;
        const binWidth = canvas.width / bins;
        
        ctx.fillStyle = 'rgba(226, 24, 51, 0.7)';
        
        for (let i = 0; i < bins; i++) {
            const height = Math.random() * (canvas.height * 0.8);
            const x = i * binWidth;
            const y = canvas.height - height;
            
            ctx.fillRect(x + 2, y, binWidth - 4, height);
        }
        
        // Labels
        ctx.fillStyle = '#333';
        ctx.font = '12px monospace';
        ctx.fillText('Measurement Distribution', 10, 20);
        ctx.fillText(`Mean: ${this.measurements.voltage.toFixed(2)}V`, 10, 35);
        ctx.fillText(`Samples: ${this.state.sampleCount}`, 10, 50);
    }
    
    drawFFT() {
        const ctx = this.canvases.get('fft');
        if (!ctx) return;
        
        this.drawGrid(ctx, 'fft');
        
        // Simulate FFT data
        const canvas = ctx.canvas;
        const frequencies = 100;
        const freqWidth = canvas.width / frequencies;
        
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < frequencies; i++) {
            const x = i * freqWidth;
            const magnitude = Math.random() * Math.exp(-i / 20) * canvas.height * 0.8;
            const y = canvas.height - magnitude;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Peak frequency marker
        const peakFreq = this.measurements.frequency;
        const peakX = (peakFreq / 10000) * canvas.width;
        
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(peakX, 0);
        ctx.lineTo(peakX, canvas.height);
        ctx.stroke();
        
        ctx.fillStyle = '#333';
        ctx.font = '12px monospace';
        ctx.fillText('Frequency Domain Analysis', 10, 20);
        ctx.fillText(`Peak: ${peakFreq}Hz`, 10, 35);
    }
    
    startWaveformAnimation() {
        if (this.intervals.has('waveform')) return;
        
        const interval = setInterval(() => {
            if (this.state.outputEnabled && this.state.currentView === 'waveform') {
                this.drawWaveform();
            }
            
            // Update oscilloscope if active
            if (this.state.currentEquipment === 'oscilloscope') {
                this.updateOscilloscope();
            }
            
            // Update signal generator preview
            this.updateSignalGeneratorPreview();
        }, 50);
        
        this.intervals.set('waveform', interval);
    }
    
    stopWaveformAnimation() {
        if (this.intervals.has('waveform')) {
            clearInterval(this.intervals.get('waveform'));
            this.intervals.delete('waveform');
        }
    }
    
    updateOscilloscope() {
        const ctx = this.canvases.get('scope');
        if (!ctx) return;
        
        this.drawGrid(ctx, 'scope');
        
        const canvas = ctx.canvas;
        const centerY = canvas.height / 2;
        const amplitude = 100;
        
        // Channel 1 (main signal)
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 2) {
            const time = x / 100;
            const frequency = this.measurements.frequency / 1000;
            const y = centerY + amplitude * Math.sin(2 * Math.PI * frequency * time + Date.now() * 0.001);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Update measurements
        this.updateScopeMeasurements();
    }
    
    updateScopeMeasurements() {
        const freqElement = document.getElementById('frequency');
        const peakToPeakElement = document.getElementById('peakToPeak');
        const averageElement = document.getElementById('average');
        const periodElement = document.getElementById('period');
        
        if (freqElement) freqElement.textContent = `${(this.measurements.frequency / 1000).toFixed(2)} kHz`;
        if (peakToPeakElement) peakToPeakElement.textContent = `${this.measurements.amplitude.toFixed(2)} V`;
        if (averageElement) averageElement.textContent = `${(this.measurements.amplitude / 2).toFixed(2)} V`;
        if (periodElement) periodElement.textContent = `${(1 / this.measurements.frequency * 1000).toFixed(2)} ms`;
    }
    
    updateSignalGeneratorPreview() {
        const ctx = this.canvases.get('preview');
        if (!ctx) return;
        
        this.drawGrid(ctx, 'preview');
        
        const canvas = ctx.canvas;
        const centerY = canvas.height / 2;
        const amplitude = 30;
        
        const waveformType = document.getElementById('waveformType')?.value || 'sine';
        
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 1) {
            const time = x / 50;
            let y;
            
            switch (waveformType) {
                case 'sine':
                    y = centerY + amplitude * Math.sin(2 * Math.PI * time);
                    break;
                case 'square':
                    y = centerY + amplitude * Math.sign(Math.sin(2 * Math.PI * time));
                    break;
                case 'triangle':
                    y = centerY + amplitude * (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * time));
                    break;
                case 'sawtooth':
                    y = centerY + amplitude * (2 * (time - Math.floor(time + 0.5)));
                    break;
                default:
                    y = centerY;
            }
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    
    switchHelpPanel(panel) {
        // Update tab buttons
        document.querySelectorAll('.help-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const selectedTab = document.querySelector(`[data-help="${panel}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Update panels
        document.querySelectorAll('.help-panel').forEach(helpPanel => {
            helpPanel.classList.remove('active');
        });
        const selectedPanel = document.getElementById(panel);
        if (selectedPanel) {
            selectedPanel.classList.add('active');
        }
        
        this.state.currentHelpPanel = panel;
    }
    
    selectCircuitTool(tool) {
        // Update tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const selectedTool = document.querySelector(`[data-tool="${tool}"]`);
        if (selectedTool) {
            selectedTool.classList.add('active');
        }
        
        if (tool === 'clear') {
            this.clearCircuit();
        } else {
            const toolNames = {
                'select': 'Selection Tool',
                'wire': 'Wire Tool',
                'resistor': 'Resistor Tool',
                'capacitor': 'Capacitor Tool',
                'inductor': 'Inductor Tool',
                'led': 'LED Tool'
            };
            
            alert(`Circuit Designer: ${toolNames[tool] || tool} selected. In the full VISTA system, you would be able to drag and drop components to build custom circuits for experimentation.`);
        }
    }
    
    clearCircuit() {
        const circuit = document.getElementById('defaultCircuit');
        if (circuit) {
            circuit.style.opacity = '0.3';
            setTimeout(() => {
                circuit.style.opacity = '1';
            }, 500);
        }
        this.showNotification('Circuit cleared - demonstrating circuit modification', 'info');
    }
    
    updateDisplays() {
        this.updateTime();
        this.updateConnectionMetrics();
        this.updateUsersOnline();
    }
    
    updateTime() {
        const timeElement = document.getElementById('screenTime');
        if (timeElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }
    }
    
    updateConnectionMetrics() {
        const latencyElement = document.getElementById('latency');
        const dataRateElement = document.getElementById('dataRate');
        
        if (latencyElement) {
            const latency = 20 + Math.random() * 10;
            latencyElement.textContent = `${latency.toFixed(0)}ms`;
        }
        
        if (dataRateElement) {
            const rates = ['60 Hz', '120 Hz', '100 Hz', '80 Hz'];
            dataRateElement.textContent = rates[Math.floor(Math.random() * rates.length)];
        }
    }
    
    updateUsersOnline() {
        const usersOnlineElement = document.getElementById('usersOnline');
        if (usersOnlineElement) {
            const users = 5 + Math.floor(Math.random() * 5);
            usersOnlineElement.textContent = users.toString();
        }
    }
    
    startSimulations() {
        // Real-time updates
        const updateInterval = setInterval(() => {
            this.updateDisplays();
            this.updateVisualization();
        }, 2000);
        this.intervals.set('updates', updateInterval);
        
        // Start waveform animation
        this.startWaveformAnimation();
        
        // Initialize measurements
        this.updateMeasurements();
    }
    
    initializeMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${this.getNotificationColor(type)};
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 10000;
                font-weight: 500;
                max-width: 300px;
                animation: slideIn 0.3s ease;
            ">
                ${message}
            </div>
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }
    
    getNotificationColor(type) {
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        return colors[type] || colors.info;
    }
    
    // Cleanup on page unload
    destroy() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
    }
}

// Initialize the Virtual Lab when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Animate main sections with staggered delay
    document.querySelectorAll('.demo-hero, .lab-interface, .equipment-sidebar').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = `all 0.8s ease ${index * 0.2}s`;
        observer.observe(section);
    });
    
    // Animate equipment cards
    document.querySelectorAll('.equipment-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Animate control panels
    document.querySelectorAll('.control-panel, .measurement-display').forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'scale(0.95) translateY(20px)';
        panel.style.transition = `all 0.7s ease ${index * 0.15}s`;
        observer.observe(panel);
    });
    
    // Animate buttons and interactive elements
    document.querySelectorAll('.btn, .slider-control, .measurement-value').forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = `all 0.5s ease ${index * 0.05}s`;
        observer.observe(element);
    });

    window.vistaLab = new VirtualLab();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.vistaLab) {
        window.vistaLab.destroy();
    }
});

// Global functions for any remaining inline event handlers
window.startExperiment = function() {
    if (window.vistaLab) {
        window.vistaLab.toggleExperiment();
    }
};

window.downloadData = function() {
    if (window.vistaLab) {
        window.vistaLab.downloadData();
    }
};