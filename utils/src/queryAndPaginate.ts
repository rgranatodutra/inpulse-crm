import { Connection } from "mysql2/promise";

interface PaginatedResponse<T> {
    data: Array<T>,
    page: {
        current: number;
        next: boolean;
        previous: boolean;
    }
}

export default async function queryAndPaginate<T>(
    connection: Connection,
    queryString: string,
    queryParameters: Array<any>,
    page: number,
    perPage: number,
): Promise<PaginatedResponse<T>> {
    const [rows] = await connection.execute(queryString, queryParameters);

    const data: Array<T> = rows.length > perPage ? rows.slice(0, perPage) : rows;

    const paginatedResponse = {
        data, page: {
            current: page,
            next: rows.length > perPage,
            previous: page > 1
        }
    }

    return paginatedResponse;
}