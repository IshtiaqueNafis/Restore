import React from 'react';
import {Box, Pagination, Typography} from "@mui/material";
import {Metadata} from "../models/pagination";

interface Props {
    metadata: Metadata
    onPageChange: (page: number) => void
}

const AppPagination = ({metadata: {currentPage, pageSize, totalCount, totalPages}, onPageChange}: Props) => {

    return (
        <Box display={"flex"} justifyContent={'space-between'} alignItems={'center'}>
            <Typography>
                Displaying {((currentPage - 1) * pageSize) + 1} -
                {(currentPage * pageSize) > totalCount ? totalCount : `${currentPage * pageSize} of ${totalCount} items`}

            </Typography>
            <Pagination
                color={'secondary'}
                size={'large'}
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => onPageChange(page)}
            />
        </Box>
    );
};

export default AppPagination;