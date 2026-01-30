export const getCurrencySymbol = (currencyCode: string): string => {
    const symbols: { [key: string]: string } = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'INR': '₹',
        'AED': 'AED ',
        'JPY': '¥',
    };
    return symbols[currencyCode?.toUpperCase()] || symbols['INR']; // Default to ₹ if unknown, or maybe $? app seems to default to INR visually
};

export const formatPrice = (price: string | number, currency: string): string => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${price}`;
};
