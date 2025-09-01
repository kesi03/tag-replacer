import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import ReplaceTagsManager from '../lib/replacer/index';
import { FormatType, ReplacerType } from '../lib/utils';

interface Args {
    replacer: string;
    type: ReplacerType;
    format: FormatType;
    in: string;
    out: string;
    start_tag: string;
    end_tag: string;
}

const startTag = '{{';
const endTag = '}}';

const argv: Args = yargs(hideBin(process.argv))
    .option('replacer', {
        alias: 'r',
        type: 'string',
        demandOption: true,
        describe: 'Replacer JSON string, CSV file path, YAML file path, or comma-separated environment variable keys'
    })
    .option('type', {
        alias: 't',
        type: 'string',
        choices: ['string', 'file', 'environment'],
        default: 'string',
        describe: "Specify if replacer is a 'string', 'file', or 'environment'"
    })
    .option('format', {
        type: 'string',
        choices: ['json', 'yaml', 'csv'],
        default: 'json',
        describe: "Format of the replacer if it's a string"
    })
    .option('in', {
        alias: 'i',
        type: 'string',
        demandOption: true,
        describe: 'Input file path'
    })
    .option('out', {
        alias: 'o',
        type: 'string',
        demandOption: true,
        describe: 'Output file path'
    })
    .option('start_tag', {
        type: 'string',
        default: startTag,
        describe: `Start tag for placeholders (default: "${startTag}")`
    })
    .option('end_tag', {
        type: 'string',
        default: endTag,
        describe: `End tag for placeholders (default: "${endTag}")`
    })
    .help()
    .argv as unknown as Args;

ReplaceTagsManager.replaceTags(argv.replacer, argv.type, argv.format, argv.in, argv.out, argv.start_tag, argv.end_tag);
