import { useEffect, useState } from "react";
import { NextPageWithLayout } from "../../../types/next_extensions";
import { useRouter } from 'next/router'

const Book: NextPageWithLayout<any> = () => {
    const router = useRouter()
    const { id } = router.query
    const [book, setBook] = useState<{ [key: string]: any }>()

    useEffect(() => {
        if (id)
            retrieveBook();
    }, [id]);


    const retrieveBook = async () => {
        const response = await fetch(`/api/book/${id}`);
        const resp = await response.json();
        setBook(resp);
        console.log(resp);
    }
    return <div>
        <div>Book: {id}</div>
    </div>;
}

export default Book;