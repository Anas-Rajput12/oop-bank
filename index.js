import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";
class Customer {
    firstname;
    lastname;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fname, lname, age, gender, mob, acc) {
        this.firstname = fname;
        this.lastname = lname;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccount(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let NewAccounts = this.account.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.account = [...NewAccounts, accObj];
    }
}
let myBank = new Bank();
for (let i = 0; i < 6; i++) {
    let fname = faker.person.firstName("male");
    let lname = faker.person.lastName();
    let num = parseInt(faker.phone.number("3#########"));
    const cus = new Customer(fname, lname, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccount({ accNumber: cus.accNumber, balance: 100 * i });
}
async function bankService(bank) {
    do {
        let service = await inquirer.prompt([
            {
                type: "list",
                name: "select",
                message: "please select the service",
                choices: ["view Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
            },
        ]);
        if (service.select === "view Balance") {
            let res = await inquirer.prompt([
                {
                    type: "input",
                    name: "num",
                    message: "Enter your Account Number",
                },
            ]);
            let account = bank.account.find((account) => account.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.italic.bold("Invalid Account Number"));
            }
            if (account) {
                let name = bank.customer.find((item) => item.accNumber == account?.accNumber);
                console.log(`Dear ${chalk.green.bold(name?.firstname)} ${chalk.green.italic(name?.lastname)} Your Account Balance is ${chalk.blue.bold(`$${account?.balance}`)}`);
            }
        }
        if (service.select === "Cash Withdraw") {
            let res = await inquirer.prompt([
                {
                    type: "input",
                    name: "num",
                    message: chalk.red.italic `Enter your Account Number`,
                },
            ]);
            let account = bank.account.find((account) => account.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.italic.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt([
                    {
                        type: "number",
                        message: chalk.green.italic `Please Enter Your Amount `,
                        name: "rupee",
                    }
                ]);
                let newBalance = account.balance - ans.rupee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(chalk.blue.bold `Remaining Balance Is ${newBalance}$`);
            }
        }
        if (service.select === "Cash Deposit") {
            let res = await inquirer.prompt([
                {
                    type: "input",
                    name: "num",
                    message: chalk.red.italic `Enter your Account Number`,
                },
            ]);
            let account = bank.account.find((account) => account.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.italic.bold("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt([
                    {
                        type: "number",
                        message: chalk.green.italic `Please Enter Your Amount`,
                        name: "rupee",
                    }
                ]);
                let newBalance = account.balance + ans.rupee;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(chalk.blue.bold `Your Balanace is ${newBalance}$`);
            }
        }
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankService(myBank);
