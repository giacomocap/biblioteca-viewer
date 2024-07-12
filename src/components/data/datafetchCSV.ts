
let csvFile: string;
let csvdata: { allRows: { [key: string]: string }[], headers: string[] };

export async function GetAllCSVData() {
    if (!csvdata) {
        const file = await fetch('https://drive.google.com/uc?export=download&id=1jsDyPqNZpx0KWaNB5a2wdpSHBKm9xJM9',{

        });

        csvFile = await file.text();

        const rows = csvFile.split('\n');
        const headerAll = rows[0].split(',').slice(0, 9).map(s => s.replaceAll('"', '').trim());
        const header = [...headerAll.slice(0, 4), ...headerAll.slice(8, 9)];

        const allData = rows.slice(1);
        const dataContainer: { [key: string]: string }[] = [];
        allData.forEach((row, i) => {
            const allrowData = row.split(',').slice(0, 9).map(s => s.replaceAll('"', '').trim());
            const rowData = [...allrowData.slice(0, 4), ...allrowData.slice(8, 9)];
            const rowObject: { [key: string]: string } = {};
            rowObject["id"] = i.toString();
            for (let i = 0; i < header.length; i++) {
                rowObject[header[i]] = rowData[i];
            }
            dataContainer.push(rowObject);
        });
        
        const allRows = dataContainer.filter(a => !(a[header[1]] === "" || a[header[1]] === undefined)).sort((a, b) => a[header[1]] < b[header[1]] ? -1 : 1);
        csvdata = { allRows, headers: header };
    }
    return csvdata;
}

export async function GetCSVDataByISBN(isbn: string) {
    if (!csvdata) {
        await GetAllCSVData();
    }
    const book = csvdata.allRows.find(a => a[csvdata.headers[1]] === isbn);
    return book;
}
