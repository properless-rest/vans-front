import { useState, useMemo } from "react"

import { useOutletContext } from "react-router-dom"

import Transaction from "./subcomponents/Transaction"
import TransactionsChart from "./subcomponents/BarChart"

import "../styles/host/HostIncome.css"


function _reduceIncomeBySelector({ selectedData, selectorName, selectorFunctionName }) {
    // TODO: HOW IT WORKS:
    const datesAndPrices = selectedData.map( 
        transaction => [transaction.transaction_date, transaction.price] 
    )
    const totalIncomeBySelector = datesAndPrices.reduce(
        (acc, [date, price]) => 
        {   
            let selector
            selector = date[selectorFunctionName]()
            // Initialize the selector if not present
            if (!acc[selector]) {
                // don't forget the square brackets around the selectorName,
                // or else your Objects will have the field called "selectorName"
                acc[selector] = { [selectorName]: selector, income: 0 }
            }
            // Sum up the income directly
            acc[selector].income += price
            return acc
        }
        , 
        {}
    );
    // Extract the result into an array
    const transformedData = Object.values(totalIncomeBySelector)
    return transformedData
}


function getMonthChartData(selectedData) {
    return _reduceIncomeBySelector(
        {
            selectedData, 
            selectorName: "day", 
            selectorFunctionName: "getDate"
        }

    )

}


function getYearChartData(selectedData) {
    const dataByMonthsAsNums =  _reduceIncomeBySelector(
        {
            selectedData, 
            selectorName: "month", 
            selectorFunctionName: "getMonth"
        }
    )
    return dataByMonthsAsNums.map( ({ month, income }) => ({ month: numToMonthDict[month], income}) )
}


function getAllTimeChartData(selectedData) {
    return _reduceIncomeBySelector(
        {
            selectedData, 
            selectorName: "year", 
            selectorFunctionName: "getFullYear"
        }
    )
}


function reduceIncomeToTotal(data) {
    return data.reduce( (total, pair) => { return total + pair.income } , 0 )
}


export default function HostIncomePage() {
    const { user } = useOutletContext()
    const { transactions } = user

    /* HERE COMES TRANSACTION DATA as Object: full, this year and this month */
    // FIXME: add useMemo() here
    const transactionsWithDateObjects = transactions.map( 
        transaction => ({ ...transaction, transaction_date: new Date(transaction.transaction_date) })
    )
    const today = new Date()
    const transactionsThisYear = useMemo(
        () =>
            transactionsWithDateObjects.filter(
                ({transaction_date, }) => transaction_date.getFullYear() == today.getFullYear()
            )
        ,
        [transactionsWithDateObjects]
    )
    const transactionsThisMonth = useMemo(
        () =>
            transactionsThisYear.filter(
                ({transaction_date, }) => transaction_date.getMonth() == today.getMonth()
            )
        ,
        [transactionsThisYear]
    )
    /*  */

    /* HERE COMES CHART DATA: [{ [calendarSelector]: selector, "income": income }, { ... }] */
    /* And also comes Total income for the period selected:  */

    const allTimeData = 
        transactions.length ?
        useMemo( () => getAllTimeChartData(transactionsWithDateObjects) , [transactionsWithDateObjects]) 
        : 
        defaultAllTime
    const allTimeIncome = useMemo( 
        () => reduceIncomeToTotal(allTimeData)
        , 
        [allTimeData]
    )
    //
    const yearData = 
        transactionsThisYear.length ?
        useMemo(() => getYearChartData(transactionsThisYear) , [transactionsThisYear])
        :
        defaultThisYear
    const yearIncome = useMemo( 
        () => reduceIncomeToTotal(yearData)
        , 
        [yearData]
    )
    //
    const monthData = 
        transactionsThisMonth.length ?
        useMemo(() => getMonthChartData(transactionsThisMonth) , [transactionsThisMonth])
        :
        defaultThisMonth
    const monthIncome = useMemo( 
        () => reduceIncomeToTotal(monthData)
        , 
        [monthData]
    )
    /*  */

    const [selectedData, setSelectedData] = useState(
        { 
            "chartData": allTimeData, 
            "totalIncome": allTimeIncome, 
            "transactions": transactionsWithDateObjects,
            "xKey": "year"
        }
    )
    const transactionsElements = selectedData.transactions.map(
        transaction => <Transaction key={transaction.uuid} transaction={transaction} />
    )
    return (
        <section className="host-income">
            <h2 className="title">Your Income</h2>
            <div className="period-box">
                <span 
                    className="option"
                    style={{ fontWeight: selectedData.xKey === "day" ? 600 : 400 }}
                    onClick={ 
                        () => 
                        setSelectedData(
                            { 
                                "chartData": monthData, 
                                "totalIncome": monthIncome,
                                "transactions": transactionsThisMonth,
                                "xKey": "day" 
                            }
                        ) 
                    }
                >
                    This Month
                </span>
                <span 
                    className="option"
                    style={{ fontWeight: selectedData.xKey === "month" ? 600 : 400 }}
                    onClick={ 
                        () => 
                        setSelectedData(
                            { 
                                "chartData": yearData, 
                                "totalIncome": yearIncome, 
                                "transactions": transactionsThisYear,
                                "xKey": "month" 
                            }
                        ) 
                    }
                >
                    This Year
                </span>
                <span 
                    className="option"
                    style={{ fontWeight: selectedData.xKey === "year" ? 600 : 400 }}
                    onClick={ 
                        () => 
                        setSelectedData(
                            { 
                                "chartData": allTimeData, 
                                "totalIncome": allTimeIncome, 
                                "transactions": transactionsWithDateObjects,
                                "xKey": "year" 
                            }
                        ) 
                    }
                >
                    All Time
                </span>
            </div>
            <span className="total">TOTAL: {selectedData.totalIncome}$</span>
            <TransactionsChart data={selectedData.chartData} xKey={selectedData.xKey} />
            <span className="num-transactions">TRANSACTIONS: [{selectedData.transactions.length}]</span>
            <div className="transactions-grid">
                {
                    selectedData.transactions.length ?
                    transactionsElements
                    :
                    <h3 style={noTrxStyle}>You don't have no transactions yet</h3>
                }
            </div>
        </section>
    )
}

const noTrxStyle = {  
    padding: "0.25rem", 
    fontSize: "1.25rem", fontWeight: "500", 
    gridColumn: "1 / span 2"  // Note: wide screens have 2 grid columns
}

const numToMonthDict = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
}

const defaultAllTime = [
    { year: 2022, income: 0 }, 
    { year: 2023, income: 0 }, 
    { year: 2024, income: 0 }
]
defaultAllTime.isDefault = true // used in BarChart for a better income display

const defaultThisYear = [
    { month: "Jan", income: 0 }, 
    { month: "Apr", income: 0 }, 
    { month: "Jun", income: 0 }, 
    { month: "Jul", income: 0 }, 
    { month: "Sep", income: 0 }, 
    { month: "Dec", income: 0 }, 
]
defaultThisYear.isDefault = true  // used in BarChart for a better income display

const defaultThisMonth = [
    { day: "01", income: 0 }, 
    { day: "07", income: 0 }, 
    { day: "14", income: 0 }, 
    { day: "21", income: 0 }, 
    { day: "28", income: 0 }
]
defaultThisMonth.isDefault = true  // used in BarChart for a better income display
