import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import { DiApple } from "react-icons/di";
import { DiAndroid } from "react-icons/di";
import { DiWindows } from "react-icons/di";

import Progress from "components/progress";
import {GET_SHIPS} from "../../../../queries.js"


const DevelopmentTable2 = () => {
  
  const [filter, setFilter] = useState('');
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Year Built',
        accessor: 'year_built',
      },
      {
        Header: 'Home Port',
        accessor: 'home_port',
      },
    ],
    []
  );

  const { data, loading, error } = useQuery(GET_SHIPS);

  let ships = [];
  if (data) {
    ships = data.ships;
  }

  const {
    getTableProps,
    getTheadProps,
    getTrProps,
    getThProps,
    getTdProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter: setGlobalFilterState,
  } = useTable({
    columns,
    data: Array.isArray(ships)? ships : [ships],
  },
  useGlobalFilter,
  useSortBy,
  usePagination
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card extra={"w-full h-full p-4"}>
      <div class="relative flex items-center justify-between">
        <div class="text-xl font-bold text-navy-700 dark:text-white">
          Development Table
        </div>
        <CardMenu />
      </div>
      <div>
        <div class="h-full overflow-x-scroll xl:overflow-x-hidden">
          <table {...getTableProps()} className="mt-8 h-max w-full" style={{ width: '100%px' }}
            variant="simple"
            color="gray-500"
            mb="24px">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} className="border-b border-gray-200 pr-32 pb-[10px] text-start dark:!border-navy-700 " 
                    style={{ padding: '10px', margin: '15px' }} > <div className="text-xs font-bold tracking-wide text-gray-600">
                    {column.render("Header")}
                  </div></th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="pt-[14px] pb-3 text-[14px]"style={{ padding: '10px', margin: '15px' }}  >{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default DevelopmentTable2;