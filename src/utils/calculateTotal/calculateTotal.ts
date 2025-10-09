export function calculateTotal(amounts: string): number {
    const amountArray = amounts
        .split(/[,\n\s]+/) // splits the string into an array wherever it finds one or more commas, newlines, or spaces.
        .map(amt => amt.trim())
        .filter(amt => amt !== "")
        .map(amt => {
            const match = amt.match(/-?\d+\.?\d*/)
            return match ? parseFloat(match[0]) : NaN
        })
        .filter(amt => !isNaN(amt))
    if (amountArray.some(isNaN)) {
        return 0
    }
    return amountArray.reduce((acc, curr) => acc + curr, 0)
}