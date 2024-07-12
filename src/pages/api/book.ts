import type { NextApiRequest, NextApiResponse } from 'next'
import { GetAllXLSData } from '../../components/data/datafetchXLS';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const data = await GetAllXLSData();
    res.status(200).json(data);
}