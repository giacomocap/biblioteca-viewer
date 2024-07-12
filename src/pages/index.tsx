import { ReactElement, useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { NextPageWithLayout } from '../types/next_extensions'
import { DashboardLayout } from '../components/dashboard-layout'
import { QuickSearchToolbar } from '../components/datagrid/QuickSearchToolbar';
// import { GetStaticProps } from 'next/types';

function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

interface HomeProps {
  allRows: {
    [key: string]: string;
  }[];
  headers: string[];
}

const Home: NextPageWithLayout<any> = () => {
  const [dataSet, setDataSet] = useState<{ [key: string]: string }[]>([])
  const [filteredRows, setFilteredRows] = useState<{ [key: string]: string }[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [searchText, setSearchText] = useState('');

  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = dataSet.filter((row: any) => {
      return Object.keys(row).some((field: any) => {
        const value = row[field];
        if (!value) return false;
        return searchRegex.test(value.toString());
      });
    });
    setFilteredRows(filteredRows);
  };

  useEffect(() => {
    setDataSet(dataSet);
  }, [dataSet]);

  useEffect(() => {
    fetchCsvFile();
  }, []);

  const fetchCsvFile = async () => {
    const response = await fetch('/api/book');
    const { headers, allRows } = await response.json() as HomeProps;

    const allColumns = headers.map((field) => {
      return {
        field,
        headerName: field,
        flex: 1
      }
    });
    setColumns(allColumns);
    setDataSet(allRows);
    setFilteredRows(allRows);
  }
  return (
    <div style={{ width: '100%', height: '800px' }}>
      {/* <div style={{ flexGrow: 1 }}> */}
      <DataGrid
        components={{ Toolbar: QuickSearchToolbar }}
        rows={filteredRows}
        columns={columns}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              requestSearch(event.target.value),
            clearSearch: () => requestSearch(''),
          },
        }}
      />
      {/* </div> */}
    </div>)

}

Home.getLayout = (page: ReactElement) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

// export async function getStaticProps() {
//   const file = await fetch('https://drive.google.com/uc?export=download&id=1jsDyPqNZpx0KWaNB5a2wdpSHBKm9xJM9');
//   const text = await file.text();
//   const rows = text.split('\n');
//   const headerAll = rows[0].split(',').slice(0, 9).map(s => s.replaceAll('"', '').trim());
//   const header = [...headerAll.slice(0, 4), ...headerAll.slice(8, 9)];

//   const data = rows.slice(1);
//   const dataContainer: { [key: string]: string }[] = [];
//   data.forEach((row, i) => {
//     const allrowData = row.split(',').slice(0, 9).map(s => s.replaceAll('"', '').trim());
//     const rowData = [...allrowData.slice(0, 4), ...allrowData.slice(8, 9)];
//     const rowObject: { [key: string]: string } = {};
//     rowObject["id"] = i.toString();
//     for (let i = 0; i < header.length; i++) {
//       rowObject[header[i]] = rowData[i];
//     }
//     dataContainer.push(rowObject);
//   });
//   const allColumns: GridColDef[] = header.map((field, index) => {
//     return {
//       field,
//       headerName: field,
//       flex: 1
//       // flex: index < 4 ? 2 : 1,

//     }
//   });
//   const allRows = dataContainer.filter(a => !(a[header[1]] === "" || a[header[1]] === undefined)).sort((a, b) => a[header[1]] < b[header[1]] ? -1 : 1);

//   return {
//     props: { allRows, allColumns }, // will be passed to the page component as props
//   }
// }

export default Home;