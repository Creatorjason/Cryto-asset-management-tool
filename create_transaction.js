const {Parser} = require("json2csv")
const fs = require("fs");


function check_length(){
    return new Promise((res)=>{
        fs.readFile("trx.csv", (err, data)=>{
            if(err) throw err;
            if(data.length === 0){
                res(true)
                
            }
            else if(data.length >= 1){
                res(false)
                
            }
        })
    })  
}


const transact =  (trx_type="deposit", token, amount) => {
    let sym = "+"
    const columns = ["Timestamp","Transaction_type","Token","Amount"]
    const date = new Date()
    // user input check
    if (!(trx_type == "deposit" || trx_type=="withdraw")){
        //throw new Error("Invalid transaction type")
        console.log(`Input Error.\n Did you mean withdraw or deposit`)
    }
    if(trx_type === "withdraw"){
        sym = "-"
    }
    const trx_obj = {
        Timestamp : date.getTime(),
        Transaction_type: trx_type.toUpperCase(),
        Token: token.toUpperCase(),
        Amount: sym + String(amount) + " " +"USD" 
    }
    const transform= new Parser({fields:columns}).parse(trx_obj)
    check_length().then((data)=>{
        if(data === true){
            fs.writeFileSync("trx.csv", transform)
         }
         else{
            fs.appendFileSync("trx.csv", `\n${trx_obj.Timestamp},${trx_obj.Transaction_type},${trx_obj.Token},${trx_obj.Amount}`)
         }
    })
}

module.exports = {transact, check_length}