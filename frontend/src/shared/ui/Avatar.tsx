import Image, {StaticImageData} from "next/image";

type Props = {
    alt?: string;
    avatar: string | StaticImageData;
    className?: string;
    size?: string;
}

const Avatar = ({avatar, className = "", alt = "", size = "2.375"}: Props) => {
    if (!avatar) {
        return <div style={{width: `${size}rem`, height: `${size}rem`}}
                    className={`rounded-full relative bg-neutral-300 ${className}`}></div>
    }

    return <div style={{width: `${size}rem`, height: `${size}rem`}} className={`relative ${className}`}>
        <Image className="rounded-full object-cover" fill src={avatar} alt={alt} sizes={`${size}rem`}/>
    </div>
}

export default Avatar;