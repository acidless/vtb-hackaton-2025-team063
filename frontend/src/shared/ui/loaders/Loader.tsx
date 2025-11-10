type Props = {
    size?: number;
    border?: number;
}

const Loader = ({size = 2.5, border = 0.25}: Props) => {
    return <div
        style={{width: `${size}rem`, height: `${size}rem`, borderWidth: `${border}rem`}}
        className={`animate-spin border-blue-600 border-t-transparent rounded-full`}></div>
}

export default  Loader;