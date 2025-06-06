/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accountsList = this.element.querySelector(".accounts-select");
    Account.list(null, (err, response) => {
      if (response.success === true) {
        accountsList.innerHTML = "";
        response.data.forEach(account => {
          const option = document.createElement("option");
          option.value = account.id;
          option.textContent = account.name;
          accountsList.appendChild(option);
        });
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success === true) {
        this.element.reset();
        App.update();
        const modalElement = this.element.closest(".modal");
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.close();
        }
      } else {
        console.error("Ошибка создания транзакции:", response.error);
      }
    })
  }
}