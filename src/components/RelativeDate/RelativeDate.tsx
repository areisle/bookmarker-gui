import React from 'react';
import { differenceInMonths, formatDistanceToNow, parseISO, format } from 'date-fns';


interface RelativeDateProps {
    children: string | undefined | null;
}

function RelativeDate({ children }: RelativeDateProps) {
    if (!children) { return null; }

    const now = Date.now()
    const date = parseISO(children);

    let relativeDateString = ''
    let localDateString = format(date, 'y-MM-dd HH:mm:ss');
    if (differenceInMonths(now, date) < 6) {
        relativeDateString = formatDistanceToNow(date, { addSuffix: true });
    } else {
        relativeDateString = format(date, 'y-MM-dd');
    }

    return (
        <time dateTime={localDateString} title={localDateString}>{relativeDateString}</time>
    )

}

export { RelativeDate };
export type { RelativeDateProps };
