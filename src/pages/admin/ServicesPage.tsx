import CrudPage from './CrudPage';
import {useServices} from '../../hooks/useEntities';
import {EntitiesApi} from '../../api/entities';

export default function ServicesPage() {
    const {data, refetch} = useServices();
    return (
        <CrudPage
            title="Services"
            rows={data}
            columns={[
                {key: 'id', label: 'Id'},
                {key: 'name', label: 'Name'},
                {key: 'durationMinutes', label: 'Duration (min)'},
            ]}
            onCreate={async f => {
                await EntitiesApi.createService(f.name, Number(f.durationMinutes));
                await refetch();
            }}
            onUpdate={async (id, f) => {
                await EntitiesApi.updateService(id, f.name, Number(f.durationMinutes));
                await refetch();
            }}
            onDelete={async id => {
                await EntitiesApi.deleteService(id);
                await refetch();
            }}
        />
    );
}
