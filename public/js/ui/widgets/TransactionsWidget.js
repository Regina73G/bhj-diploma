/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(!element) {
      throw new Error("Не передан элемент в конструктор AccountsWidget");
    }

    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const newIncome = this.element.querySelector(".create-income-button");
    const modalNewIncome = document.getElementById("modal-new-income");
    newIncome.addEventListener("click", () => {
      if (modalNewIncome) {
        const modal = new Modal(modalNewIncome);
        modal.open();
      }

      App.getModal("newIncome");
    });

    const newExpense = this.element.querySelector(".create-expense-button");
    const modalNewExpense = document.getElementById("modal-new-expense");
    newExpense.addEventListener("click", () => {
      if (modalNewExpense) {
        const modal = new Modal(modalNewExpense);
        modal.open();
      }

      App.getModal("newExpense");
    });
  }
}
