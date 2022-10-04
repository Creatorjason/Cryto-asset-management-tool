// remember to build the singapore version
const figlet = require("figlet")
const inquirer = require("inquirer")
const {createSpinner} = require("nanospinner")
const language = require("./language_support")
const {transact, check_length} = require('./create_transaction')
const  {
    set_latest_portfolio_all_token,
    get_latest_balance_for_all_token,
    get_latest_balance_per_token,
    push_to_group,
    set_is_grouped,
    get_token_portfolio_on_date,
    get_all_portfolio_on_date, 
} = require("./coordinator")


let system_lang = []
let date;
let token;
const spinner = createSpinner("Fetching Resource..\n")



const trx_que = () =>{   
    return inquirer.prompt([
     {
         name:"Token",
         message:"Enter Token symbol",
         type:"input",
 
     },
     {
         name:"Trx_type",
         message:"Select transaction type",
         type:"list",
         choices:["deposit","withdraw"]
     },
     {
         name:"Amount",
         message:"Enter amount",
         type:"input",
     },
    ])
}



const loader = (message="", delay=2000)=>{
    return new Promise((res)=>{
        setTimeout(() => {
         spinner.success({text:message})
         res(true)
        },delay)
        
    })
}
const delay =(delay=2000)=>{
    return new Promise((res)=>{
        setTimeout(()=>{
            res(true)
        }, delay)
    })
}

const welcome_msg_banner =(lang)=>{
    return new Promise((res)=>{
        system_lang.push(lang) 
        let sub = lang
        if (lang == "Tamil" || lang == "Mandarin"){
             sub = "English"
         }
     figlet.text(`${language[sub]["Welcome to"]} Propine Tech :) `,{width:130}, (err, data)=>{
        if(err){
            console.log(err)
            return;
        }
           console.log(data)
           //spinner.start()
    })
         res([true,lang])
    })
    
   
}
const user_input = (name, message, type, defaults, choice=0)=>{
    return [inquirer.prompt([
        {
            name,
            message,
            type,
            default:`${defaults}`,
            choices:choice
        }
    ]), name]
}

const value = user_input("Lang", "Choose your preferred language", 
                        "list", "English", ["English","Malay","Tamil",
                        "Mandarin"])

value[0].then(async (ans)=>{
    welcome_msg_banner((ans[`${value[1]}`])).then(([bool,lang])=>{
        if(bool){
            check_length().then(async(state)=>{
                if(state){
                    const outcome = await delay(3000)
                    console.log("You currently do not have any transaction recorded, kindly create/make one")
                    outcome ? trx_que().then((val)=>{
                        transact(val.Trx_type, val.Token, val.Amount)
                        //process.exit(0)
                    }):_ 
                }
                else{
                    //delay().then((bl)=>{bl?spinner.start():_})
                    loader(`${language[lang]
                        [ "Latest Portfolio Of Your Digital Assets"]}`)
                        .then(()=>FirstTask()
                        .then((bool)=>{TaskManager(bool,secondTask)}))
                }
            })
        }
    })
})
async function FirstTask(){
    const set  = await set_latest_portfolio_all_token()
    return new Promise((res)=>{
        if(set){
            get_latest_balance_for_all_token()
            res(true)
        }
    })   
}
const capture =async()=>{
    const err3 = `${language[system_lang[0]]["Invalid date"]}`
    return new Promise((res)=>{
        push_to_group(date).then((bool)=>{ bool ? set_is_grouped():console.log(err3)})
        res(true)
    })
}
async function TaskManager(bool, func){
    if(bool){
        func()
    }
}
const secondTask =async ()=>{
    const opt1 = `${language[system_lang[0]]["Check token balance"]}`
    const opt2 = `${language[system_lang[0]]["Check balance per token on a date"]}`
    const opt3 = `${language[system_lang[0]]["Check balance of token on a date"]}`
    const opt4 = `${language[system_lang[0]]["Create transaction"]}`
    const header1 = `${language[system_lang[0]]["Enter token symbol"]}`
    const header2 = `${language[system_lang[0]]["Enter date"]}`
    const err1 = `${language[system_lang[0]]["Oops, we do not seem to have a record for this token,check token symbol and try again"]}`
    const err2 = `${language[system_lang[0]]["Error!, record not found, Check date or token"]}`
    await delay()
    const output = user_input("Services",`${language[system_lang[0]]["Check out our services"]}`, 
    "list", `${language[system_lang[0]]["Check out our services"]}`, [opt1, opt2, opt3, opt4])
    output[0].then(
        (ans)=>{
            const condition = ans[`${output[1]}`]
            if(condition === opt1){
                const output = user_input("Token",header1,"input","btc")
                output[0].then((ans)=>{
                    get_latest_balance_per_token(ans[`${output[1]}`]).then((bool)=>{
                        bool? console.log("Thank you for choosing us to serve you 🧑‍💻"):_
                    }).catch((err)=>{
                        console.log(err1)
                    })
                    
                })
            }
            else if(condition === opt2){
                const hold = new Promise((res)=>{
                    const output = user_input("Date",header2,"input","(yyyy-mm-dd)")
                    output[0].then((ans)=>{
                        date = ans[`${output[1]}`]
                        res(true)
                    })
                })
                hold.then((bool)=>{bool ? delay()
                    .then((res)=>{
                        res ? get_all_portfolio_on_date(date) :_
                    })
                :_})
            }
            else if(condition === opt3){

                const dual_que = new Promise((res)=>{
                    const output = user_input("Token",header1,"input","btc")
                    output[0].then((ans)=>{
                        token = ans[`${output[1]}`]
                        res(true)
                    })
                })
                dual_que.then((bool)=>{
                    if(bool){
                        const output2 = user_input("Date",header2 + "(YYYY-MM-DD)","input","(yyyy-mm-dd)")
                        output2[0].then((ans)=>{
                         date = ans[`${output2[1]}`]
                         capture().then((bool)=>{
                            if(bool){
                                delay().then((bool)=>{
                                    if(bool){  
                                        get_token_portfolio_on_date(date, token)
                                        .then(({Token, Amount})=>{
                                            console.log(Token, Amount)
                                        }).catch(()=>{
                                            console.log(err2)
                                        })
                                    }
                                })
                            }
                         })
                        })
                    }
                })
         }
            else if(condition === opt4){
                trx_que().then((val)=>{
                    transact(val.Trx_type, val.Token, val.Amount)})
            }
        }
    ) 
}