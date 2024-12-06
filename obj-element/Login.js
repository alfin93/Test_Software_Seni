//wrap login

class Login {

    get txtUserName () {
        return $('//*[@id="user-name"]');
    }
    get txtPassword () {
        return $('//*[@id="password"]');
    }

    get btnLogin () {
        return $('//*[@id="login-button"]')
    }

    async login(user, password) {
        //await browser.pause(1000);
        await txtUserName.fill('//*[@id="user-name"]', user);
        //await browser.pause(1000);
        await txtPassword.fill('//*[@id="password"]', password);
        await btnLogin.click();
        //await browser.pause(5000);
    }

}

module.exports = new Login();
