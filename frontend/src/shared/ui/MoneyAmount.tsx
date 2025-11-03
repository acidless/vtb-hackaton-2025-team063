type Props = {
    value: number;
    showCurrency?: boolean;
}

const MoneyAmount = ({value, showCurrency = true}: Props) => {
    return <>{new Intl.NumberFormat('ru-RU').format(value)}{showCurrency ? ' ₽' : ''}</>;
}

export default MoneyAmount;