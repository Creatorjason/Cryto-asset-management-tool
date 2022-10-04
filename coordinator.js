const csv = require('csvtojson')
let latest_portfolio_all_token = {}
let group = []
let isGrouped = {}


const retrieve = async()=>{
    const obj = await csv().fromFile('trx.csv') 
    return obj 
}

const convert_milliseconds_to_ymd = (milliseconds)=>{
    const date = new Date(Number(milliseconds))
    const ymd = /\d{4}\-\d{2}\-\d{2}/.exec(date.toISOString())
    return ymd[0]
}

const set_latest_portfolio_all_token = async ()=>{
    // check for the latest balance of tokens
    const item = await retrieve()
    return new Promise((res)=>{
        for(let i =0; i<item.length; i++){
        let {Token} = item[i]
        latest_portfolio_all_token[Token] = i
    }
        res(true)
    })
}


const get_latest_balance_for_all_token = async() =>{
    const item = await retrieve()
    Object.values(latest_portfolio_all_token).map((value)=>{
        let {Token, Amount} = item[value]
        console.log(Token, Amount)
    })
}
const get_latest_balance_per_token = async(token)=>{
    const item = await retrieve()
    return new Promise((res, rej)=>{
        Object.keys(latest_portfolio_all_token).map((value)=>{
            if(value === (token.toUpperCase())){
                const index = latest_portfolio_all_token[value]
                const {Token, Amount} = item[index]
                console.log(Token, Amount)
                res(true)
            }
        })
        rej(true)
    
    })   
}
const push_to_group =async(date)=>{
    const item = await retrieve()
    return new Promise((res)=>{
        item.map((value)=>{
            let {Timestamp} = value
            let ymd = convert_milliseconds_to_ymd(`${Timestamp}`)
            if(date === ymd){
                group.push(Timestamp)
                res(true)
            }
        })
           res(false)
        
       

    })   
}
const set_is_grouped = ()=>{
    group.map((value)=>{
        isGrouped[value] = true
    })
}
const time_to_obj = async()=>{
    const item = await retrieve();
    for(let i=0; i<group.length; i++){
        let {Timestamp, Token, Amount} = item[i]
        if(isGrouped[Timestamp]){
            console.log(Token, Amount)
        }    
    }
}
const get_token_portfolio_on_date = async(date, token)=>{
    const item = await retrieve()
    return new Promise((res, rej)=>{
        item.map((value)=>{
            let {Timestamp, Token, Amount} = value
            let ymd = convert_milliseconds_to_ymd(`${Timestamp}`)
            if(date === ymd){
            if((isGrouped[Timestamp]) && (Token === (token.toUpperCase()))){
                res({Token, Amount})
            }}
        })
            rej(true)
    })    
}
const get_all_portfolio_on_date = async(date)=>{
    const item  = await retrieve()
    return new Promise((res,rej)=>{
        item.map((value)=>{
            let {Timestamp, Token, Amount} = value
            let ymd = convert_milliseconds_to_ymd(`${Timestamp}`)
            if(date === ymd){
                console.log(Token, Amount)
                res(true)
            }
        })
        rej(true)
    })
}
const sleep =(delay)=>{
    return new Promise((res)=>{
        setTimeout(()=>{
            res(true)
        },delay)
    }) 
}

module.exports = {
                    set_latest_portfolio_all_token,
                    get_latest_balance_for_all_token,
                    get_latest_balance_per_token,
                    push_to_group,
                    set_is_grouped,
                    time_to_obj,
                    get_token_portfolio_on_date,
                    get_all_portfolio_on_date
                }
