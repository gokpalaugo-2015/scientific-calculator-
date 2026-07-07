// Scientific Calculator Application
class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.expression = document.getElementById('expression');
        this.historyList = document.getElementById('history');
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.history = [];
        this.angleMode = 'deg'; // 'deg' or 'rad'
        
        this.loadHistory();
        this.initializeEventListeners();
        this.updateDisplay();
        this.initializeTheme();
        this.initializeKeyboardSupport();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleNumber(btn.dataset.number));
        });

        // Operator buttons
        document.querySelectorAll('.operator-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleOperator(btn.dataset.operator));
        });

        // Function buttons
        document.querySelectorAll('.func-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleFunction(btn.dataset.function));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Clear history
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
    }

    // Handle number input
    handleNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = num;
            this.shouldResetDisplay = false;
        } else {
            if (num === '.' && this.currentValue.includes('.')) return;
            if (this.currentValue === '0' && num !== '.') {
                this.currentValue = num;
            } else if (num === '.' && this.currentValue === '') {
                this.currentValue = '0.';
            } else {
                this.currentValue += num;
            }
        }
        this.updateDisplay();
    }

    // Handle operators
    handleOperator(op) {
        if (op === '=') {
            this.calculate();
            return;
        }

        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operator = op;
        this.shouldResetDisplay = true;
        this.updateExpression();
    }

    // Handle scientific functions
    handleFunction(func) {
        let result;

        try {
            const value = parseFloat(this.currentValue);

            switch (func) {
                case 'sin':
                    result = this.sine(value);
                    break;
                case 'cos':
                    result = this.cosine(value);
                    break;
                case 'tan':
                    result = this.tangent(value);
                    break;
                case 'asin':
                    result = this.arcsine(value);
                    break;
                case 'acos':
                    result = this.arccosine(value);
                    break;
                case 'atan':
                    result = this.arctangent(value);
                    break;
                case 'sqrt':
                    result = Math.sqrt(value);
                    break;
                case 'log':
                    result = Math.log10(value);
                    break;
                case 'ln':
                    result = Math.log(value);
                    break;
                case 'pi':
                    this.currentValue = String(Math.PI);
                    this.updateDisplay();
                    return;
                case 'e':
                    this.currentValue = String(Math.E);
                    this.updateDisplay();
                    return;
                case 'factorial':
                    result = this.factorial(Math.round(value));
                    break;
                case 'percent':
                    result = value / 100;
                    break;
                case 'pow':
                    this.previousValue = this.currentValue;
                    this.operator = '^';
                    this.shouldResetDisplay = true;
                    this.updateExpression();
                    return;
                case 'backspace':
                    this.currentValue = this.currentValue.toString().slice(0, -1) || '0';
                    this.updateDisplay();
                    return;
                case 'ce':
                    this.currentValue = '0';
                    this.updateDisplay();
                    return;
                case 'clear':
                    this.clear();
                    return;
                case 'toggleSign':
                    this.currentValue = String(parseFloat(this.currentValue) * -1);
                    this.updateDisplay();
                    return;
                default:
                    return;
            }

            this.currentValue = String(this.formatResult(result));
            this.updateDisplay();
        } catch (error) {
            this.displayError('Invalid Operation');
        }
    }

    // Trigonometric functions with angle mode support
    sine(value) {
        const radians = this.angleMode === 'deg' ? value * (Math.PI / 180) : value;
        return Math.sin(radians);
    }

    cosine(value) {
        const radians = this.angleMode === 'deg' ? value * (Math.PI / 180) : value;
        return Math.cos(radians);
    }

    tangent(value) {
        const radians = this.angleMode === 'deg' ? value * (Math.PI / 180) : value;
        return Math.tan(radians);
    }

    arcsine(value) {
        if (value < -1 || value > 1) throw new Error('Domain error');
        const result = Math.asin(value);
        return this.angleMode === 'deg' ? result * (180 / Math.PI) : result;
    }

    arccosine(value) {
        if (value < -1 || value > 1) throw new Error('Domain error');
        const result = Math.acos(value);
        return this.angleMode === 'deg' ? result * (180 / Math.PI) : result;
    }

    arctangent(value) {
        const result = Math.atan(value);
        return this.angleMode === 'deg' ? result * (180 / Math.PI) : result;
    }

    // Factorial function
    factorial(n) {
        if (n < 0) throw new Error('Negative factorial');
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // Calculate result
    calculate() {
        if (this.operator === null || this.previousValue === '') return;

        let result;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        try {
            switch (this.operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        this.displayError('Cannot divide by zero');
                        return;
                    }
                    result = prev / current;
                    break;
                case '^':
                    result = Math.pow(prev, current);
                    break;
                default:
                    return;
            }

            const expression = `${this.previousValue} ${this.getOperatorSymbol(this.operator)} ${this.currentValue}`;
            this.addToHistory(expression, result);

            this.currentValue = String(this.formatResult(result));
            this.previousValue = '';
            this.operator = null;
            this.shouldResetDisplay = true;
            this.updateDisplay();
        } catch (error) {
            this.displayError('Calculation Error');
        }
    }

    // Format result to avoid long decimals
    formatResult(result) {
        if (isNaN(result) || !isFinite(result)) {
            return 0;
        }
        // Round to 10 decimal places to avoid floating point errors
        return Math.round(result * 10000000000) / 10000000000;
    }

    // Get operator symbol for history
    getOperatorSymbol(op) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '^': '^'
        };
        return symbols[op] || op;
    }

    // Clear everything
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    // Update display
    updateDisplay() {
        this.display.value = this.currentValue;
    }

    // Update expression display
    updateExpression() {
        if (this.operator) {
            this.expression.textContent = `${this.previousValue} ${this.getOperatorSymbol(this.operator)}`;
        } else {
            this.expression.textContent = '';
        }
    }

    // Display error message
    displayError(message) {
        this.currentValue = message;
        this.display.value = message;
        this.shouldResetDisplay = true;
    }

    // Add calculation to history
    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: this.formatResult(result),
            timestamp: new Date().toLocaleTimeString()
        };
        this.history.unshift(historyItem);
        if (this.history.length > 50) {
            this.history.pop();
        }
        this.saveHistory();
        this.renderHistory();
    }

    // Render history
    renderHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p class="empty-message">No calculations yet</p>';
            return;
        }

        this.historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
                <div style="font-size: 0.8em; opacity: 0.5; margin-top: 5px;">${item.timestamp}</div>
            </div>
        `).join('');

        // Add click listeners to history items
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = item.dataset.index;
                this.currentValue = String(this.history[index].result);
                this.updateDisplay();
            });
        });
    }

    // Save history to localStorage
    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    // Load history from localStorage
    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.renderHistory();
        }
    }

    // Clear history
    clearHistory() {
        if (confirm('Are you sure you want to clear the history?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
        }
    }

    // Initialize keyboard support
    initializeKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();

            // Numbers
            if (e.key >= '0' && e.key <= '9') {
                this.handleNumber(e.key);
            }
            // Decimal point
            else if (e.key === '.') {
                this.handleNumber('.');
            }
            // Operators
            else if (e.key === '+') {
                this.handleOperator('+');
            }
            else if (e.key === '-') {
                this.handleOperator('-');
            }
            else if (e.key === '*') {
                this.handleOperator('*');
            }
            else if (e.key === '/') {
                this.handleOperator('/');
            }
            else if (e.key === 'Enter' || e.key === '=') {
                this.handleOperator('=');
            }
            // Backspace
            else if (e.key === 'Backspace') {
                this.handleFunction('backspace');
            }
            // Escape (Clear)
            else if (e.key === 'Escape') {
                this.handleFunction('clear');
            }
            // Delete (CE)
            else if (e.key === 'Delete') {
                this.handleFunction('ce');
            }
        });
    }

    // Toggle theme
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        this.updateThemeIcon();
    }

    // Initialize theme from localStorage
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
        this.updateThemeIcon();
    }

    // Update theme icon
    updateThemeIcon() {
        const icon = document.querySelector('.theme-icon');
        if (document.body.classList.contains('dark-mode')) {
            icon.textContent = '☀️';
        } else {
            icon.textContent = '🌙';
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
