/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element) {
      throw new Error("Не передан элемент в конструктор TransactionsPage");
    }

    this.element = element;
    // this.lastOptions = null;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = this.element.querySelector(".remove-account");
    removeAccount.addEventListener("click", () => {
      this.removeAccount();
    });
    
    this.element.querySelector(".content").addEventListener("click", (event) => {
      if (event.target.classList.contains("transaction__remove")) {
        const transactionId = event.target.dataset.id;
        this.removeTransaction(transactionId);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }

    const confirmation = confirm("Вы действительно хотите удалить счёт?");
    if (!confirmation) {
      return
    }
    
    Account.remove({id: this.lastOptions.account_id}, (err, response) => {
      if (response.success === true) {
        this.clear();
        App.updateWidgets();
        App.updateForms();
      } else {
        console.error(err);
      }
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    const confirmation = confirm("Вы действительно хотите удалить эту транзакцию?");
    if (!confirmation) {
      return
    }

    Transaction.remove({id: id}, (err, response) => {
      if (response.success === true) {
        App.update();
      } else {
        console.error(err);
      }
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) {
      return
    }

    this.lastOptions = options;

    Account.get(options.account_id, (err, response) => {
      if (response.success === true) {
        this.renderTitle(response.data.name);
      } else {
        console.error(err);
      }
    });

    Transaction.list(options, (err, response) => {
      if (response.success === true) {
        this.renderTransactions(response.data);
      } else {
        console.error(err);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const contentTitle = this.element.querySelector(".content-title");
    contentTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const fullDate = new Date(date);
    const options = { dateStyle: "long", timeStyle: "short" };
    const formatedDate = new Intl.DateTimeFormat("ru-RU", options).format(
      fullDate
    );

    return formatedDate.split(",").join(" в ");
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const dateCreated = this.formatDate(item.created_at);
    return `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${dateCreated}</div>
          </div>
        </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          ${item.sum }<span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id=${item.id}>
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>`
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = this.element.querySelector(".content");
    content.innerHTML = '';
    if (data) {
      data.forEach(item => {
        const transactionHTML  = this.getTransactionHTML(item);
        content.insertAdjacentHTML("beforeend", transactionHTML);
      });
    }
  }
}