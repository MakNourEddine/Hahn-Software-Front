import CrudPage from './CrudPage';
import {useDentists} from '../../hooks/useEntities';
import {EntitiesApi} from '../../api/entities';

export default function DentistsPage() {
    const {data, refetch} = useDentists();
    return (
        <CrudPage
            title="Dentists"
            rows={data}
            columns={[
                {key: 'id', label: 'Id'},
                {key: 'fullName', label: 'Full Name'},
            ]}
            onCreate={async f => {
                await EntitiesApi.createDentist(f.fullName);
                await refetch();
            }}
            onUpdate={async (id, f) => {
                await EntitiesApi.updateDentist(id, f.fullName);
                await refetch();
            }}
            onDelete={async id => {
                await EntitiesApi.deleteDentist(id);
                await refetch();
            }}
        />
    );
}
