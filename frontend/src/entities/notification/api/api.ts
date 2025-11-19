import urlBase64ToUint8Array from "@/shared/lib/urlBase64ToUint8Array";
import universalFetch from "@/shared/lib/universalFetch";

export async function getNotificationsStatus() {
    return universalFetch<null | {id: number}>("/notifications", {
        method: "GET",
    });
}

export async function notificationsSubscribe() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        throw new Error("Вы запретили уведомления");
    }

    const reg = await navigator.serviceWorker.ready;

    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
    const uint8 = urlBase64ToUint8Array(key);

    const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });


    await universalFetch("/notifications", {
        method: "POST",
        body: subscription
    });
}

export async function notificationsUnsubscribe() {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();

    if (!subscription) {
        throw new Error("У вас нет активной подписки");
    }

    await universalFetch("/notifications", {
        method: "DELETE",
    });

    const success = await subscription.unsubscribe();
    if (!success) {
        throw new Error("Не удалось отписаться");
    }
}