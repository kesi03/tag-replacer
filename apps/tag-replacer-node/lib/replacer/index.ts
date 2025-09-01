import * as fs from 'fs';
import { FormatType, ReplacerType, ReplaceUtils } from '../utils/index';

export default class ReplaceTagsManager {
    static replaceTags(
        replacer: string,
        replacerType: ReplacerType,
        formatType: FormatType,
        infile: string,
        outfile: string,
        startTag: string,
        endTag: string
    ) {
        // Load the replacer data
        const replacerData = ReplaceUtils.loadReplacer(replacer, replacerType, formatType);
        if (replacerData === null) {
            return;
        }

        // Read the input file
        let content: string;
        try {
            content = fs.readFileSync(infile, 'utf-8');
        } catch (e) {
            console.error(`Error reading input file: ${e}`);
            return;
        }

        // Replace tags in the content
        for (const item of replacerData.replace) {
            const key = item.key;
            const value = item.value;
            content = content.replace(new RegExp(`${startTag}${key}${endTag}`, 'g'), value);
        }

        // Write the modified content to the output file
        try {
            fs.writeFileSync(outfile, content);
        } catch (e) {
            console.error(`Error writing to output file: ${e}`);
        }
    }
}
