export default function phoneToPlain(phone: string) {
    return phone.replace(/\D/g, "");
}