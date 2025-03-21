
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

export const getHost = () => {
    let protocol = window.location.protocol;
    let hostname = window.location.hostname;
    let port = window.location.port;

    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "") {
        return protocol + '//' + hostname + ':8000';
    }

    return protocol + '//' + hostname + ':' + port;
}