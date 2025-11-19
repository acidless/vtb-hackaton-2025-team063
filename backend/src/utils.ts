export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * max - min) + min;
}

export function getRandomDate(start: Date, end: Date): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();

    const randomTimestamp = startTime + Math.random() * (endTime - startTime);

    return new Date(randomTimestamp);
}