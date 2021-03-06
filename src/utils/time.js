/**
 * @param {number} seconds
 */
export function timestamp(seconds) {
    const dateObj = new Date(0);
    dateObj.setSeconds(seconds);
    const hours = dateObj.getUTCHours().toString();
    const minutes = dateObj.getUTCMinutes().toString();
    seconds = dateObj.getSeconds();

    return hours.padStart(2, '0') 
        + ':' + minutes.padStart(2, '0')
        + ':' + seconds.toString().padStart(2, '0');
}
