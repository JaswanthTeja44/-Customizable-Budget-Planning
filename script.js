class BudgetTracker {
            constructor() {
                this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
                this.init();
            }

            init() {
                this.form = document.getElementById('budgetForm');
                this.nameInput = document.getElementById('name');
                this.amountInput = document.getElementById('amount');
                this.typeSelect = document.getElementById('type');
                
                this.form.addEventListener('submit', this.handleSubmit.bind(this));
                
                this.render();
            }

            handleSubmit(e) {
                e.preventDefault();
                
                const name = this.nameInput.value.trim();
                const amount = parseFloat(this.amountInput.value);
                const type = this.typeSelect.value;

                if (!this.validateInput(name, amount)) return;

                this.transactions.push({ name, amount, type });
                this.saveToLocalStorage();
                this.render();
                this.form.reset();
            }

            validateInput(name, amount) {
                let isValid = true;
                
                if (!name) {
                    this.showError('nameError');
                    isValid = false;
                }
                
                if (isNaN(amount) || amount <= 0) {
                    this.showError('amountError');
                    isValid = false;
                }

                return isValid;
            }

            showError(errorId) {
                document.getElementById(errorId).classList.add('show');
                setTimeout(() => {
                    document.getElementById(errorId).classList.remove('show');
                }, 3000);
            }

            calculateTotals() {
                return this.transactions.reduce((acc, transaction) => {
                    if (transaction.type === 'income') {
                        acc.income += transaction.amount;
                    } else {
                        acc.expenses += transaction.amount;
                    }
                    return acc;
                }, { income: 0, expenses: 0 });
            }

            render() {
                const totals = this.calculateTotals();
                const balance = totals.income - totals.expenses;

                document.getElementById('totalIncome').textContent = 
                    `$${totals.income.toFixed(2)}`;
                document.getElementById('totalExpenses').textContent = 
                    `$${totals.expenses.toFixed(2)}`;
                document.getElementById('balance').textContent = 
                    `$${balance.toFixed(2)}`;
                
                const transactionsList = document.getElementById('transactions');
                transactionsList.innerHTML = this.transactions
                    .map((transaction, index) => `
                        <div class="expense-item">
                            <div>
                                <strong>${transaction.name}</strong>
                                <span>${transaction.type}</span>
                            </div>
                            <div>
                                $${transaction.amount.toFixed(2)}
                                <button onclick="budgetTracker.deleteTransaction(${index})">×</button>
                            </div>
                        </div>
                    `).join('');
            }

            deleteTransaction(index) {
                this.transactions.splice(index, 1);
                this.saveToLocalStorage();
                this.render();
            }

            saveToLocalStorage() {
                localStorage.setItem('transactions', JSON.stringify(this.transactions));
            }
        }

        const budgetTracker = new BudgetTracker();