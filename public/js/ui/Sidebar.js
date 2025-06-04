/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector('[data-toggle="push-menu"]');
    const body = document.body;
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      body.classList.toggle("sidebar-open");
      body.classList.toggle("sidebar-collapse");
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((menuItem) => {
      menuItem.addEventListener("click", (event) => {
        event.preventDefault();
        const clickedElement = event.target;
        if (clickedElement.closest(".menu-item_login")) {
          const loginModal = App.getModal('login');
          loginModal.open();
        } else if (clickedElement.closest(".menu-item_register")) {
          const loginModal = App.getModal('register');
          loginModal.open();
        } else if (clickedElement.closest(".menu-item_logout")) {
          User.logout((err, response) => {
            if (response.success) { 
              App.setState('init');
            } else {
              console.error("Ошибка при выходе:", err);
            }
          });
        }
      })
    });
  }
}