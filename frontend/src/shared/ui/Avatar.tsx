import Image, {StaticImageData} from "next/image";

type Props = {
    alt?: string;
    avatar: string | StaticImageData;
    className?: string;
}

const Avatar = ({avatar, className = "", alt = ""}: Props) => {
    if (!avatar) {
        return <div className={`w-[2.375rem] h-[2.375rem] rounded-full relative bg-neutral-300 ${className}`}></div>
    }

    return <div className={`w-[2.375rem] h-[2.375rem] relative ${className}`}>
        <Image className="rounded-full object-cover" fill src={avatar} alt={alt} sizes="38px"/>
    </div>
}

export default Avatar;