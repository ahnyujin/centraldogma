import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { DataTableClientPagination } from 'dogma/common/components/table/DataTableClientPagination';
import { useGetCredentialsQuery, useDeleteCredentialMutation } from 'dogma/features/api/apiSlice';
import { Badge } from '@chakra-ui/react';
import { ChakraLink } from 'dogma/common/components/ChakraLink';
import { CredentialDto } from 'dogma/features/project/settings/credentials/CredentialDto';
import { DeleteCredential } from 'dogma/features/project/settings/credentials/DeleteCredential';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type CredentialListProps<Data extends object> = {
  projectName: string;
};

const CredentialList = <Data extends object>({ projectName }: CredentialListProps<Data>) => {
  const { data } = useGetCredentialsQuery(projectName);
  const [deleteCredential, { isLoading }] = useDeleteCredentialMutation();
  const columnHelper = createColumnHelper<CredentialDto>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row: CredentialDto) => row.id, {
        cell: (info) => {
          const id = info.getValue() || 'undefined';
          return (
            <ChakraLink
              href={`/app/projects/${projectName}/settings/credentials/${info.row.original.id}`}
              fontWeight="semibold"
            >
              {id}
            </ChakraLink>
          );
        },
        header: 'ID',
      }),
      columnHelper.accessor((row: CredentialDto) => row.type, {
        cell: (info) => {
          return <Badge colorScheme="green">{info.getValue()}</Badge>;
        },
        header: 'Authentication Type',
      }),
      columnHelper.accessor((row: CredentialDto) => row.enabled, {
        cell: (info) => {
          if (info.getValue()) {
            return 'Active';
          } else {
            return 'Inactive';
          }
        },
        header: 'Status',
      }),
      columnHelper.accessor((row: CredentialDto) => row.id, {
        cell: (info) => (
          <DeleteCredential
            projectName={projectName}
            id={info.getValue()}
            deleteCredential={(projectName, id) => deleteCredential({ projectName, id }).unwrap()}
            isLoading={isLoading}
          />
        ),
        header: 'Actions',
        enableSorting: false,
      }),
    ],
    [columnHelper, deleteCredential, isLoading, projectName],
  );
  return <DataTableClientPagination columns={columns as ColumnDef<CredentialDto>[]} data={data || []} />;
};

export default CredentialList;
