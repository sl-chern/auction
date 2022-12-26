const getStringDate = (date) => {
    let newDate = new Date(date)
    return newDate.toLocaleString('ru-RU').replace(',', '').slice(0, -3)
}

export default getStringDate