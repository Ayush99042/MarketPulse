import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickers } from '../api/queries';
import { Card } from '../components/Card';
import { Eye } from 'lucide-react';
import type { Ticker } from '../api/queries';
import type { Column } from '../components/DataTable';
import DataTable from '../components/DataTable';

export const Listing: React.FC = () => {
  const { data, isLoading, isError } = useTickers('XNSE');
  const navigate = useNavigate();

  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);

  const rawData = data || [];
  
  const paginatedData = rawData.slice((page - 1) * limit, page * limit);
  const total = rawData.length;

  if (isError) {
    return (
      <Card className="p-6 text-center text-red-500">
        Failed to load market data. Please check your API key or network.
      </Card>
    );
  }
  const columns: Column<Ticker>[] = [
    {
      header: "Company Name",
      accessor: "name",
      cell: (row) => (
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {row.name}
        </span>
      ),
    },
    {
      header: "Symbol",
      accessor: "symbol",
      cell: (row) => <span>{row.symbol}</span>,
    },
    {
      header: "Actions",
      align: "right",
      cell: () => (
        <Eye className="inline-block h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      ),
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">National Stock Exchange of India (XNSE)</p>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        total={total}
        isLoading={isLoading}
        isError={isError}

        limit={limit}
        page={page}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onPageChange={setPage}
        onRowClick={(row) => navigate(`/detail/${row.symbol}`, { state: { name: row.name } })}
      />
    </div>
  );
};
