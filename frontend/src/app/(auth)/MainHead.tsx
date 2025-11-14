import AuthHead from "@/app/(auth)/AuthHead";

export default function MainHead() {
    return <AuthHead>
        <h1 className="text-3xl font-semibold leading-none mb-1.5">Добро пожаловать в семейный мультибанк!</h1>
        <p className="max-w-72 font-normal text-secondary leading-tight">Единое финансовое пространство для вас и ваших
            близких</p>
    </AuthHead>;
}