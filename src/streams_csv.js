import { parse } from 'csv-parse';
import fs from 'node:fs';


export function import_csv(){
    const csvPath = new URL('../files/tasks_to_import.csv', import.meta.url);
    const stream = fs.createReadStream(csvPath);
    
    const csvParse = parse({
      delimiter: ',',
      skipEmptyLines: true,
      fromLine: 2
    });
    
    return stream.pipe(csvParse);
}

export async function readCSV() {
    const parser = import_csv();
    const lines =[];
    for await (const record of parser) {
        const [title, description] = record;
        lines.push({
            title, description
        })
    }

    return lines;
}
