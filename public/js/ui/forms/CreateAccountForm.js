/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      if (response.success === true) {
        this.element.reset();
        App.update();
        const modalElement = this.element.closest(".modal");
        if (modalElement) {
          const modal = new Modal(modalElement);
          modal.close();
        }
      } else {
        console.error("Ошибка создания счета:", response.error);
      }
    });
  }
}