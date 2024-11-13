import { Text, VStack } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DateWithTooltip } from 'dogma/common/components/DateWithTooltip';
import { UserRole } from 'dogma/common/components/UserRole';
import { DataTableClientPagination } from 'dogma/common/components/table/DataTableClientPagination';
import { useMemo } from 'react';
import { useDeleteTokenMemberMutation } from 'dogma/features/api/apiSlice';
import { AppTokenDetailDto } from 'dogma/features/project/settings/tokens/AppTokenDto';
import { DeleteToken } from 'dogma/features/project/settings/tokens/DeleteToken';

export type AppTokenListProps<Data extends object> = {
  data: Data[];
  projectName: string;
};

const AppTokenList = <Data extends object>({ data, projectName }: AppTokenListProps<Data>) => {
  const [deleteToken, { isLoading }] = useDeleteTokenMemberMutation();
  const columnHelper = createColumnHelper<AppTokenDetailDto>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row: AppTokenDetailDto) => row.appId, {
        cell: (info) => (
          <VStack alignItems="left">
            <Text>{info.getValue()}</Text>
            <Text>
              <UserRole role={info.row.original.role} />
            </Text>
          </VStack>
        ),
        header: 'App ID',
      }),
      columnHelper.accessor((row: AppTokenDetailDto) => row.creation.user, {
        cell: (info) => info.getValue(),
        header: 'Added By',
      }),
      columnHelper.accessor((row: AppTokenDetailDto) => row.creation.timestamp, {
        cell: (info) => <DateWithTooltip date={info.getValue()} />,
        header: 'Added At',
      }),
      columnHelper.accessor((row: AppTokenDetailDto) => row.appId, {
        cell: (info) => (
          <DeleteToken
            projectName={projectName}
            id={info.getValue()}
            deleteToken={(projectName, id) => deleteToken({ projectName, id }).unwrap()}
            isLoading={isLoading}
          />
        ),
        header: 'Actions',
        enableSorting: false,
      }),
    ],
    [columnHelper, deleteToken, isLoading, projectName],
  );
  return <DataTableClientPagination columns={columns as ColumnDef<Data>[]} data={data} />;
};

export default AppTokenList;
