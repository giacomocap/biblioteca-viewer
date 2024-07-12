import { CellObject, read, utils, WorkSheet } from "xlsx";

let xlsFile: Blob;
let xlsdata: { allRows: { [key: string]: string }[], headers: string[] };

const get_header_row = (sheet: WorkSheet) => {
    const headers = [];
    const range = utils.decode_range(sheet['!ref'] ?? "");
    let C, R = range.s.r;
    for (C = range.s.c; C <= range.e.c; ++C) {
        const cell = sheet[utils.encode_cell({ c: C, r: R })] as CellObject;/* find the cell in the first row */

        let hdr = "UNKNOWN " + C;
        if (cell?.t) hdr = utils.format_cell(cell);

        headers.push(hdr);
    }
    return headers;
}

export async function GetAllXLSData() {
    if (!xlsdata) {
        const file = await fetch('https://drive.google.com/uc?export=download&id=1B8fCbh4wIZ2pwb1LQrNmfhEvMVwDcBC3', {

        });

        xlsFile = await file.blob();

        console.log('parsing');
        const wb = read(await xlsFile.arrayBuffer(), { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0] ?? ''] as WorkSheet;
        const headers = get_header_row(sheet);
        const data = utils.sheet_to_json<{ [key: string]: string; }>(sheet);
        const headerAll = headers.slice(0, 9);
        const header = [...headerAll.slice(0, 4), ...headerAll.slice(8, 9)];
        const rows = data.filter(a => !(a[header[1]] === "" || a[header[1]] === undefined)).sort((a, b) => a[header[1]] < b[header[1]] ? -1 : 1).map((e, i) => { e['id'] = i.toString(); return e; });
        // console.log(data);


        // const rows = xlsFile.split('\n');

        // const allData = rows.slice(1);
        // const dataContainer: { [key: string]: string }[] = [];
        // allData.forEach((row, i) => {
        //     const allrowData = row.split(',').slice(0, 9).map(s => s.replaceAll('"', '').trim());
        //     const rowData = [...allrowData.slice(0, 4), ...allrowData.slice(8, 9)];
        //     const rowObject: { [key: string]: string } = {};
        //     rowObject["id"] = i.toString();
        //     for (let i = 0; i < header.length; i++) {
        //         rowObject[header[i]] = rowData[i];
        //     }
        //     dataContainer.push(rowObject);
        // });

        xlsdata = { allRows: rows, headers: header };
    }
    return xlsdata;
}

export async function GetXLSDataByISBN(isbn: string) {
    if (!xlsdata) {
        await GetAllXLSData();
    }
    const book = xlsdata.allRows.find(a => a[xlsdata.headers[4]] as any === +isbn);
    return book;
}
