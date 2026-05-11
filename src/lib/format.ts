export function formatCurrency(amount: string | number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(Number(amount))
}

export function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

export function formatShortDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    })
}

export function getCurrentMonthRange(): { start: string; end: string } {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const start = new Date(year, month, 1).toISOString().split("T")[0]
    const end = new Date(year, month + 1, 0).toISOString().split("T")[0]
    return { start, end }
}

export function getCurrentYearMonth(): { year: number; month: number } {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
}
