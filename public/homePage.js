"use strict"
const logout = new LogoutButton();
logout.action = () => {
  ApiConnector.logout(response => {
    if (response.success) {
      location.reload();
    }
  });
}

ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();

function exchangeRates() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    };
  });
}
exchangeRates();
let intervalExchengeRates = setInterval(exchangeRates, 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = data => {
  ApiConnector.addMoney(data, response => {
    let message = "";
    if (response.success) {
      message = `${data.amount} ${data.currency} добавлены на счет`;
      ProfileWidget.showProfile(response.data);
    } else {
      message = response.error;
    };
    moneyManager.setMessage(response.success, message);
  });
}

moneyManager.conversionMoneyCallback = data => {
  ApiConnector.convertMoney(data, response => {
    let message = "";
    if (response.success) {
      message = `${data.fromAmount} ${data.fromCurrency} успешно сконвертированы в ${data.targetCurrency}`;
      ProfileWidget.showProfile(response.data);
    } else {
      message = response.error;
    };
    moneyManager.setMessage(response.success, message);
  });
}

moneyManager.sendMoneyCallback = data => {
  ApiConnector.transferMoney(data, response => {
    let message = "";
    if (response.success) {
      message = `${data.amount} ${data.currency} переведены пользоваеудю с ID ${data.to}`;
      ProfileWidget.showProfile(response.data);
    } else {
      message = response.error;
    };
    moneyManager.setMessage(response.success, message);
  });
}

const favoritesWidget = new FavoritesWidget();

function favoritesTableChanges(response) {
  favoritesWidget.clearTable();
  favoritesWidget.fillTable(response.data);
  moneyManager.updateUsersList(response.data);
}

ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesTableChanges(response);
  };
});

favoritesWidget.addUserCallback = data => {
  ApiConnector.addUserToFavorites(data, response => {
    let message = "";
    if (response.success) {
      favoritesTableChanges(response);
      message = `Пользователь ${data.name} добавлен в список`
    } else {
      message = response.error;
    };
    favoritesWidget.setMessage(response.success, message);
  });
}

favoritesWidget.removeUserCallback = data => {
  ApiConnector.removeUserFromFavorites(data, response => {
    let message = "";
    if (response.success) {
      favoritesTableChanges(response);
      message = `Пользователь ${data.name} удален из списка`
    } else {
      message = response.error;
    };
    favoritesWidget.setMessage(response.success, message);
  });
}
