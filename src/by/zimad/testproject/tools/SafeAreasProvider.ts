export class SafeAreaProvider {
    public static getSafeArea(): number {
        const maxHPadding = Math.max(SafeAreaProvider.getDocumentComputedStyleAsNumber("--top-safe-area"), SafeAreaProvider.getDocumentComputedStyleAsNumber("--bottom-safe-area"));
        const maxVPadding = Math.max(SafeAreaProvider.getDocumentComputedStyleAsNumber("--right-safe-area"), SafeAreaProvider.getDocumentComputedStyleAsNumber("--left-safe-area"));
        return Math.max(maxHPadding, maxVPadding);
    }

    private static getDocumentComputedStyleAsNumber(propertyName: string): number {
        return Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(propertyName));
    }
}