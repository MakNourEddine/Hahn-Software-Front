import CrudPage from './CrudPage';
import {usePatients} from '../../hooks/useEntities';
import {EntitiesApi} from '../../api/entities';

export default function PatientsPage() {
    const {data, refetch} = usePatients();
    return (
        <CrudPage
            title="Patients"
            rows={data}
            columns={[
                {key: 'id', label: 'Id'},
                {key: 'fullName', label: 'Full Name'},
                {key: 'email', label: 'Email'},
            ]}
            onCreate={async f => {
                await EntitiesApi.createPatient(f.fullName, f.email);
                await refetch();
            }}
            onUpdate={async (id, f) => {
                await EntitiesApi.updatePatient(id, f.fullName, f.email);
                await refetch();
            }}
            onDelete={async id => {
                await EntitiesApi.deletePatient(id);
                await refetch();
            }}
        />
    );
}
