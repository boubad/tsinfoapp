import moment from "moment";

export const DateUtils = {
    toDisplay: (date?: string): string => {
        if (date !== undefined && date !== null && date.length > 0) {
            const dx = moment(date);
            if (dx.isValid()) {
                return dx.format("DD/MM/YYYY");
            }
        }
        return "";
    },// toDisplay
    fromDisplay: (date: string): string | undefined => {
        if (date && date.length > 0) {
            const dx = moment(date);
            if (dx.isValid()) {
                const x = dx.toDate();
                return x.toISOString();
            }
        }
        return undefined;
    }// fromDispay
};