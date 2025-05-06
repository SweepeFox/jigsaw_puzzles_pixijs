export class JsonLoader {
    public static async loadJson<T>(pathToJson: string): Promise<T> {
        const response = await fetch(pathToJson);
        if (!response.ok) {
            throw new Error(`Failed to load ${pathToJson}, ${response.statusText}`);
        }
        return <T>await response.json();
    }
}