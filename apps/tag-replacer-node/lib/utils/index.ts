import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface ReplacerData {
    replace: Array<{ key: string; value: string }>;
}

export enum ReplacerType {
    File = 'file',
    String = 'string',
    Environment = 'environment'
}

export enum FormatType {
    Json = 'json',
    Yaml = 'yaml',
    Csv = 'csv'
}

export class ReplaceUtils {
    static loadReplacer(
        replacer: string,
        replacerType: ReplacerType,
        formatType?: FormatType
    ): ReplacerData | null {
        if (replacerType === ReplacerType.File) {
            const fileExtension = path.extname(replacer).toLowerCase();
            try {
                if (fileExtension === '.json') {
                    return JSON.parse(fs.readFileSync(replacer, 'utf-8'));
                } else if (fileExtension === '.csv') {
                    return this.loadCSV(replacer);
                } else if (fileExtension === '.yaml' || fileExtension === '.yml') {
                    return yaml.load(fs.readFileSync(replacer, 'utf-8')) as ReplacerData;
                } else {
                    console.error("Unsupported file format. Please use JSON, CSV, or YAML.");
                    return null;
                }
            } catch (e) {
                console.error(`Error reading replacer from file: ${e}`);
                return null;
            }
        } else if (replacerType === ReplacerType.String) {
            try {
                if (formatType === FormatType.Json) {
                    return JSON.parse(replacer);
                } else if (formatType === FormatType.Yaml) {
                    return yaml.load(replacer) as ReplacerData;
                } else if (formatType === FormatType.Csv) {
                    return this.loadCSVFromString(replacer);
                } else {
                    console.error("Invalid format type. Use 'json', 'yaml', or 'csv'.");
                    return null;
                }
            } catch (e) {
                console.error(`Error decoding string: ${e}`);
                return null;
            }
        } else if (replacerType === ReplacerType.Environment) {
            return this.loadEnvironment(replacer);
        } else {
            console.error("Invalid replacer type. Use 'string', 'file', or 'environment'.");
            return null;
        }
    }

    static loadCSV(filePath: string): ReplacerData {
        const replacerData: ReplacerData = { replace: [] };
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            const rows = data.split('\n').slice(1); // Skip header
            for (const row of rows) {
                const [key, value] = row.split(',');
                if (key && value) {
                    replacerData.replace.push({ key: key.trim(), value: value.trim() });
                }
            }
        } catch (e) {
            console.error(`Error reading CSV file: ${e}`);
        }
        return replacerData;
    }

    static loadCSVFromString(csvString: string): ReplacerData {
        const replacerData: ReplacerData = { replace: [] };
        const rows = csvString.split('\n').slice(1); // Skip header
        for (const row of rows) {
            const [key, value] = row.split(',');
            if (key && value) {
                replacerData.replace.push({ key: key.trim(), value: value.trim() });
            }
        }
        return replacerData;
    }

    static loadEnvironment(replacer: string): ReplacerData {
        const replacerData: ReplacerData = { replace: [] };
        for (const key of replacer.split(',')) {
            const value = process.env[key.trim()];
            if (value !== undefined) {
                replacerData.replace.push({ key: key.trim(), value });
            } else {
                console.warn(`Warning: Environment variable '${key.trim()}' not found.`);
            }
        }
        return replacerData;
    }
}
