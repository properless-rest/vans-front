

export default function Transaction({ transaction }) {

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')  // Months are 0-based in JS
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    const { 
        lessee_name: name, 
        price, 
        lessee_surname: surname,
        transaction_date: date
    } = transaction
    const dateString = formatDate(date)
    return (
        // FIXME: TRANSFER THE STYLE TO .css
        <div className="transaction">
            <div className="trx-block block-name">
                <span>{name} {surname}</span>
            </div>
            <div className="trx-block">
                <span>{price}$</span>
            </div>
            <div className="trx-block">
                <span>{dateString}</span>
            </div>
        </div>
    )
}
