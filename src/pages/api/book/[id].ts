import type { NextApiRequest, NextApiResponse } from 'next'
import { GetXLSDataByISBN } from '../../../components/data/datafetchXLS';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const id = req.query.id as string;
    console.log(`Fetching data for ${id}`);
    const data = await GetXLSDataByISBN(id);
    res.status(200).json(data ? data : {});
}