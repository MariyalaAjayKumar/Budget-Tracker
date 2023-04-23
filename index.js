const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list")
let transactions=localStorage.getItem("transactions")!==null ? JSON.parse(localStorage.getItem("transactions")) : [];
//if it is local storage is null it will create a array..then we are adding elements adter referesh,we storing the previous data into array then we are pushing new data int0 array
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

function updateStatistics(){
    const updateIncome = transactions
                           .filter(transaction=> transaction.amount>0)
                           .reduce((total,transaction)=>total += transaction.amount,0);
    
    const updateExpense = transactions
                           .filter(transaction=> transaction.amount<0)
                           .reduce((total,transaction)=>total += Math.abs(transaction.amount),0);
   balance.textContent = updateIncome - updateExpense;
   income.textContent=updateIncome;
   expense.textContent= updateExpense;

}

function addTemplate(id,source,amount,time){
    return `<li data-id="${id}">
            <p>
                <span>${source}</span>
                <span id="time">${time}</span>
            </p>
            $<span>${Math.abs(amount)}</span>
            <i class="bi bi-trash delete"></i>
            </li>`;

}

function addTransactionDOM(id,source,amount,time){
    if(amount>0){
        incomeList.innerHTML+=addTemplate(id,source,amount,time);
        
    }
    else{
        expenseList.innerHTML+=addTemplate(id,source,amount,time);

    }

}


function addTransaction(source,amount){
    const time = new Date();
    const transaction={
        id:Math.floor(Math.random()*100000),
        source: source,
        amount:amount,
        time:`${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    }
    transactions.push(transaction);
    localStorage.setItem("transactions",JSON.stringify(transactions));
    addTransactionDOM(transaction.id,source,amount,transaction.time);
    //console.log(JSON.parse(localStorage.getItem("transaction")));
    //console.log(form.source.value,form.amount.value);
}
form.addEventListener("submit",event=>{
    event.preventDefault();
    if(form.source.value.trim()==="" || form.amount.value===""){
        return alert("please add proper values!");
    }
    addTransaction(form.source.value.trim(),Number(form.amount.value));
    updateStatistics();
    form.reset();
});
//we need to store our value in database(local storage we are storing)

function getTransaction(){
    transactions.forEach(transaction => {
        if(transaction.amount>0){
            incomeList.innerHTML+=addTemplate(transaction.id,transaction.source,transaction.amount,transaction.time);
        }else{
            expenseList.innerHTML+=addTemplate(transaction.id,transaction.source,transaction.amount,transaction.time);

        }
    });
}



function deleteFunction(id){
    transactions = transactions.filter(transaction=>{
         return transaction.id!== id;
    });
    localStorage.setItem("transactions",JSON.stringify(transactions));

}

incomeList.addEventListener("click",event=>{
      if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        //console.log(event.target);
        deleteFunction(Number(event.target.parentElement.dataset.id));
        updateStatistics();
      }
});

expenseList.addEventListener("click",event=>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteFunction(Number(event.target.parentElement.dataset.id));
        updateStatistics();
    }
});

function updateStatistics(){
     const updateIncome = transactions
                            .filter(transaction=> transaction.amount>0)
                            .reduce((total,transaction)=>total += transaction.amount,0);
     
     const updateExpense = transactions
                            .filter(transaction=> transaction.amount<0)
                            .reduce((total,transaction)=>total += Math.abs(transaction.amount),0);
    balance.textContent = updateIncome - updateExpense;
    income.textContent=updateIncome;
    expense.textContent= updateExpense;

}

function init(){
    getTransaction();
    updateStatistics();
}

init();