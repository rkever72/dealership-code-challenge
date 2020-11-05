export class CurrencyValueConverter {
    toView(value, showCents) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: showCents ? 2 : 0
        });

        return formatter.format(value);
    }


}
