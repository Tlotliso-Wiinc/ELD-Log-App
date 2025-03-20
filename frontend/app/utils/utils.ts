
const formatter = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
});

export const formatDateTime = (date: string | null | undefined) => {
    return date ? formatter.format(new Date(date)) : '';
};